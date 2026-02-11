"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface StudentCardProps {
  id: string;
  firstName: string;
  lastName: string;
  testType: "ACT" | "SAT";
  gradeLevel: number;
  testDate: string | null;
  baselineScore: number | null;
  planStatus: "draft" | "approved" | "archived" | null;
}

const planStatusConfig = {
  draft: { label: "Draft", variant: "outline" as const },
  approved: { label: "Approved", variant: "default" as const },
  archived: { label: "Archived", variant: "secondary" as const },
};

export function StudentCard({
  id,
  firstName,
  lastName,
  testType,
  gradeLevel,
  testDate,
  baselineScore,
  planStatus,
}: StudentCardProps) {
  return (
    <Link href={`/students/${id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between p-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {firstName} {lastName}
              </span>
              <Badge
                variant={testType === "SAT" ? "default" : "destructive"}
                className="text-xs"
              >
                {testType}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>Grade {gradeLevel}</span>
              {testDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {testDate}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-right">
            {baselineScore !== null && (
              <div>
                <p className="text-xs text-muted-foreground">Baseline</p>
                <p className="font-semibold">{baselineScore}</p>
              </div>
            )}
            {planStatus && (
              <Badge
                variant={planStatusConfig[planStatus].variant}
                className="text-xs"
              >
                {planStatusConfig[planStatus].label}
              </Badge>
            )}
            {!planStatus && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                No plan
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
