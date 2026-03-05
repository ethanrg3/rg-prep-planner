"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ScoreReport } from "@/types/database";
import { formatScoreReportsForChart, getSectionTrend, type Trend } from "@/lib/utils/score-trends";

interface SectionTrendChartProps {
  reports: ScoreReport[];
}

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend === "improving") {
    return (
      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
        <TrendingUp className="mr-1 h-3 w-3" /> Improving
      </Badge>
    );
  }
  if (trend === "declining") {
    return (
      <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
        <TrendingDown className="mr-1 h-3 w-3" /> Declining
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
      <Minus className="mr-1 h-3 w-3" /> Plateau
    </Badge>
  );
}

export function SectionTrendChart({ reports }: SectionTrendChartProps) {
  const data = formatScoreReportsForChart(reports);

  if (data.length < 2) {
    return null;
  }

  const rwTrend = getSectionTrend(reports, "rw");
  const mathTrend = getSectionTrend(reports, "math");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Section Score Trends</CardTitle>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-blue-600">R&W</span>
              <TrendBadge trend={rwTrend.trend} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-emerald-600">Math</span>
              <TrendBadge trend={mathTrend.trend} />
            </div>
          </div>
        </div>
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
              domain={[200, 800]}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-white p-2 shadow-md">
                    <p className="text-xs font-medium">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.dateFormatted}</p>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs">
                        <span className="font-medium text-blue-600">R&W:</span> {d.rw}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium text-emerald-600">Math:</span> {d.math}
                      </p>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value: string) => (
                <span className="text-xs">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="rw"
              name="Reading & Writing"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="math"
              name="Math"
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 4, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
