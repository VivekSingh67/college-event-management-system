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
import BranchesPage from "./pages/super-admin/BranchPage";
import BranchAdminsPage from "./pages/super-admin/BranchAdmin";
import DepartmentsPage from "./pages/super-admin/DepartmentsPage";
import HODsPage from "./pages/super-admin/Hods";
import StudentPage from "./pages/super-admin/StudentPage";
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
            <Route path="/approvals" element={<PlaceholderPage />} />
            <Route path="/announcements" element={<PlaceholderPage />} />
            <Route path="/reports" element={<PlaceholderPage />} />
            <Route path="/queries" element={<PlaceholderPage />} />
            <Route path="/notifications" element={<PlaceholderPage />} />
            <Route path="/profile" element={<PlaceholderPage />} />
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
