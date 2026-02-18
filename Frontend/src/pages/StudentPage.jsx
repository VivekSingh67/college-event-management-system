import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
  GraduationCap,
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
  Phone,
  Mail,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

const branchOptions = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Electrical Engineering",
  "Chemical Engineering",
];

const departmentOptions = [
  "Department of Science",
  "Department of Engineering",
  "Department of Management",
  "Department of Arts",
  "Department of Commerce",
];

const batchOptions = ["2021-25", "2022-26", "2023-27", "2024-28", "2025-29"];

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const mockStudents = [
  {
    id: "1",
    rollNo: "CS2101",
    fullname: "Aarav Sharma",
    email: "aarav.sharma@college.edu",
    mobile: "9876543210",
    branch: "Computer Science & Engineering",
    department: "Department of Engineering",
    batch: "2021-25",
    year: "4th Year",
  },
  {
    id: "2",
    rollNo: "EC2205",
    fullname: "Priya Patel",
    email: "priya.patel@college.edu",
    mobile: "9823456781",
    branch: "Electronics & Communication",
    department: "Department of Engineering",
    batch: "2022-26",
    year: "3rd Year",
  },
  {
    id: "3",
    rollNo: "ME2312",
    fullname: "Rohan Verma",
    email: "rohan.verma@college.edu",
    mobile: "9712345678",
    branch: "Mechanical Engineering",
    department: "Department of Engineering",
    batch: "2023-27",
    year: "2nd Year",
  },
  {
    id: "4",
    rollNo: "IT2408",
    fullname: "Sneha Gupta",
    email: "sneha.gupta@college.edu",
    mobile: "9988776655",
    branch: "Information Technology",
    department: "Department of Engineering",
    batch: "2024-28",
    year: "1st Year",
  },
  {
    id: "5",
    rollNo: "CE2119",
    fullname: "Karan Mehta",
    email: "karan.mehta@college.edu",
    mobile: "9654321098",
    branch: "Civil Engineering",
    department: "Department of Engineering",
    batch: "2021-25",
    year: "4th Year",
  },
];

const emptyForm = {
  rollNo: "",
  fullname: "",
  email: "",
  mobile: "",
  branch: "",
  department: "",
  batch: "",
  year: "",
};

export default function StudentsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [students, setStudents] = useState(mockStudents);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filteredStudents = students.filter(
    (s) =>
      s.fullname.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};

    if (!form.rollNo.trim() || form.rollNo.trim().length < 2)
      newErrors.rollNo = "Roll No must be at least 2 characters";

    if (!form.fullname.trim() || form.fullname.trim().length < 3)
      newErrors.fullname = "Full name must be at least 3 characters";

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile))
      newErrors.mobile = "Mobile must be a 10-digit number";

    if (!form.branch) newErrors.branch = "Please select a branch";
    if (!form.department) newErrors.department = "Please select a department";
    if (!form.batch) newErrors.batch = "Please select a batch";
    if (!form.year) newErrors.year = "Please select a year";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editStudent) {
      setStudents(
        students.map((s) =>
          s.id === editStudent.id ? { ...s, ...form } : s
        )
      );
      toast.success("Student updated successfully!");
      setEditStudent(null);
    } else {
      const newStudent = {
        id: String(Date.now()),
        ...form,
      };
      setStudents([newStudent, ...students]);
      toast.success("Student added successfully!");
    }

    setForm(emptyForm);
    setErrors({});
    setDialogOpen(false);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setForm({
      rollNo: student.rollNo,
      fullname: student.fullname,
      email: student.email,
      mobile: student.mobile,
      branch: student.branch,
      department: student.department,
      batch: student.batch,
      year: student.year,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id));
    toast.success("Student deleted");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditStudent(null);
    setForm(emptyForm);
    setErrors({});
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground">
              {isStudent ? "View enrolled students" : "Manage enrolled students"}
            </p>
          </div>
          {!isStudent && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Student
            </Button>
          )}
        </div>

        {/* Search & View Toggle */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll no, email or branch..."
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
                  <TableHead>Roll No</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                    <TableCell>{student.fullname}</TableCell>
                    <TableCell className="text-muted-foreground">{student.branch}</TableCell>
                    <TableCell className="text-muted-foreground">{student.batch}</TableCell>
                    <TableCell className="text-muted-foreground">{student.year}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isStudent && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(student)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-full">
                    {student.rollNo}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{student.fullname}</h3>
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {student.email}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {student.mobile}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> {student.branch}
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                  <span className="bg-muted px-2 py-0.5 rounded">{student.batch}</span>
                  <span className="bg-muted px-2 py-0.5 rounded">{student.year}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setViewStudent(student)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  {!isStudent && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(student)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {filteredStudents.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No students found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Student Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
            <DialogDescription>
              {editStudent
                ? "Update the student's information below."
                : "Enter the details of the new student."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Row 1: Roll No + Full Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll No *</Label>
                <Input
                  id="rollNo"
                  placeholder="e.g. CS2101"
                  value={form.rollNo}
                  onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                />
                {errors.rollNo && (
                  <p className="text-sm text-destructive">{errors.rollNo}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name *</Label>
                <Input
                  id="fullname"
                  placeholder="e.g. Aarav Sharma"
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                />
                {errors.fullname && (
                  <p className="text-sm text-destructive">{errors.fullname}</p>
                )}
              </div>
            </div>

            {/* Row 2: Email + Mobile */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@college.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile *</Label>
                <Input
                  id="mobile"
                  placeholder="10-digit number"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
                {errors.mobile && (
                  <p className="text-sm text-destructive">{errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label>Branch *</Label>
              <Select
                value={form.branch}
                onValueChange={(val) => setForm({ ...form, branch: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && (
                <p className="text-sm text-destructive">{errors.branch}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                value={form.department}
                onValueChange={(val) => setForm({ ...form, department: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department}</p>
              )}
            </div>

            {/* Row 3: Batch + Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Batch *</Label>
                <Select
                  value={form.batch}
                  onValueChange={(val) => setForm({ ...form, batch: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchOptions.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.batch && (
                  <p className="text-sm text-destructive">{errors.batch}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Year *</Label>
                <Select
                  value={form.year}
                  onValueChange={(val) => setForm({ ...form, year: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year && (
                  <p className="text-sm text-destructive">{errors.year}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editStudent ? "Update Student" : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewStudent?.fullname}</DialogTitle>
            <DialogDescription>Student Information</DialogDescription>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-3 py-4">
              {[
                { label: "Roll No", value: viewStudent.rollNo },
                { label: "Email", value: viewStudent.email },
                { label: "Mobile", value: viewStudent.mobile },
                { label: "Branch", value: viewStudent.branch },
                { label: "Department", value: viewStudent.department },
                { label: "Batch", value: viewStudent.batch },
                { label: "Year", value: viewStudent.year },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewStudent(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
