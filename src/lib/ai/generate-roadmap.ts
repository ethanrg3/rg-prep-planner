import Anthropic from "@anthropic-ai/sdk";
import { buildRoadmapSystemPrompt, buildRoadmapUserPrompt } from "./prompts";
import { generatePrepPlanTool } from "./tool-definitions";
import type { SATSectionScores, ACTSectionScores, PlanAssignment, AgendaItem } from "@/types/database";

interface GenerateRoadmapInput {
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

interface GeneratedWeek {
  week_number: number;
  theme: string;
  goals: string[];
  self_study_assignments: PlanAssignment[];
  sessions: {
    session_number: number;
    agenda: AgendaItem[];
  }[];
}

export interface GeneratedPlan {
  weeks: GeneratedWeek[];
  model: string;
}

export async function generateRoadmap(
  input: GenerateRoadmapInput
): Promise<GeneratedPlan> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 8192,
    system: buildRoadmapSystemPrompt(),
    tools: [generatePrepPlanTool],
    tool_choice: { type: "tool", name: "generate_prep_plan" },
    messages: [
      {
        role: "user",
        content: buildRoadmapUserPrompt(input),
      },
    ],
  });

  // Extract tool use result
  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use response");
  }

  const planData = toolUse.input as { weeks: GeneratedWeek[] };

  if (!planData.weeks || !Array.isArray(planData.weeks)) {
    throw new Error("Invalid plan structure returned from Claude");
  }

  return {
    weeks: planData.weeks,
    model: response.model,
  };
}
