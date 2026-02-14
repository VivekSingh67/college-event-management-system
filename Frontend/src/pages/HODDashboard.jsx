import { 
  GraduationCap, 
  Calendar, 
  ClipboardCheck, 
  CheckCircle2, 
  PlusCircle, 
  FileText, 
  BarChart3 
} from "lucide-react";

import { StatCard } from "../components/dashboard/StatCard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const applications = [
  { student: "Rahul Verma", event: "Hackathon 3.0", date: "Feb 15", status: "pending" },
  { student: "Priya Mehta", event: "Tech Talk", date: "Feb 14", status: "pending" },
  { student: "Amit Kumar", event: "Code Sprint", date: "Feb 13", status: "approved" },
  { student: "Sneha Gupta", event: "Design Jam", date: "Feb 12", status: "rejected" },
];

const statusColors = {
  pending: "bg-warning/10 text-warning border-0",
  approved: "bg-success/10 text-success border-0",
  rejected: "bg-destructive/10 text-destructive border-0",
};

export default function HODDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">HOD Dashboard</h1>
        <p className="text-muted-foreground">Computer Science Department</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={320} icon={GraduationCap} variant="primary" />
        <StatCard title="Total Events" value={12} icon={Calendar} variant="info" />
        <StatCard title="Pending Applications" value={6} icon={ClipboardCheck} variant="warning" />
        <StatCard title="Approved" value={45} icon={CheckCircle2} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Applications */}
        <Card className="col-span-2 p-6 border-0 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Student Applications</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {applications.map((app, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {app.student.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{app.student}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.event} • {app.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={statusColors[app.status]}>{app.status}</Badge>

                  {app.status === "pending" && (
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        className="h-7 text-xs gradient-primary border-0"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-0 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "Add Student", icon: PlusCircle },
              { label: "Create Event", icon: Calendar },
              { label: "View Reports", icon: BarChart3 },
              { label: "Export Data", icon: FileText },
            ].map((action, i) => (
              <Button
                key={i}
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