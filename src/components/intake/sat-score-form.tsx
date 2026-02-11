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
  SAT_RW_SUBSCORES,
  SAT_MATH_SUBSCORES,
  SAT_SUBSCORE_MAX,
} from "@/lib/utils/constants";

interface SATScoreFormProps {
  form: FormType;
}

export function SATScoreForm({ form }: SATScoreFormProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="satScores.compositeScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Score</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={400}
                max={1600}
                placeholder="1120"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reading & Writing Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
        <h3 className="mb-4 font-semibold text-blue-800">
          Reading & Writing
        </h3>

        <FormField
          control={form.control}
          name="satScores.readingWriting.total"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Section Total (200-800)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={200}
                  max={800}
                  placeholder="620"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {SAT_RW_SUBSCORES.map((sub) => (
            <FormField
              key={sub.key}
              control={form.control}
              name={`satScores.readingWriting.${sub.key}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{sub.label}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={SAT_SUBSCORE_MAX}
                        className="w-20"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">
                      / {SAT_SUBSCORE_MAX}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Math Section */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
        <h3 className="mb-4 font-semibold text-emerald-800">Math</h3>

        <FormField
          control={form.control}
          name="satScores.math.total"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Section Total (200-800)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={200}
                  max={800}
                  placeholder="500"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {SAT_MATH_SUBSCORES.map((sub) => (
            <FormField
              key={sub.key}
              control={form.control}
              name={`satScores.math.${sub.key}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{sub.label}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={SAT_SUBSCORE_MAX}
                        className="w-20"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">
                      / {SAT_SUBSCORE_MAX}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
