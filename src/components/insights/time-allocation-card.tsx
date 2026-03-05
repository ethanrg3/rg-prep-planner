"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const SECTION_COLORS: Record<string, { bg: string; text: string }> = {
  reading_writing: { bg: "bg-blue-500", text: "text-blue-700" },
  math: { bg: "bg-emerald-500", text: "text-emerald-700" },
};

const SECTION_LABELS: Record<string, string> = {
  reading_writing: "Reading & Writing",
  math: "Math",
};

interface TimeAllocationCardProps {
  allocation: Record<string, number>;
}

export function TimeAllocationCard({ allocation }: TimeAllocationCardProps) {
  const entries = Object.entries(allocation).sort(([, a], [, b]) => b - a);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-orange-500" />
          Recommended Time Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stacked bar */}
        <div className="flex h-8 overflow-hidden rounded-lg">
          {entries.map(([key, pct]) => {
            const colors = SECTION_COLORS[key] || { bg: "bg-slate-400", text: "text-slate-700" };
            return (
              <div
                key={key}
                className={`flex items-center justify-center ${colors.bg} transition-all`}
                style={{ width: `${pct}%` }}
              >
                {pct >= 15 && (
                  <span className="text-xs font-bold text-white">
                    {Math.round(pct)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {entries.map(([key, pct]) => {
            const colors = SECTION_COLORS[key] || { bg: "bg-slate-400", text: "text-slate-700" };
            return (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-sm ${colors.bg}`} />
                <span className={`text-xs font-medium ${colors.text}`}>
                  {SECTION_LABELS[key] || key}: {Math.round(pct)}%
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
