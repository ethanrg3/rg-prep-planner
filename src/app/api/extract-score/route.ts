import { NextRequest, NextResponse } from "next/server";
import { extractScoreReport } from "@/lib/ai/extract-score-report";

const ALLOWED_TYPES = [
  "application/pdf",
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const mediaType = file.type as (typeof ALLOWED_TYPES)[number];
    if (!ALLOWED_TYPES.includes(mediaType)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type}. Supported: PDF`,
        },
        { status: 400 }
      );
    }

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const result = await extractScoreReport(base64, mediaType);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Score extraction failed:", error);
    return NextResponse.json(
      {
        error: "Failed to extract scores from PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
