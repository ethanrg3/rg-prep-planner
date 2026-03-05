"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExtractedScoreReport } from "@/lib/ai/extract-score-report";

interface ScoreVerificationFormProps {
  initialData: ExtractedScoreReport;
  onConfirm: (data: ExtractedScoreReport) => void;
  onCancel: () => void;
}

export function ScoreVerificationForm({
  initialData,
  onConfirm,
  onCancel,
}: ScoreVerificationFormProps) {
  const [data, setData] = useState<ExtractedScoreReport>({ ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField(path: string, value: string) {
    const num = parseInt(value, 10);
    setData((prev) => {
      const next = { ...prev };
      if (path === "report_label") {
        next.report_label = value;
        return next;
      }
      if (path === "report_date") {
        next.report_date = value;
        return next;
      }
      if (isNaN(num)) return next;
      if (path === "composite_score") next.composite_score = num;
      else if (path === "reading_writing_total") next.reading_writing_total = num;
      else if (path === "math_total") next.math_total = num;
      else if (path.startsWith("rw.")) {
        const key = path.replace("rw.", "") as keyof typeof next.rw_subscores;
        next.rw_subscores = { ...next.rw_subscores, [key]: num };
      } else if (path.startsWith("math.")) {
        const key = path.replace("math.", "") as keyof typeof next.math_subscores;
        next.math_subscores = { ...next.math_subscores, [key]: num };
      }
      return next;
    });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (data.composite_score < 400 || data.composite_score > 1600)
      e.composite_score = "400-1600";
    if (data.reading_writing_total < 200 || data.reading_writing_total > 800)
      e.reading_writing_total = "200-800";
    if (data.math_total < 200 || data.math_total > 800)
      e.math_total = "200-800";

    for (const [k, v] of Object.entries(data.rw_subscores)) {
      if (v < 1 || v > 7) e[`rw.${k}`] = "1-7";
    }
    for (const [k, v] of Object.entries(data.math_subscores)) {
      if (v < 1 || v > 7) e[`math.${k}`] = "1-7";
    }

    if (!data.report_label.trim()) e.report_label = "Required";
    if (!data.report_date) e.report_date = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) onConfirm(data);
  }

  const rwLabels: Record<string, string> = {
    information_and_ideas: "Information & Ideas",
    craft_and_structure: "Craft & Structure",
    expression_of_ideas: "Expression of Ideas",
    standard_english_conventions: "Standard English Conventions",
  };

  const mathLabels: Record<string, string> = {
    algebra: "Algebra",
    advanced_math: "Advanced Math",
    problem_solving: "Problem Solving & Data Analysis",
    geometry_and_trig: "Geometry & Trigonometry",
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Report Label</Label>
          <Input
            value={data.report_label}
            onChange={(e) => updateField("report_label", e.target.value)}
            placeholder="e.g., Practice 6"
            className={errors.report_label ? "border-red-300" : ""}
          />
        </div>
        <div>
          <Label className="text-xs">Report Date</Label>
          <Input
            type="date"
            value={data.report_date}
            onChange={(e) => updateField("report_date", e.target.value)}
            className={errors.report_date ? "border-red-300" : ""}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Total Score</Label>
        <Input
          type="number"
          value={data.composite_score}
          onChange={(e) => updateField("composite_score", e.target.value)}
          min={400}
          max={1600}
          className={`text-lg font-bold ${errors.composite_score ? "border-red-300" : ""}`}
        />
        {errors.composite_score && (
          <p className="mt-0.5 text-xs text-red-500">Range: {errors.composite_score}</p>
        )}
      </div>

      {/* R&W Section */}
      <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
        <h4 className="mb-2 text-sm font-semibold text-blue-700">
          Reading & Writing
        </h4>
        <div className="mb-3">
          <Label className="text-xs text-blue-600">Section Total</Label>
          <Input
            type="number"
            value={data.reading_writing_total}
            onChange={(e) => updateField("reading_writing_total", e.target.value)}
            min={200}
            max={800}
            className={`font-medium ${errors.reading_writing_total ? "border-red-300" : ""}`}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data.rw_subscores).map(([key, value]) => (
            <div key={key}>
              <Label className="text-xs text-blue-600">{rwLabels[key]}</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => updateField(`rw.${key}`, e.target.value)}
                  min={1}
                  max={7}
                  className={`h-8 text-sm ${errors[`rw.${key}`] ? "border-red-300" : ""}`}
                />
                <span className="text-xs text-muted-foreground">/7</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Math Section */}
      <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
        <h4 className="mb-2 text-sm font-semibold text-emerald-700">Math</h4>
        <div className="mb-3">
          <Label className="text-xs text-emerald-600">Section Total</Label>
          <Input
            type="number"
            value={data.math_total}
            onChange={(e) => updateField("math_total", e.target.value)}
            min={200}
            max={800}
            className={`font-medium ${errors.math_total ? "border-red-300" : ""}`}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data.math_subscores).map(([key, value]) => (
            <div key={key}>
              <Label className="text-xs text-emerald-600">
                {mathLabels[key]}
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => updateField(`math.${key}`, e.target.value)}
                  min={1}
                  max={7}
                  className={`h-8 text-sm ${errors[`math.${key}`] ? "border-red-300" : ""}`}
                />
                <span className="text-xs text-muted-foreground">/7</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={handleSubmit}
        >
          Save Report
        </Button>
      </div>
    </div>
  );
}
