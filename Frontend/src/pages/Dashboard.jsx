import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Users, CheckCircle, Award, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

const eventColumns = [
  { key: "event_title", label: "Event Name" },
  { key: "event_date", label: "Date" },
  { key: "location", label: "Venue" },
  { key: "event_status", label: "Status" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "student";

  // Fetch Stats
  const { data: eventsRes, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", { limit: 5 }],
    queryFn: () => apiClient.get("/api/events?limit=5").then(res => res.data)
  });

  const { data: studentsRes } = useQuery({
    queryKey: ["students", { limit: 1 }],
    queryFn: () => apiClient.get("/api/students?limit=1").then(res => res.data)
  });

  const { data: approvalsRes } = useQuery({
    queryKey: ["approvals", { status: "pending", limit: 1 }],
    queryFn: () => apiClient.get("/api/event-approvals?approval_status=pending&limit=1").then(res => res.data)
  });

  const { data: certificatesRes } = useQuery({
    queryKey: ["certificates", { limit: 1 }],
    queryFn: () => apiClient.get("/api/certificates?limit=1").then(res => res.data)
  });

  const recentEvents = eventsRes?.data || [];
  const stats = {
    totalEvents: eventsRes?.total || 0,
    totalStudents: studentsRes?.total || 0,
    pendingApprovals: approvalsRes?.total || 0,
    certificatesIssued: certificatesRes?.total || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {user?.name}! Here's an overview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Events" 
            value={stats.totalEvents} 
            icon={<Calendar className="h-5 w-5" />} 
          />
          <StatsCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={<Users className="h-5 w-5" />} 
          />
          <StatsCard 
            title="Pending Approvals" 
            value={stats.pendingApprovals} 
            icon={<CheckCircle className="h-5 w-5" />} 
          />
          <StatsCard 
            title="Certificates Issued" 
            value={stats.certificatesIssued} 
            icon={<Award className="h-5 w-5" />} 
          />
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-1 overflow-hidden">
          {eventsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable 
              title="Recent Events" 
              columns={eventColumns} 
              data={recentEvents} 
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
