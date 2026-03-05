"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Info, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { PriorityAreasCard } from "./priority-areas-card";
import { TimeAllocationCard } from "./time-allocation-card";
import { StrengthsCard } from "./strengths-card";
import { RiskAlertsCard } from "./risk-alerts-card";
import type { InsightsResult } from "@/lib/ai/generate-insights";
import type { ScoreReport } from "@/types/database";

interface InsightsPanelProps {
  studentId: string;
  testType: "SAT" | "ACT";
  scoreReports: ScoreReport[];
  testDate: string | null;
  selfStudyHoursPerWeek: number;
  liveSessionHoursPerWeek: number;
}

// Mock insights for when API key isn't configured
const MOCK_INSIGHTS: InsightsResult = {
  summary:
    "Sarah shows strong improvement in Reading & Writing (+40 pts across 3 tests) but Math growth has been slower (+50 pts). With 5 weeks remaining, focusing on Geometry & Trig and Advanced Math offers the highest ROI for composite score gains.",
  priority_areas: [
    {
      section: "math",
      subscore: "geometry_and_trig",
      reason:
        "Lowest subscore at 3/7 with minimal improvement across tests. High potential for growth given foundational gaps.",
      impact_estimate: "+30-50 points",
      recommended_resources: [
        "Khan Academy: Geometry & Trig",
        "Triangle & Circle Drill Worksheet",
        "Bluebook Practice: Math Section Focus",
      ],
    },
    {
      section: "math",
      subscore: "advanced_math",
      reason:
        "Improved from 3 to 4/7 but still below target. Quadratics and exponentials need focused practice.",
      impact_estimate: "+20-35 points",
      recommended_resources: [
        "Khan Academy: Passport to Advanced Math",
        "College Board: Advanced Math Practice",
      ],
    },
    {
      section: "reading_writing",
      subscore: "expression_of_ideas",
      reason:
        "Showed improvement from 3 to 4/7 but still the weakest R&W domain. Quick wins available with transition word drills.",
      impact_estimate: "+10-20 points",
      recommended_resources: [
        "Sentence Placement Drills",
        "Transition Words Practice",
      ],
    },
  ],
  time_allocation: {
    math: 60,
    reading_writing: 40,
  },
  strengths: [
    {
      section: "reading_writing",
      subscore: "information_and_ideas",
      note: "Strongest domain at 6/7, improved +1 since baseline. Maintain with weekly reading practice.",
    },
    {
      section: "reading_writing",
      subscore: "standard_english_conventions",
      note: "Solid at 5/7 with steady improvement. Grammar rules are sticking.",
    },
  ],
  risk_alerts: [
    {
      section: "math",
      subscore: "geometry_and_trig",
      alert:
        "Only +1 improvement across 3 tests while other math domains improved more. May need different instructional approach.",
      severity: "high",
    },
  ],
  model: "mock",
};

export function InsightsPanel({
  studentId,
  testType,
  scoreReports,
  testDate,
  selfStudyHoursPerWeek,
  liveSessionHoursPerWeek,
}: InsightsPanelProps) {
  const [insights, setInsights] = useState<InsightsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  if (scoreReports.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="mb-1 font-medium text-muted-foreground">
            Not enough data for insights
          </p>
          <p className="text-sm text-muted-foreground">
            Add at least 2 score reports to generate actionable insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function handleGenerate() {
    setIsLoading(true);
    setUsingMock(false);

    try {
      const res = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          testType,
          scoreReports,
          testDate,
          selfStudyHoursPerWeek,
          liveSessionHoursPerWeek,
        }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const result = await res.json();
      setInsights(result.data);
      toast.success("Insights generated!");
    } catch {
      // Fallback to mock data
      setInsights(MOCK_INSIGHTS);
      setUsingMock(true);
      toast.info("Using sample insights (API key not configured)");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-orange-400" />
          <p className="mb-2 font-medium">
            Ready to analyze {scoreReports.length} score reports
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            AI will identify priority areas, strengths, and risks based on score
            trends.
          </p>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleGenerate}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Insights
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {usingMock && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Info className="h-4 w-4 shrink-0" />
          <span>Showing sample insights. Configure ANTHROPIC_API_KEY for live analysis.</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleGenerate}
          >
            Try Live
          </Button>
        </div>
      )}

      {/* Executive summary */}
      <Card className="border-orange-100 bg-orange-50/50">
        <CardContent className="p-4">
          <p className="text-sm leading-relaxed text-orange-900">
            {insights.summary}
          </p>
        </CardContent>
      </Card>

      {/* Cards grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PriorityAreasCard areas={insights.priority_areas} />
        <TimeAllocationCard allocation={insights.time_allocation} />
        <StrengthsCard strengths={insights.strengths} />
        <RiskAlertsCard alerts={insights.risk_alerts} />
      </div>

      {/* Regenerate button */}
      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={handleGenerate}>
          <Sparkles className="mr-2 h-4 w-4" />
          Regenerate Insights
        </Button>
      </div>
    </div>
  );
}
