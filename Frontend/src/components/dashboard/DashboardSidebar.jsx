import { useLocation, Link } from "react-router-dom";
import { roleSidebarItems, roleLabels } from "@/lib/roles";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, ChevronLeft, ChevronRight,
  LayoutDashboard, Building, GitBranch, UserCog, Building2, Users, Tag, Megaphone,
  BarChart3, HelpCircle, ScrollText, Bell, Settings, Calendar, ClipboardList,
  CheckCircle, MapPin, Layers, UserCheck, ListChecks, Award, Trophy, User
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard, Building, GitBranch, UserCog, Building2, Users, Tag, Megaphone,
  BarChart3, HelpCircle, ScrollText, Bell, Settings, Calendar, ClipboardList,
  CheckCircle, MapPin, Layers, UserCheck, GraduationCap, ListChecks, Award, Trophy, User,
};

export function DashboardSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const role = user?.role || "student";
  const items = roleSidebarItems[role] || roleSidebarItems["student"];

  return (
    <aside className={cn(
      "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 shrink-0",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold text-sidebar-foreground">CampusHub</span>
          </Link>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          <span className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
            {roleLabels[role]}
          </span>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
