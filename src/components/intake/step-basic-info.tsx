"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GRADE_LEVELS } from "@/lib/utils/constants";

interface StepBasicInfoProps {
  form: FormType;
}

export function StepBasicInfo({ form }: StepBasicInfoProps) {
  const selectedTest = form.watch("basicInfo.testType");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Enter the student&apos;s basic details
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="basicInfo.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Sarah" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basicInfo.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="basicInfo.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="student@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basicInfo.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="basicInfo.gradeLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade Level</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {GRADE_LEVELS.map((grade) => (
                  <SelectItem
                    key={grade.value}
                    value={grade.value.toString()}
                  >
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="basicInfo.testType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Type</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => field.onChange("SAT")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all",
                  selectedTest === "SAT"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <span className="text-2xl font-bold">SAT</span>
                <span className="text-xs text-muted-foreground">
                  College Board
                </span>
              </button>
              <button
                type="button"
                onClick={() => field.onChange("ACT")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all",
                  selectedTest === "ACT"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <span className="text-2xl font-bold">ACT</span>
                <span className="text-xs text-muted-foreground">
                  ACT, Inc.
                </span>
              </button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
