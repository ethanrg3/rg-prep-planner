import { NextRequest, NextResponse } from "next/server";
import { generateInsights } from "@/lib/ai/generate-insights";
import type { ScoreReport } from "@/types/database";

interface GenerateInsightsRequest {
  studentId: string;
  testType: "SAT" | "ACT";
  scoreReports: ScoreReport[];
  testDate: string | null;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateInsightsRequest = await request.json();

    if (!body.testType || !body.scoreReports || body.scoreReports.length < 2) {
      return NextResponse.json(
        { error: "At least 2 score reports are required for insights" },
        { status: 400 }
      );
    }

    const insights = await generateInsights({
      testType: body.testType,
      scoreReports: body.scoreReports,
      testDate: body.testDate,
      selfStudyHoursPerWeek: body.selfStudyHoursPerWeek,
      liveSessionHoursPerWeek: body.liveSessionHoursPerWeek,
    });

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("Insights generation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to generate insights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
