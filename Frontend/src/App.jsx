import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/branches" element={<PlaceholderPage />} />
            <Route path="/departments" element={<PlaceholderPage />} />
            <Route path="/students" element={<PlaceholderPage />} />
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
