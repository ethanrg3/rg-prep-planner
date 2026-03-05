import Anthropic from "@anthropic-ai/sdk";
import { generateInsightsTool } from "./tool-definitions";
import type { ScoreReport, SATSectionScores } from "@/types/database";

interface GenerateInsightsInput {
  testType: "SAT" | "ACT";
  scoreReports: ScoreReport[];
  testDate: string | null;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
}

export interface PriorityArea {
  section: string;
  subscore: string;
  reason: string;
  impact_estimate: string;
  recommended_resources: string[];
}

export interface InsightsResult {
  summary: string;
  priority_areas: PriorityArea[];
  time_allocation: Record<string, number>;
  strengths: { section: string; subscore: string; note: string }[];
  risk_alerts: {
    section: string;
    subscore: string;
    alert: string;
    severity: "high" | "medium";
  }[];
  model: string;
}

function buildInsightsSystemPrompt(): string {
  return `You are an expert SAT/ACT tutor analyzing a student's score progression across multiple practice tests. Your goal is to identify exactly what the student should focus on to maximize their score improvement in the remaining preparation time.

Your analysis should:
- Identify specific subscores with the highest potential for improvement
- Consider trends (improving, plateau, declining) across reports
- Prioritize areas where small gains yield the biggest composite score impact
- Account for time remaining until test date
- Provide actionable, specific resource recommendations
- Distinguish between areas to actively improve vs. areas to maintain

Always use the generate_insights tool to return your analysis in structured format.`;
}

function buildInsightsUserPrompt(input: GenerateInsightsInput): string {
  const { testType, scoreReports, testDate, selfStudyHoursPerWeek, liveSessionHoursPerWeek } = input;

  // Sort reports by date
  const sorted = [...scoreReports].sort(
    (a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
  );

  // Build score progression table
  let table = "| Report | Date | Composite |";
  if (testType === "SAT") {
    table += " R&W | Math | Info&Ideas | Craft&Struct | Expression | Conventions | Algebra | AdvMath | ProbSolving | GeoTrig |\n";
    table += "|--------|------|-----------|-----|------|------------|--------------|------------|-------------|---------|---------|-------------|---------|";
  }
  table += "\n";

  for (const r of sorted) {
    if (testType === "SAT") {
      const s = r.section_scores as SATSectionScores;
      table += `| ${r.report_label} | ${r.report_date} | ${r.composite_score} | ${s.reading_writing.total} | ${s.math.total} | ${s.reading_writing.information_and_ideas}/7 | ${s.reading_writing.craft_and_structure}/7 | ${s.reading_writing.expression_of_ideas}/7 | ${s.reading_writing.standard_english_conventions}/7 | ${s.math.algebra}/7 | ${s.math.advanced_math}/7 | ${s.math.problem_solving}/7 | ${s.math.geometry_and_trig}/7 |\n`;
    }
  }

  const weeksRemaining = testDate
    ? Math.max(
        1,
        Math.ceil(
          (new Date(testDate).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)
        )
      )
    : null;

  return `Analyze this ${testType} student's score progression and provide actionable insights.

SCORE PROGRESSION (${sorted.length} reports):
${table}

STUDY PARAMETERS:
- Self-study: ${selfStudyHoursPerWeek} hours/week
- Live tutoring: ${liveSessionHoursPerWeek} hours/week
- Test date: ${testDate ?? "Not scheduled"}
${weeksRemaining ? `- Weeks remaining: ${weeksRemaining}` : ""}

For SAT, section keys should be "reading_writing" and "math". Subscore keys should match: information_and_ideas, craft_and_structure, expression_of_ideas, standard_english_conventions, algebra, advanced_math, problem_solving, geometry_and_trig.

Focus your analysis on:
1. Which specific subscores have the most room to grow and would yield the biggest composite improvement
2. Whether any areas are declining and need immediate attention
3. How the student should allocate their remaining study time across sections`;
}

export async function generateInsights(
  input: GenerateInsightsInput
): Promise<InsightsResult> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 4096,
    system: buildInsightsSystemPrompt(),
    tools: [generateInsightsTool],
    tool_choice: { type: "tool", name: "generate_insights" },
    messages: [
      {
        role: "user",
        content: buildInsightsUserPrompt(input),
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use response");
  }

  const data = toolUse.input as Omit<InsightsResult, "model">;

  if (!data.summary || !data.priority_areas || !data.time_allocation) {
    throw new Error("Invalid insights structure returned from Claude");
  }

  return {
    ...data,
    model: response.model,
  };
}
