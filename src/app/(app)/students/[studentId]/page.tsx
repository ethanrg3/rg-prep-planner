"use client";

import { useState } from "react";
import Link from "next/link";
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

// TODO: Replace with Supabase fetch by studentId
const mockStudent = {
  id: "1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  gradeLevel: 11,
  testType: "SAT" as const,
  testDate: "2026-03-15",
  schoolsOfInterest: ["Georgia Tech", "Emory University", "UGA"],
  selfStudyHoursPerWeek: 5,
  liveSessionHoursPerWeek: 2,
  sessionsPaid: 16,
  status: "active" as const,
  baselineComposite: 1120,
  baselineRW: 620,
  baselineMath: 500,
  baselineRWSubscores: {
    information_and_ideas: 5,
    craft_and_structure: 4,
    expression_of_ideas: 3,
    standard_english_conventions: 4,
  },
  baselineMathSubscores: {
    algebra: 4,
    advanced_math: 3,
    problem_solving: 3,
    geometry_and_trig: 2,
  },
  predictedLow: 1240,
  predictedHigh: 1310,
  planStatus: "approved" as const,
  sessionsCompleted: 6,
  weeksRemaining: 5,
};

// Mock score reports for progress tracking demo
const initialMockScoreReports: ScoreReport[] = [
  {
    id: "sr_001",
    student_id: "1",
    report_type: "baseline",
    report_label: "Baseline (Practice 3)",
    report_date: "2026-01-10",
    composite_score: 1120,
    section_scores: {
      reading_writing: { total: 620, information_and_ideas: 5, craft_and_structure: 4, expression_of_ideas: 3, standard_english_conventions: 4 },
      math: { total: 500, algebra: 4, advanced_math: 3, problem_solving: 3, geometry_and_trig: 2 },
    },
    prediction_range_low: null,
    prediction_range_high: null,
    section_predictions: null,
    confidence_notes: null,
    source_image_url: null,
    created_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "sr_002",
    student_id: "1",
    report_type: "actual",
    report_label: "Practice 4",
    report_date: "2026-01-28",
    composite_score: 1170,
    section_scores: {
      reading_writing: { total: 640, information_and_ideas: 5, craft_and_structure: 5, expression_of_ideas: 3, standard_english_conventions: 5 },
      math: { total: 530, algebra: 5, advanced_math: 3, problem_solving: 4, geometry_and_trig: 2 },
    },
    prediction_range_low: null,
    prediction_range_high: null,
    section_predictions: null,
    confidence_notes: null,
    source_image_url: null,
    created_at: "2026-01-28T00:00:00Z",
  },
  {
    id: "sr_003",
    student_id: "1",
    report_type: "actual",
    report_label: "Practice 6",
    report_date: "2026-02-16",
    composite_score: 1210,
    section_scores: {
      reading_writing: { total: 660, information_and_ideas: 6, craft_and_structure: 5, expression_of_ideas: 4, standard_english_conventions: 5 },
      math: { total: 550, algebra: 5, advanced_math: 4, problem_solving: 4, geometry_and_trig: 3 },
    },
    prediction_range_low: null,
    prediction_range_high: null,
    section_predictions: null,
    confidence_notes: null,
    source_image_url: null,
    created_at: "2026-02-16T00:00:00Z",
  },
];

// TODO: Replace with Supabase fetch
const mockPlanWeeks: PlanWeekData[] = [
  {
    week_number: 1,
    theme: "Algebra Foundations & Grammar Review",
    goals: [
      "Master linear equations and inequalities",
      "Review comma and semicolon rules",
      "Complete diagnostic timed reading drill",
    ],
    self_study_assignments: [
      {
        title: "Khan Academy: Heart of Algebra",
        resource_type: "khan_academy",
        estimated_minutes: 45,
        focus_area: "math.algebra",
        instructions: "Complete all practice exercises in the Linear Equations unit. Aim for 80%+ mastery.",
      },
      {
        title: "College Board: Grammar Drill #1",
        resource_type: "college_board",
        estimated_minutes: 30,
        focus_area: "rw.conventions",
        instructions: "Focus on punctuation rules. Review any missed questions.",
      },
      {
        title: "Bluebook Practice: Reading Passage Set A",
        resource_type: "bluebook_test",
        estimated_minutes: 25,
        focus_area: "rw.information_and_ideas",
        instructions: "Complete under timed conditions (13 min). Circle any questions you guessed on.",
      },
    ],
    sessions: [
      {
        session_number: 1,
        agenda: [
          { activity: "Review baseline scores & discuss goals", minutes: 10 },
          { activity: "Guided practice: Linear equations", minutes: 25 },
          { activity: "Timed reading drill (1 passage)", minutes: 15 },
          { activity: "Wrap-up & assign homework", minutes: 5 },
        ],
      },
      {
        session_number: 2,
        agenda: [
          { activity: "Homework review & error analysis", minutes: 10 },
          { activity: "Grammar rules: Commas & semicolons", minutes: 20 },
          { activity: "Guided practice: Systems of equations", minutes: 20 },
          { activity: "Wrap-up & preview next week", minutes: 5 },
        ],
      },
    ],
  },
  {
    week_number: 2,
    theme: "Advanced Algebra & Reading Comprehension",
    goals: [
      "Solve quadratic equations confidently",
      "Improve reading passage timing to under 13 minutes",
      "Master subject-verb agreement rules",
    ],
    self_study_assignments: [
      {
        title: "Khan Academy: Passport to Advanced Math",
        resource_type: "khan_academy",
        estimated_minutes: 50,
        focus_area: "math.advanced_math",
        instructions: "Focus on quadratic equations and factoring. Complete at least 20 practice problems.",
      },
      {
        title: "Reading Comprehension: Social Science Passages",
        resource_type: "college_board",
        estimated_minutes: 35,
        focus_area: "rw.craft_and_structure",
        instructions: "Practice identifying main idea and author's purpose. Time yourself.",
      },
    ],
    sessions: [
      {
        session_number: 1,
        agenda: [
          { activity: "Review self-study progress", minutes: 5 },
          { activity: "Quadratic equations deep dive", minutes: 25 },
          { activity: "Timed reading: 2 passages", minutes: 20 },
          { activity: "Error review & strategies", minutes: 5 },
        ],
      },
      {
        session_number: 2,
        agenda: [
          { activity: "Subject-verb agreement lesson", minutes: 15 },
          { activity: "Mixed math practice (linear + quadratic)", minutes: 20 },
          { activity: "Reading strategy review", minutes: 15 },
          { activity: "Week 3 preview", minutes: 5 },
        ],
      },
    ],
  },
  {
    week_number: 3,
    theme: "Geometry & Data Analysis Focus",
    goals: [
      "Review core geometry concepts (triangles, circles)",
      "Interpret data from charts and graphs accurately",
      "Improve expression of ideas score",
    ],
    self_study_assignments: [
      {
        title: "Khan Academy: Geometry & Trigonometry",
        resource_type: "khan_academy",
        estimated_minutes: 45,
        focus_area: "math.geometry_and_trig",
        instructions: "Complete triangle properties and circle equations units.",
      },
      {
        title: "Problem Solving & Data Analysis Practice",
        resource_type: "college_board",
        estimated_minutes: 30,
        focus_area: "math.problem_solving",
        instructions: "Focus on interpreting scatterplots and two-way tables.",
      },
      {
        title: "Expression of Ideas Drills",
        resource_type: "worksheet",
        estimated_minutes: 25,
        focus_area: "rw.expression_of_ideas",
        instructions: "Practice sentence placement and transition questions.",
      },
    ],
    sessions: [
      {
        session_number: 1,
        agenda: [
          { activity: "Geometry fundamentals review", minutes: 25 },
          { activity: "Data interpretation practice", minutes: 20 },
          { activity: "Quick grammar check-in", minutes: 10 },
        ],
      },
      {
        session_number: 2,
        agenda: [
          { activity: "Expression of ideas strategies", minutes: 15 },
          { activity: "Mixed geometry + algebra problems", minutes: 25 },
          { activity: "Midpoint check: progress review", minutes: 15 },
        ],
      },
    ],
  },
];

export default function StudentDetailPage() {
  const s = mockStudent;
  const [scoreReports, setScoreReports] = useState<ScoreReport[]>(initialMockScoreReports);

  function handleReportAdded(report: ScoreReport) {
    setScoreReports((prev) => [...prev, report]);
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
                  <span className="ml-1 font-medium text-orange-600">
                    ({s.weeksRemaining} weeks away)
                  </span>
                </span>
              )}
            </div>
          </div>
          {s.planStatus !== "approved" && (
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
                    <p className="text-xl font-bold">{s.baselineComposite}</p>
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
                      {s.predictedLow}-{s.predictedHigh}
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
                    <Badge
                      variant={
                        s.planStatus === "approved" ? "default" : "outline"
                      }
                      className="mt-0.5"
                    >
                      {s.planStatus === "approved" ? "Approved" : "Draft"}
                    </Badge>
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
          {mockPlanWeeks.length > 0 ? (
            <PlanView
              studentName={`${s.firstName} ${s.lastName}`}
              baselineScore={s.baselineComposite}
              predictedLow={s.predictedLow}
              predictedHigh={s.predictedHigh}
              weeks={mockPlanWeeks}
              initialStatus={s.planStatus === "approved" ? "approved" : "draft"}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  No plan generated yet. Click &quot;Generate Plan&quot; to create one.
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
                    Add more score reports to see progress charts and trend analysis.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Progress Charts (2+ reports) */}
            <CompositeTrendChart reports={scoreReports} />
            <SectionTrendChart reports={scoreReports} />
            <SubscoreTrendGrid reports={scoreReports} />

            {/* Score Report History */}
            <ScoreReportList reports={scoreReports} />

            {/* Score Prediction Panel */}
            <ScorePredictionPanel
              studentId={s.id}
              testType={s.testType}
              baselineComposite={s.baselineComposite}
              baselineSubscores={{
                ...s.baselineRWSubscores,
                ...s.baselineMathSubscores,
              }}
              totalWeeks={8}
              selfStudyHoursPerWeek={s.selfStudyHoursPerWeek}
              liveSessionHoursPerWeek={s.liveSessionHoursPerWeek}
              totalSessions={s.sessionsPaid}
            />
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
                Session list will be displayed here once Phase 4 is built.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
