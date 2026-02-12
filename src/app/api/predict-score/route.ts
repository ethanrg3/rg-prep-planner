import { NextRequest, NextResponse } from "next/server";
import { predictScore } from "@/lib/ai/predict-score";
import type { SATSectionScores, ACTSectionScores } from "@/types/database";

interface PredictScoreRequest {
  studentId: string;
  testType: "SAT" | "ACT";
  baselineComposite: number;
  sectionScores: SATSectionScores | ACTSectionScores;
  totalWeeks: number;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
  totalSessions: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictScoreRequest = await request.json();

    if (!body.testType || !body.baselineComposite || !body.sectionScores) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prediction = await predictScore({
      testType: body.testType,
      baselineComposite: body.baselineComposite,
      sectionScores: body.sectionScores,
      totalWeeks: body.totalWeeks,
      selfStudyHoursPerWeek: body.selfStudyHoursPerWeek,
      liveSessionHoursPerWeek: body.liveSessionHoursPerWeek,
      totalSessions: body.totalSessions,
    });

    // TODO: Insert into Supabase score_reports table with report_type: 'predicted'

    return NextResponse.json({
      success: true,
      prediction: {
        studentId: body.studentId,
        ...prediction,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Score prediction failed:", error);
    return NextResponse.json(
      {
        error: "Failed to predict score",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
