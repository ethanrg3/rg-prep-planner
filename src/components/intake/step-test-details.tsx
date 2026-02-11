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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { COMMON_SCHOOLS } from "@/lib/utils/constants";

interface StepTestDetailsProps {
  form: FormType;
}

export function StepTestDetails({ form }: StepTestDetailsProps) {
  const [schoolSearch, setSchoolSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const notYetScheduled = form.watch("testDetails.notYetScheduled");
  const schools = form.watch("testDetails.schoolsOfInterest") ?? [];

  const filteredSchools = schoolSearch
    ? COMMON_SCHOOLS.filter(
        (s) =>
          s.toLowerCase().includes(schoolSearch.toLowerCase()) &&
          !schools.includes(s)
      ).slice(0, 8)
    : [];

  const addSchool = (school: string) => {
    if (schools.length < 5 && !schools.includes(school)) {
      form.setValue("testDetails.schoolsOfInterest", [...schools, school]);
    }
    setSchoolSearch("");
    setShowSuggestions(false);
  };

  const removeSchool = (school: string) => {
    form.setValue(
      "testDetails.schoolsOfInterest",
      schools.filter((s: string) => s !== school)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Test Details</h2>
        <p className="text-sm text-muted-foreground">
          When is the test and what schools are they targeting?
        </p>
      </div>

      <FormField
        control={form.control}
        name="testDetails.testDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Official Test Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                disabled={notYetScheduled}
                {...field}
                value={notYetScheduled ? "" : field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="testDetails.notYetScheduled"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    form.setValue("testDetails.testDate", "");
                  }
                }}
              />
            </FormControl>
            <FormLabel className="font-normal">Not yet scheduled</FormLabel>
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Schools of Interest (up to 5)</FormLabel>
        <div className="relative mt-2">
          <Input
            placeholder="Search schools..."
            value={schoolSearch}
            onChange={(e) => {
              setSchoolSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={schools.length >= 5}
          />
          {showSuggestions && filteredSchools.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
              {filteredSchools.map((school) => (
                <button
                  key={school}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addSchool(school);
                  }}
                >
                  {school}
                </button>
              ))}
            </div>
          )}
        </div>

        {schools.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {schools.map((school: string) => (
              <Badge
                key={school}
                variant="secondary"
                className="gap-1 py-1 pl-3 pr-1"
              >
                {school}
                <button
                  type="button"
                  onClick={() => removeSchool(school)}
                  className="rounded-full p-0.5 hover:bg-slate-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {schools.length >= 5 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Maximum 5 schools reached
          </p>
        )}
      </div>
    </div>
  );
}
