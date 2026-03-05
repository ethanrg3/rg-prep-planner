"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ScoreReport } from "@/types/database";
import {
  formatScoreReportsForChart,
  getSectionTrend,
  type Trend,
} from "@/lib/utils/score-trends";
import {
  SAT_RW_SUBSCORES,
  SAT_MATH_SUBSCORES,
  SAT_SUBSCORE_MAX,
} from "@/lib/utils/constants";

interface SubscoreTrendGridProps {
  reports: ScoreReport[];
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "improving") {
    return <TrendingUp className="h-3.5 w-3.5 text-green-600" />;
  }
  if (trend === "declining") {
    return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  }
  return <Minus className="h-3.5 w-3.5 text-yellow-500" />;
}

function trendColor(trend: Trend): string {
  if (trend === "improving") return "#16a34a";
  if (trend === "declining") return "#ef4444";
  return "#eab308";
}

function trendBgClass(trend: Trend): string {
  if (trend === "improving") return "bg-green-50 border-green-100";
  if (trend === "declining") return "bg-red-50 border-red-100";
  return "bg-yellow-50 border-yellow-100";
}

interface SubscoreCardProps {
  label: string;
  dataKey: string;
  data: ReturnType<typeof formatScoreReportsForChart>;
  reports: ScoreReport[];
  sectionColor: string;
}

function SubscoreCard({ label, dataKey, data, reports, sectionColor }: SubscoreCardProps) {
  const trendResult = getSectionTrend(reports, dataKey);
  const latestValue = data.length > 0 ? (data[data.length - 1][dataKey as keyof typeof data[0]] as number) : 0;

  return (
    <div className={`rounded-lg border p-3 ${trendBgClass(trendResult.trend)}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: sectionColor }}>
          {label}
        </span>
        <div className="flex items-center gap-1">
          <TrendIcon trend={trendResult.trend} />
          <span className="text-xs font-semibold">
            {latestValue}/{SAT_SUBSCORE_MAX}
          </span>
        </div>
      </div>
      {data.length >= 2 && (
        <div className="h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={trendColor(trendResult.trend)}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {trendResult.changeFromFirst !== 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          {trendResult.changeFromFirst > 0 ? "+" : ""}
          {trendResult.changeFromFirst} since baseline
        </p>
      )}
    </div>
  );
}

export function SubscoreTrendGrid({ reports }: SubscoreTrendGridProps) {
  const data = formatScoreReportsForChart(reports);

  if (data.length < 2) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Sub-Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {/* R&W Subscores */}
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Reading & Writing
        </h4>
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SAT_RW_SUBSCORES.map((sub) => (
            <SubscoreCard
              key={sub.key}
              label={sub.label}
              dataKey={sub.key}
              data={data}
              reports={reports}
              sectionColor="#2563eb"
            />
          ))}
        </div>

        {/* Math Subscores */}
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Math
        </h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SAT_MATH_SUBSCORES.map((sub) => (
            <SubscoreCard
              key={sub.key}
              label={sub.label}
              dataKey={sub.key}
              data={data}
              reports={reports}
              sectionColor="#059669"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
