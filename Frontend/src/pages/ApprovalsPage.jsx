import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import {
  ClipboardCheck,
  Search,
  Calendar,
  Building2,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

const mockApprovals = [
  {
    id: 1,
    title: "Tech Fest 2026",
    type: "event",
    requester: "Prof. Anita Sharma",
    branch: "Engineering",
    department: "All",
    date: "Feb 20, 2026",
    status: "pending",
    description: "Annual technical festival with hackathon and workshops.",
  },
  {
    id: 2,
    title: "Cultural Night",
    type: "event",
    requester: "Dr. Vikram Singh",
    branch: "Arts",
    department: "Fine Arts",
    date: "Feb 28, 2026",
    status: "pending",
    description: "Cultural performances and talent showcase.",
  },
  {
    id: 3,
    title: "Hackathon 3.0",
    type: "event",
    requester: "Prof. Anita Sharma",
    branch: "Engineering",
    department: "CS",
    date: "Mar 5, 2026",
    status: "approved",
    description: "48-hour coding competition.",
  },
  {
    id: 4,
    title: "Sports Day",
    type: "event",
    requester: "Branch Admin",
    branch: "All",
    department: "All",
    date: "Mar 10, 2026",
    status: "rejected",
    description: "Annual sports event for all students.",
  },
  {
    id: 5,
    title: "Science Exhibition",
    type: "event",
    requester: "Dr. Meera Joshi",
    branch: "Science",
    department: "Physics",
    date: "Mar 15, 2026",
    status: "pending",
    description: "Student science project showcase.",
  },
];

const mockStudentApprovals = [
  { id: 1, student: "Vivek Patel", rollNo: "CS2021001", event: "Hackathon 3.0", applied: "Feb 10, 2026", status: "pending" },
  { id: 2, student: "Priya Mehta", rollNo: "CS2021002", event: "Tech Fest 2026", applied: "Feb 11, 2026", status: "approved" },
  { id: 3, student: "Rahul Sharma", rollNo: "CS2021003", event: "Hackathon 3.0", applied: "Feb 12, 2026", status: "pending" },
  { id: 4, student: "Anjali Singh", rollNo: "CS2021004", event: "Cultural Night", applied: "Feb 13, 2026", status: "rejected" },
  { id: 5, student: "Rohan Gupta", rollNo: "CS2021005", event: "Science Exhibition", applied: "Feb 14, 2026", status: "pending" },
];

const statusConfig = {
  pending: { color: "bg-warning/10 text-warning border-0", icon: Clock },
  approved: { color: "bg-success/10 text-success border-0", icon: CheckCircle },
  rejected: { color: "bg-destructive/10 text-destructive border-0", icon: XCircle },
};

export default function ApprovalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [approvals, setApprovals] = useState(mockApprovals);
  const [studentApprovals, setStudentApprovals] = useState(mockStudentApprovals);

  const handleEventAction = (id, action) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
    toast({
      title: action === "approved" ? "Event Approved ✓" : "Event Rejected",
      description: `The event request has been ${action}.`,
    });
  };

  const handleStudentAction = (id, action) => {
    setStudentApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
    toast({
      title: action === "approved" ? "Application Approved ✓" : "Application Rejected",
      description: `Student application has been ${action}.`,
    });
  };

  const filteredApprovals = approvals.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.requester.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = approvals.filter((a) => a.status === "pending").length;
  const studentPendingCount = studentApprovals.filter((a) => a.status === "pending").length;

  const totalApproved =
    approvals.filter((a) => a.status === "approved").length +
    studentApprovals.filter((a) => a.status === "approved").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Approvals</h1>
            <p className="text-muted-foreground">Manage event and application approvals</p>
          </div>
          <Badge className="bg-warning/10 text-warning border-0 text-sm px-3 py-1">
            {pendingCount + studentPendingCount} Pending
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pending Events", value: pendingCount, color: "text-warning", bg: "bg-warning/10" },
            { label: "Pending Applications", value: studentPendingCount, color: "text-primary", bg: "bg-primary/10" },
            { label: "Total Approved", value: totalApproved, color: "text-success", bg: "bg-success/10" },
          ].map((card, index) => (
            <Card key={index} className="p-4 border-0 shadow-card flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                <ClipboardCheck className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="events">
          <TabsList className="mb-4">
            <TabsTrigger value="events">Event Approvals</TabsTrigger>
            {(user?.role === "hod" || user?.role === "branch_admin") && (
              <TabsTrigger value="students">Student Applications</TabsTrigger>
            )}
          </TabsList>

          {/* Event Approvals Tab */}
          <TabsContent value="events">
            <Card className="border-0 shadow-card">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by event or requester..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
                />
              </div>

              <div className="divide-y divide-border">
                {filteredApprovals.map((approval) => {
                  const StatusIcon = statusConfig[approval.status].icon;
                  return (
                    <div key={approval.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{approval.title}</h3>
                              <Badge className={statusConfig[approval.status].color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {approval.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{approval.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" /> {approval.requester}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" /> {approval.branch}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {approval.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        {approval.status === "pending" && user?.role !== "student" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              className="gradient-primary border-0 h-8 text-xs"
                              onClick={() => handleEventAction(approval.id, "approved")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => handleEventAction(approval.id, "rejected")}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Student Applications Tab */}
          <TabsContent value="students">
            <Card className="border-0 shadow-card">
              <div className="divide-y divide-border">
                {studentApprovals.map((app) => {
                  const StatusIcon = statusConfig[app.status].icon;
                  return (
                    <div key={app.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{app.student}</p>
                            <p className="text-xs text-muted-foreground">
                              {app.rollNo} • Applied for:{" "}
                              <span className="text-primary">{app.event}</span> • {app.applied}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[app.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {app.status}
                          </Badge>

                          {app.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="gradient-primary border-0 h-7 text-xs"
                                onClick={() => handleStudentAction(app.id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-destructive border-destructive/30"
                                onClick={() => handleStudentAction(app.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}