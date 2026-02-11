"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormType = any;
import { SATScoreForm } from "./sat-score-form";
import { ACTScoreForm } from "./act-score-form";

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

      {testType === "SAT" ? (
        <SATScoreForm form={form} />
      ) : (
        <ACTScoreForm form={form} />
      )}
    </div>
  );
}
