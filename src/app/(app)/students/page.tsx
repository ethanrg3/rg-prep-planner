import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StudentList } from "@/components/students/student-list";

// TODO: Replace with Supabase query once connected
const mockStudents = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    testType: "SAT" as const,
    gradeLevel: 11,
    testDate: "2026-03-15",
    baselineScore: 1120,
    planStatus: "approved" as const,
    status: "active" as const,
  },
  {
    id: "2",
    firstName: "Mike",
    lastName: "Chen",
    testType: "ACT" as const,
    gradeLevel: 10,
    testDate: "2026-04-12",
    baselineScore: 24,
    planStatus: "draft" as const,
    status: "active" as const,
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Davis",
    testType: "SAT" as const,
    gradeLevel: 11,
    testDate: "2026-06-07",
    baselineScore: 980,
    planStatus: "draft" as const,
    status: "active" as const,
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Wilson",
    testType: "ACT" as const,
    gradeLevel: 12,
    testDate: "2026-02-22",
    baselineScore: 28,
    planStatus: "approved" as const,
    status: "active" as const,
  },
  {
    id: "5",
    firstName: "Olivia",
    lastName: "Martinez",
    testType: "SAT" as const,
    gradeLevel: 10,
    testDate: null,
    baselineScore: 1050,
    planStatus: null,
    status: "active" as const,
  },
];

export default function StudentsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage your students and their prep plans
          </p>
        </div>
        <Link href="/students/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-1 h-4 w-4" />
            New Student
          </Button>
        </Link>
      </div>

      <StudentList students={mockStudents} />
    </div>
  );
}
