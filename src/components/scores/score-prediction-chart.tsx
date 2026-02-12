"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SectionPrediction } from "@/types/database";

const SECTION_LABELS: Record<string, string> = {
  reading_writing: "R&W",
  math: "Math",
  english: "English",
  reading: "Reading",
  science: "Science",
};

interface ScorePredictionChartProps {
  testType: "SAT" | "ACT";
  sectionPredictions: Record<string, SectionPrediction>;
}

export function ScorePredictionChart({
  sectionPredictions,
}: ScorePredictionChartProps) {
  const data = Object.entries(sectionPredictions).map(([key, pred]) => ({
    name: SECTION_LABELS[key] || key,
    Baseline: pred.current,
    "Predicted Low": pred.predicted_low,
    "Predicted High": pred.predicted_high,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Section Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Predicted Low" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Predicted High" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
