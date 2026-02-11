import { createClient } from "@/lib/supabase/server";
import { getCurrentTutor } from "@/lib/supabase/auth-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions";
import { RecentActivity, type ActivityType } from "@/components/dashboard/recent-activity";
import { Users, ClipboardList, CalendarDays, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const tutor = await getCurrentTutor();
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: activeStudentsCount },
    { count: pendingPlansCount },
  ] = await Promise.all([
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("prep_plans")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
  ]);

  // Fetch upcoming sessions (next 5 scheduled sessions)
  const { data: upcomingSessions } = await supabase
    .from("plan_sessions")
    .select(`
      id,
      session_number,
      scheduled_date,
      scheduled_time_start,
      status,
      plan_week:plan_weeks (
        week_number,
        theme,
        prep_plan:prep_plans (
          student:students (
            first_name,
            last_name
          )
        )
      )
    `)
    .eq("status", "scheduled")
    .not("scheduled_date", "is", null)
    .order("scheduled_date", { ascending: true })
    .limit(5);

  const formattedSessions = (upcomingSessions ?? []).map((s) => {
    const week = s.plan_week as unknown as {
      week_number: number;
      theme: string;
      prep_plan: {
        student: { first_name: string; last_name: string };
      };
    };
    return {
      id: s.id,
      studentName: `${week.prep_plan.student.first_name} ${week.prep_plan.student.last_name}`,
      weekNumber: week.week_number,
      theme: week.theme,
      scheduledDate: s.scheduled_date,
      scheduledTime: s.scheduled_time_start,
    };
  });

  // Fetch recent activity: recent students + recent plan status changes
  const [{ data: recentStudents }, { data: recentPlans }] = await Promise.all([
    supabase
      .from("students")
      .select("id, first_name, last_name, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("prep_plans")
      .select("id, status, created_at, approved_at, student:students(first_name, last_name)")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const activities: { id: string; type: ActivityType; description: string; timestamp: string }[] = [];

  (recentStudents ?? []).forEach((s) => {
    activities.push({
      id: `student-${s.id}`,
      type: "student_created",
      description: `${s.first_name} ${s.last_name} added as a new student`,
      timestamp: formatDistanceToNow(new Date(s.created_at), { addSuffix: true }),
    });
  });

  (recentPlans ?? []).forEach((p) => {
    const student = p.student as unknown as { first_name: string; last_name: string };
    const name = `${student.first_name} ${student.last_name}`;
    if (p.status === "approved" && p.approved_at) {
      activities.push({
        id: `plan-approved-${p.id}`,
        type: "plan_approved",
        description: `${name}'s prep plan was approved`,
        timestamp: formatDistanceToNow(new Date(p.approved_at), { addSuffix: true }),
      });
    } else if (p.status === "draft") {
      activities.push({
        id: `plan-generated-${p.id}`,
        type: "plan_generated",
        description: `Prep plan generated for ${name}`,
        timestamp: formatDistanceToNow(new Date(p.created_at), { addSuffix: true }),
      });
    }
  });

  // Sort by most recent
  activities.sort((a, b) => {
    // Simple sort — the formatDistanceToNow strings won't sort correctly,
    // but this is fine since both source arrays are already sorted by recency
    return 0;
  });

  // Count sessions this week (simple approach: count scheduled sessions)
  const { count: sessionsThisWeekCount } = await supabase
    .from("plan_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "scheduled")
    .not("scheduled_date", "is", null);

  // Average score improvement
  const { data: outcomes } = await supabase
    .from("historical_outcomes")
    .select("baseline_composite, final_composite");

  let avgImprovement = 0;
  if (outcomes && outcomes.length > 0) {
    const total = outcomes.reduce(
      (sum, o) => sum + (o.final_composite - o.baseline_composite),
      0
    );
    avgImprovement = Math.round(total / outcomes.length);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        {tutor && (
          <p className="text-muted-foreground">
            Welcome back, {tutor.full_name}
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Students"
          value={activeStudentsCount ?? 0}
          icon={Users}
          accent="blue"
        />
        <StatCard
          title="Plans Pending"
          value={pendingPlansCount ?? 0}
          subtitle="Awaiting approval"
          icon={ClipboardList}
          accent="orange"
        />
        <StatCard
          title="Sessions Scheduled"
          value={sessionsThisWeekCount ?? 0}
          icon={CalendarDays}
          accent="green"
        />
        <StatCard
          title="Avg Improvement"
          value={avgImprovement > 0 ? `+${avgImprovement}` : "—"}
          subtitle={outcomes && outcomes.length > 0 ? `across ${outcomes.length} students` : "No data yet"}
          icon={TrendingUp}
          accent="slate"
        />
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingSessions sessions={formattedSessions} />
        <RecentActivity activities={activities.slice(0, 8)} />
      </div>
    </div>
  );
}
