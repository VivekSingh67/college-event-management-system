import { useAuth } from "../contexts/AuthContext";
import { DashboardLayout } from "../components/layout/DashboardLayout";

import SuperAdminDashboard from "./SuperAdminDashboard";
import BranchAdminDashboard from "./BranchAdminDashboard";
import HODDashboard from "./HODDashboard";
import StudentDashboard from "./StudentDashboard";

const dashboardByRole = {
  super_admin: SuperAdminDashboard,
  branch_admin: BranchAdminDashboard,
  hod: HODDashboard,
  student: StudentDashboard,
};

export default function Dashboard() {
  const { user } = useAuth();

  // Fallback to student dashboard if role is missing / invalid
  const role = user?.role || "student";
  const DashboardComponent = dashboardByRole[role] || StudentDashboard;

  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
}