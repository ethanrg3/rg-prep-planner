import Anthropic from "@anthropic-ai/sdk";
import { extractScoreReportTool } from "./tool-definitions";

export interface ExtractedScoreReport {
  report_label: string;
  report_date: string;
  composite_score: number;
  reading_writing_total: number;
  math_total: number;
  rw_subscores: {
    information_and_ideas: number;
    craft_and_structure: number;
    expression_of_ideas: number;
    standard_english_conventions: number;
  };
  math_subscores: {
    algebra: number;
    advanced_math: number;
    problem_solving: number;
    geometry_and_trig: number;
  };
  model: string;
}

export async function extractScoreReport(
  imageBase64: string,
  mediaType: "image/png" | "image/jpeg" | "image/webp" | "image/gif"
): Promise<ExtractedScoreReport> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: `You are an OCR specialist for College Board SAT score reports from the Bluebook digital SAT platform. Extract all scores exactly as shown in the report image.

The SAT score report format:
- Total Score: 400-1600 (composite of Reading & Writing + Math)
- Reading and Writing: 200-800
- Math: 200-800
- Knowledge and Skills domains are shown as filled/unfilled boxes (1-7 scale):
  - Reading & Writing domains: Information and Ideas, Craft and Structure, Expression of Ideas, Standard English Conventions
  - Math domains: Algebra, Advanced Math, Problem-Solving and Data Analysis, Geometry and Trigonometry
- Count the number of FILLED (orange/colored) boxes for each domain to get the 1-7 score

Extract the practice test label (e.g., "Practice 6") and date from the report header.`,
    tools: [extractScoreReportTool],
    tool_choice: { type: "tool", name: "extract_score_report" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: "Extract all scores from this SAT score report. Count the filled boxes carefully for each Knowledge and Skills domain (1-7 scale). Return the results using the extract_score_report tool.",
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use response");
  }

  const data = toolUse.input as Omit<ExtractedScoreReport, "model">;

  if (
    !data.composite_score ||
    !data.reading_writing_total ||
    !data.math_total ||
    !data.rw_subscores ||
    !data.math_subscores
  ) {
    throw new Error("Invalid score report structure returned from Claude");
  }

  return {
    ...data,
    model: response.model,
  };
}
