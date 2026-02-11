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
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { AvailabilityGrid } from "./availability-grid";

interface StepScheduleProps {
  form: FormType;
}

function HourStepper({
  value,
  onChange,
  min = 0,
  max = 40,
  step = 0.5,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[3rem] text-center text-lg font-semibold">
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">hrs/week</span>
      </div>
    </div>
  );
}

export function StepSchedule({ form }: StepScheduleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Schedule & Commitment</h2>
        <p className="text-sm text-muted-foreground">
          How much time will the student dedicate to prep?
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="schedule.selfStudyHoursPerWeek"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <HourStepper
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  min={0}
                  max={40}
                  label="Self-study hours/week"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule.liveSessionHoursPerWeek"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <HourStepper
                  value={field.value ?? 1}
                  onChange={field.onChange}
                  min={0.5}
                  max={20}
                  label="Live session hours/week"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="schedule.sessionsPaid"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Sessions Paid For</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={100}
                placeholder="16"
                className="w-32"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="mb-3 block">
          Weekly Availability
        </FormLabel>
        <p className="mb-3 text-sm text-muted-foreground">
          Click slots when the student is available for live tutoring sessions
        </p>
        <FormField
          control={form.control}
          name="schedule.weeklyAvailability"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvailabilityGrid
                  value={field.value ?? {}}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
