"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormType = any;
import { SATScoreForm } from "./sat-score-form";
import { ACTScoreForm } from "./act-score-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepBaselineScoresProps {
  form: FormType;
}

export function StepBaselineScores({ form }: StepBaselineScoresProps) {
  const testType = form.watch("basicInfo.testType");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Baseline Scores ({testType})
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter the student&apos;s most recent {testType} score report with
          section and sub-score breakdown
        </p>
      </div>

      <FormField
        control={form.control}
        name="baselineReportSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Baseline Report Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="official">Official</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {testType === "SAT" ? (
        <SATScoreForm form={form} />
      ) : (
        <ACTScoreForm form={form} />
      )}
    </div>
  );
}
