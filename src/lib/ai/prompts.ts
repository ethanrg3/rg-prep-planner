import type { SATSectionScores, ACTSectionScores, HistoricalOutcome } from "@/types/database";

interface RoadmapPromptParams {
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

export function buildRoadmapSystemPrompt(): string {
  return `You are an expert ACT/SAT test prep curriculum designer. You create personalized, week-by-week study plans for students preparing for standardized tests.

Your plans should:
- Prioritize the student's weakest areas while maintaining strengths
- Front-load foundational skills and build toward test-day readiness
- Include a mix of content review, practice problems, and timed drills
- Gradually increase difficulty and include full-length practice tests in later weeks
- Allocate live session time for guided instruction on the hardest topics
- Include specific, actionable self-study assignments with estimated times
- Build in review weeks before the test date

For each live tutoring session, create a detailed minute-by-minute agenda that a tutor can follow.

Always use the generate_prep_plan tool to return your plan in structured format.`;
}

export function buildRoadmapUserPrompt(params: RoadmapPromptParams): string {
  const {
    testType,
    totalWeeks,
    totalSessions,
    selfStudyHoursPerWeek,
    liveSessionHoursPerWeek,
    baselineComposite,
    sectionScores,
    schoolsOfInterest,
    testDate,
    tutorNotes,
  } = params;

  let scoreBreakdown: string;
  if (testType === "SAT") {
    const sat = sectionScores as SATSectionScores;
    scoreBreakdown = `
Reading & Writing: ${sat.reading_writing.total}/800
  - Information & Ideas: ${sat.reading_writing.information_and_ideas}/15
  - Craft & Structure: ${sat.reading_writing.craft_and_structure}/15
  - Expression of Ideas: ${sat.reading_writing.expression_of_ideas}/15
  - Standard English Conventions: ${sat.reading_writing.standard_english_conventions}/15
Math: ${sat.math.total}/800
  - Algebra: ${sat.math.algebra}/15
  - Advanced Math: ${sat.math.advanced_math}/15
  - Problem Solving & Data Analysis: ${sat.math.problem_solving}/15
  - Geometry & Trigonometry: ${sat.math.geometry_and_trig}/15`;
  } else {
    const act = sectionScores as ACTSectionScores;
    scoreBreakdown = `
English: ${act.english.total}/36
  - Usage & Mechanics: ${act.english.usage_mechanics}/18
  - Rhetorical Skills: ${act.english.rhetorical_skills}/18
Math: ${act.math.total}/36
  - Pre-Algebra / Elementary Algebra: ${act.math.pre_algebra}/18
  - Algebra / Coordinate Geometry: ${act.math.algebra}/18
  - Plane Geometry / Trigonometry: ${act.math.geometry}/18
Reading: ${act.reading.total}/36
  - Social Studies / Sciences: ${act.reading.social_studies_sciences}/18
  - Arts / Literature: ${act.reading.arts_literature}/18
Science: ${act.science.total}/36
  - Data Representation: ${act.science.data_representation}/18
  - Research Summaries: ${act.science.research_summaries}/18
  - Conflicting Viewpoints: ${act.science.conflicting_viewpoints}/18`;
  }

  let prompt = `Create a ${totalWeeks}-week ${testType} prep plan for this student.

STUDENT PROFILE:
- Test: ${testType}
- Baseline Composite: ${baselineComposite}
- Test Date: ${testDate ?? "Not yet scheduled"}
- Target Schools: ${schoolsOfInterest.length > 0 ? schoolsOfInterest.join(", ") : "Not specified"}

BASELINE SCORE BREAKDOWN:
${scoreBreakdown}

SCHEDULE:
- Self-study: ${selfStudyHoursPerWeek} hours/week
- Live sessions: ${liveSessionHoursPerWeek} hours/week
- Total paid sessions: ${totalSessions}
- Sessions per week: ${Math.ceil(totalSessions / totalWeeks)}

Create exactly ${totalWeeks} weeks with approximately ${Math.ceil(totalSessions / totalWeeks)} sessions per week. Each session should have a detailed agenda that fills the allocated time (approximately ${Math.round((liveSessionHoursPerWeek / Math.ceil(totalSessions / totalWeeks)) * 60)} minutes per session).

Self-study assignments should total approximately ${selfStudyHoursPerWeek * 60} minutes per week.`;

  if (tutorNotes) {
    prompt += `\n\nTUTOR NOTES (incorporate these preferences):\n${tutorNotes}`;
  }

  return prompt;
}

// --- Score Prediction Prompts ---

interface PredictionPromptParams {
  testType: "SAT" | "ACT";
  baselineComposite: number;
  sectionScores: SATSectionScores | ACTSectionScores;
  totalWeeks: number;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
  totalSessions: number;
  historicalOutcomes: HistoricalOutcome[];
}

export function buildPredictionSystemPrompt(): string {
  return `You are an expert standardized test score prediction analyst. You analyze student baseline scores, study plan parameters, and historical outcome data to predict realistic score improvements.

Your predictions should:
- Be conservative and realistic based on the historical data provided
- Provide a low and high prediction for the composite and each section
- Account for the student's specific weaknesses and the study plan intensity
- Consider diminishing returns at higher score ranges
- Include confidence notes explaining your rationale and key factors

Always use the predict_score tool to return your prediction in structured format.`;
}

export function buildPredictionUserPrompt(params: PredictionPromptParams): string {
  const {
    testType,
    baselineComposite,
    sectionScores,
    totalWeeks,
    selfStudyHoursPerWeek,
    liveSessionHoursPerWeek,
    totalSessions,
    historicalOutcomes,
  } = params;

  let scoreBreakdown: string;
  if (testType === "SAT") {
    const sat = sectionScores as SATSectionScores;
    scoreBreakdown = `
Reading & Writing: ${sat.reading_writing.total}/800
  - Information & Ideas: ${sat.reading_writing.information_and_ideas}/15
  - Craft & Structure: ${sat.reading_writing.craft_and_structure}/15
  - Expression of Ideas: ${sat.reading_writing.expression_of_ideas}/15
  - Standard English Conventions: ${sat.reading_writing.standard_english_conventions}/15
Math: ${sat.math.total}/800
  - Algebra: ${sat.math.algebra}/15
  - Advanced Math: ${sat.math.advanced_math}/15
  - Problem Solving & Data Analysis: ${sat.math.problem_solving}/15
  - Geometry & Trigonometry: ${sat.math.geometry_and_trig}/15`;
  } else {
    const act = sectionScores as ACTSectionScores;
    scoreBreakdown = `
English: ${act.english.total}/36
  - Usage & Mechanics: ${act.english.usage_mechanics}/18
  - Rhetorical Skills: ${act.english.rhetorical_skills}/18
Math: ${act.math.total}/36
  - Pre-Algebra / Elementary Algebra: ${act.math.pre_algebra}/18
  - Algebra / Coordinate Geometry: ${act.math.algebra}/18
  - Plane Geometry / Trigonometry: ${act.math.geometry}/18
Reading: ${act.reading.total}/36
  - Social Studies / Sciences: ${act.reading.social_studies_sciences}/18
  - Arts / Literature: ${act.reading.arts_literature}/18
Science: ${act.science.total}/36
  - Data Representation: ${act.science.data_representation}/18
  - Research Summaries: ${act.science.research_summaries}/18
  - Conflicting Viewpoints: ${act.science.conflicting_viewpoints}/18`;
  }

  // Build historical outcomes table
  let historicalTable = "| Baseline | Final | Improvement | Weeks | Study hrs/wk | Live hrs/wk |\n";
  historicalTable += "|----------|-------|-------------|-------|-------------|-------------|\n";
  for (const h of historicalOutcomes) {
    historicalTable += `| ${h.baseline_composite} | ${h.final_composite} | +${h.final_composite - h.baseline_composite} | ${h.total_weeks} | ${h.self_study_hours_per_week ?? "N/A"} | ${h.live_session_hours_per_week ?? "N/A"} |\n`;
  }

  return `Predict the score improvement for this ${testType} student.

STUDENT BASELINE:
- Composite: ${baselineComposite}
${scoreBreakdown}

STUDY PLAN:
- Duration: ${totalWeeks} weeks
- Self-study: ${selfStudyHoursPerWeek} hours/week
- Live tutoring: ${liveSessionHoursPerWeek} hours/week
- Total sessions: ${totalSessions}

HISTORICAL OUTCOMES (similar students):
${historicalTable}

Based on this data, predict the student's composite score range and per-section score ranges. For SAT, provide predictions for "reading_writing" and "math" sections. For ACT, provide predictions for "english", "math", "reading", and "science" sections.`;
}
