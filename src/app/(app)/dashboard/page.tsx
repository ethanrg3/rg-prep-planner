export const dynamic = "force-dynamic";

import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions";
import { RecentActivity, type ActivityType } from "@/components/dashboard/recent-activity";
import { Users, ClipboardList, CalendarDays, TrendingUp } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_TUTOR_ID } from "@/lib/supabase/constants";

async function getDashboardStats() {
  const supabase = createAdminClient();

  const [studentsResult, plansResult] = await Promise.all([
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("tutor_id", DEFAULT_TUTOR_ID)
      .eq("status", "active"),
    supabase
      .from("prep_plans")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
  ]);

  return {
    activeStudents: studentsResult.count ?? 0,
    pendingPlans: plansResult.count ?? 0,
  };
}

// Sessions and activity remain placeholder until scheduling is implemented
const mockSessions = [
  {
    id: "1",
    studentName: "No sessions scheduled",
    weekNumber: 0,
    theme: "Add students and generate plans to see sessions",
    scheduledDate: "—",
    scheduledTime: "—",
  },
];

const mockActivities: { id: string; type: ActivityType; description: string; timestamp: string }[] = [
  {
    id: "a1",
    type: "student_created",
    description: "Add your first student to get started",
    timestamp: "—",
  },
];

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          accent="blue"
        />
        <StatCard
          title="Plans Pending"
          value={stats.pendingPlans}
          subtitle="Awaiting approval"
          icon={ClipboardList}
          accent="orange"
        />
        <StatCard
          title="Sessions This Week"
          value={0}
          icon={CalendarDays}
          accent="green"
        />
        <StatCard
          title="Avg Improvement"
          value="—"
          subtitle="Add score reports to track"
          icon={TrendingUp}
          accent="slate"
        />
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingSessions sessions={mockSessions} />
        <RecentActivity activities={mockActivities} />
      </div>
    </div>
  );
}
