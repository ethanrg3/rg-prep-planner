import type { ScoreReport, SATSectionScores } from "@/types/database";
import { format } from "date-fns";

export type Trend = "improving" | "plateau" | "declining";

export interface TrendResult {
  trend: Trend;
  changeFromFirst: number;
  changeFromPrevious: number;
}

export interface ChartDataPoint {
  date: string;
  dateFormatted: string;
  label: string;
  composite: number;
  rw: number;
  math: number;
  // SAT subscores
  information_and_ideas?: number;
  craft_and_structure?: number;
  expression_of_ideas?: number;
  standard_english_conventions?: number;
  algebra?: number;
  advanced_math?: number;
  problem_solving?: number;
  geometry_and_trig?: number;
}

/**
 * Calculate trend from a series of numeric values using simple linear regression slope.
 * - slope > threshold → improving
 * - slope < -threshold → declining
 * - otherwise → plateau
 */
export function calculateTrend(values: number[]): Trend {
  if (values.length < 2) return "plateau";

  const n = values.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Threshold: consider a slope of < 0.1 as plateau (for 1-7 scale subscores)
  // and for section scores (200-800), we need a proportionally larger threshold
  const range = Math.max(...values) - Math.min(...values);
  const maxVal = Math.max(...values);
  const relativeThreshold = maxVal > 50 ? 5 : 0.15;

  if (slope > relativeThreshold) return "improving";
  if (slope < -relativeThreshold) return "declining";
  return "plateau";
}

/**
 * Convert score reports into chart-friendly data points.
 */
export function formatScoreReportsForChart(
  reports: ScoreReport[]
): ChartDataPoint[] {
  return [...reports]
    .sort(
      (a, b) =>
        new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
    )
    .map((r) => {
      const sat = r.section_scores as SATSectionScores;
      return {
        date: r.report_date,
        dateFormatted: format(new Date(r.report_date), "MMM d"),
        label: r.report_label,
        composite: r.composite_score,
        rw: sat.reading_writing.total,
        math: sat.math.total,
        information_and_ideas: sat.reading_writing.information_and_ideas,
        craft_and_structure: sat.reading_writing.craft_and_structure,
        expression_of_ideas: sat.reading_writing.expression_of_ideas,
        standard_english_conventions:
          sat.reading_writing.standard_english_conventions,
        algebra: sat.math.algebra,
        advanced_math: sat.math.advanced_math,
        problem_solving: sat.math.problem_solving,
        geometry_and_trig: sat.math.geometry_and_trig,
      };
    });
}

/**
 * Get trend for a specific section or subscore key across reports.
 */
export function getSectionTrend(
  reports: ScoreReport[],
  sectionKey: string
): TrendResult {
  const sorted = [...reports].sort(
    (a, b) =>
      new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
  );

  const values = sorted.map((r) => {
    const sat = r.section_scores as SATSectionScores;
    switch (sectionKey) {
      case "composite":
        return r.composite_score;
      case "rw":
        return sat.reading_writing.total;
      case "math":
        return sat.math.total;
      // R&W subscores
      case "information_and_ideas":
        return sat.reading_writing.information_and_ideas;
      case "craft_and_structure":
        return sat.reading_writing.craft_and_structure;
      case "expression_of_ideas":
        return sat.reading_writing.expression_of_ideas;
      case "standard_english_conventions":
        return sat.reading_writing.standard_english_conventions;
      // Math subscores
      case "algebra":
        return sat.math.algebra;
      case "advanced_math":
        return sat.math.advanced_math;
      case "problem_solving":
        return sat.math.problem_solving;
      case "geometry_and_trig":
        return sat.math.geometry_and_trig;
      default:
        return 0;
    }
  });

  return {
    trend: calculateTrend(values),
    changeFromFirst: values.length >= 2 ? values[values.length - 1] - values[0] : 0,
    changeFromPrevious:
      values.length >= 2
        ? values[values.length - 1] - values[values.length - 2]
        : 0,
  };
}
