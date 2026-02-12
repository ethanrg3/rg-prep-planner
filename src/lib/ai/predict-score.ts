import Anthropic from "@anthropic-ai/sdk";
import { buildPredictionSystemPrompt, buildPredictionUserPrompt } from "./prompts";
import { predictScoreTool } from "./tool-definitions";
import type { SATSectionScores, ACTSectionScores, SectionPrediction } from "@/types/database";
import { HISTORICAL_OUTCOMES_SEED } from "@/lib/data/historical-outcomes-seed";

interface PredictScoreInput {
  testType: "SAT" | "ACT";
  baselineComposite: number;
  sectionScores: SATSectionScores | ACTSectionScores;
  totalWeeks: number;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
  totalSessions: number;
}

export interface ScorePredictionResult {
  predicted_composite_low: number;
  predicted_composite_high: number;
  section_predictions: Record<string, SectionPrediction>;
  confidence_notes: string;
  model: string;
}

export async function predictScore(
  input: PredictScoreInput
): Promise<ScorePredictionResult> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  // Filter and sort historical outcomes by proximity to student baseline
  const relevantOutcomes = HISTORICAL_OUTCOMES_SEED
    .filter((h) => h.test_type === input.testType)
    .sort(
      (a, b) =>
        Math.abs(a.baseline_composite - input.baselineComposite) -
        Math.abs(b.baseline_composite - input.baselineComposite)
    )
    .slice(0, 10);

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 4096,
    system: buildPredictionSystemPrompt(),
    tools: [predictScoreTool],
    tool_choice: { type: "tool", name: "predict_score" },
    messages: [
      {
        role: "user",
        content: buildPredictionUserPrompt({
          ...input,
          historicalOutcomes: relevantOutcomes,
        }),
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use response");
  }

  const data = toolUse.input as {
    predicted_composite_low: number;
    predicted_composite_high: number;
    section_predictions: Record<string, SectionPrediction>;
    confidence_notes: string;
  };

  if (
    !data.predicted_composite_low ||
    !data.predicted_composite_high ||
    !data.section_predictions
  ) {
    throw new Error("Invalid prediction structure returned from Claude");
  }

  return {
    predicted_composite_low: data.predicted_composite_low,
    predicted_composite_high: data.predicted_composite_high,
    section_predictions: data.section_predictions,
    confidence_notes: data.confidence_notes,
    model: response.model,
  };
}
