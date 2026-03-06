import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
import { createDepartment } from "../services/departmentService";
import { getBranches } from "../services/branchService";
import { getAdminData } from "../services/adminService";

const mockDepartments = [
  {
    id: "1",
    departmentName: "Computer Science & Engineering",
    departmentDescription:
      "Focuses on software development, AI, data science and systems",
    branch: "CSE",
    admin: "Prof. Rajesh Mehta",
    createdBy: "Prof. Rajesh Mehta",
  },
  {
    id: "2",
    departmentName: "Electronics & Communication",
    departmentDescription:
      "VLSI, embedded systems, communication networks & signal processing",
    branch: "ECE",
    admin: "Dr. Sunita Verma",
    createdBy: "Dr. Sunita Verma",
  },
  {
    id: "3",
    departmentName: "Mechanical Engineering",
    departmentDescription:
      "Thermodynamics, manufacturing, robotics and automobile engineering",
    branch: "Mechanical",
    admin: "Prof. Anjali Desai",
    createdBy: "Prof. Anjali Desai",
  },
  {
    id: "4",
    departmentName: "Civil Engineering",
    departmentDescription:
      "Structural engineering, geotechnical, transportation & environmental",
    branch: "Civil",
    admin: "Dr. Manoj Kapoor",
    createdBy: "Dr. Manoj Kapoor",
  },
  {
    id: "5",
    departmentName: "Information Technology",
    departmentDescription:
      "Web technologies, cloud computing, cybersecurity and databases",
    branch: "IT",
    admin: "Adv. Priya Sharma",
    createdBy: "Adv. Priya Sharma",
  },
];

const emptyForm = {
  departmentName: "",
  departmentDescription: "",
  branch: "",
  admin: "",
};

export default function DepartmentsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [departments, setDepartments] = useState(mockDepartments);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Branch options
  // const branchOptions = [
  //   { value: "CSE", label: "Computer Science & Engineering" },
  //   { value: "ECE", label: "Electronics & Communication Engineering" },
  //   { value: "Mechanical", label: "Mechanical Engineering" },
  //   { value: "Civil", label: "Civil Engineering" },
  //   { value: "IT", label: "Information Technology" },
  //   { value: "EEE", label: "Electrical & Electronics Engineering" },
  //   { value: "AI", label: "Artificial Intelligence & Data Science" },
  // ];

  const filteredDepartments = departments.filter(
    (d) =>
      d.departmentName.toLowerCase().includes(search.toLowerCase()) ||
      d.departmentDescription.toLowerCase().includes(search.toLowerCase()) ||
      d.branch?.toLowerCase().includes(search.toLowerCase()) ||
      d.admin?.toLowerCase().includes(search.toLowerCase()),
  );

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
      !form.departmentDescription.trim() ||
      form.departmentDescription.trim().length < 5
    ) {
      newErrors.departmentDescription =
        "Description must be at least 5 characters";
    }
    if (form.departmentDescription.trim().length > 300) {
      newErrors.departmentDescription =
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
  }, []);

  const fetchBranch = async () => {
    const res = await getBranches();
    setBranchOptions(res.data.branch)
  };

  const fetchAdmin = async () => {
    const res = await getAdminData();
    setAdminOptions(res.data.admin);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newDepartment = {
      departmentName: form.departmentName.trim(),
      departmentDescription: form.departmentDescription.trim(),
      branchId: form.branch,
      adminId: form.admin,
    };

console.log(newDepartment)
    await createDepartment(newDepartment);
    setDepartments([newDepartment, ...departments]);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(false);
    toast.success("Department added successfully!");
  };

  const handleEditClick = (dept) => {
    setEditingDepartment(dept);
    setForm({
      departmentName: dept.departmentName,
      departmentDescription: dept.departmentDescription,
      branch: dept.branch,
      admin: dept.admin,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!validateForm()) return;

    const updatedDepartments = departments.map((dept) =>
      dept.id === editingDepartment.id
        ? {
            ...dept,
            departmentName: form.departmentName.trim(),
            departmentDescription: form.departmentDescription.trim(),
            branch: form.branch,
            admin: form.admin,
          }
        : dept,
    );

    setDepartments(updatedDepartments);
    setForm(emptyForm);
    setErrors({});
    setEditDialogOpen(false);
    setEditingDepartment(null);
    toast.success("Department updated successfully!");
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter((d) => d.id !== id));
    toast.success("Department deleted");
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

        {/* Search & View Toggle */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description, branch or admin..."
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
                  <TableRow key={dept.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {dept.departmentName}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {dept.branch}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{dept.admin}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {dept.departmentDescription}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {dept.createdBy}
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
                              onClick={() => handleDelete(dept.id)}
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
                key={dept.id}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                    {dept.branch}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {dept.departmentName}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {dept.departmentDescription}
                </p>
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-muted-foreground">
                    Admin:{" "}
                    <span className="font-medium text-foreground">
                      {dept.admin}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created by:{" "}
                    <span className="font-medium text-foreground">
                      {dept.createdBy}
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
              <Select
                value={form.branch}
                onValueChange={(value) => setForm({ ...form, branch: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((option) => (
                    <SelectItem key={option._id} value={option._id}>
                      {option.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && (
                <p className="text-sm text-destructive">{errors.branch}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin">Department Admin *</Label>
              <Select
                value={form.admin}
                onValueChange={(value) => setForm({ ...form, admin: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select admin" />
                </SelectTrigger>
                <SelectContent>
                  {adminOptions.map((option) => (
                    <SelectItem key={option._id} value={option.userId._id}>
                      {option.fullname.firstname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                value={form.departmentDescription}
                onChange={(e) =>
                  setForm({ ...form, departmentDescription: e.target.value })
                }
              />
              {errors.departmentDescription && (
                <p className="text-sm text-destructive">
                  {errors.departmentDescription}
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
              <Select
                value={form.branch}
                onValueChange={(value) => setForm({ ...form, branch: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((option) => (
                    <SelectItem key={option._id} value={option._id}>
                      {option.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && (
                <p className="text-sm text-destructive">{errors.branch}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-admin">Department Admin *</Label>
              <Select
                value={form.admin}
                onValueChange={(value) => setForm({ ...form, admin: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select admin" />
                </SelectTrigger>
                <SelectContent>
                  {adminOptions.map((option) => (
                     <SelectItem key={option._id} value={option.userId._id}>
                      {option.fullname.firstname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                value={form.departmentDescription}
                onChange={(e) =>
                  setForm({ ...form, departmentDescription: e.target.value })
                }
              />
              {errors.departmentDescription && (
                <p className="text-sm text-destructive">
                  {errors.departmentDescription}
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
                      {viewDepartment.branch}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-muted-foreground font-medium">
                    {viewDepartment.admin}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-muted-foreground">
                  {viewDepartment.departmentDescription}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created By</p>
                <p className="text-muted-foreground">
                  {viewDepartment.createdBy}
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
