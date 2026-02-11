"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, RefreshCw, Loader2 } from "lucide-react";

interface PlanApprovalBarProps {
  status: "draft" | "approved" | "archived";
  onApprove: () => void;
  onRegenerate: (notes: string) => void;
  isLoading?: boolean;
}

export function PlanApprovalBar({
  status,
  onApprove,
  onRegenerate,
  isLoading = false,
}: PlanApprovalBarProps) {
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  if (status === "approved") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
        <Check className="h-5 w-5 text-green-600" />
        <span className="font-medium text-green-800">Plan Approved</span>
      </div>
    );
  }

  if (status === "archived") {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <Badge variant="secondary">Archived</Badge>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-orange-300 text-orange-700">
            Draft
          </Badge>
          <span className="text-sm text-orange-800">
            Review the plan and approve or request changes
          </span>
        </div>
      </div>

      {showNotes && (
        <Textarea
          placeholder="Add notes for regeneration (e.g., 'Focus more on geometry', 'Include more reading drills')..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-white"
          rows={3}
        />
      )}

      <div className="flex items-center gap-2">
        <Button
          onClick={onApprove}
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Approve Plan
        </Button>
        {showNotes ? (
          <Button
            variant="outline"
            onClick={() => {
              onRegenerate(notes);
              setNotes("");
              setShowNotes(false);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerate
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowNotes(true)}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Request Changes
          </Button>
        )}
      </div>
    </div>
  );
}
