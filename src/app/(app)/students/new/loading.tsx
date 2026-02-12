import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function IntakeWizardLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="mb-6 h-8 w-32" />

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            {i < 4 && <Skeleton className="h-0.5 w-12" />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <Card>
        <CardContent className="space-y-6 p-6">
          <Skeleton className="h-6 w-48" />

          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
