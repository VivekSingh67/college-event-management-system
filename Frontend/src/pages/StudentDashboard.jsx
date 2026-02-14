import {
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
} from "lucide-react";

import { StatCard } from "../components/dashboard/StatCard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const upcomingEvents = [
  {
    name: "Hackathon 3.0",
    date: "Feb 25, 2026",
    dept: "Computer Science",
    lastDate: "Feb 20",
    poster: "🖥️",
  },
  {
    name: "Cultural Night",
    date: "Mar 01, 2026",
    dept: "All Departments",
    lastDate: "Feb 25",
    poster: "🎭",
  },
  {
    name: "Sports Day",
    date: "Mar 10, 2026",
    dept: "All Departments",
    lastDate: "Mar 05",
    poster: "🏆",
  },
];

const myApplications = [
  { event: "Tech Fest 2026", status: "approved", date: "Feb 10" },
  { event: "Code Sprint", status: "pending", date: "Feb 12" },
  { event: "Design Jam", status: "rejected", date: "Feb 08" },
];

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  approved: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-500/10 text-rose-700 border-rose-200",
};

export default function StudentDashboard() {
  // In real app → get from auth context or prop
  const studentName = "Vivek";

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Student Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {studentName}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Events"
          value={5}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Applied Events"
          value={3}
          icon={FileText}
          variant="info"
        />
        <StatCard
          title="Approved"
          value={1}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Participation History"
          value={8}
          icon={Star}
          variant="accent"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Events */}
        <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold tracking-tight">
                Upcoming Events
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {upcomingEvents.map((event, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-5">
                    <div className="text-4xl mb-4">{event.poster}</div>

                    <h4 className="font-semibold text-lg leading-tight">
                      {event.name}
                    </h4>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.dept}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-accent-foreground font-medium">
                        <Clock className="h-4 w-4" />
                        <span>Last date: {event.lastDate}</span>
                      </div>
                    </div>

                    <Button
                      className="mt-5 w-full font-medium"
                      size="sm"
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* My Applications */}
        <Card className="border-none shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold tracking-tight mb-5">
              My Applications
            </h3>

            <div className="space-y-3">
              {myApplications.map((app, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4 transition-colors hover:bg-muted/60"
                >
                  <div className="font-medium">{app.event}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{app.date}</span>
                    <Badge
                      variant="outline"
                      className={statusStyles[app.status]}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6 gap-2">
              <MessageSquare className="h-4 w-4" />
              Submit Feedback
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}