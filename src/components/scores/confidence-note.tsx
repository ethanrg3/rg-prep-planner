"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface ConfidenceNoteProps {
  notes: string;
}

export function ConfidenceNote({ notes }: ConfidenceNoteProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="flex gap-3 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p className="mb-1 text-sm font-medium text-blue-900">
            Confidence Note
          </p>
          <p className="text-sm leading-relaxed text-blue-800">{notes}</p>
        </div>
      </CardContent>
    </Card>
  );
}
