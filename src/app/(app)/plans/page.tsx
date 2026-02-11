"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Check,
  Clock,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

// TODO: Replace with Supabase query
const mockPlans = [
  {
    id: "plan_1",
    studentId: "1",
    studentName: "Sarah Johnson",
    testType: "SAT" as const,
    gradeLevel: 11,
    baselineScore: 1120,
    predictedRange: "1240–1310",
    totalWeeks: 8,
    status: "approved" as const,
    createdAt: "2026-01-28",
    approvedAt: "2026-01-30",
  },
  {
    id: "plan_2",
    studentId: "2",
    studentName: "Mike Chen",
    testType: "ACT" as const,
    gradeLevel: 10,
    baselineScore: 24,
    predictedRange: "28–30",
    totalWeeks: 10,
    status: "draft" as const,
    createdAt: "2026-02-08",
    approvedAt: null,
  },
  {
    id: "plan_3",
    studentId: "3",
    studentName: "Emily Rodriguez",
    testType: "SAT" as const,
    gradeLevel: 11,
    baselineScore: 980,
    predictedRange: "1100–1180",
    totalWeeks: 12,
    status: "draft" as const,
    createdAt: "2026-02-10",
    approvedAt: null,
  },
];

type FilterStatus = "all" | "draft" | "approved";

export default function PlansPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered =
    filter === "all"
      ? mockPlans
      : mockPlans.filter((p) => p.status === filter);

  const draftCount = mockPlans.filter((p) => p.status === "draft").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
          <p className="text-sm text-muted-foreground">
            Review and approve generated prep plans
          </p>
        </div>
        {draftCount > 0 && (
          <Badge className="bg-orange-500 text-white">
            {draftCount} pending review
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        {(["all", "draft", "approved"] as FilterStatus[]).map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
            className={filter === s ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {s === "all" ? "All" : s === "draft" ? "Pending Review" : "Approved"}
            {s === "draft" && draftCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1.5 h-5 min-w-[1.25rem] px-1"
              >
                {draftCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Plan List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">No plans to display</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((plan) => (
            <Link
              key={plan.id}
              href={`/students/${plan.studentId}`}
            >
              <Card className="transition-colors hover:bg-slate-50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        plan.status === "draft"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {plan.status === "draft" ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{plan.studentName}</p>
                        <Badge
                          variant={
                            plan.testType === "SAT" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {plan.testType}
                        </Badge>
                        <Badge
                          variant={
                            plan.status === "draft" ? "outline" : "default"
                          }
                          className={
                            plan.status === "draft"
                              ? "border-orange-300 text-orange-700"
                              : "bg-green-600"
                          }
                        >
                          {plan.status === "draft" ? "Pending Review" : "Approved"}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Grade {plan.gradeLevel}
                        </span>
                        <span>
                          {plan.baselineScore} → {plan.predictedRange}
                        </span>
                        <span>{plan.totalWeeks} weeks</span>
                        <span>Created {plan.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
