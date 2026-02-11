"use client";

import { useState } from "react";
import { PlanTimeline, type PlanWeekData } from "./plan-timeline";
import { PlanApprovalBar } from "./plan-approval-bar";

interface PlanViewProps {
  studentName: string;
  baselineScore: number;
  predictedLow: number;
  predictedHigh: number;
  weeks: PlanWeekData[];
  initialStatus: "draft" | "approved" | "archived";
}

export function PlanView({
  studentName,
  baselineScore,
  predictedLow,
  predictedHigh,
  weeks,
  initialStatus,
}: PlanViewProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  function handleApprove() {
    setIsLoading(true);
    // TODO: Call server action to update plan status
    setTimeout(() => {
      setStatus("approved");
      setIsLoading(false);
    }, 800);
  }

  function handleRegenerate(notes: string) {
    setIsLoading(true);
    // TODO: Call API to regenerate plan with notes
    console.log("Regenerating plan with notes:", notes);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Score projection header */}
      <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-4">
        <div className="text-sm">
          <span className="font-medium">{studentName}</span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {baselineScore} → {predictedLow}–{predictedHigh}
          </span>
          <span className="ml-2 text-sm font-medium text-green-600">
            (+{predictedLow - baselineScore} to +{predictedHigh - baselineScore} pts)
          </span>
        </div>
      </div>

      <PlanApprovalBar
        status={status}
        onApprove={handleApprove}
        onRegenerate={handleRegenerate}
        isLoading={isLoading}
      />

      <PlanTimeline weeks={weeks} status={status} />
    </div>
  );
}
