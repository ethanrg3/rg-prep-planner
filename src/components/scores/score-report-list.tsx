"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ScoreReport, SATSectionScores } from "@/types/database";
import {
  SAT_RW_SUBSCORES,
  SAT_MATH_SUBSCORES,
  SAT_SUBSCORE_MAX,
} from "@/lib/utils/constants";

interface ScoreReportListProps {
  reports: ScoreReport[];
}

function ScoreBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-current transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-[2rem] text-right text-xs font-medium">
        {value}/{max}
      </span>
    </div>
  );
}

function ReportRow({ report, isFirst }: { report: ScoreReport; isFirst: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const sat = report.section_scores as SATSectionScores;

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="min-w-[5rem] text-xs text-muted-foreground">
          {format(new Date(report.report_date), "MMM d, yyyy")}
        </div>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium">{report.report_label}</span>
          {isFirst && (
            <Badge variant="outline" className="text-[10px]">
              Baseline
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-bold">{report.composite_score}</span>
          <span className="text-blue-600">{sat.reading_writing.total}</span>
          <span className="text-emerald-600">{sat.math.total}</span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 px-4 py-3">
          <div className="space-y-1.5 text-blue-700">
            <p className="text-xs font-semibold">Reading & Writing — {sat.reading_writing.total}</p>
            {SAT_RW_SUBSCORES.map((sub) => (
              <div key={sub.key}>
                <p className="mb-0.5 text-[10px]">{sub.label}</p>
                <ScoreBar
                  value={sat.reading_writing[sub.key as keyof typeof sat.reading_writing] as number}
                  max={SAT_SUBSCORE_MAX}
                />
              </div>
            ))}
          </div>
          <div className="space-y-1.5 text-emerald-700">
            <p className="text-xs font-semibold">Math — {sat.math.total}</p>
            {SAT_MATH_SUBSCORES.map((sub) => (
              <div key={sub.key}>
                <p className="mb-0.5 text-[10px]">{sub.label}</p>
                <ScoreBar
                  value={sat.math[sub.key as keyof typeof sat.math] as number}
                  max={SAT_SUBSCORE_MAX}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ScoreReportList({ reports }: ScoreReportListProps) {
  const sorted = [...reports].sort(
    (a, b) =>
      new Date(b.report_date).getTime() - new Date(a.report_date).getTime()
  );

  // Find the earliest report as baseline
  const earliest = [...reports].sort(
    (a, b) =>
      new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
  )[0];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Score Report History ({reports.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {/* Column headers */}
          <div className="flex items-center gap-3 border-b bg-slate-50 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <div className="min-w-[5rem]">Date</div>
            <div className="flex-1">Report</div>
            <div className="flex items-center gap-4">
              <span>Total</span>
              <span className="text-blue-600">R&W</span>
              <span className="text-emerald-600">Math</span>
              <span className="w-4" />
            </div>
          </div>
          {sorted.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              isFirst={report.id === earliest?.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
