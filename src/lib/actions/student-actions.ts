"use server";

import { revalidatePath } from "next/cache";
import { createStudent } from "@/lib/db/students";
import { createScoreReport } from "@/lib/db/score-reports";
import type { IntakeFormData } from "@/lib/schemas/intake-form";
import type { SectionScores } from "@/types/database";

export async function createStudentAction(
  data: IntakeFormData
): Promise<{ studentId: string }> {
  const { basicInfo, testDetails, schedule } = data;

  // 1. Create the student
  const student = await createStudent({
    firstName: basicInfo.firstName,
    lastName: basicInfo.lastName,
    email: basicInfo.email || undefined,
    phone: basicInfo.phone || undefined,
    gradeLevel: basicInfo.gradeLevel,
    testType: basicInfo.testType,
    testDate: testDetails.notYetScheduled ? undefined : testDetails.testDate,
    schoolsOfInterest: testDetails.schoolsOfInterest,
    selfStudyHoursPerWeek: schedule.selfStudyHoursPerWeek,
    liveSessionHoursPerWeek: schedule.liveSessionHoursPerWeek,
    sessionsPaid: schedule.sessionsPaid,
    weeklyAvailability: schedule.weeklyAvailability,
  });

  // 2. Create baseline score report
  let sectionScores: SectionScores;
  let compositeScore: number;

  if (basicInfo.testType === "SAT" && data.satScores) {
    compositeScore = data.satScores.compositeScore;
    sectionScores = {
      reading_writing: {
        total: data.satScores.readingWriting.total,
        information_and_ideas: data.satScores.readingWriting.information_and_ideas,
        craft_and_structure: data.satScores.readingWriting.craft_and_structure,
        expression_of_ideas: data.satScores.readingWriting.expression_of_ideas,
        standard_english_conventions: data.satScores.readingWriting.standard_english_conventions,
      },
      math: {
        total: data.satScores.math.total,
        algebra: data.satScores.math.algebra,
        advanced_math: data.satScores.math.advanced_math,
        problem_solving: data.satScores.math.problem_solving,
        geometry_and_trig: data.satScores.math.geometry_and_trig,
      },
    };
  } else if (basicInfo.testType === "ACT" && data.actScores) {
    compositeScore = data.actScores.compositeScore;
    sectionScores = {
      english: {
        total: data.actScores.english.total,
        usage_mechanics: data.actScores.english.usage_mechanics,
        rhetorical_skills: data.actScores.english.rhetorical_skills,
      },
      math: {
        total: data.actScores.math.total,
        pre_algebra: data.actScores.math.pre_algebra,
        algebra: data.actScores.math.algebra,
        geometry: data.actScores.math.geometry,
      },
      reading: {
        total: data.actScores.reading.total,
        social_studies_sciences: data.actScores.reading.social_studies_sciences,
        arts_literature: data.actScores.reading.arts_literature,
      },
      science: {
        total: data.actScores.science.total,
        data_representation: data.actScores.science.data_representation,
        research_summaries: data.actScores.science.research_summaries,
        conflicting_viewpoints: data.actScores.science.conflicting_viewpoints,
      },
    };
  } else {
    throw new Error("Missing score data for test type");
  }

  await createScoreReport({
    studentId: student.id,
    reportType: "baseline",
    reportLabel: "Baseline",
    reportDate: new Date().toISOString().split("T")[0],
    compositeScore,
    sectionScores,
  });

  revalidatePath("/students");
  return { studentId: student.id };
}

export async function saveScoreReportAction(data: {
  studentId: string;
  reportType: "baseline" | "actual";
  reportLabel: string;
  reportDate: string;
  compositeScore: number;
  sectionScores: SectionScores;
  sourceImageUrl?: string | null;
}) {
  const report = await createScoreReport({
    studentId: data.studentId,
    reportType: data.reportType,
    reportLabel: data.reportLabel,
    reportDate: data.reportDate,
    compositeScore: data.compositeScore,
    sectionScores: data.sectionScores,
    sourceImageUrl: data.sourceImageUrl,
  });

  revalidatePath(`/students/${data.studentId}`);
  return report;
}
