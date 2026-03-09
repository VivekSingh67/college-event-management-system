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
import { getBranches } from "../services/branchService";
import { getAdminData } from "../services/adminService";
import { getDepartmentData } from "../services/departmentService";
import { 
  createHod, 
  getHodData, 
  updateHodData, 
  deleteData 
} from "../services/hodService";

const emptyForm = {
  branch: "",
  admin: "",
  department: "",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  // password field removed - will use default "1"
};

export default function HODsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [hods, setHODs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewHOD, setViewHOD] = useState(null);
  const [editingHOD, setEditingHOD] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Helper function to get full name with null check
  const getFullName = (hod) => {
    if (!hod) return "";
    if (hod.fullName) return hod.fullName;
    if (hod.fullname) {
      return `${hod.fullname.firstname || ''} ${hod.fullname.lastname || ''}`.trim();
    }
    return `${hod.firstName || hod.firstname || ''} ${hod.lastName || hod.lastname || ''}`.trim() || "Unknown";
  };

  // Combine first and last name for display and search
  const filteredHODs = hods.filter((h) => {
    if (!h) return false;
    const fullName = getFullName(h);
    const department = h.departmentName || h.department?.departmentName || h.department || '';
    const branch = h.branchName || h.branch?.branchName || h.branch || '';
    
    return (
      department.toLowerCase().includes(search.toLowerCase()) ||
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      (h.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      branch.toLowerCase().includes(search.toLowerCase())
    );
  });

  const validateForm = (isEdit = false) => {
    const newErrors = {};

    if (!form.branch) {
      newErrors.branch = "Please select a branch";
    }

    if (!form.admin) {
      newErrors.admin = "Please select an admin";
    }

    if (!form.department) {
      newErrors.department = "Please select a department";
    }

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (form.firstName.trim().length > 50) {
      newErrors.firstName = "First name must be under 50 characters";
    }

    if (form.lastName.trim() && form.lastName.trim().length > 50) {
      newErrors.lastName = "Last name must be under 50 characters";
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

  // Fetch all data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchHODs(),
        fetchBranches(),
        fetchAdmins(),
        fetchDepartments()
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchHODs = async () => {
    try {
      const res = await getHodData();
      console.log(res.data)
      // Handle different response structures
      const hodData = res.data?.data || res.data?.hods || res.data || [];
      setHODs(Array.isArray(hodData) ? hodData : []);
    } catch (error) {
      console.error("Error fetching HODs:", error);
      toast.error("Failed to load HODs");
      setHODs([]);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      const branches = res.data?.branch || res.data || [];
      setBranchOptions(Array.isArray(branches) ? branches : []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to load branches");
      setBranchOptions([]);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await getAdminData();
      const admins = res.data?.admin || res.data || [];
      setAdminOptions(Array.isArray(admins) ? admins : []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins");
      setAdminOptions([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentData();
      const departments = res.data?.data || res.data || [];
      setDepartmentOptions(Array.isArray(departments) ? departments : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
      setDepartmentOptions([]);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Prepare data for API with correct structure and default password "1"
      const hodData = {
        branchId: form.branch,
        adminId: form.admin,
        departmentId: form.department,
        fullname: {
          firstname: form.firstName.trim(),
          lastname: form.lastName.trim() || ""
        },
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        password: "1", // Default password
        role: "hod"
      };

      console.log("Submitting HOD data:", hodData); // For debugging

      const response = await createHod(hodData);
      
      // Add the new HOD to the list
      if (response.data && response.data.data) {
        setHODs([response.data.data, ...hods]);
      } else {
        // If response doesn't return the created HOD, refresh the list
        await fetchHODs();
      }
      
      setForm(emptyForm);
      setErrors({});
      setDialogOpen(false);
      toast.success("HOD added successfully! Default password: 1");
    } catch (error) {
      console.error("Error creating HOD:", error);
      toast.error(error.response?.data?.message || "Failed to create HOD");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (hod) => {
    if (!hod) return;
    
    setEditingHOD(hod);
    
    // Set form with existing values
    setForm({
      branch: hod.branchId || hod.branch || "",
      admin: hod.adminId || hod.admin || "",
      department: hod.departmentId || hod.department || "",
      firstName: hod.firstname || hod.firstName || hod.fullname?.firstname || '',
      lastName: hod.lastname || hod.lastName || hod.fullname?.lastname || '',
      email: hod.email || '',
      mobile: hod.mobile || '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!validateForm(true) || !editingHOD) return;

    setSubmitting(true);
    try {
      // Prepare updated data
      const updatedData = {
        branchId: form.branch,
        adminId: form.admin,
        departmentId: form.department,
        fullname: {
          firstname: form.firstName.trim(),
          lastname: form.lastName.trim() || ""
        },
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
      };

      const response = await updateHodData(editingHOD._id || editingHOD.id, updatedData);
      
      // Update the HOD in the list
      setHODs(hods.map((h) => 
        (h._id === editingHOD._id || h.id === editingHOD.id) 
          ? { ...h, ...updatedData, ...(response.data?.data || {}) } 
          : h
      ));
      
      setForm(emptyForm);
      setErrors({});
      setEditDialogOpen(false);
      setEditingHOD(null);
      toast.success("HOD updated successfully!");
    } catch (error) {
      console.error("Error updating HOD:", error);
      toast.error(error.response?.data?.message || "Failed to update HOD");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this HOD?")) return;

    try {
      await deleteData(id);
      setHODs(hods.filter((h) => h._id !== id && h.id !== id));
      toast.success("HOD removed successfully");
    } catch (error) {
      console.error("Error deleting HOD:", error);
      toast.error(error.response?.data?.message || "Failed to delete HOD");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditDialogOpen(false);
    setEditingHOD(null);
    setViewHOD(null);
    setForm(emptyForm);
    setErrors({});
  };

  // Helper function to get display names from IDs
  const getBranchName = (branchId) => {
    if (!branchId) return "";
    const branch = branchOptions.find(b => b._id === branchId || b.id === branchId);
    return branch?.branchName || branch?.name || branchId;
  };

  const getAdminName = (adminId) => {
    if (!adminId) return "";
    const admin = adminOptions.find(a => a._id === adminId || a.id === adminId);
    if (!admin) return adminId;
    const firstName = admin.fullname?.firstname || admin.firstName || admin.firstname || '';
    const lastName = admin.fullname?.lastname || admin.lastName || admin.lastname || '';
    return `${firstName} ${lastName}`.trim() || adminId;
  };

  const getDepartmentName = (deptId) => {
    if (!deptId) return "";
    const dept = departmentOptions.find(d => d._id === deptId || d.id === deptId);
    return dept?.departmentName || dept?.name || deptId;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading HODs...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Heads of Department (HODs)
            </h1>
            <p className="text-muted-foreground">
              {isStudent ? "View department heads" : "Manage department heads"}
            </p>
          </div>
          {!isStudent && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2" disabled={submitting}>
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
                placeholder="Search by branch, department, name or email..."
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
                  <TableHead>Department</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHODs.map((hod) => (
                  <TableRow key={hod._id || hod.id || Math.random()} className="hover:bg-muted/30">
                    <TableCell>{hod.branchName || getBranchName(hod.branchId || hod.branch)}</TableCell>
                    <TableCell className="font-medium">
                      {hod.departmentName || getDepartmentName(hod.departmentId || hod.department)}
                    </TableCell>
                    <TableCell>{getFullName(hod)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {hod.email || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {hod.mobile || '-'}
                    </TableCell>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(hod)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(hod._id || hod.id)}
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
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
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
              <Card
                key={hod._id || hod.id || Math.random()}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{getFullName(hod)}</h3>
                <p className="text-sm font-medium text-primary mb-1">
                  {hod.departmentName || getDepartmentName(hod.departmentId || hod.department)}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {hod.branchName || getBranchName(hod.branchId || hod.branch)}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {hod.email || '-'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {hod.mobile || '-'}
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(hod)}
                    >
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

      {/* Add HOD Dialog - No scroll, compact design */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md !overflow-visible">
          <DialogHeader>
            <DialogTitle>Add New HOD</DialogTitle>
            <DialogDescription>
              Enter details of the new Head of Department. Default password is <span className="font-mono font-bold">1</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="branch">Branch *</Label>
              <select
                id="branch"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select branch</option>
                {branchOptions.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="text-xs text-destructive">{errors.branch}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="admin">Admin *</Label>
              <select
                id="admin"
                value={form.admin}
                onChange={(e) => setForm({ ...form, admin: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select admin</option>
                {adminOptions.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.fullname?.firstname || admin.firstName || ''} {admin.fullname?.lastname || admin.lastName || ''}
                  </option>
                ))}
              </select>
              {errors.admin && (
                <p className="text-xs text-destructive">{errors.admin}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="department">Department *</Label>
              <select
                id="department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  className="h-9"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  className="h-9"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@college.edu"
                className="h-9"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                placeholder="+91 98290 12345"
                className="h-9"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
              {errors.mobile && (
                <p className="text-xs text-destructive">{errors.mobile}</p>
              )}
            </div>

            <div className="bg-muted/50 p-2 rounded-md">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Default Password:</span> A default password <span className="font-mono font-bold">"1"</span> will be set for this HOD.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" size="sm" onClick={handleCloseDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Adding..." : "Add HOD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit HOD Dialog - No scroll, compact design */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md !overflow-visible">
          <DialogHeader>
            <DialogTitle>Edit HOD</DialogTitle>
            <DialogDescription>
              Update the Head of Department information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="edit-branch">Branch *</Label>
              <select
                id="edit-branch"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select branch</option>
                {branchOptions.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="text-xs text-destructive">{errors.branch}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-admin">Admin *</Label>
              <select
                id="edit-admin"
                value={form.admin}
                onChange={(e) => setForm({ ...form, admin: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select admin</option>
                {adminOptions.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.fullname?.firstname || admin.firstName || ''} {admin.fullname?.lastname || admin.lastName || ''}
                  </option>
                ))}
              </select>
              {errors.admin && (
                <p className="text-xs text-destructive">{errors.admin}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-department">Department *</Label>
              <select
                id="edit-department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-firstName">First Name *</Label>
                <Input
                  id="edit-firstName"
                  placeholder="First name"
                  className="h-9"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  placeholder="Last name"
                  className="h-9"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="name@college.edu"
                className="h-9"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-mobile">Mobile Number *</Label>
              <Input
                id="edit-mobile"
                placeholder="+91 98290 12345"
                className="h-9"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
              {errors.mobile && (
                <p className="text-xs text-destructive">{errors.mobile}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" size="sm" onClick={handleCloseDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdate} disabled={submitting}>
              {submitting ? "Updating..." : "Update HOD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View HOD Dialog */}
      <Dialog open={!!viewHOD} onOpenChange={() => setViewHOD(null)}>
        <DialogContent className="max-w-md !overflow-visible">
          <DialogHeader>
            <DialogTitle>{viewHOD ? getFullName(viewHOD) : 'HOD Details'}</DialogTitle>
            <DialogDescription>
              Head of Department Information
            </DialogDescription>
          </DialogHeader>
          {viewHOD && (
            <div className="space-y-3 py-2">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Branch</p>
                <p className="text-sm">
                  {viewHOD.branchName || getBranchName(viewHOD.branchId || viewHOD.branch) || '-'}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Admin</p>
                <p className="text-sm">
                  {viewHOD.adminName || getAdminName(viewHOD.adminId || viewHOD.admin) || '-'}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Department</p>
                <p className="text-sm">
                  {viewHOD.departmentName || getDepartmentName(viewHOD.departmentId || viewHOD.department) || '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">First Name</p>
                  <p className="text-sm">
                    {viewHOD.firstname || viewHOD.firstName || viewHOD.fullname?.firstname || '-'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">Last Name</p>
                  <p className="text-sm">
                    {viewHOD.lastname || viewHOD.lastName || viewHOD.fullname?.lastname || '-'}
                  </p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{viewHOD.email || '-'}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Mobile</p>
                <p className="text-sm">{viewHOD.mobile || '-'}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Created By</p>
                <p className="text-sm">
                  {viewHOD.createdBy ? (typeof viewHOD.createdBy === 'object' ? getFullName(viewHOD.createdBy) : viewHOD.createdBy) : "System"}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Created At</p>
                <p className="text-sm">
                  {viewHOD.createdAt ? new Date(viewHOD.createdAt).toLocaleString() : '-'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="mt-2">
            <Button variant="outline" size="sm" onClick={() => setViewHOD(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}