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
  ACT_ENGLISH_SUBSCORES,
  ACT_MATH_SUBSCORES,
  ACT_READING_SUBSCORES,
  ACT_SCIENCE_SUBSCORES,
  ACT_SUBSCORE_MAX,
} from "@/lib/utils/constants";

interface ACTScoreFormProps {
  form: FormType;
}

interface SectionConfig {
  key: string;
  label: string;
  color: { border: string; bg: string; text: string };
  subscores: readonly { key: string; label: string }[];
  formPath: string;
}

const sections: SectionConfig[] = [
  {
    key: "english",
    label: "English",
    color: {
      border: "border-blue-200",
      bg: "bg-blue-50/30",
      text: "text-blue-800",
    },
    subscores: ACT_ENGLISH_SUBSCORES,
    formPath: "actScores.english",
  },
  {
    key: "math",
    label: "Math",
    color: {
      border: "border-emerald-200",
      bg: "bg-emerald-50/30",
      text: "text-emerald-800",
    },
    subscores: ACT_MATH_SUBSCORES,
    formPath: "actScores.math",
  },
  {
    key: "reading",
    label: "Reading",
    color: {
      border: "border-purple-200",
      bg: "bg-purple-50/30",
      text: "text-purple-800",
    },
    subscores: ACT_READING_SUBSCORES,
    formPath: "actScores.reading",
  },
  {
    key: "science",
    label: "Science",
    color: {
      border: "border-amber-200",
      bg: "bg-amber-50/30",
      text: "text-amber-800",
    },
    subscores: ACT_SCIENCE_SUBSCORES,
    formPath: "actScores.science",
  },
];

export function ACTScoreForm({ form }: ACTScoreFormProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="actScores.compositeScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Composite Score (1-36)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={36}
                placeholder="24"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {sections.map((section) => (
        <div
          key={section.key}
          className={`rounded-lg border ${section.color.border} ${section.color.bg} p-4`}
        >
          <h3 className={`mb-4 font-semibold ${section.color.text}`}>
            {section.label}
          </h3>

          <FormField
            control={form.control}
            name={`${section.formPath}.total` as never}
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Section Total (1-36)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={36}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {section.subscores.map((sub) => (
              <FormField
                key={sub.key}
                control={form.control}
                name={
                  `${section.formPath}.${sub.key}` as never
                }
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">{sub.label}</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={ACT_SUBSCORE_MAX}
                          className="w-20"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">
                        / {ACT_SUBSCORE_MAX}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
