"use client";

import { Clock } from "lucide-react";
import type { AgendaItem } from "@/types/database";

interface SessionAgendaProps {
  session: {
    session_number: number;
    agenda: AgendaItem[];
  };
  weekNumber: number;
}

export function SessionAgenda({ session, weekNumber }: SessionAgendaProps) {
  const totalMinutes = session.agenda.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <p className="text-sm font-medium">
          Session {session.session_number}{" "}
          <span className="text-muted-foreground">
            — Week {weekNumber}
          </span>
        </p>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {totalMinutes} min
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {session.agenda.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2">
            <span className="text-sm">{item.activity}</span>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {item.minutes} min
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
