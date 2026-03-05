import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanWeekData } from "@/components/plan/plan-timeline";
import type { PlanAssignment, AgendaItem } from "@/types/database";

// Shape expected by plans list page
export interface PlanListItem {
  id: string;
  studentId: string;
  studentName: string;
  testType: "SAT" | "ACT";
  gradeLevel: number;
  baselineScore: number | null;
  predictedRange: string | null;
  totalWeeks: number;
  status: "draft" | "approved" | "archived";
  createdAt: string;
  approvedAt: string | null;
}

export async function getPlanForStudent(
  studentId: string
): Promise<{ planId: string; status: string; weeks: PlanWeekData[] } | null> {
  const supabase = createAdminClient();

  // Get latest plan
  const { data: plan, error: planError } = await supabase
    .from("prep_plans")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (planError) throw planError;
  if (!plan) return null;

  // Get plan weeks
  const { data: weeks, error: weeksError } = await supabase
    .from("plan_weeks")
    .select("*")
    .eq("prep_plan_id", plan.id)
    .order("week_number", { ascending: true });

  if (weeksError) throw weeksError;

  // Get sessions for all weeks
  const weekIds = (weeks || []).map((w) => w.id);
  const { data: sessions, error: sessionsError } = await supabase
    .from("plan_sessions")
    .select("*")
    .in("plan_week_id", weekIds)
    .order("session_number", { ascending: true });

  if (sessionsError) throw sessionsError;

  // Group sessions by week
  const sessionsByWeek = new Map<string, typeof sessions>();
  for (const s of sessions || []) {
    const arr = sessionsByWeek.get(s.plan_week_id) || [];
    arr.push(s);
    sessionsByWeek.set(s.plan_week_id, arr);
  }

  const planWeeks: PlanWeekData[] = (weeks || []).map((w) => ({
    week_number: w.week_number,
    theme: w.theme,
    goals: w.goals || [],
    self_study_assignments: (w.self_study_assignments || []) as PlanAssignment[],
    sessions: (sessionsByWeek.get(w.id) || []).map((s) => ({
      session_number: s.session_number,
      agenda: (s.agenda || []) as AgendaItem[],
    })),
  }));

  return { planId: plan.id, status: plan.status, weeks: planWeeks };
}

export async function getPlansWithStudents(): Promise<PlanListItem[]> {
  const supabase = createAdminClient();

  const { data: plans, error } = await supabase
    .from("prep_plans")
    .select("*, students(first_name, last_name, test_type, grade_level)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!plans) return [];

  // Get baseline scores for all student IDs
  const studentIds = [...new Set(plans.map((p) => p.student_id))];
  const { data: baselines } = await supabase
    .from("score_reports")
    .select("student_id, composite_score, prediction_range_low, prediction_range_high")
    .in("student_id", studentIds)
    .eq("report_type", "baseline");

  const baselineMap = new Map(
    (baselines || []).map((b) => [b.student_id, b])
  );

  // Get predicted scores
  const { data: predictions } = await supabase
    .from("score_reports")
    .select("student_id, prediction_range_low, prediction_range_high")
    .in("student_id", studentIds)
    .eq("report_type", "predicted");

  const predictionMap = new Map(
    (predictions || []).map((p) => [p.student_id, p])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return plans.map((p: any) => {
    const student = p.students;
    const baseline = baselineMap.get(p.student_id);
    const prediction = predictionMap.get(p.student_id);
    const predictedRange =
      prediction?.prediction_range_low && prediction?.prediction_range_high
        ? `${prediction.prediction_range_low}–${prediction.prediction_range_high}`
        : null;

    return {
      id: p.id,
      studentId: p.student_id,
      studentName: `${student.first_name} ${student.last_name}`,
      testType: student.test_type as "SAT" | "ACT",
      gradeLevel: student.grade_level,
      baselineScore: baseline?.composite_score ?? null,
      predictedRange,
      totalWeeks: p.total_weeks,
      status: p.status as "draft" | "approved" | "archived",
      createdAt: p.created_at,
      approvedAt: p.approved_at,
    };
  });
}

interface CreatePlanWeek {
  week_number: number;
  theme: string;
  goals: string[];
  self_study_assignments: PlanAssignment[];
  sessions: { session_number: number; agenda: AgendaItem[] }[];
}

export async function createPlan(
  studentId: string,
  weeks: CreatePlanWeek[],
  model: string
): Promise<{ id: string }> {
  const supabase = createAdminClient();

  // Insert prep_plan
  const { data: plan, error: planError } = await supabase
    .from("prep_plans")
    .insert({
      student_id: studentId,
      total_weeks: weeks.length,
      status: "draft",
      ai_model_used: model,
    })
    .select("id")
    .single();

  if (planError) throw planError;

  // Insert plan_weeks
  for (const week of weeks) {
    const { data: planWeek, error: weekError } = await supabase
      .from("plan_weeks")
      .insert({
        prep_plan_id: plan.id,
        week_number: week.week_number,
        theme: week.theme,
        goals: week.goals,
        self_study_assignments: week.self_study_assignments,
      })
      .select("id")
      .single();

    if (weekError) throw weekError;

    // Insert plan_sessions for this week
    if (week.sessions.length > 0) {
      const sessionRows = week.sessions.map((s) => ({
        plan_week_id: planWeek.id,
        session_number: s.session_number,
        agenda: s.agenda,
      }));

      const { error: sessionsError } = await supabase
        .from("plan_sessions")
        .insert(sessionRows);

      if (sessionsError) throw sessionsError;
    }
  }

  return { id: plan.id };
}

export async function updatePlanStatus(
  planId: string,
  status: "approved" | "archived"
): Promise<void> {
  const supabase = createAdminClient();

  const update: Record<string, unknown> = { status };
  if (status === "approved") {
    update.approved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("prep_plans")
    .update(update)
    .eq("id", planId);

  if (error) throw error;
}
