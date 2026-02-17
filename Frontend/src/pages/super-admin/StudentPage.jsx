import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
import { Users, Search, Eye, LayoutGrid, List, GraduationCap, Mail, Phone } from "lucide-react";

const mockStudents = [
  {
    id: "1",
    rollNumber: "22CS001",
    fullName: "Aarav Sharma",
    branch: "Computer Science & Engineering",
    department: "Computer Engineering",
    batch: "2022-2026",
    year: "3rd Year",
    email: "aarav.sharma@college.edu.in",
    mobileNumber: "+91-98765-43210",
    cgpa: 8.92,
    status: "Active",
  },
  {
    id: "2",
    rollNumber: "21EC045",
    fullName: "Priya Patel",
    branch: "Electronics & Communication",
    department: "Electronics Engineering",
    batch: "2021-2025",
    year: "4th Year",
    email: "priya.patel@college.edu.in",
    mobileNumber: "+91-87654-32109",
    cgpa: 9.14,
    status: "Active",
  },
  {
    id: "3",
    rollNumber: "23ME112",
    fullName: "Rahul Verma",
    branch: "Mechanical Engineering",
    department: "Mechanical Engineering",
    batch: "2023-2027",
    year: "2nd Year",
    email: "rahul.verma@college.edu.in",
    mobileNumber: "+91-76543-21098",
    cgpa: 7.68,
    status: "Active",
  },
  {
    id: "4",
    rollNumber: "20CE089",
    fullName: "Sneha Kapoor",
    branch: "Civil Engineering",
    department: "Civil Engineering",
    batch: "2020-2024",
    year: "Final Year",
    email: "sneha.kapoor@college.edu.in",
    mobileNumber: "+91-65432-10987",
    cgpa: 8.45,
    status: "Active",
  },
  {
    id: "5",
    rollNumber: "22IT067",
    fullName: "Vikram Singh",
    branch: "Information Technology",
    department: "Information Technology",
    batch: "2022-2026",
    year: "3rd Year",
    email: "vikram.singh@college.edu.in",
    mobileNumber: "+91-54321-09876",
    cgpa: 8.76,
    status: "Active",
  },
  {
    id: "6",
    rollNumber: "19CS120",
    fullName: "Neha Gupta",
    branch: "Computer Science & Engineering",
    department: "Computer Engineering",
    batch: "2019-2023",
    year: "Passout",
    email: "neha.gupta@alumni.college.edu.in",
    mobileNumber: "+91-98765-12345",
    cgpa: 9.21,
    status: "Passout",
  },
];

export default function StudentPage() {
  const { user } = useAuth();

  const [students] = useState(mockStudents);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      student.branch.toLowerCase().includes(search.toLowerCase()) ||
      student.department?.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Student Directory
          </h1>
          <p className="text-muted-foreground mt-1">
            Search and view student profiles • Branch • Department • Batch • Year
          </p>
        </div>

        {/* Search + Layout Toggle */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll no, branch, department..."
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
                    ? "bg-primary text-primary-foreground rounded-none border-r"
                    : "rounded-none border-r"
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

        {/* CARD VIEW */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                className="p-5 hover:shadow-lg transition-all duration-200 border hover:border-primary/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      student.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <h3 className="font-semibold text-xl mb-1">{student.fullName}</h3>
                <p className="text-sm text-primary font-medium mb-3">{student.rollNumber}</p>

                <div className="space-y-2 text-sm text-muted-foreground mb-5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {student.branch}
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {student.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {student.email}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Batch • Year</p>
                    <p className="font-medium">
                      {student.batch} • {student.year}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}

            {filteredStudents.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground text-lg">
                No students found matching your search
              </div>
            )}
          </div>
        ) : (
          /* TABLE VIEW */
          <Card className="overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Roll No</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-28">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/40 cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{student.branch}</TableCell>
                    <TableCell className="text-muted-foreground">{student.department}</TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          student.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No matching students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* View Student Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              {selectedStudent?.fullName}
            </DialogTitle>
            <DialogDescription>Student Profile</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Roll Number</p>
                  <p className="text-muted-foreground">{selectedStudent.rollNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CGPA</p>
                  <p className="text-muted-foreground font-bold">
                    {selectedStudent.cgpa.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Branch</p>
                  <p className="text-muted-foreground">{selectedStudent.branch}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-muted-foreground">{selectedStudent.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Batch</p>
                  <p className="text-muted-foreground">{selectedStudent.batch}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Year</p>
                  <p className="text-muted-foreground">{selectedStudent.year}</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-muted-foreground">{selectedStudent.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Mobile Number</p>
                    <p className="text-muted-foreground">{selectedStudent.mobileNumber}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium">Status</p>
                <p
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    selectedStudent.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedStudent.status}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}