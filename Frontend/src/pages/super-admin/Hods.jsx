import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  User,
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

const mockHODs = [
  {
    id: "1",
    department: "Computer Science & Engineering",
    fullName: "Dr. Arvind Kumar Singh",
    email: "arvind.singh@college.edu",
    mobile: "+91 98290 12345",
    createdBy: "Admin Superuser",
  },
  {
    id: "2",
    department: "Mechanical Engineering",
    fullName: "Prof. Sanjay Sharma",
    email: "sanjay.sharma@college.edu",
    mobile: "+91 94140 56789",
    createdBy: "Admin Superuser",
  },
  {
    id: "3",
    department: "Electronics & Communication",
    fullName: "Dr. Neha Gupta",
    email: "neha.gupta@college.edu",
    mobile: "+91 99887 65432",
    createdBy: "Admin Superuser",
  },
  {
    id: "4",
    department: "Civil Engineering",
    fullName: "Prof. Rajendra Prasad",
    email: "rajendra.prasad@college.edu",
    mobile: "+91 87650 98765",
    createdBy: "Admin Superuser",
  },
  {
    id: "5",
    department: "Electrical Engineering",
    fullName: "Dr. Vikram Rathore",
    email: "vikram.rathore@college.edu",
    mobile: "+91 78901 23456",
    createdBy: "Admin Superuser",
  },
];

const emptyForm = {
  department: "",
  fullName: "",
  email: "",
  mobile: "",
};

export default function HODsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [hods, setHODs] = useState(mockHODs);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewHOD, setViewHOD] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filteredHODs = hods.filter(
    (h) =>
      h.department.toLowerCase().includes(search.toLowerCase()) ||
      h.fullName.toLowerCase().includes(search.toLowerCase()) ||
      h.email.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};

    if (!form.department.trim() || form.department.trim().length < 3) {
      newErrors.department = "Department name must be at least 3 characters";
    }
    if (form.department.trim().length > 100) {
      newErrors.department = "Department name must be under 100 characters";
    }

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }
    if (form.fullName.trim().length > 100) {
      newErrors.fullName = "Full name must be under 100 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?\d{10,15}$/.test(form.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Enter a valid mobile number (10–15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newHOD = {
      id: String(hods.length + 1),
      department: form.department.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      createdBy: user?.name || "Current Admin",
    };

    setHODs([newHOD, ...hods]);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(false);
    toast.success("HOD added successfully!");
  };

  const handleDelete = (id) => {
    setHODs(hods.filter((h) => h.id !== id));
    toast.success("HOD removed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Heads of Department (HODs)</h1>
            <p className="text-muted-foreground">
              {isStudent ? "View department heads" : "Manage department heads"}
            </p>
          </div>
          {!isStudent && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add HOD
            </Button>
          )}
        </div>

        {/* Search & View Toggle */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by department, name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex border rounded-lg overflow-hidden shrink-0">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-primary text-primary-foreground rounded-none" : "rounded-none"}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("card")}
                className={viewMode === "card" ? "bg-primary text-primary-foreground rounded-none" : "rounded-none"}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Table View */}
        {viewMode === "table" ? (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Department</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHODs.map((hod) => (
                  <TableRow key={hod.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{hod.department}</TableCell>
                    <TableCell>{hod.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{hod.email}</TableCell>
                    <TableCell className="text-muted-foreground">{hod.mobile}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewHOD(hod)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isStudent && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(hod.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHODs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No HODs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHODs.map((hod) => (
              <Card key={hod.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{hod.fullName}</h3>
                <p className="text-sm font-medium text-primary mb-1">{hod.department}</p>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {hod.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {hod.mobile}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setViewHOD(hod)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  {!isStudent && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {filteredHODs.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No HODs found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add HOD Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New HOD</DialogTitle>
            <DialogDescription>
              Enter details of the new Head of Department.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="e.g. Computer Science & Engineering"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
              {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="e.g. Dr. Arvind Kumar Singh"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                placeholder="+91 98290 12345"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
              {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
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
            <Button onClick={handleSubmit}>Add HOD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View HOD Dialog */}
      <Dialog open={!!viewHOD} onOpenChange={() => setViewHOD(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewHOD?.fullName}</DialogTitle>
            <DialogDescription>Head of Department Information</DialogDescription>
          </DialogHeader>
          {viewHOD && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Department</p>
                <p className="text-muted-foreground">{viewHOD.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{viewHOD.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-muted-foreground">{viewHOD.mobile}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created By</p>
                <p className="text-muted-foreground">{viewHOD.createdBy}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewHOD(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}