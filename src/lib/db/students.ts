import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_TUTOR_ID } from "@/lib/supabase/constants";
import type { SATSectionScores, ACTSectionScores } from "@/types/database";

// Shape expected by StudentList component
export interface StudentListItem {
  id: string;
  firstName: string;
  lastName: string;
  testType: "ACT" | "SAT";
  gradeLevel: number;
  testDate: string | null;
  baselineScore: number | null;
  planStatus: "draft" | "approved" | "archived" | null;
  status: "active" | "inactive" | "completed";
}

// Shape expected by student detail page
export interface StudentDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  gradeLevel: number;
  testType: "SAT" | "ACT";
  testDate: string | null;
  schoolsOfInterest: string[];
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
  sessionsPaid: number;
  status: "active" | "inactive" | "completed";
  baselineComposite: number;
  baselineRW: number;
  baselineMath: number;
  baselineRWSubscores: SATSectionScores["reading_writing"] | null;
  baselineMathSubscores: SATSectionScores["math"] | null;
  baselineACTScores: ACTSectionScores | null;
  predictedLow: number | null;
  predictedHigh: number | null;
  planStatus: "draft" | "approved" | "archived" | null;
  planId: string | null;
  sessionsCompleted: number;
  weeksRemaining: number;
}

export async function getStudents(): Promise<StudentListItem[]> {
  const supabase = createAdminClient();

  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("tutor_id", DEFAULT_TUTOR_ID)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!students) return [];

  // Fetch baseline score reports for all students
  const studentIds = students.map((s) => s.id);
  const { data: baselineReports } = await supabase
    .from("score_reports")
    .select("student_id, composite_score")
    .in("student_id", studentIds)
    .eq("report_type", "baseline");

  // Fetch latest plan status for all students
  const { data: plans } = await supabase
    .from("prep_plans")
    .select("student_id, status")
    .in("student_id", studentIds)
    .order("created_at", { ascending: false });

  const baselineMap = new Map(
    (baselineReports || []).map((r) => [r.student_id, r.composite_score])
  );
  // Get first (most recent) plan per student
  const planMap = new Map<string, string>();
  for (const p of plans || []) {
    if (!planMap.has(p.student_id)) {
      planMap.set(p.student_id, p.status);
    }
  }

  return students.map((s) => ({
    id: s.id,
    firstName: s.first_name,
    lastName: s.last_name,
    testType: s.test_type as "ACT" | "SAT",
    gradeLevel: s.grade_level,
    testDate: s.test_date,
    baselineScore: baselineMap.get(s.id) ?? null,
    planStatus: (planMap.get(s.id) as StudentListItem["planStatus"]) ?? null,
    status: s.status as "active" | "inactive" | "completed",
  }));
}

export async function getStudentById(
  studentId: string
): Promise<StudentDetail | null> {
  const supabase = createAdminClient();

  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (error || !student) return null;

  // Get baseline score report
  const { data: baseline } = await supabase
    .from("score_reports")
    .select("*")
    .eq("student_id", studentId)
    .eq("report_type", "baseline")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get predicted score report
  const { data: predicted } = await supabase
    .from("score_reports")
    .select("*")
    .eq("student_id", studentId)
    .eq("report_type", "predicted")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get latest plan
  const { data: plan } = await supabase
    .from("prep_plans")
    .select("id, status, total_weeks")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Count completed sessions
  let sessionsCompleted = 0;
  if (plan) {
    const { count } = await supabase
      .from("plan_sessions")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed")
      .in(
        "plan_week_id",
        (
          await supabase
            .from("plan_weeks")
            .select("id")
            .eq("prep_plan_id", plan.id)
        ).data?.map((w) => w.id) || []
      );
    sessionsCompleted = count || 0;
  }

  // Calculate weeks remaining
  const weeksRemaining = student.test_date
    ? Math.max(
        0,
        Math.ceil(
          (new Date(student.test_date).getTime() - Date.now()) /
            (7 * 24 * 60 * 60 * 1000)
        )
      )
    : 0;

  // Extract baseline section scores
  const sectionScores = baseline?.section_scores as SATSectionScores | ACTSectionScores | null;
  let baselineRW = 0;
  let baselineMath = 0;
  let baselineRWSubscores: SATSectionScores["reading_writing"] | null = null;
  let baselineMathSubscores: SATSectionScores["math"] | null = null;
  let baselineACTScores: ACTSectionScores | null = null;

  if (sectionScores && student.test_type === "SAT") {
    const sat = sectionScores as SATSectionScores;
    baselineRW = sat.reading_writing.total;
    baselineMath = sat.math.total;
    baselineRWSubscores = sat.reading_writing;
    baselineMathSubscores = sat.math;
  } else if (sectionScores && student.test_type === "ACT") {
    baselineACTScores = sectionScores as ACTSectionScores;
  }

  return {
    id: student.id,
    firstName: student.first_name,
    lastName: student.last_name,
    email: student.email,
    phone: student.phone,
    gradeLevel: student.grade_level,
    testType: student.test_type as "SAT" | "ACT",
    testDate: student.test_date,
    schoolsOfInterest: student.schools_of_interest || [],
    selfStudyHoursPerWeek: Number(student.self_study_hours_per_week),
    liveSessionHoursPerWeek: Number(student.live_session_hours_per_week),
    sessionsPaid: student.sessions_paid,
    status: student.status as "active" | "inactive" | "completed",
    baselineComposite: baseline?.composite_score ?? 0,
    baselineRW,
    baselineMath,
    baselineRWSubscores,
    baselineMathSubscores,
    baselineACTScores,
    predictedLow: predicted?.prediction_range_low ?? null,
    predictedHigh: predicted?.prediction_range_high ?? null,
    planStatus: (plan?.status as StudentDetail["planStatus"]) ?? null,
    planId: plan?.id ?? null,
    sessionsCompleted,
    weeksRemaining,
  };
}

export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gradeLevel: number;
  testType: "SAT" | "ACT";
  testDate?: string;
  schoolsOfInterest: string[];
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
  sessionsPaid: number;
  weeklyAvailability: Record<string, string[]>;
}

export async function createStudent(
  data: CreateStudentInput
): Promise<{ id: string }> {
  const supabase = createAdminClient();

  const { data: student, error } = await supabase
    .from("students")
    .insert({
      tutor_id: DEFAULT_TUTOR_ID,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      grade_level: data.gradeLevel,
      test_type: data.testType,
      test_date: data.testDate || null,
      schools_of_interest: data.schoolsOfInterest,
      self_study_hours_per_week: data.selfStudyHoursPerWeek,
      live_session_hours_per_week: data.liveSessionHoursPerWeek,
      sessions_paid: data.sessionsPaid,
      weekly_availability: data.weeklyAvailability,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: student.id };
}
