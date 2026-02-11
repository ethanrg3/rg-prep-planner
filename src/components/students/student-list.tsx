"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { StudentCard } from "./student-card";

interface StudentListItem {
  id: string;
  firstName: string;
  lastName: string;
  testType: "ACT" | "SAT";
  gradeLevel: number;
  testDate: string | null;
  baselineScore: number | null;
  planStatus: "draft" | "approved" | "archived" | null;
  status: "active" | "inactive" | "completed";
}

interface StudentListProps {
  students: StudentListItem[];
}

export function StudentList({ students }: StudentListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [testFilter, setTestFilter] = useState<string>("all");

  const filtered = students.filter((s) => {
    const matchesSearch =
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;
    const matchesTest = testFilter === "all" || s.testType === testFilter;
    return matchesSearch && matchesStatus && matchesTest;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={testFilter} onValueChange={setTestFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            <SelectItem value="SAT">SAT</SelectItem>
            <SelectItem value="ACT">ACT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {students.length === 0
              ? "No students yet. Add your first student to get started."
              : "No students match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((student) => (
            <StudentCard
              key={student.id}
              id={student.id}
              firstName={student.firstName}
              lastName={student.lastName}
              testType={student.testType}
              gradeLevel={student.gradeLevel}
              testDate={student.testDate}
              baselineScore={student.baselineScore}
              planStatus={student.planStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
