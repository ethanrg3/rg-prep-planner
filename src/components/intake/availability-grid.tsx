"use client";

import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/utils/constants";
import type { DayOfWeek, TimeSlot } from "@/types/database";

interface AvailabilityGridProps {
  value: Partial<Record<DayOfWeek, TimeSlot[]>>;
  onChange: (value: Partial<Record<DayOfWeek, TimeSlot[]>>) => void;
}

export function AvailabilityGrid({ value, onChange }: AvailabilityGridProps) {
  const toggleSlot = (day: DayOfWeek, slot: TimeSlot) => {
    const current = value[day] ?? [];
    const updated = current.includes(slot)
      ? current.filter((s) => s !== slot)
      : [...current, slot];

    onChange({
      ...value,
      [day]: updated,
    });
  };

  const isSelected = (day: DayOfWeek, slot: TimeSlot) => {
    return (value[day] ?? []).includes(slot);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-xs font-medium text-muted-foreground" />
            {DAYS_OF_WEEK.map((day) => (
              <th
                key={day.key}
                className="p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((slot) => (
            <tr key={slot.key}>
              <td className="p-2 text-right">
                <div className="text-sm font-medium">{slot.label}</div>
                <div className="text-xs text-muted-foreground">
                  {slot.description}
                </div>
              </td>
              {DAYS_OF_WEEK.map((day) => (
                <td key={`${day.key}-${slot.key}`} className="p-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSlot(day.key as DayOfWeek, slot.key as TimeSlot)
                    }
                    className={cn(
                      "h-10 w-full rounded-md border-2 transition-all",
                      isSelected(day.key as DayOfWeek, slot.key as TimeSlot)
                        ? "border-orange-500 bg-orange-100 text-orange-700"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
