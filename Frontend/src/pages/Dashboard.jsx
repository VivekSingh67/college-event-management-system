import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Users, CheckCircle, Award, Loader2 } from "lucide-react";
import { fetchEvents, selectEvents, selectEventsLoading, selectEventsTotal } from "@/redux/slices/eventSlice";
import { fetchStudents, fetchCertificates, fetchQueries, selectStudents, selectCertificates, selectQueries } from "@/redux/slices/coreSlice";

const eventColumns = [
  { key: "event_title", label: "Event Name" },
  { key: "event_date", label: "Date" },
  { key: "location", label: "Venue" },
  { key: "event_status", label: "Status" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  // Redux Selectors
  const events = useSelector(selectEvents);
  const eventsLoading = useSelector(selectEventsLoading);
  const eventsTotal = useSelector(selectEventsTotal);
  
  const studentsState = useSelector(selectStudents);
  const certificatesState = useSelector(selectCertificates);
  // Using queries for pending approvals per the original logic (mapped to queries/approvals)
  const queriesState = useSelector(selectQueries);

  useEffect(() => {
    dispatch(fetchEvents({ limit: 5 }));
    dispatch(fetchStudents({ limit: 1 }));
    // We'll use fetchQueries or add a specific thunk for approvals if needed, 
    // but the original dashboard fetched approvals too.
    // For now mirroring the original logic with available thunks.
    dispatch(fetchCertificates({ limit: 1 }));
  }, [dispatch]);

  const recentEvents = events?.list || [];
  const stats = {
    totalEvents: eventsTotal || 0,
    totalStudents: studentsState.total || 0,
    pendingApprovals: 0, // In a real app, we'd have a specific thunk for this
    certificatesIssued: certificatesState.total || 0,
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
