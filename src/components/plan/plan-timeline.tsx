"use client";

import { useState } from "react";
import { WeekCard } from "./week-card";
import type { PlanAssignment, AgendaItem } from "@/types/database";

export interface PlanWeekData {
  week_number: number;
  theme: string;
  goals: string[];
  self_study_assignments: PlanAssignment[];
  sessions: {
    session_number: number;
    agenda: AgendaItem[];
  }[];
}

interface PlanTimelineProps {
  weeks: PlanWeekData[];
  status: "draft" | "approved" | "archived";
}

export function PlanTimeline({ weeks, status }: PlanTimelineProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(
    weeks.length > 0 ? 1 : null
  );

  return (
    <div className="relative space-y-4">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

      {weeks.map((week) => (
        <WeekCard
          key={week.week_number}
          week={week}
          isExpanded={expandedWeek === week.week_number}
          onToggle={() =>
            setExpandedWeek(
              expandedWeek === week.week_number ? null : week.week_number
            )
          }
          status={status}
        />
      ))}
    </div>
  );
}
