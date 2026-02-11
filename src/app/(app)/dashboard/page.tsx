import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions";
import { RecentActivity, type ActivityType } from "@/components/dashboard/recent-activity";
import { Users, ClipboardList, CalendarDays, TrendingUp } from "lucide-react";

// TODO: Re-enable Supabase queries once connected. This is placeholder data for UI preview.

const mockSessions = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    weekNumber: 3,
    theme: "Algebra & Reading Comprehension",
    scheduledDate: "Mon 2/10",
    scheduledTime: "4:00 PM",
  },
  {
    id: "2",
    studentName: "Mike Chen",
    weekNumber: 1,
    theme: "English Foundations & Data Analysis",
    scheduledDate: "Tue 2/11",
    scheduledTime: "3:30 PM",
  },
  {
    id: "3",
    studentName: "Emma Davis",
    weekNumber: 5,
    theme: "Practice Test #2 Review",
    scheduledDate: "Wed 2/12",
    scheduledTime: "5:00 PM",
  },
  {
    id: "4",
    studentName: "Sarah Johnson",
    weekNumber: 3,
    theme: "Algebra & Reading Comprehension",
    scheduledDate: "Thu 2/13",
    scheduledTime: "4:00 PM",
  },
];

const mockActivities: { id: string; type: ActivityType; description: string; timestamp: string }[] = [
  {
    id: "a1",
    type: "student_created",
    description: "Mike Chen added as a new student",
    timestamp: "2 hours ago",
  },
  {
    id: "a2",
    type: "plan_generated",
    description: "Prep plan generated for Emma Davis",
    timestamp: "5 hours ago",
  },
  {
    id: "a3",
    type: "plan_approved",
    description: "Sarah Johnson's prep plan was approved",
    timestamp: "1 day ago",
  },
  {
    id: "a4",
    type: "student_created",
    description: "Emma Davis added as a new student",
    timestamp: "2 days ago",
  },
  {
    id: "a5",
    type: "plan_generated",
    description: "Prep plan generated for Sarah Johnson",
    timestamp: "3 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Ethan Garcia
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Students"
          value={12}
          icon={Users}
          accent="blue"
        />
        <StatCard
          title="Plans Pending"
          value={2}
          subtitle="Awaiting approval"
          icon={ClipboardList}
          accent="orange"
        />
        <StatCard
          title="Sessions This Week"
          value={5}
          icon={CalendarDays}
          accent="green"
        />
        <StatCard
          title="Avg Improvement"
          value="+142"
          subtitle="across 8 students"
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
