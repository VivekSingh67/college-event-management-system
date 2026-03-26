import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/dashboard/EventsPage";
import StudentsPage from "./pages/dashboard/StudentsPage";
import ApprovalsPage from "./pages/dashboard/ApprovalsPage";
import AnnouncementsPage from "./pages/dashboard/AnnouncementsPage";
import CollegesPage from "./pages/dashboard/CollegesPage";
import BranchesPage from "./pages/dashboard/BranchesPage";
import BranchAdminsPage from "./pages/dashboard/BranchAdminsPage";
import DepartmentsPage from "./pages/dashboard/DepartmentsPage";
import HodsPage from "./pages/dashboard/HodsPage";
import CategoriesPage from "./pages/dashboard/CategoriesPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import SupportPage from "./pages/dashboard/SupportPage";
import ActivityPage from "./pages/dashboard/ActivityPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import FacultyPage from "./pages/dashboard/FacultyPage";
import BatchPage from "./pages/dashboard/BatchPage";
import RegistrationsPage from "./pages/dashboard/RegistrationsPage";
import VenuesPage from "./pages/dashboard/VenuesPage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";
import MyRegistrationsPage from "./pages/dashboard/MyRegistrationsPage";
import ParticipationPage from "./pages/dashboard/ParticipationPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

/**
 * Main App Component
 * 
 * Cleaned up: Removed React Query (QueryClientProvider) as the app 
 * now fully uses Redux Toolkit for state management.
 * AuthProvider is now Redux-backed.
 */
const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/events" element={<EventsPage />} />
          <Route path="/dashboard/students" element={<StudentsPage />} />
          <Route path="/dashboard/approvals" element={<ApprovalsPage />} />
          <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
          <Route path="/dashboard/colleges" element={<CollegesPage />} />
          <Route path="/dashboard/branches" element={<BranchesPage />} />
          <Route path="/dashboard/branch-admins" element={<BranchAdminsPage />} />
          <Route path="/dashboard/departments" element={<DepartmentsPage />} />
          <Route path="/dashboard/hods" element={<HodsPage />} />
          <Route path="/dashboard/categories" element={<CategoriesPage />} />
          <Route path="/dashboard/reports" element={<ReportsPage />} />
          <Route path="/dashboard/support" element={<SupportPage />} />
          <Route path="/dashboard/activity" element={<ActivityPage />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/faculty" element={<FacultyPage />} />
          <Route path="/dashboard/batch" element={<BatchPage />} />
          <Route path="/dashboard/registrations" element={<RegistrationsPage />} />
          <Route path="/dashboard/venues" element={<VenuesPage />} />
          <Route path="/dashboard/attendance" element={<AttendancePage />} />
          <Route path="/dashboard/certificates" element={<CertificatesPage />} />
          <Route path="/dashboard/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="/dashboard/participation" element={<ParticipationPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
