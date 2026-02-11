import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-slate-200 ${className ?? ""}`} />
  );
}

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <SkeletonBlock className="mb-2 h-8 w-48" />
        <SkeletonBlock className="h-5 w-64" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-6">
              <SkeletonBlock className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-7 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two columns skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <SkeletonBlock className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="rounded-lg border p-3">
                  <SkeletonBlock className="mb-2 h-4 w-32" />
                  <SkeletonBlock className="h-3 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
