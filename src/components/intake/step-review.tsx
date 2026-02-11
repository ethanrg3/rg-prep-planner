"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormType = any;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { GRADE_LEVELS, DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/utils/constants";
interface StepReviewProps {
  form: FormType;
}

export function StepReview({ form }: StepReviewProps) {
  const data = form.getValues();
  const { basicInfo, testDetails, schedule } = data;

  const gradeLabel =
    GRADE_LEVELS.find((g) => g.value === Number(basicInfo.gradeLevel))
      ?.label ?? `Grade ${basicInfo.gradeLevel}`;

  const scores =
    basicInfo.testType === "SAT" ? data.satScores : data.actScores;

  const selectedSlots = Object.entries(schedule.weeklyAvailability ?? {} as Record<string, string[]>)
    .filter(([, slots]) => slots && (slots as string[]).length > 0)
    .map(([day, slots]: [string, unknown]) => {
      const dayLabel = DAYS_OF_WEEK.find((d) => d.key === day)?.label ?? day;
      const slotLabels = ((slots as string[]) ?? [])
        .map((s: string) => TIME_SLOTS.find((t) => t.key === s)?.label ?? s)
        .join(", ");
      return `${dayLabel}: ${slotLabels}`;
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review & Submit</h2>
        <p className="text-sm text-muted-foreground">
          Verify all information before creating the student
        </p>
      </div>

      {/* Student Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Student</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="font-medium">
            {basicInfo.firstName} {basicInfo.lastName}
          </p>
          <p className="text-muted-foreground">{gradeLabel}</p>
          <div className="flex items-center gap-2">
            <Badge
              variant={basicInfo.testType === "SAT" ? "default" : "destructive"}
            >
              {basicInfo.testType}
            </Badge>
            {testDetails.testDate && !testDetails.notYetScheduled && (
              <span className="text-muted-foreground">
                Test: {testDetails.testDate}
              </span>
            )}
            {testDetails.notYetScheduled && (
              <span className="text-muted-foreground">Not yet scheduled</span>
            )}
          </div>
          {basicInfo.email && (
            <p className="text-muted-foreground">{basicInfo.email}</p>
          )}
          {testDetails.schoolsOfInterest &&
            testDetails.schoolsOfInterest.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {(testDetails.schoolsOfInterest as string[]).map((school: string) => (
                  <Badge key={school} variant="outline" className="text-xs">
                    {school}
                  </Badge>
                ))}
              </div>
            )}
        </CardContent>
      </Card>

      {/* Baseline Scores */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Baseline Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {scores ? (
            <div className="text-sm">
              <p className="mb-2 text-lg font-bold">
                Composite: {scores.compositeScore}
              </p>
              {basicInfo.testType === "SAT" && data.satScores && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="font-medium">R&W:</span>{" "}
                    {data.satScores.readingWriting.total}
                  </div>
                  <div>
                    <span className="font-medium">Math:</span>{" "}
                    {data.satScores.math.total}
                  </div>
                </div>
              )}
              {basicInfo.testType === "ACT" && data.actScores && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="font-medium">English:</span>{" "}
                    {data.actScores.english.total}
                  </div>
                  <div>
                    <span className="font-medium">Math:</span>{" "}
                    {data.actScores.math.total}
                  </div>
                  <div>
                    <span className="font-medium">Reading:</span>{" "}
                    {data.actScores.reading.total}
                  </div>
                  <div>
                    <span className="font-medium">Science:</span>{" "}
                    {data.actScores.science.total}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No scores entered
            </p>
          )}
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="font-medium">
              {schedule.selfStudyHoursPerWeek}
            </span>{" "}
            hrs/wk self-study,{" "}
            <span className="font-medium">
              {schedule.liveSessionHoursPerWeek}
            </span>{" "}
            hrs/wk live sessions
          </p>
          <p>
            <span className="font-medium">{schedule.sessionsPaid}</span>{" "}
            sessions paid
          </p>
          {selectedSlots.length > 0 && (
            <div className="pt-1">
              <p className="font-medium">Availability:</p>
              {selectedSlots.map((slot) => (
                <p key={slot} className="text-muted-foreground">
                  {slot}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate plan checkbox */}
      <FormField
        control={form.control}
        name="generatePlan"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-medium text-orange-800">
              Generate Prep Plan automatically after creation
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
}
