import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accent?: "orange" | "blue" | "green" | "slate";
}

const accentColors = {
  orange: "bg-orange-50 text-orange-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  slate: "bg-slate-100 text-slate-600",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "slate",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            accentColors[accent]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
