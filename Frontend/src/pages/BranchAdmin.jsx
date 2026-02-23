import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
  UserCog,
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
import { getBranches } from "../services/branchService";
import { createAdmin } from "../services/adminService";

const mockBranchAdmins = [
  {
    id: "1",
    branch: "Engineering",
    fullName: "Prof. Rajesh Mehta",
    email: "rajesh.mehta@college.edu",
    mobile: "+91 98765 43210",
    createdBy: "Admin Superuser",
  },
  {
    id: "2",
    branch: "Science",
    fullName: "Dr. Sunita Verma",
    email: "sunita.verma@college.edu",
    mobile: "+91 87654 32109",
    createdBy: "Admin Superuser",
  },
  {
    id: "3",
    branch: "Arts & Humanities",
    fullName: "Prof. Anjali Desai",
    email: "anjali.desai@college.edu",
    mobile: "+91 76543 21098",
    createdBy: "Admin Superuser",
  },
  {
    id: "4",
    branch: "Commerce & Management",
    fullName: "Dr. Manoj Kapoor",
    email: "manoj.kapoor@college.edu",
    mobile: "+91 65432 10987",
    createdBy: "Admin Superuser",
  },
  {
    id: "5",
    branch: "Law",
    fullName: "Adv. Priya Sharma",
    email: "priya.sharma@college.edu",
    mobile: "+91 54321 09876",
    createdBy: "Admin Superuser",
  },
];

const emptyForm = {
  branch: "",
  firstname: "",
  lastname: "",
  email: "",
  mobile: "",
};

export default function BranchAdminsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [admins, setAdmins] = useState(mockBranchAdmins);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewAdmin, setViewAdmin] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchBranch();
  }, []);

  const fetchBranch = async () => {
    let res = await getBranches();
    setBranches(res.data.branch);
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.branch.toLowerCase().includes(search.toLowerCase()) ||
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  const validateForm = () => {
    const newErrors = {};

    if (!form.branch) {
      newErrors.branch = "Please select a branch";
    }

    if (!form.firstname.trim() || form.firstname.trim().length < 2) {
      newErrors.firstname = "First name must be at least 2 characters";
    }
    if (form.firstname.trim().length > 60) {
      newErrors.firstname = "First name is too long";
    }

    if (!form.lastname.trim() || form.lastname.trim().length < 2) {
      newErrors.lastname = "Last name must be at least 2 characters";
    }
    if (form.lastname.trim().length > 60) {
      newErrors.lastname = "Last name is too long";
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const adminData = {
      branchId: form.branch,
      fullname: {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
      },
      email: form.email.trim(),
      mobile: form.mobile.trim(),

    };

    console.log("Sending data:", adminData);

    let res = await createAdmin(adminData);

     console.log("Response:", res.data); 
     
    const newAdmin = res.data || res.data;

    setAdmins((prevAdmin) => [newAdmin, ...prevAdmin]);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(false);
    toast.success("Branch Admin added successfully!");
  };

  const handleDelete = (id) => {
    setAdmins(admins.filter((a) => a.id !== id));
    toast.success("Branch Admin removed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Branch Admins
            </h1>
            <p className="text-muted-foreground">
              {isStudent
                ? "View branch administrators"
                : "Manage branch administrators"}
            </p>
          </div>
          {!isStudent && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Branch Admin
            </Button>
          )}
        </div>

        {/* Search & View Toggle */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by branch, name or email..."
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
                className={
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground rounded-none"
                    : "rounded-none"
                }
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("card")}
                className={
                  viewMode === "card"
                    ? "bg-primary text-primary-foreground rounded-none"
                    : "rounded-none"
                }
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
                  <TableHead>Branch</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {admin.branch}
                    </TableCell>
                    <TableCell>{admin.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {admin.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {admin.mobile}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewAdmin(admin)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isStudent && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(admin.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAdmins.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No branch admins found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdmins.map((admin) => (
              <Card
                key={admin.id}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{admin.fullName}</h3>
                <p className="text-sm font-medium text-primary mb-1">
                  {admin.branch}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {admin.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {admin.mobile}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setViewAdmin(admin)}
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
            {filteredAdmins.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No branch admins found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Branch Admin Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Branch Admin</DialogTitle>
            <DialogDescription>
              Enter details of the new branch administrator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Branch Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <select
                id="branch"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Select Branch --</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.branchName}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="text-sm text-destructive">{errors.branch}</p>
              )}
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name *</Label>
                <Input
                  id="firstname"
                  placeholder="e.g. Rajesh"
                  value={form.firstname}
                  onChange={(e) =>
                    setForm({ ...form, firstname: e.target.value })
                  }
                />
                {errors.firstname && (
                  <p className="text-sm text-destructive">{errors.firstname}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name *</Label>
                <Input
                  id="lastname"
                  placeholder="e.g. Mehta"
                  value={form.lastname}
                  onChange={(e) =>
                    setForm({ ...form, lastname: e.target.value })
                  }
                />
                {errors.lastname && (
                  <p className="text-sm text-destructive">{errors.lastname}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                placeholder="+91 98765 43210"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
              {errors.mobile && (
                <p className="text-sm text-destructive">{errors.mobile}</p>
              )}
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
            <Button onClick={handleSubmit}>Add Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Branch Admin Dialog */}
      <Dialog open={!!viewAdmin} onOpenChange={() => setViewAdmin(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewAdmin?.fullName}</DialogTitle>
            <DialogDescription>Branch Admin Information</DialogDescription>
          </DialogHeader>
          {viewAdmin && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Branch</p>
                <p className="text-muted-foreground">{viewAdmin.branch}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{viewAdmin.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-muted-foreground">{viewAdmin.mobile}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created By</p>
                <p className="text-muted-foreground">{viewAdmin.createdBy}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewAdmin(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
