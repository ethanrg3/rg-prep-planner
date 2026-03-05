"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

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

interface RiskAlertsCardProps {
  alerts: {
    section: string;
    subscore: string;
    alert: string;
    severity: "high" | "medium";
  }[];
}

export function RiskAlertsCard({ alerts }: RiskAlertsCardProps) {
  if (alerts.length === 0) return null;

  return (
    <Card className="border-amber-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-amber-700">
          <AlertTriangle className="h-4 w-4" />
          Risk Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((a) => (
          <div
            key={`${a.section}-${a.subscore}`}
            className={`rounded-lg p-2.5 ${
              a.severity === "high"
                ? "bg-red-50 border border-red-100"
                : "bg-amber-50 border border-amber-100"
            }`}
          >
            <div className="mb-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  a.severity === "high"
                    ? "border-red-200 bg-red-100 text-red-700 text-[10px]"
                    : "border-amber-200 bg-amber-100 text-amber-700 text-[10px]"
                }
              >
                {a.severity}
              </Badge>
              <span
                className={`text-xs font-medium ${
                  a.severity === "high" ? "text-red-800" : "text-amber-800"
                }`}
              >
                {SUBSCORE_LABELS[a.subscore] || a.subscore}
              </span>
            </div>
            <p
              className={`text-xs ${
                a.severity === "high" ? "text-red-700/80" : "text-amber-700/80"
              }`}
            >
              {a.alert}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
