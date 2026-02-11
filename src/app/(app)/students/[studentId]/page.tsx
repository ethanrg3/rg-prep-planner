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
} from "lucide-react";

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
  predictedLow: 1240,
  predictedHigh: 1310,
  planStatus: "approved" as const,
  sessionsCompleted: 6,
  weeksRemaining: 5,
};

export default function StudentDetailPage() {
  const s = mockStudent;

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
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

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
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                Plan timeline will be displayed here once Phase 4 is built.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scores Tab */}
        <TabsContent value="scores">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Baseline Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold">{s.baselineComposite}</p>
                  <p className="text-sm text-muted-foreground">Composite</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-lg font-semibold text-blue-700">
                      {s.baselineRW}
                    </p>
                    <p className="text-xs text-blue-600">Reading & Writing</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3 text-center">
                    <p className="text-lg font-semibold text-emerald-700">
                      {s.baselineMath}
                    </p>
                    <p className="text-xs text-emerald-600">Math</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Predicted Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {s.predictedLow} — {s.predictedHigh}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Predicted Range
                  </p>
                </div>
                <div className="pt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Score prediction charts will be displayed here once Phase
                    5 is built.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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
