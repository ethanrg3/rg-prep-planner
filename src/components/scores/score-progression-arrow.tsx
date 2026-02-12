"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { SectionPrediction } from "@/types/database";

interface ScoreProgressionArrowProps {
  testType: "SAT" | "ACT";
  baselineComposite: number;
  predictedLow: number;
  predictedHigh: number;
  sectionPredictions: Record<string, SectionPrediction>;
}

const SECTION_LABELS: Record<string, string> = {
  reading_writing: "Reading & Writing",
  math: "Math",
  english: "English",
  reading: "Reading",
  science: "Science",
};

const SECTION_COLORS: Record<string, string> = {
  reading_writing: "bg-blue-50 text-blue-700 border-blue-200",
  math: "bg-emerald-50 text-emerald-700 border-emerald-200",
  english: "bg-purple-50 text-purple-700 border-purple-200",
  reading: "bg-amber-50 text-amber-700 border-amber-200",
  science: "bg-teal-50 text-teal-700 border-teal-200",
};

export function ScoreProgressionArrow({
  baselineComposite,
  predictedLow,
  predictedHigh,
  sectionPredictions,
}: ScoreProgressionArrowProps) {
  const improvementLow = predictedLow - baselineComposite;
  const improvementHigh = predictedHigh - baselineComposite;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Score Projection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Composite arrow */}
        <div className="flex items-center justify-center gap-4 rounded-lg bg-slate-50 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{baselineComposite}</p>
            <p className="text-xs text-muted-foreground">Baseline</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="h-6 w-6 text-orange-500" />
            <Badge className="bg-green-600 text-xs">
              +{improvementLow} to +{improvementHigh}
            </Badge>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {predictedLow}–{predictedHigh}
            </p>
            <p className="text-xs text-muted-foreground">Predicted</p>
          </div>
        </div>

        {/* Section rows */}
        <div className="space-y-2">
          {Object.entries(sectionPredictions).map(([key, pred]) => {
            const colors = SECTION_COLORS[key] || "bg-slate-50 text-slate-700 border-slate-200";
            const label = SECTION_LABELS[key] || key;
            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-lg border p-3 ${colors}`}
              >
                <span className="text-sm font-medium">{label}</span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold">{pred.current}</span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                  <span className="font-semibold">
                    {pred.predicted_low}–{pred.predicted_high}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    +{pred.predicted_low - pred.current} to +
                    {pred.predicted_high - pred.current}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
