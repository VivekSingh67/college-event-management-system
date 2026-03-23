import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

const columns = [
  { key: "enrollment_no", label: "Enrollment No" },
  { key: "user_id", label: "Name" }, // Will need population in backend or manual mapping
  { key: "semester", label: "Semester" },
  { key: "status", label: "Status" },
];

export default function StudentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await apiClient.get("/api/students");
      return response.data;
    },
  });

  const students = data?.data?.map(s => ({
    ...s,
    name: s.user_id?.name || "Unknown", // Handle population if available
    email: s.user_id?.email || "N/A"
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
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage student records</p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-destructive">
            Failed to load students. Only staff members can view students.
          </div>
        ) : (
          <DataTable columns={studentColumns} data={students} />
        )}
      </div>
    </DashboardLayout>
  );
}
