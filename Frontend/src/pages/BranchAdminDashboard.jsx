import {
  Building,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  PlusCircle,
  Users,
  FileText,
  Megaphone,
} from "lucide-react";

import { StatCard } from "../components/dashboard/StatCard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const upcomingEvents = [
  { name: "Code Sprint 2026", dept: "Computer Science", date: "Feb 22", participants: 85 },
  { name: "Design Workshop", dept: "Electronics", date: "Feb 28", participants: 42 },
  { name: "Science Exhibition", dept: "All Departments", date: "Mar 05", participants: 200 },
];

export default function BranchAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Branch Admin Dashboard</h1>
        <p className="text-muted-foreground">Engineering Branch Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Departments" value={8} icon={Building} variant="primary" />
        <StatCard
          title="Total Students"
          value="1,240"
          icon={GraduationCap}
          variant="success"
          trend="+45 new"
        />
        <StatCard title="Upcoming Events" value={5} icon={Calendar} variant="info" />
        <StatCard title="Pending Approvals" value={3} icon={ClipboardCheck} variant="warning" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="col-span-2 p-6 border-0 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.dept} • {event.date}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{event.participants} registered</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-0 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="space-y-3">
            {[
              { label: "Create Event", icon: PlusCircle },
              { label: "Create Department", icon: Building },
              { label: "Create HOD", icon: Users },
              { label: "Announcements", icon: Megaphone },
              { label: "Export Data", icon: FileText },
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start gap-3 h-11"
              >
                <action.icon className="h-4 w-4 text-primary" />
                {action.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}