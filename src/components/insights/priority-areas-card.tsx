"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import type { PriorityArea } from "@/lib/ai/generate-insights";

const SECTION_COLORS: Record<string, string> = {
  reading_writing: "bg-blue-100 text-blue-700",
  math: "bg-emerald-100 text-emerald-700",
};

const SUBSCORE_LABELS: Record<string, string> = {
  information_and_ideas: "Info & Ideas",
  craft_and_structure: "Craft & Structure",
  expression_of_ideas: "Expression of Ideas",
  standard_english_conventions: "Conventions",
  algebra: "Algebra",
  advanced_math: "Advanced Math",
  problem_solving: "Problem Solving",
  geometry_and_trig: "Geometry & Trig",
};

interface PriorityAreasCardProps {
  areas: PriorityArea[];
}

export function PriorityAreasCard({ areas }: PriorityAreasCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-orange-500" />
          Priority Focus Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {areas.map((area, i) => (
          <div
            key={`${area.section}-${area.subscore}`}
            className="rounded-lg border bg-slate-50/50 p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <Badge
                variant="secondary"
                className={SECTION_COLORS[area.section] || ""}
              >
                {SUBSCORE_LABELS[area.subscore] || area.subscore}
              </Badge>
              <span className="text-xs font-medium text-orange-600">
                {area.impact_estimate}
              </span>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{area.reason}</p>
            {area.recommended_resources.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {area.recommended_resources.map((r) => (
                  <Badge key={r} variant="outline" className="text-[10px]">
                    {r}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
