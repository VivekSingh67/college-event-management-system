import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  GraduationCap,
  FileText,
  Bell,
  MessageSquare,
  User,
  ClipboardCheck,
  Building,
  PlusCircle,
  BarChart3,
  Megaphone,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const navByRole = {
  super_admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Branches", url: "/branches", icon: Building2 },
    { title: "Departments", url: "/departments", icon: Building },
    { title: "Students", url: "/students", icon: GraduationCap },
    { title: "Events", url: "/events", icon: Calendar },
    { title: "Approvals", url: "/approvals", icon: ClipboardCheck },
    { title: "Announcements", url: "/announcements", icon: Megaphone },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Queries", url: "/queries", icon: MessageSquare },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Profile", url: "/profile", icon: User },
  ],
  branch_admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Departments", url: "/departments", icon: Building },
    { title: "Students", url: "/students", icon: GraduationCap },
    { title: "Events", url: "/events", icon: Calendar },
    { title: "Create Event", url: "/events/create", icon: PlusCircle },
    { title: "Approvals", url: "/approvals", icon: ClipboardCheck },
    { title: "Announcements", url: "/announcements", icon: Megaphone },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Queries", url: "/queries", icon: MessageSquare },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Profile", url: "/profile", icon: User },
  ],
  hod: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/students", icon: GraduationCap },
    { title: "Events", url: "/events", icon: Calendar },
    { title: "Create Event", url: "/events/create", icon: PlusCircle },
    { title: "Approvals", url: "/approvals", icon: ClipboardCheck },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Queries", url: "/queries", icon: MessageSquare },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Profile", url: "/profile", icon: User },
  ],
  student: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Events", url: "/events", icon: Calendar },
    { title: "My Applications", url: "/applications", icon: FileText },
    { title: "History", url: "/history", icon: ClipboardCheck },
    { title: "Feedback", url: "/feedback", icon: MessageSquare },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Profile", url: "/profile", icon: User },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navByRole[user?.role || "student"] || navByRole.student;

  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-10 w-10 rounded-xl bg-sidebar-accent flex items-center justify-center flex-shrink-0">
          <GraduationCap className="h-6 w-6 text-sidebar-accent-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-sidebar-primary truncate">CEMS</h1>
            <p className="text-xs text-sidebar-foreground/70 truncate">Event Management</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay / backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 gradient-primary flex flex-col transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop / large screen sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col gradient-primary sticky top-0 h-screen transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-sidebar-border text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
        >
          <Menu className="h-5 w-5 mx-auto" />
        </button>
      </aside>
    </>
  );
}