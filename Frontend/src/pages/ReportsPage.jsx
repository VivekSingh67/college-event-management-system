import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  BarChart3,
  Download,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  GraduationCap,
  Building,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useToast } from "../hooks/use-toast";

const eventParticipationData = [
  { month: "Sep", events: 4, students: 120 },
  { month: "Oct", events: 6, students: 230 },
  { month: "Nov", events: 8, students: 310 },
  { month: "Dec", events: 3, students: 90 },
  { month: "Jan", events: 7, students: 275 },
  { month: "Feb", events: 9, students: 380 },
];

const departmentData = [
  { name: "CS", value: 380, color: "hsl(var(--primary))" },
  { name: "IT", value: 260, color: "hsl(var(--chart-2))" },
  { name: "Mech", value: 180, color: "hsl(var(--chart-3))" },
  { name: "Civil", value: 140, color: "hsl(var(--chart-4))" },
  { name: "Elect", value: 200, color: "hsl(var(--chart-5))" },
];

const approvalTrendData = [
  { month: "Oct", approved: 5, rejected: 2 },
  { month: "Nov", approved: 8, rejected: 1 },
  { month: "Dec", approved: 3, rejected: 3 },
  { month: "Jan", approved: 7, rejected: 2 },
  { month: "Feb", approved: 9, rejected: 1 },
];

const topEvents = [
  { name: "Tech Fest 2026", branch: "Engineering", participants: 180, status: "approved" },
  { name: "Hackathon 3.0", branch: "Engineering", participants: 120, status: "approved" },
  { name: "Cultural Night", branch: "Arts", participants: 95, status: "approved" },
  { name: "Science Exhibition", branch: "Science", participants: 75, status: "pending" },
  { name: "Sports Day", branch: "All", participants: 340, status: "approved" },
];

export default function ReportsPage() {
  const { toast } = useToast();

  const handleExport = (type) => {
    toast({
      title: `Exporting ${type}...`,
      description: "Your file will be ready shortly.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights on events and participation
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Select defaultValue="2026">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2025–26</SelectItem>
                <SelectItem value="2025">2024–25</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2" onClick={() => handleExport("PDF")}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>

            <Button
              className="gradient-primary border-0 gap-2"
              onClick={() => handleExport("Excel")}
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Events",
              value: "37",
              icon: Calendar,
              color: "text-primary",
              bg: "bg-primary/10",
              trend: "+9 this month",
            },
            {
              label: "Total Participants",
              value: "1,405",
              icon: Users,
              color: "text-success",
              bg: "bg-success/10",
              trend: "+380 this month",
            },
            {
              label: "Approval Rate",
              value: "87%",
              icon: TrendingUp,
              color: "text-warning",
              bg: "bg-warning/10",
              trend: "↑ 5% from last month",
            },
            {
              label: "Active Departments",
              value: "18",
              icon: Building,
              color: "text-chart-2",
              bg: "bg-chart-2/10",
              trend: "Across 6 branches",
            },
          ].map((card, index) => (
            <Card key={index} className="p-5 border-0 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center`}
                >
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <span className="text-sm text-muted-foreground">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.trend}</p>
            </Card>
          ))}
        </div>

        {/* Charts – Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Event Participation */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">Monthly Event Participation</h3>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={eventParticipationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="students"
                  name="Students"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="events"
                  name="Events"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Department-wise Participation */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">
                Department-wise Participation
              </h3>
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 w-full sm:w-auto">
                {departmentData.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-semibold text-foreground ml-auto">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Approval Trend */}
        <Card className="p-6 border-0 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Approval Trend</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={approvalTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="approved"
                name="Approved"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="rejected"
                name="Rejected"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Events Table */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-semibold text-foreground">Top Events by Participation</h3>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleExport("Event Report")}
            >
              <FileText className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Event Name
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Branch
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Participants
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {topEvents.map((event, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-medium text-foreground">{event.name}</td>
                    <td className="p-4 text-muted-foreground">{event.branch}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 rounded-full bg-primary/20 flex-1 max-w-32">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(event.participants / 340) * 100}%` }}
                          />
                        </div>
                        <span className="font-semibold text-foreground">
                          {event.participants}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          event.status === "approved"
                            ? "bg-success/10 text-success border-0"
                            : "bg-warning/10 text-warning border-0"
                        }
                      >
                        {event.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}