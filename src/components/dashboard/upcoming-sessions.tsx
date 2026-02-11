import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface UpcomingSession {
  id: string;
  studentName: string;
  weekNumber: number;
  theme: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
}

interface UpcomingSessionsProps {
  sessions: UpcomingSession[];
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No upcoming sessions scheduled
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{session.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    Week {session.weekNumber}: {session.theme}
                  </p>
                </div>
                <div className="text-right">
                  {session.scheduledDate ? (
                    <Badge variant="secondary" className="text-xs">
                      {session.scheduledDate}
                      {session.scheduledTime && ` ${session.scheduledTime}`}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Unscheduled
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
