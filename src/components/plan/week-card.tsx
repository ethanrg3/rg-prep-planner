"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";
import { SessionAgenda } from "./session-agenda";
import type { PlanWeekData } from "./plan-timeline";

interface WeekCardProps {
  week: PlanWeekData;
  isExpanded: boolean;
  onToggle: () => void;
  status: "draft" | "approved" | "archived";
}

export function WeekCard({ week, isExpanded, onToggle }: WeekCardProps) {
  const totalStudyMinutes = week.self_study_assignments.reduce(
    (sum, a) => sum + a.estimated_minutes,
    0
  );

  return (
    <div className="relative pl-10">
      {/* Timeline dot */}
      <div className="absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-orange-500 bg-white" />

      <Card>
        <CardHeader className="cursor-pointer p-4" onClick={onToggle}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {isExpanded ? (
                <ChevronDown className="mt-0.5 h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="mt-0.5 h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Week {week.week_number}</h3>
                  <span className="text-sm text-muted-foreground">—</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {week.theme}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {week.self_study_assignments.length} assignments
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {totalStudyMinutes} min self-study
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {week.sessions.length} session
                    {week.sessions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">
              Wk {week.week_number}
            </Badge>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-5 px-4 pb-4 pt-0">
            {/* Goals */}
            <div>
              <p className="mb-2 text-sm font-medium">Goals</p>
              <ul className="space-y-1">
                {week.goals.map((goal, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Self-Study Assignments */}
            <div>
              <p className="mb-2 text-sm font-medium">Self-Study Assignments</p>
              <div className="space-y-2">
                {week.self_study_assignments.map((assignment, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{assignment.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {assignment.resource_type.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {assignment.estimated_minutes} min
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · {assignment.focus_area}
                        </span>
                      </div>
                      {assignment.instructions && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {assignment.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sessions */}
            <div>
              <p className="mb-2 text-sm font-medium">Live Sessions</p>
              <div className="space-y-3">
                {week.sessions.map((session) => (
                  <SessionAgenda
                    key={session.session_number}
                    session={session}
                    weekNumber={week.week_number}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
