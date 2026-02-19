import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { Megaphone, Plus, Search, Calendar, Building2, Pin } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const initialAnnouncements = [
  {
    id: 1,
    title: "Mid-Term Exam Schedule Released",
    content:
      "Mid-term exams for all departments will be held from March 1–10, 2026. Check your department notice board for subject-wise schedule.",
    branch: "All",
    author: "Super Admin",
    date: "Feb 15, 2026",
    priority: "high",
    pinned: true,
  },
  {
    id: 2,
    title: "Annual Tech Fest Registration Open",
    content:
      "Registrations for Tech Fest 2026 are now open. Students can register through the Events section. Last date: Feb 25, 2026.",
    branch: "Engineering",
    author: "Branch Admin",
    date: "Feb 14, 2026",
    priority: "medium",
    pinned: false,
  },
  {
    id: 3,
    title: "Library Timing Change",
    content:
      "The library will remain open from 8 AM to 9 PM starting from February 18, 2026 onwards. Night reading room available till 11 PM.",
    branch: "All",
    author: "Admin",
    date: "Feb 13, 2026",
    priority: "low",
    pinned: false,
  },
  {
    id: 4,
    title: "Sports Day Volunteers Needed",
    content:
      "Students willing to volunteer for the Annual Sports Day (March 10) can register at the sports office by March 1.",
    branch: "All",
    author: "Super Admin",
    date: "Feb 12, 2026",
    priority: "medium",
    pinned: false,
  },
  {
    id: 5,
    title: "CS Department Seminar",
    content:
      "Guest lecture on AI & Machine Learning by Dr. Arjun Nair from IIT Bombay on February 22, 2026 at 2 PM in Seminar Hall.",
    branch: "Engineering",
    author: "Dr. Vikram Singh",
    date: "Feb 11, 2026",
    priority: "high",
    pinned: false,
  },
];

const priorityConfig = {
  high: "bg-destructive/10 text-destructive border-0",
  medium: "bg-warning/10 text-warning border-0",
  low: "bg-success/10 text-success border-0",
};

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    branch: "All",
    priority: "medium",
  });

  const canCreate = user?.role === "super_admin" || user?.role === "branch_admin";

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((a) => a.pinned);
  const regular = filtered.filter((a) => !a.pinned);

  const handleCreate = () => {
    if (!form.title || !form.content) {
      toast({
        title: "Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    const newAnn = {
      id: announcements.length + 1,
      title: form.title,
      content: form.content,
      branch: form.branch,
      priority: form.priority,
      author: user?.name || "Admin",
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      pinned: false,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setForm({ title: "", content: "", branch: "All", priority: "medium" });
    setOpen(false);

    toast({
      title: "Announcement Posted ✓",
      description: "Your announcement has been published.",
    });
  };

  const AnnouncementCard = ({ ann }) => (
    <Card className="p-5 border-0 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              ann.pinned ? "bg-primary/20" : "bg-muted"
            }`}
          >
            {ann.pinned ? (
              <Pin className="h-5 w-5 text-primary" />
            ) : (
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-foreground">{ann.title}</h3>
              {ann.pinned && (
                <Badge className="bg-primary/10 text-primary border-0 text-xs">
                  Pinned
                </Badge>
              )}
              <Badge
                className={
                  priorityConfig[ann.priority] + " text-xs"
                }
              >
                {ann.priority}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {ann.content}
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {ann.branch}
              </span>
              <span>By {ann.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {ann.date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">
              Stay updated with college notices and announcements
            </p>
          </div>

          {canCreate && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary border-0 gap-2">
                  <Plus className="h-4 w-4" />
                  New Announcement
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      placeholder="Announcement title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Content *</Label>
                    <Textarea
                      placeholder="Write announcement content..."
                      value={form.content}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, content: e.target.value }))
                      }
                      className="mt-1 min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Branch</Label>
                      <Select
                        value={form.branch}
                        onValueChange={(v) =>
                          setForm((f) => ({ ...f, branch: v }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Branches</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Commerce">Commerce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={form.priority}
                        onValueChange={(v) =>
                          setForm((f) => ({ ...f, priority: v }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="gradient-primary border-0"
                      onClick={handleCreate}
                    >
                      Post Announcement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pinned Announcements */}
        {pinned.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              📌 Pinned
            </h2>
            {pinned.map((a) => (
              <AnnouncementCard key={a.id} ann={a} />
            ))}
          </div>
        )}

        {/* Regular Announcements */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            All Announcements ({regular.length})
          </h2>
          {regular.map((a) => (
            <AnnouncementCard key={a.id} ann={a} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}