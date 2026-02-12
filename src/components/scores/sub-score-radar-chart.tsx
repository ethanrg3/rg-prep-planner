"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SAT_RW_SUBSCORES,
  SAT_MATH_SUBSCORES,
  SAT_SUBSCORE_MAX,
  ACT_ENGLISH_SUBSCORES,
  ACT_MATH_SUBSCORES,
  ACT_READING_SUBSCORES,
  ACT_SCIENCE_SUBSCORES,
  ACT_SUBSCORE_MAX,
} from "@/lib/utils/constants";
import type { SectionPrediction } from "@/types/database";

interface SubScoreRadarChartProps {
  testType: "SAT" | "ACT";
  baselineSubscores: Record<string, number>;
  sectionPredictions: Record<string, SectionPrediction>;
}

export function SubScoreRadarChart({
  testType,
  baselineSubscores,
  sectionPredictions,
}: SubScoreRadarChartProps) {
  const maxScore = testType === "SAT" ? SAT_SUBSCORE_MAX : ACT_SUBSCORE_MAX;

  // Build sub-score data with proportional prediction scaling
  let subscoreEntries: { label: string; key: string; section: string }[];

  if (testType === "SAT") {
    subscoreEntries = [
      ...SAT_RW_SUBSCORES.map((s) => ({
        label: s.label,
        key: s.key,
        section: "reading_writing",
      })),
      ...SAT_MATH_SUBSCORES.map((s) => ({
        label: s.label,
        key: s.key,
        section: "math",
      })),
    ];
  } else {
    subscoreEntries = [
      ...ACT_ENGLISH_SUBSCORES.map((s) => ({
        label: s.label,
        key: s.key,
        section: "english",
      })),
      ...ACT_MATH_SUBSCORES.map((s) => ({
        label: s.label,
        key: s.key,
        section: "math",
      })),
      ...ACT_READING_SUBSCORES.map((s) => ({
        label: s.label,
        key: s.key,
        section: "reading",
      })),
      ...ACT_SCIENCE_SUBSCORES.map((s) => ({
        label: s.label,
        key: s.key,
        section: "science",
      })),
    ];
  }

  const data = subscoreEntries.map((entry) => {
    const baseline = baselineSubscores[entry.key] || 0;
    const sectionPred = sectionPredictions[entry.section];

    // Scale sub-score proportionally based on section prediction
    let predictedMid = baseline;
    if (sectionPred && sectionPred.current > 0) {
      const sectionMidpoint =
        (sectionPred.predicted_low + sectionPred.predicted_high) / 2;
      const ratio = sectionMidpoint / sectionPred.current;
      predictedMid = Math.min(Math.round(baseline * ratio * 10) / 10, maxScore);
    }

    // Shorten label for radar display
    const shortLabel =
      entry.label.length > 16
        ? entry.label.slice(0, 14) + "..."
        : entry.label;

    return {
      subject: shortLabel,
      Baseline: baseline,
      Predicted: predictedMid,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Sub-Score Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, maxScore]}
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Baseline"
              dataKey="Baseline"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.2}
            />
            <Radar
              name="Predicted"
              dataKey="Predicted"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.2}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
