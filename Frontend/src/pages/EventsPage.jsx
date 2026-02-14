import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Calendar,
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "sonner";

const mockEvents = [
  {
    id: "1",
    title: "Tech Fest 2026",
    description:
      "Annual technology festival with coding competitions, workshops, and tech talks.",
    branch: "Engineering",
    department: "All",
    eventDate: "2026-03-15",
    lastRegDate: "2026-03-10",
    status: "approved",
    participants: 320,
    createdBy: "Prof. Anita Sharma",
  },
  {
    id: "2",
    title: "Hackathon 3.0",
    description:
      "48-hour coding marathon. Build innovative solutions for real-world problems.",
    branch: "Engineering",
    department: "Computer Science",
    eventDate: "2026-02-25",
    lastRegDate: "2026-02-20",
    status: "pending",
    participants: 85,
    createdBy: "Dr. Vikram Singh",
  },
  {
    id: "3",
    title: "Cultural Night",
    description:
      "Celebrate diversity through dance, music, drama, and art performances.",
    branch: "All",
    department: "All",
    eventDate: "2026-03-01",
    lastRegDate: "2026-02-25",
    status: "approved",
    participants: 500,
    createdBy: "Prof. Anita Sharma",
  },
  {
    id: "4",
    title: "Science Exhibition",
    description: "Showcase innovative science projects and working models.",
    branch: "Science",
    department: "Physics",
    eventDate: "2026-03-05",
    lastRegDate: "2026-02-28",
    status: "pending",
    participants: 120,
    createdBy: "Dr. Meena Gupta",
  },
  {
    id: "5",
    title: "Design Jam",
    description:
      "UI/UX design competition with live mentorship from industry experts.",
    branch: "Engineering",
    department: "Computer Science",
    eventDate: "2026-03-12",
    lastRegDate: "2026-03-08",
    status: "rejected",
    participants: 42,
    createdBy: "Dr. Vikram Singh",
  },
  {
    id: "6",
    title: "Sports Day 2026",
    description:
      "Inter-department sports competition featuring cricket, football, and athletics.",
    branch: "All",
    department: "All",
    eventDate: "2026-03-20",
    lastRegDate: "2026-03-15",
    status: "approved",
    participants: 600,
    createdBy: "Prof. Anita Sharma",
  },
  {
    id: "7",
    title: "AI Workshop",
    description: "Hands-on workshop on Machine Learning and AI fundamentals.",
    branch: "Engineering",
    department: "Computer Science",
    eventDate: "2026-02-28",
    lastRegDate: "2026-02-24",
    status: "approved",
    participants: 75,
    createdBy: "Dr. Vikram Singh",
  },
  {
    id: "8",
    title: "Debate Competition",
    description:
      "Inter-college debate competition on current affairs and technology ethics.",
    branch: "Arts",
    department: "English",
    eventDate: "2026-03-08",
    lastRegDate: "2026-03-05",
    status: "pending",
    participants: 60,
    createdBy: "Prof. Ravi Kumar",
  },
];

const statusColors = {
  pending: "bg-warning/10 text-warning border-0",
  approved: "bg-success/10 text-success border-0",
  rejected: "bg-destructive/10 text-destructive border-0",
};

const branches = ["All", "Engineering", "Science", "Arts", "Commerce"];
const departments = [
  "All",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Physics",
  "English",
  "Mathematics",
];

const emptyForm = {
  title: "",
  description: "",
  branch: "",
  department: "",
  eventDate: "",
  lastRegDate: "",
};

export default function EventsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [events, setEvents] = useState(mockEvents);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filteredEvents = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.branch.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim() || form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (form.title.trim().length > 100) {
      newErrors.title = "Title must be under 100 characters";
    }

    if (!form.description.trim() || form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (form.description.trim().length > 500) {
      newErrors.description = "Description must be under 500 characters";
    }

    if (!form.branch) newErrors.branch = "Please select a branch";
    if (!form.department) newErrors.department = "Please select a department";
    if (!form.eventDate) newErrors.eventDate = "Please select event date";
    if (!form.lastRegDate)
      newErrors.lastRegDate = "Please select last registration date";

    if (
      form.eventDate &&
      form.lastRegDate &&
      form.lastRegDate > form.eventDate
    ) {
      newErrors.lastRegDate = "Registration date must be before event date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newEvent = {
      id: String(events.length + 1),
      title: form.title.trim(),
      description: form.description.trim(),
      branch: form.branch,
      department: form.department,
      eventDate: form.eventDate,
      lastRegDate: form.lastRegDate,
      status: "pending",
      participants: 0,
      createdBy: user?.name || "Unknown",
    };

    setEvents([newEvent, ...events]);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(false);
    toast.success("Event created successfully! Awaiting approval.");
  };

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground">
              {isStudent
                ? "Browse and apply for upcoming events"
                : "Manage and create college events"}
            </p>
          </div>
          {!isStudent && (
            <Button
              onClick={() => setDialogOpen(true)}
              className="gradient-primary border-0 gap-2"
            >
              <PlusCircle className="h-4 w-4" /> Create Event
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="p-4 border-0 shadow-card">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                className={
                  viewMode === "table" ? "gradient-primary border-0 rounded-none" : "rounded-none"
                }
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("card")}
                className={
                  viewMode === "card" ? "gradient-primary border-0 rounded-none" : "rounded-none"
                }
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Table View */}
        {viewMode === "table" ? (
          <Card className="border-0 shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Event</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Last Reg.</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {event.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{event.branch}</TableCell>
                    <TableCell className="text-muted-foreground">{event.department}</TableCell>
                    <TableCell className="text-muted-foreground">{event.eventDate}</TableCell>
                    <TableCell className="text-muted-foreground">{event.lastRegDate}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-foreground">{event.participants}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[event.status]}>{event.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewEvent(event)}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        {!isStudent && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(event.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEvents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="p-5 border-0 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <Badge className={statusColors[event.status]}>{event.status}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {event.description}
                </p>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <p>
                    <span className="font-medium text-foreground">Branch:</span> {event.branch}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Dept:</span> {event.department}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Date:</span> {event.eventDate}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Last Reg:</span>{" "}
                    {event.lastRegDate}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Participants:</span>{" "}
                    {event.participants}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => setViewEvent(event)}
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  {isStudent ? (
                    <Button
                      size="sm"
                      className="flex-1 gradient-primary border-0"
                      disabled={event.status !== "approved"}
                    >
                      Apply
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No events found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in the details to create a new college event.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ev-title">Event Title *</Label>
              <Input
                id="ev-title"
                placeholder="Enter event title"
                maxLength={100}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-desc">Description *</Label>
              <Textarea
                id="ev-desc"
                placeholder="Describe the event..."
                maxLength={500}
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex justify-between">
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {form.description.length}/500
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Branch *</Label>
                <Select value={form.branch} onValueChange={(v) => setForm({ ...form, branch: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch && <p className="text-xs text-destructive">{errors.branch}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Department *</Label>
                <Select
                  value={form.department}
                  onValueChange={(v) => setForm({ ...form, department: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-xs text-destructive">{errors.department}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ev-date">Event Date *</Label>
                <Input
                  id="ev-date"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                />
                {errors.eventDate && (
                  <p className="text-xs text-destructive">{errors.eventDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ev-lastreg">Last Registration *</Label>
                <Input
                  id="ev-lastreg"
                  type="date"
                  value={form.lastRegDate}
                  onChange={(e) => setForm({ ...form, lastRegDate: e.target.value })}
                />
                {errors.lastRegDate && (
                  <p className="text-xs text-destructive">{errors.lastRegDate}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setForm(emptyForm);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gradient-primary border-0">
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={!!viewEvent} onOpenChange={() => setViewEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewEvent?.title}</DialogTitle>
            <DialogDescription>Event Details</DialogDescription>
          </DialogHeader>
          {viewEvent && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2">
                <Badge className={statusColors[viewEvent.status]}>
                  {viewEvent.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Created by {viewEvent.createdBy}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{viewEvent.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Branch</p>
                  <p className="font-medium">{viewEvent.branch}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{viewEvent.department}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Event Date</p>
                  <p className="font-medium">{viewEvent.eventDate}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Last Registration</p>
                  <p className="font-medium">{viewEvent.lastRegDate}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 text-center">
                <p className="text-2xl font-bold text-primary">{viewEvent.participants}</p>
                <p className="text-xs text-muted-foreground">Total Participants</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}