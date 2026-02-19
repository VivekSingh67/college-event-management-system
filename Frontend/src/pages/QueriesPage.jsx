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
import { MessageSquare, Plus, Search, User, Clock, CheckCircle, Send } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const initialQueries = [
  {
    id: 1,
    subject: "Event registration not working",
    message: "I am unable to register for Tech Fest 2026. The button is not responding.",
    from: "Vivek Patel",
    role: "student",
    category: "Technical",
    status: "open",
    date: "Feb 15, 2026",
    replies: [
      {
        by: "Admin",
        text: "We are looking into the issue. Please try clearing your browser cache.",
        date: "Feb 15, 2026",
      },
    ],
  },
  {
    id: 2,
    subject: "Certificate for Hackathon participation",
    message: "Requesting e-certificate for my participation in Hackathon 3.0 held last month.",
    from: "Priya Mehta",
    role: "student",
    category: "Certificate",
    status: "resolved",
    date: "Feb 10, 2026",
    replies: [
      {
        by: "HOD",
        text: "Certificate has been sent to your registered email.",
        date: "Feb 11, 2026",
      },
    ],
  },
  {
    id: 3,
    subject: "Event approval delay",
    message:
      "The Cultural Night event approval request submitted 5 days ago has not been processed yet.",
    from: "Prof. Anita Sharma",
    role: "branch_admin",
    category: "Approval",
    status: "open",
    date: "Feb 14, 2026",
    replies: [],
  },
  {
    id: 4,
    subject: "Department data export issue",
    message: "The Excel export for department-wise student data is showing incorrect records.",
    from: "Dr. Vikram Singh",
    role: "hod",
    category: "Technical",
    status: "in_progress",
    date: "Feb 12, 2026",
    replies: [
      {
        by: "Super Admin",
        text: "We have identified the issue. Fix will be deployed by EOD.",
        date: "Feb 13, 2026",
      },
    ],
  },
];

const statusConfig = {
  open: "bg-warning/10 text-warning border-0",
  in_progress: "bg-primary/10 text-primary border-0",
  resolved: "bg-success/10 text-success border-0",
};

const statusIcon = {
  open: Clock,
  in_progress: MessageSquare,
  resolved: CheckCircle,
};

export default function QueriesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [queries, setQueries] = useState(initialQueries);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [form, setForm] = useState({
    subject: "",
    message: "",
    category: "General",
  });

  const filtered = queries.filter((q) => {
    const matchSearch =
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.from.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSubmitQuery = () => {
    if (!form.subject || !form.message) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    const newQuery = {
      id: queries.length + 1,
      subject: form.subject,
      message: form.message,
      from: user?.name || "User",
      role: user?.role || "student",
      category: form.category,
      status: "open",
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      replies: [],
    };

    setQueries((prev) => [newQuery, ...prev]);
    setForm({ subject: "", message: "", category: "General" });
    setOpen(false);
    toast({
      title: "Query Submitted ✓",
      description: "We'll get back to you shortly.",
    });
  };

  const handleReply = () => {
    if (!replyText || !selected) return;

    const updatedQuery = {
      ...selected,
      status: "in_progress",
      replies: [
        ...selected.replies,
        {
          by: user?.name || "Admin",
          text: replyText,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      ],
    };

    setQueries((prev) =>
      prev.map((q) => (q.id === selected.id ? updatedQuery : q))
    );
    setSelected(updatedQuery);
    setReplyText("");
    toast({ title: "Reply Sent ✓" });
  };

  const handleResolve = (id) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "resolved" } : q))
    );

    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status: "resolved" } : null));
    }

    toast({ title: "Query Resolved ✓" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header + Create Query Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Queries & Support</h1>
            <p className="text-muted-foreground">Submit and track your queries</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 gap-2">
                <Plus className="h-4 w-4" />
                New Query
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit a Query</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["General", "Technical", "Certificate", "Approval", "Event", "Other"].map(
                        (cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subject *</Label>
                  <Input
                    placeholder="Brief subject line"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Message *</Label>
                  <Textarea
                    placeholder="Describe your query in detail..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-primary border-0" onClick={handleSubmitQuery}>
                    Submit Query
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Status Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search queries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Queries</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main content: List + Detail view */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column - Query list */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((q) => {
              const StatusIcon = statusIcon[q.status];
              return (
                <Card
                  key={q.id}
                  onClick={() => setSelected(q)}
                  className={`p-4 border-0 shadow-card cursor-pointer hover:shadow-md transition-all ${
                    selected?.id === q.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {q.subject}
                    </h3>
                    <Badge className={`${statusConfig[q.status]} text-xs flex-shrink-0`}>
                      <StatusIcon className="h-2.5 w-2.5 mr-1" />
                      {q.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{q.message}</p>

                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {q.from}
                    </span>
                    <span>•</span>
                    <span>{q.date}</span>
                    {q.replies.length > 0 && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        {q.replies.length} {q.replies.length === 1 ? "reply" : "replies"}
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Right column - Selected query detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <Card className="border-0 shadow-card h-full flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-foreground">{selected.subject}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{selected.from}</span>
                        <span>•</span>
                        <span>{selected.date}</span>
                        <Badge className="bg-muted text-muted-foreground border-0">
                          {selected.category}
                        </Badge>
                      </div>
                    </div>

                    {selected.status !== "resolved" && user?.role !== "student" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success/30 hover:bg-success/10 text-xs whitespace-nowrap"
                        onClick={() => handleResolve(selected.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 space-y-5 overflow-auto">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-foreground leading-relaxed">{selected.message}</p>
                  </div>

                  {selected.replies.map((reply, index) => (
                    <div
                      key={index}
                      className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary"
                    >
                      <div className="flex items-center gap-3 mb-1.5 text-xs">
                        <span className="font-semibold text-primary">{reply.by}</span>
                        <span className="text-muted-foreground">{reply.date}</span>
                      </div>
                      <p className="text-sm text-foreground">{reply.text}</p>
                    </div>
                  ))}

                  {selected.status !== "resolved" && (
                    <div className="pt-3 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[90px] resize-none"
                        />
                        <Button
                          className="gradient-primary border-0 self-end h-10 w-10 p-0 flex-shrink-0"
                          size="sm"
                          onClick={handleReply}
                          disabled={!replyText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="border-0 shadow-card h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>Select a query to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}