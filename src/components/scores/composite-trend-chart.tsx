"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScoreReport } from "@/types/database";
import { formatScoreReportsForChart } from "@/lib/utils/score-trends";

interface CompositeTrendChartProps {
  reports: ScoreReport[];
}

export function CompositeTrendChart({ reports }: CompositeTrendChartProps) {
  const data = formatScoreReportsForChart(reports);

  if (data.length < 2) {
    return null;
  }

  const baselineScore = data[0].composite;
  const scores = data.map((d) => d.composite);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const domainMin = Math.floor((minScore - 40) / 20) * 20;
  const domainMax = Math.ceil((maxScore + 40) / 20) * 20;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Composite Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="dateFormatted"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis
              domain={[domainMin, domainMax]}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-white p-2 shadow-md">
                    <p className="text-xs font-medium">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.dateFormatted}</p>
                    <p className="mt-1 text-sm font-bold">{d.composite}</p>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={baselineScore}
              stroke="#94a3b8"
              strokeDasharray="6 3"
              label={{
                value: `Baseline: ${baselineScore}`,
                position: "insideTopRight",
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="composite"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
