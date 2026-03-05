import { notFound } from "next/navigation";
import { getStudentById } from "@/lib/db/students";
import { getScoreReports } from "@/lib/db/score-reports";
import { getPlanForStudent } from "@/lib/db/plans";
import { StudentDetailClient } from "./student-detail-client";

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { studentId } = await params;

  const [student, scoreReports, planData] = await Promise.all([
    getStudentById(studentId),
    getScoreReports(studentId),
    getPlanForStudent(studentId),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <StudentDetailClient
      student={student}
      initialScoreReports={scoreReports}
      planWeeks={planData?.weeks ?? []}
      planStatus={
        (planData?.status as "draft" | "approved" | "archived") ?? null
      }
    />
  );
}
