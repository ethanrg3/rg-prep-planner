import { createAdminClient } from "@/lib/supabase/admin";
import type { ScoreReport, SectionScores, SectionPrediction } from "@/types/database";

export async function getScoreReports(
  studentId: string
): Promise<ScoreReport[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("score_reports")
    .select("*")
    .eq("student_id", studentId)
    .order("report_date", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map(mapScoreReport);
}

export interface CreateScoreReportInput {
  studentId: string;
  reportType: "baseline" | "predicted" | "actual";
  reportLabel: string;
  reportDate: string;
  compositeScore: number;
  sectionScores: SectionScores;
  predictionRangeLow?: number | null;
  predictionRangeHigh?: number | null;
  sectionPredictions?: Record<string, SectionPrediction> | null;
  confidenceNotes?: string | null;
  sourceImageUrl?: string | null;
}

export async function createScoreReport(
  data: CreateScoreReportInput
): Promise<ScoreReport> {
  const supabase = createAdminClient();

  const { data: report, error } = await supabase
    .from("score_reports")
    .insert({
      student_id: data.studentId,
      report_type: data.reportType,
      report_label: data.reportLabel,
      report_date: data.reportDate,
      composite_score: data.compositeScore,
      section_scores: data.sectionScores,
      prediction_range_low: data.predictionRangeLow ?? null,
      prediction_range_high: data.predictionRangeHigh ?? null,
      section_predictions: data.sectionPredictions ?? null,
      confidence_notes: data.confidenceNotes ?? null,
      source_image_url: data.sourceImageUrl ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapScoreReport(report);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapScoreReport(row: any): ScoreReport {
  return {
    id: row.id,
    student_id: row.student_id,
    report_type: row.report_type,
    report_label: row.report_label,
    report_date: row.report_date,
    composite_score: row.composite_score,
    section_scores: row.section_scores as SectionScores,
    prediction_range_low: row.prediction_range_low,
    prediction_range_high: row.prediction_range_high,
    section_predictions: row.section_predictions as Record<string, SectionPrediction> | null,
    confidence_notes: row.confidence_notes,
    source_image_url: row.source_image_url,
    created_at: row.created_at,
  };
}
