import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
import BranchesPage from "./pages/BranchPage";
import BranchAdminsPage from "./pages/BranchAdmin";
import DepartmentsPage from "./pages/DepartmentsPage";
import HODsPage from "./pages/Hods";
import StudentPage from "./pages/StudentPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import QueriesPage from "./pages/QueriesPage";
import ReportsPage from "./pages/ReportsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/branch-admins" element={<BranchAdminsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/hods" element={<HODsPage />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<EventsPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/queries" element={<QueriesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/applications" element={<PlaceholderPage />} />
            <Route path="/history" element={<PlaceholderPage />} />
            <Route path="/feedback" element={<PlaceholderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
