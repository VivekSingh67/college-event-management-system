import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Bell,
  CheckCheck,
  Calendar,
  ClipboardCheck,
  Megaphone,
  MessageSquare,
  User,
  Trash2,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";

const initialNotifications = [
  {
    id: 1,
    type: "approval",
    title: "Event Approved!",
    message: "Your event 'Hackathon 3.0' has been approved by Super Admin.",
    time: "2 hours ago",
    read: false,
    icon: ClipboardCheck,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: 2,
    type: "event",
    title: "New Event Available",
    message: "Tech Fest 2026 registration is now open. Last date: Feb 25, 2026.",
    time: "5 hours ago",
    read: false,
    icon: Calendar,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 3,
    type: "announcement",
    title: "New Announcement",
    message: "Mid-term exam schedule has been released. Check announcements for details.",
    time: "1 day ago",
    read: false,
    icon: Megaphone,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    id: 4,
    type: "query",
    title: "Query Response Received",
    message: "Admin replied to your query: 'Event registration not working'.",
    time: "1 day ago",
    read: true,
    icon: MessageSquare,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    id: 5,
    type: "reminder",
    title: "Event Reminder",
    message: "Cultural Night is tomorrow at 6 PM. Don't forget to attend!",
    time: "2 days ago",
    read: true,
    icon: Bell,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    id: 6,
    type: "approval",
    title: "Application Pending",
    message: "Your application for Science Exhibition is under review.",
    time: "3 days ago",
    read: true,
    icon: ClipboardCheck,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    id: 7,
    type: "event",
    title: "Registration Confirmed",
    message: "You have successfully registered for Hackathon 3.0.",
    time: "4 days ago",
    read: true,
    icon: Calendar,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: 8,
    type: "profile",
    title: "Profile Updated",
    message: "Your profile information has been updated successfully.",
    time: "5 days ago",
    read: true,
    icon: User,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge className="gradient-primary border-0 text-white">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">Stay updated with all activities</p>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" className="gap-2" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "all" },
            { label: `Unread (${unreadCount})`, value: "unread" },
            { label: "Read", value: "read" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={filter === tab.value ? "default" : "outline"}
              size="sm"
              className={
                filter === tab.value ? "gradient-primary border-0" : ""
              }
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Notification List */}
        <Card className="border-0 shadow-card divide-y divide-border overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No notifications here</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    "p-4 flex items-start gap-4 cursor-pointer hover:bg-muted/30 transition-colors group",
                    !notif.read && "bg-primary/5"
                  )}
                >
                  <div
                    className={`h-10 w-10 rounded-xl ${notif.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`h-5 w-5 ${notif.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          !notif.read ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mt-0.5">
                      {notif.message}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {notif.time}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}