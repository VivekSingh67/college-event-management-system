import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
  Building2,
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { createDepartment, getDepartmentData, updateDepartment, deleteDepartment } from "../services/departmentService";
import { getBranches } from "../services/branchService";
import { getAdminData } from "../services/adminService";

const emptyForm = {
  departmentName: "",
  description: "",
  branch: "",
  admin: "",
};

// Helper function to safely get admin name
const getAdminName = (admin) => {
  if (!admin || !admin.fullname) return 'N/A';
  const firstName = admin.fullname.firstname || '';
  const lastName = admin.fullname.lastname || '';
  return `${firstName} ${lastName}`.trim() || 'N/A';
};

// Helper function to safely get created by name
const getCreatedByName = (createdBy) => {
  if (!createdBy || !createdBy.fullname) return 'N/A';
  const firstName = createdBy.fullname.firstname || '';
  const lastName = createdBy.fullname.lastname || '';
  return `${firstName} ${lastName}`.trim() || 'N/A';
};

export default function DepartmentsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Filter departments based on search and selected branch
  const filteredDepartments = departments.filter((d) => {
    const matchesSearch =
      d.departmentName?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()) ||
      d.branch?.toLowerCase().includes(search.toLowerCase()) ||
      d.admin?.toLowerCase().includes(search.toLowerCase());

    const matchesBranch = selectedBranch === "all" || d.branchId?._id === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.departmentName.trim() || form.departmentName.trim().length < 3) {
      newErrors.departmentName =
        "Department name must be at least 3 characters";
    }
    if (form.departmentName.trim().length > 100) {
      newErrors.departmentName = "Department name must be under 100 characters";
    }

    if (
      !form.description.trim() ||
      form.description.trim().length < 5
    ) {
      newErrors.description =
        "Description must be at least 5 characters";
    }
    if (form.description.trim().length > 300) {
      newErrors.description =
        "Description must be under 300 characters";
    }

    if (!form.branch) {
      newErrors.branch = "Please select a branch";
    }

    if (!form.admin) {
      newErrors.admin = "Please select an admin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchAdmin();
    fetchBranch();
    fetchDepartment();
  }, []);

  const fetchBranch = async () => {
    try {
      const res = await getBranches();
      setBranchOptions(res.data.branch);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to load branches");
    }
  };

  const fetchAdmin = async () => {
    try {
      const res = await getAdminData();
      setAdminOptions(res.data.admin);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins");
    }
  };

  const fetchDepartment = async () => {
    try {
      const res = await getDepartmentData();
      setDepartments(res.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newDepartment = {
      departmentName: form.departmentName.trim(),
      description: form.description.trim(),
      branchId: form.branch,
      adminId: form.admin,
    };

    try {
      await createDepartment(newDepartment);
      await fetchDepartment(); // Refresh the entire list from server
      setForm(emptyForm);
      setErrors({});
      setDialogOpen(false);
      toast.success("Department added successfully!");
    } catch (error) {
      console.error("Create error:", error);
      toast.error("Failed to add department. Please try again.");
    }
  };

  const handleEditClick = (dept) => {
    setEditingDepartment(dept);
    setForm({
      departmentName: dept.departmentName,
      description: dept.description,
      branch: dept.branchId?._id || dept.branchId,
      admin: dept.adminId?._id || dept.adminId,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const updatedData = {
        departmentName: form.departmentName.trim(),
        description: form.description.trim(),
        branchId: form.branch,
        adminId: form.admin,
      };

      // Call the API to update the department
      await updateDepartment(editingDepartment._id, updatedData);

      // Refresh the departments list from the server
      await fetchDepartment();

      // Reset form and close dialog
      setForm(emptyForm);
      setErrors({});
      setEditDialogOpen(false);
      setEditingDepartment(null);

      toast.success("Department updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update department. Please try again.");
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }
    
    try {
      await deleteDepartment(dept._id);
      await fetchDepartment(); // Refresh the list after deletion
      toast.success("Department deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete department. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground">
              {isStudent
                ? "View college departments"
                : "Manage college departments"}
            </p>
          </div>
          {!isStudent && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Department
            </Button>
          )}
        </div>

        {/* Search & Branch Filter */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description, branch or admin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Branch Filter Dropdown */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full sm:w-48 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Branches</option>
              {branchOptions.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.branchName}
                </option>
              ))}
            </select>

            {/* View Toggle */}
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

          {/* Active Filter Indicator */}
          {selectedBranch !== "all" && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filter:</span>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                {branchOptions.find(b => b._id === selectedBranch)?.branchName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBranch("all")}
                className="h-6 px-2 text-xs"
              >
                Clear filter
              </Button>
            </div>
          )}
        </Card>

        {/* Table View */}
        {viewMode === "table" ? (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Department Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {dept.departmentName}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {dept.branchId?.branchName || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getAdminName(dept.adminId)}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {dept.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getCreatedByName(dept.createdBy)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewDepartment(dept)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isStudent && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(dept)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(dept)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDepartments.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No departments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => (
              <Card
                key={dept._id}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                    {dept.branchId?.branchName || 'N/A'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {dept.departmentName}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {dept.description}
                </p>
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-muted-foreground">
                    Admin:{" "}
                    <span className="font-medium text-foreground">
                      {getAdminName(dept.adminId)}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created by:{" "}
                    <span className="font-medium text-foreground">
                      {getCreatedByName(dept.createdBy)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setViewDepartment(dept)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  {!isStudent && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditClick(dept)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {filteredDepartments.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No departments found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Department Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Enter the department details including branch and admin
              information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="department-name">Department Name *</Label>
              <Input
                id="department-name"
                placeholder="e.g. Computer Science & Engineering"
                value={form.departmentName}
                onChange={(e) =>
                  setForm({ ...form, departmentName: e.target.value })
                }
              />
              {errors.departmentName && (
                <p className="text-sm text-destructive">
                  {errors.departmentName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <select
                id="branch"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select branch</option>
                {branchOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.branchName}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="text-sm text-destructive">{errors.branch}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin">Department Admin *</Label>
              <select
                id="admin"
                value={form.admin}
                onChange={(e) => setForm({ ...form, admin: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select admin</option>
                {adminOptions.map((option) => (
                  <option key={option._id} value={option.userId?._id}>
                    {option.fullname?.firstname || ''} {option.fullname?.lastname || ''}
                  </option>
                ))}
              </select>
              {errors.admin && (
                <p className="text-sm text-destructive">{errors.admin}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department-desc">Description *</Label>
              <Textarea
                id="department-desc"
                placeholder="Brief description about the department..."
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
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
            <Button onClick={handleSubmit}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-department-name">Department Name *</Label>
              <Input
                id="edit-department-name"
                placeholder="e.g. Computer Science & Engineering"
                value={form.departmentName}
                onChange={(e) =>
                  setForm({ ...form, departmentName: e.target.value })
                }
              />
              {errors.departmentName && (
                <p className="text-sm text-destructive">
                  {errors.departmentName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-branch">Branch *</Label>
              <select
                id="edit-branch"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select branch</option>
                {branchOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.branchName}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="text-sm text-destructive">{errors.branch}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-admin">Department Admin *</Label>
              <select
                id="edit-admin"
                value={form.admin}
                onChange={(e) => setForm({ ...form, admin: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select admin</option>
                {adminOptions.map((option) => (
                  <option key={option._id} value={option.userId?._id}>
                    {option.fullname?.firstname || ''} {option.fullname?.lastname || ''}
                  </option>
                ))}
              </select>
              {errors.admin && (
                <p className="text-sm text-destructive">{errors.admin}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-department-desc">Description *</Label>
              <Textarea
                id="edit-department-desc"
                placeholder="Brief description about the department..."
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingDepartment(null);
                setForm(emptyForm);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Department Dialog */}
      <Dialog
        open={!!viewDepartment}
        onOpenChange={() => setViewDepartment(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewDepartment?.departmentName}</DialogTitle>
            <DialogDescription>Department Information</DialogDescription>
          </DialogHeader>
          {viewDepartment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Branch</p>
                  <p className="text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {viewDepartment.branchId?.branchName || 'N/A'}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-muted-foreground font-medium">
                    {getAdminName(viewDepartment.adminId)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-muted-foreground">
                  {viewDepartment.description}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created By</p>
                <p className="text-muted-foreground">
                  {getCreatedByName(viewDepartment.createdBy)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDepartment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}