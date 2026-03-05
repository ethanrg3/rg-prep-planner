"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadArea } from "./image-upload-area";
import { ScoreVerificationForm } from "./score-verification-form";
import type { ExtractedScoreReport } from "@/lib/ai/extract-score-report";
import type { ScoreReport } from "@/types/database";

type DialogState = "upload" | "extracting" | "verify";

interface AddScoreReportDialogProps {
  studentId: string;
  onReportAdded: (report: ScoreReport) => void;
}

export function AddScoreReportDialog({
  studentId,
  onReportAdded,
}: AddScoreReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<DialogState>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedScoreReport | null>(null);

  function resetDialog() {
    setState("upload");
    setSelectedFile(null);
    setExtractedData(null);
  }

  async function handleExtract() {
    if (!selectedFile) return;

    setState("extracting");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/extract-score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Extraction failed");
      }

      const result = await res.json();
      setExtractedData(result.data);
      setState("verify");
      toast.success("Scores extracted! Please verify the results.");
    } catch (error) {
      console.error("Extraction failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to extract scores. Please try again."
      );
      setState("upload");
    }
  }

  function handleConfirm(data: ExtractedScoreReport) {
    // Convert to ScoreReport format
    const report: ScoreReport = {
      id: `sr_${Date.now()}`,
      student_id: studentId,
      report_type: "actual",
      report_label: data.report_label,
      report_date: data.report_date,
      composite_score: data.composite_score,
      section_scores: {
        reading_writing: {
          total: data.reading_writing_total,
          information_and_ideas: data.rw_subscores.information_and_ideas,
          craft_and_structure: data.rw_subscores.craft_and_structure,
          expression_of_ideas: data.rw_subscores.expression_of_ideas,
          standard_english_conventions: data.rw_subscores.standard_english_conventions,
        },
        math: {
          total: data.math_total,
          algebra: data.math_subscores.algebra,
          advanced_math: data.math_subscores.advanced_math,
          problem_solving: data.math_subscores.problem_solving,
          geometry_and_trig: data.math_subscores.geometry_and_trig,
        },
      },
      prediction_range_low: null,
      prediction_range_high: null,
      section_predictions: null,
      confidence_notes: null,
      source_image_url: null,
      created_at: new Date().toISOString(),
    };

    onReportAdded(report);
    toast.success(`Score report "${data.report_label}" saved!`);
    setOpen(false);
    resetDialog();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-1 h-4 w-4" />
          Add Score Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {state === "upload" && "Upload Score Report"}
            {state === "extracting" && "Analyzing Report..."}
            {state === "verify" && "Verify Extracted Scores"}
          </DialogTitle>
        </DialogHeader>

        {state === "upload" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a screenshot of the College Board SAT score report. AI will
              extract the scores automatically.
            </p>
            <ImageUploadArea onFileSelect={setSelectedFile} />
            {selectedFile && (
              <div className="flex justify-end">
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleExtract}
                >
                  Upload & Extract Scores
                </Button>
              </div>
            )}
          </div>
        )}

        {state === "extracting" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-orange-500" />
            <p className="text-sm font-medium">Analyzing score report...</p>
            <p className="text-xs text-muted-foreground">
              This usually takes a few seconds
            </p>
          </div>
        )}

        {state === "verify" && extractedData && (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              Review and correct any scores that were extracted incorrectly.
            </p>
            <ScoreVerificationForm
              initialData={extractedData}
              onConfirm={handleConfirm}
              onCancel={() => {
                setState("upload");
                setExtractedData(null);
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
