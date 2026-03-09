"use client";

import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormType = any;
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  SAT_RW_SUBSCORES,
  SAT_MATH_SUBSCORES,
  SAT_SUBSCORE_MAX,
} from "@/lib/utils/constants";
import { ImageUploadArea } from "@/components/scores/image-upload-area";

interface SATScoreFormProps {
  form: FormType;
}

export function SATScoreForm({ form }: SATScoreFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  async function handleExtractFromPdf() {
    if (!selectedFile) return;

    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/extract-score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Extraction failed");
      }

      const result = await res.json();
      const data = result.data;

      form.setValue("satScores.compositeScore", data.composite_score);
      form.setValue("satScores.readingWriting.total", data.reading_writing_total);
      form.setValue("satScores.math.total", data.math_total);
      form.setValue(
        "satScores.readingWriting.information_and_ideas",
        data.rw_subscores.information_and_ideas
      );
      form.setValue(
        "satScores.readingWriting.craft_and_structure",
        data.rw_subscores.craft_and_structure
      );
      form.setValue(
        "satScores.readingWriting.expression_of_ideas",
        data.rw_subscores.expression_of_ideas
      );
      form.setValue(
        "satScores.readingWriting.standard_english_conventions",
        data.rw_subscores.standard_english_conventions
      );
      form.setValue("satScores.math.algebra", data.math_subscores.algebra);
      form.setValue(
        "satScores.math.advanced_math",
        data.math_subscores.advanced_math
      );
      form.setValue(
        "satScores.math.problem_solving",
        data.math_subscores.problem_solving
      );
      form.setValue(
        "satScores.math.geometry_and_trig",
        data.math_subscores.geometry_and_trig
      );

      toast.success("Baseline SAT scores extracted from PDF.");
      setSelectedFile(null);
    } catch (error) {
      console.error("Baseline SAT extraction failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to extract scores from PDF."
      );
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50/40 p-4">
        <p className="text-sm font-medium text-orange-900">
          Auto-fill from SAT score report PDF
        </p>
        <ImageUploadArea onFileSelect={setSelectedFile} isLoading={isExtracting} />
        {selectedFile && (
          <div className="flex justify-end">
            <Button
              type="button"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleExtractFromPdf}
              disabled={isExtracting}
            >
              {isExtracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                "Extract from PDF"
              )}
            </Button>
          </div>
        )}
      </div>

      <FormField
        control={form.control}
        name="satScores.compositeScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Score</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={400}
                max={1600}
                placeholder="1120"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reading & Writing Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
        <h3 className="mb-4 font-semibold text-blue-800">
          Reading & Writing
        </h3>

        <FormField
          control={form.control}
          name="satScores.readingWriting.total"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Section Total (200-800)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={200}
                  max={800}
                  placeholder="620"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {SAT_RW_SUBSCORES.map((sub) => (
            <FormField
              key={sub.key}
              control={form.control}
              name={`satScores.readingWriting.${sub.key}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{sub.label}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={SAT_SUBSCORE_MAX}
                        className="w-20"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">
                      / {SAT_SUBSCORE_MAX}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Math Section */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
        <h3 className="mb-4 font-semibold text-emerald-800">Math</h3>

        <FormField
          control={form.control}
          name="satScores.math.total"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Section Total (200-800)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={200}
                  max={800}
                  placeholder="500"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {SAT_MATH_SUBSCORES.map((sub) => (
            <FormField
              key={sub.key}
              control={form.control}
              name={`satScores.math.${sub.key}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{sub.label}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={SAT_SUBSCORE_MAX}
                        className="w-20"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">
                      / {SAT_SUBSCORE_MAX}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
