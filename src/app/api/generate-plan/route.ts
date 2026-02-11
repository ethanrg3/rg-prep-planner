import { NextRequest, NextResponse } from "next/server";
import { generateRoadmap } from "@/lib/ai/generate-roadmap";
import type { SATSectionScores, ACTSectionScores } from "@/types/database";

interface GeneratePlanRequest {
  studentId: string;
  testType: "SAT" | "ACT";
  totalWeeks: number;
  totalSessions: number;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
  baselineComposite: number;
  sectionScores: SATSectionScores | ACTSectionScores;
  schoolsOfInterest: string[];
  testDate: string | null;
  tutorNotes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePlanRequest = await request.json();

    // Validate required fields
    if (!body.testType || !body.totalWeeks || !body.baselineComposite || !body.sectionScores) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = await generateRoadmap({
      testType: body.testType,
      totalWeeks: body.totalWeeks,
      totalSessions: body.totalSessions,
      selfStudyHoursPerWeek: body.selfStudyHoursPerWeek,
      liveSessionHoursPerWeek: body.liveSessionHoursPerWeek,
      baselineComposite: body.baselineComposite,
      sectionScores: body.sectionScores,
      schoolsOfInterest: body.schoolsOfInterest,
      testDate: body.testDate,
      tutorNotes: body.tutorNotes,
    });

    // TODO: Insert into Supabase prep_plans, plan_weeks, plan_sessions tables
    // For now, return the generated plan directly

    return NextResponse.json({
      success: true,
      plan: {
        id: `plan_${Date.now()}`,
        studentId: body.studentId,
        totalWeeks: body.totalWeeks,
        status: "draft",
        aiModelUsed: plan.model,
        weeks: plan.weeks,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Plan generation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to generate plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
