import { useState } from "react";
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

const mockDepartments = [
  {
    id: "1",
    departmentName: "Computer Science & Engineering",
    departmentDescription: "Focuses on software development, AI, data science and systems",
    createdBy: "Prof. Rajesh Mehta",
  },
  {
    id: "2",
    departmentName: "Electronics & Communication",
    departmentDescription: "VLSI, embedded systems, communication networks & signal processing",
    createdBy: "Dr. Sunita Verma",
  },
  {
    id: "3",
    departmentName: "Mechanical Engineering",
    departmentDescription: "Thermodynamics, manufacturing, robotics and automobile engineering",
    createdBy: "Prof. Anjali Desai",
  },
  {
    id: "4",
    departmentName: "Civil Engineering",
    departmentDescription: "Structural engineering, geotechnical, transportation & environmental",
    createdBy: "Dr. Manoj Kapoor",
  },
  {
    id: "5",
    departmentName: "Information Technology",
    departmentDescription: "Web technologies, cloud computing, cybersecurity and databases",
    createdBy: "Adv. Priya Sharma",
  },
];

const emptyForm = {
  departmentName: "",
  departmentDescription: "",
};

export default function DepartmentsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [departments, setDepartments] = useState(mockDepartments);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filteredDepartments = departments.filter((d) =>
    d.departmentName.toLowerCase().includes(search.toLowerCase()) ||
    d.departmentDescription.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};

    if (!form.departmentName.trim() || form.departmentName.trim().length < 3) {
      newErrors.departmentName = "Department name must be at least 3 characters";
    }
    if (form.departmentName.trim().length > 100) {
      newErrors.departmentName = "Department name must be under 100 characters";
    }

    if (!form.departmentDescription.trim() || form.departmentDescription.trim().length < 5) {
      newErrors.departmentDescription = "Description must be at least 5 characters";
    }
    if (form.departmentDescription.trim().length > 300) {
      newErrors.departmentDescription = "Description must be under 300 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newDepartment = {
      id: String(departments.length + 1),
      departmentName: form.departmentName.trim(),
      departmentDescription: form.departmentDescription.trim(),
      createdBy: user?.name || "Current User",
    };

    setDepartments([newDepartment, ...departments]);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(false);
    toast.success("Department added successfully!");
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
            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2"
            >
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
                placeholder="Search by name or description..."
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
                  <TableHead>Department Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{dept.departmentName}</TableCell>
                    <TableCell className="text-muted-foreground">{dept.departmentDescription}</TableCell>
                    <TableCell className="text-muted-foreground">{dept.createdBy}</TableCell>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
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
              <Card key={dept.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{dept.departmentName}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {dept.departmentDescription}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Created by: <span className="font-medium">{dept.createdBy}</span>
                </p>
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
                    <Button size="sm" variant="outline" className="flex-1">
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
              Enter the name and description of the new department.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="department-name">Department Name *</Label>
              <Input
                id="department-name"
                placeholder="e.g. Computer Science & Engineering"
                value={form.departmentName}
                onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
              />
              {errors.departmentName && (
                <p className="text-sm text-destructive">{errors.departmentName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department-desc">Description *</Label>
              <Textarea
                id="department-desc"
                placeholder="Brief description about the department..."
                rows={4}
                value={form.departmentDescription}
                onChange={(e) => setForm({ ...form, departmentDescription: e.target.value })}
              />
              {errors.departmentDescription && (
                <p className="text-sm text-destructive">{errors.departmentDescription}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDialogOpen(false);
              setForm(emptyForm);
              setErrors({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Department Dialog */}
      <Dialog open={!!viewDepartment} onOpenChange={() => setViewDepartment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewDepartment?.departmentName}</DialogTitle>
            <DialogDescription>Department Information</DialogDescription>
          </DialogHeader>
          {viewDepartment && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-muted-foreground">{viewDepartment.departmentDescription}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created By</p>
                <p className="text-muted-foreground">{viewDepartment.createdBy}</p>
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