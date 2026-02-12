"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, TrendingUp } from "lucide-react";
import { ScoreProgressionArrow } from "./score-progression-arrow";
import { ScorePredictionChart } from "./score-prediction-chart";
import { SubScoreRadarChart } from "./sub-score-radar-chart";
import { ConfidenceNote } from "./confidence-note";
import type { SectionPrediction } from "@/types/database";

interface ScorePredictionPanelProps {
  studentId: string;
  testType: "SAT" | "ACT";
  baselineComposite: number;
  baselineSubscores: Record<string, number>;
  sectionPredictions?: Record<string, SectionPrediction>;
  totalWeeks: number;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
  totalSessions: number;
}

interface PredictionData {
  predicted_composite_low: number;
  predicted_composite_high: number;
  section_predictions: Record<string, SectionPrediction>;
  confidence_notes: string;
}

// Fallback mock prediction for when API is unavailable
const MOCK_SAT_PREDICTION: PredictionData = {
  predicted_composite_low: 1240,
  predicted_composite_high: 1310,
  section_predictions: {
    reading_writing: { current: 620, predicted_low: 680, predicted_high: 720 },
    math: { current: 500, predicted_low: 560, predicted_high: 590 },
  },
  confidence_notes:
    "Based on analysis of 10 similar students with baselines between 1050-1160, studying 5 hrs/wk with 2 hrs/wk live tutoring over 8 weeks, we project a 120-190 point improvement. The largest gains are expected in Math, where foundational skills in algebra and geometry can be rapidly improved. Reading & Writing improvement is projected to be steady, driven by gains in Expression of Ideas and Standard English Conventions.",
};

export function ScorePredictionPanel({
  testType,
  baselineComposite,
  baselineSubscores,
  totalWeeks,
  selfStudyHoursPerWeek,
  liveSessionHoursPerWeek,
  totalSessions,
}: ScorePredictionPanelProps) {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedMock, setUsedMock] = useState(false);

  async function generatePrediction() {
    setIsLoading(true);
    setError(null);
    setUsedMock(false);

    try {
      const res = await fetch("/api/predict-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "mock",
          testType,
          baselineComposite,
          sectionScores:
            testType === "SAT"
              ? {
                  reading_writing: {
                    total: 620,
                    ...Object.fromEntries(
                      Object.entries(baselineSubscores).filter(([k]) =>
                        [
                          "information_and_ideas",
                          "craft_and_structure",
                          "expression_of_ideas",
                          "standard_english_conventions",
                        ].includes(k)
                      )
                    ),
                  },
                  math: {
                    total: 500,
                    ...Object.fromEntries(
                      Object.entries(baselineSubscores).filter(([k]) =>
                        [
                          "algebra",
                          "advanced_math",
                          "problem_solving",
                          "geometry_and_trig",
                        ].includes(k)
                      )
                    ),
                  },
                }
              : {},
          totalWeeks,
          selfStudyHoursPerWeek,
          liveSessionHoursPerWeek,
          totalSessions,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setPrediction(data.prediction);
    } catch {
      // Fallback to mock data
      console.log("Using mock prediction data (API unavailable)");
      setPrediction(MOCK_SAT_PREDICTION);
      setUsedMock(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Auto-load with mock data on mount
    setPrediction(MOCK_SAT_PREDICTION);
    setUsedMock(true);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm text-muted-foreground">
            Generating score prediction...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error && !prediction) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <Button variant="outline" onClick={generatePrediction}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <TrendingUp className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="mb-4 text-muted-foreground">
            Generate an AI-powered score prediction
          </p>
          <Button
            onClick={generatePrediction}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Prediction
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {usedMock && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
          <p className="text-xs text-amber-800">
            Showing sample prediction. Connect your Anthropic API key for live
            predictions.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={generatePrediction}
            className="text-xs"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Try Live
          </Button>
        </div>
      )}

      <ScoreProgressionArrow
        testType={testType}
        baselineComposite={baselineComposite}
        predictedLow={prediction.predicted_composite_low}
        predictedHigh={prediction.predicted_composite_high}
        sectionPredictions={prediction.section_predictions}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ScorePredictionChart
          testType={testType}
          sectionPredictions={prediction.section_predictions}
        />
        <SubScoreRadarChart
          testType={testType}
          baselineSubscores={baselineSubscores}
          sectionPredictions={prediction.section_predictions}
        />
      </div>

      <ConfidenceNote notes={prediction.confidence_notes} />
    </div>
  );
}
