export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StudentList } from "@/components/students/student-list";
import { getStudents } from "@/lib/db/students";

export default async function StudentsPage() {
  const students = await getStudents();

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

      <StudentList students={students} />
    </div>
  );
}
