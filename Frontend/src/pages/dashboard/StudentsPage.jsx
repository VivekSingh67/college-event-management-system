import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { Loader2 } from "lucide-react";
import { fetchStudents, selectStudents } from "@/redux/slices/coreSlice";

export default function StudentsPage() {
  const dispatch = useDispatch();
  
  // Redux state
  const { list, isLoading, error } = useSelector(selectStudents);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Re-map for UI presentation (if names aren't populated)
  const students = list.map(s => ({
    ...s,
    name: s.user_id?.name || s.name || "Unknown", 
    email: s.user_id?.email || s.email || "N/A"
  })) || [];

  const studentColumns = [
    { key: "enrollment_no", label: "Enrollment" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "semester", label: "Semester" },
    { key: "status", label: "Status" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">Students</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage student records</p>
          </div>
        </div>
        
        {isLoading && students.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error && students.length === 0 ? (
          <div className="text-center py-20 text-destructive bg-destructive/5 rounded-xl border border-destructive/20 mx-auto max-w-md">
            <p className="font-semibold">Failed to load students</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
            <DataTable 
              columns={studentColumns} 
              data={students} 
              title="Student List"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
