import {
  Building2,
  Building,
  GraduationCap,
  ClipboardCheck,
  Calendar,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

import { StatCard } from "../../components/dashboard/StatCard";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const recentEventRequests = [
  { name: "Tech Fest 2026", branch: "Engineering", status: "pending", date: "Feb 20, 2026" },
  { name: "Cultural Night", branch: "Arts", status: "approved", date: "Feb 18, 2026" },
  { name: "Hackathon 3.0", branch: "Engineering", status: "pending", date: "Feb 25, 2026" },
  { name: "Annual Sports Day", branch: "All Branches", status: "approved", date: "Mar 01, 2026" },
];

const statusVariants = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-200/80",
  approved: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80",
  rejected: "bg-rose-100 text-rose-800 hover:bg-rose-200/80",
};

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of what's happening.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Branches"
          value={6}
          icon={Building2}
          variant="primary"
          trend="+2 this month"
        />
        <StatCard
          title="Total Departments"
          value={24}
          icon={Building}
          variant="info"
        />
        <StatCard
          title="Total Students"
          value="3,420"
          icon={GraduationCap}
          variant="success"
          trend="+120 new"
        />
        <StatCard
          title="Pending Approvals"
          value={8}
          icon={ClipboardCheck}
          variant="warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Event Requests */}
        <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
          <div className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">
                Recent Event Requests
              </h3>
              <Button variant="ghost" size="sm">
                View All Requests
              </Button>
            </div>

            <div className="space-y-2.5">
              {recentEventRequests.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-lg border bg-card/60 p-4 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium leading-tight">{event.name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {event.branch} • {event.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={statusVariants[event.status]}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>

                    {event.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs font-medium"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <div className="p-6">
            <h3 className="mb-5 text-lg font-semibold tracking-tight">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { label: "Add New Branch", icon: Building2 },
                { label: "Create Department", icon: Building },
                { label: "Create Branch Admin", icon: Users },
                { label: "Export Reports", icon: FileText },
                { label: "View Analytics", icon: TrendingUp },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-10 justify-start gap-3 text-left font-medium"
                >
                  <action.icon className="h-4 w-4 text-primary" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}