"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

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

interface StrengthsCardProps {
  strengths: { section: string; subscore: string; note: string }[];
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  if (strengths.length === 0) return null;

  return (
    <Card className="border-green-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-green-700">
          <Shield className="h-4 w-4" />
          Strengths to Maintain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {strengths.map((s) => (
          <div
            key={`${s.section}-${s.subscore}`}
            className="flex items-start gap-2 rounded-lg bg-green-50 p-2.5"
          >
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            <div>
              <p className="text-xs font-medium text-green-800">
                {SUBSCORE_LABELS[s.subscore] || s.subscore}
              </p>
              <p className="text-xs text-green-700/80">{s.note}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
