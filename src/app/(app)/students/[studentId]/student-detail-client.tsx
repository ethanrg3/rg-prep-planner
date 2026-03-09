"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  ArrowLeft,
  GraduationCap,
  Target,
  Clock,
  FileText,
  BarChart3,
} from "lucide-react";
import { PlanView } from "@/components/plan/plan-view";
import type { PlanWeekData } from "@/components/plan/plan-timeline";
import { ScorePredictionPanel } from "@/components/scores/score-prediction-panel";
import { AddScoreReportDialog } from "@/components/scores/add-score-report-dialog";
import { CompositeTrendChart } from "@/components/scores/composite-trend-chart";
import { SectionTrendChart } from "@/components/scores/section-trend-chart";
import { SubscoreTrendGrid } from "@/components/scores/subscore-trend-grid";
import { ScoreReportList } from "@/components/scores/score-report-list";
import { InsightsPanel } from "@/components/insights/insights-panel";
import type { ScoreReport } from "@/types/database";
import type { StudentDetail } from "@/lib/db/students";
import { deleteScoreReportAction } from "@/lib/actions/student-actions";

interface StudentDetailClientProps {
  student: StudentDetail;
  initialScoreReports: ScoreReport[];
  planWeeks: PlanWeekData[];
  planStatus: "draft" | "approved" | "archived" | null;
}

export function StudentDetailClient({
  student: s,
  initialScoreReports,
  planWeeks,
  planStatus,
}: StudentDetailClientProps) {
  const [scoreReports, setScoreReports] =
    useState<ScoreReport[]>(initialScoreReports);
  const router = useRouter();

  function handleReportAdded(report: ScoreReport) {
    setScoreReports((prev) => [...prev, report]);
  }

  async function handleReportDeleted(reportId: string) {
    try {
      await deleteScoreReportAction({
        studentId: s.id,
        reportId,
      });
      setScoreReports((prev) => prev.filter((report) => report.id !== reportId));
      router.refresh();
      toast.success("Score report deleted.");
    } catch (error) {
      console.error("Failed to delete score report:", error);
      toast.error("Failed to delete score report. Please try again.");
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/students"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {s.firstName} {s.lastName}
              </h1>
              <Badge
                variant={s.testType === "SAT" ? "default" : "destructive"}
              >
                {s.testType}
              </Badge>
              <Badge variant="outline">{s.status}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Grade {s.gradeLevel}
              </span>
              {s.testDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Test: {s.testDate}
                  {s.weeksRemaining > 0 && (
                    <span className="ml-1 font-medium text-orange-600">
                      ({s.weeksRemaining} weeks away)
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
          {planStatus !== "approved" && (
            <Button className="bg-orange-500 hover:bg-orange-600">
              Generate Plan
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="scores">Scores</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Baseline</p>
                    <p className="text-xl font-bold">
                      {s.baselineComposite || "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Predicted</p>
                    <p className="text-xl font-bold">
                      {s.predictedLow && s.predictedHigh
                        ? `${s.predictedLow}-${s.predictedHigh}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    <p className="text-xl font-bold">
                      {s.sessionsCompleted}/{s.sessionsPaid}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plan</p>
                    {planStatus ? (
                      <Badge
                        variant={
                          planStatus === "approved" ? "default" : "outline"
                        }
                        className="mt-0.5"
                      >
                        {planStatus === "approved" ? "Approved" : "Draft"}
                      </Badge>
                    ) : (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Not generated
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {s.email && (
                  <p>
                    <span className="font-medium">Email:</span> {s.email}
                  </p>
                )}
                {s.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {s.phone}
                  </p>
                )}
                <p>
                  <span className="font-medium">Study commitment:</span>{" "}
                  {s.selfStudyHoursPerWeek} hrs/wk self-study +{" "}
                  {s.liveSessionHoursPerWeek} hrs/wk live
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Target Schools</CardTitle>
              </CardHeader>
              <CardContent>
                {s.schoolsOfInterest.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {s.schoolsOfInterest.map((school) => (
                      <Badge key={school} variant="secondary">
                        {school}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No schools specified
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan">
          {planWeeks.length > 0 ? (
            <PlanView
              studentName={`${s.firstName} ${s.lastName}`}
              baselineScore={s.baselineComposite}
              predictedLow={s.predictedLow ?? 0}
              predictedHigh={s.predictedHigh ?? 0}
              weeks={planWeeks}
              initialStatus={planStatus === "approved" ? "approved" : "draft"}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  No plan generated yet. Click &quot;Generate Plan&quot; to
                  create one.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Scores Tab */}
        <TabsContent value="scores">
          <div className="space-y-6">
            {/* Header with Add button */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Score Reports</h2>
              <AddScoreReportDialog
                studentId={s.id}
                onReportAdded={handleReportAdded}
              />
            </div>

            {scoreReports.length === 1 && (
              <Card className="border-blue-100 bg-blue-50/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <p className="text-sm text-blue-800">
                    Add more score reports to see progress charts and trend
                    analysis.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Progress Charts (2+ reports) */}
            <CompositeTrendChart reports={scoreReports} />
            <SectionTrendChart reports={scoreReports} />
            <SubscoreTrendGrid reports={scoreReports} />

            {/* Score Report History */}
            <ScoreReportList
              reports={scoreReports}
              onDelete={handleReportDeleted}
            />

            {/* Score Prediction Panel */}
            {s.baselineComposite > 0 && (
              <ScorePredictionPanel
                studentId={s.id}
                testType={s.testType}
                baselineComposite={s.baselineComposite}
                baselineSubscores={{
                  ...(s.baselineRWSubscores || {}),
                  ...(s.baselineMathSubscores || {}),
                }}
                totalWeeks={s.weeksRemaining || 8}
                selfStudyHoursPerWeek={s.selfStudyHoursPerWeek}
                liveSessionHoursPerWeek={s.liveSessionHoursPerWeek}
                totalSessions={s.sessionsPaid}
              />
            )}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <InsightsPanel
            studentId={s.id}
            testType={s.testType}
            scoreReports={scoreReports}
            testDate={s.testDate}
            selfStudyHoursPerWeek={s.selfStudyHoursPerWeek}
            liveSessionHoursPerWeek={s.liveSessionHoursPerWeek}
          />
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                Session scheduling coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
