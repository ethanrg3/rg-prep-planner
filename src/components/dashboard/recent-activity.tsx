import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, UserPlus, FileCheck, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityType = "student_created" | "plan_generated" | "plan_approved";

interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const activityIcons: Record<ActivityType, React.ElementType> = {
  student_created: UserPlus,
  plan_generated: ClipboardCheck,
  plan_approved: FileCheck,
};

const activityColors: Record<ActivityType, string> = {
  student_created: "text-blue-500",
  plan_generated: "text-orange-500",
  plan_approved: "text-green-500",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No recent activity
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      activityColors[activity.type]
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
