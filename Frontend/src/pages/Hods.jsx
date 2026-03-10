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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  Filter,
  Power,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { getBranches } from "../services/branchService";
import { getAdminData } from "../services/adminService";
import { getDepartmentData } from "../services/departmentService";
import {
  createHod,
  getHodData,
  updateHodData,
  deactivateHod,
  reactivateHod, // Make sure to add this to your service
} from "../services/hodService";

const emptyForm = {
  branch: "",
  admin: "",
  department: "",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
};

export default function HODsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [hods, setHODs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");

  // Filter states
  const [branchFilter, setBranchFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewHOD, setViewHOD] = useState(null);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false); // New state
  const [selectedHOD, setSelectedHOD] = useState(null);
  const [selectedHODForReactivate, setSelectedHODForReactivate] =
    useState(null); // New state
  const [editingHOD, setEditingHOD] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deactivatedUserIds, setDeactivatedUserIds] = useState(new Set());

  // ===== HELPER FUNCTIONS =====

  // Helper function to get full name with null check
  const getFullName = (hod) => {
    if (!hod) return "";
    if (hod.fullName) return hod.fullName;
    if (hod.fullname) {
      return `${hod.fullname.firstname || ""} ${hod.fullname.lastname || ""}`.trim();
    }
    return (
      `${hod.firstName || hod.firstname || ""} ${hod.lastName || hod.lastname || ""}`.trim() ||
      "Unknown"
    );
  };

  // Helper function to get display names from IDs - ALWAYS RETURN STRING
  const getBranchName = (branchId) => {
    if (!branchId) return "";
    // Handle if branchId is an object (populated data)
    if (typeof branchId === "object" && branchId !== null) {
      return branchId.branchName || branchId.name || "";
    }
    const branch = branchOptions.find(
      (b) => b._id === branchId || b.id === branchId,
    );
    return branch?.branchName || branch?.name || branchId || "";
  };

  const getAdminName = (adminId) => {
    if (!adminId) return "";
    // Handle if adminId is an object (populated data)
    if (typeof adminId === "object" && adminId !== null) {
      const firstName =
        adminId.fullname?.firstname ||
        adminId.firstName ||
        adminId.firstname ||
        "";
      const lastName =
        adminId.fullname?.lastname ||
        adminId.lastName ||
        adminId.lastname ||
        "";
      return `${firstName} ${lastName}`.trim() || "";
    }
    const admin = adminOptions.find(
      (a) => a._id === adminId || a.id === adminId,
    );
    if (!admin) return adminId || "";
    const firstName =
      admin.fullname?.firstname || admin.firstName || admin.firstname || "";
    const lastName =
      admin.fullname?.lastname || admin.lastName || admin.lastname || "";
    return `${firstName} ${lastName}`.trim() || adminId || "";
  };

  const getDepartmentName = (deptId) => {
    if (!deptId) return "";
    // Handle if deptId is an object (populated data)
    if (typeof deptId === "object" && deptId !== null) {
      return deptId.departmentName || deptId.name || "";
    }
    const dept = departmentOptions.find(
      (d) => d._id === deptId || d.id === deptId,
    );
    return dept?.departmentName || dept?.name || deptId || "";
  };

  // Safe string converter - ensures we always render strings, not objects
  const safeString = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
      // If it's an object, try to get a string representation
      if (value.branchName) return value.branchName;
      if (value.departmentName) return value.departmentName;
      if (value.name) return value.name;
      if (value.email) return value.email;
      if (value.fullname) {
        return `${value.fullname.firstname || ""} ${value.fullname.lastname || ""}`.trim();
      }
      return JSON.stringify(value); // Fallback
    }
    return String(value);
  };

  // ===== FILTER FUNCTION =====

  // Apply all filters
  const filteredHODs = hods.filter((h) => {
    if (!h) return false;

    const fullName = getFullName(h);
    const department = safeString(
      h.departmentName || h.department?.departmentName || h.department,
    );
    const branch = safeString(h.branchName || h.branch?.branchName || h.branch);
    const admin = safeString(h.adminName || getAdminName(h.adminId || h.admin));
    const isActive = h.isActive !== false; // Default to true if not specified

    // Search filter
    const matchesSearch =
      search === "" ||
      department.toLowerCase().includes(search.toLowerCase()) ||
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      (h.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      branch.toLowerCase().includes(search.toLowerCase()) ||
      admin.toLowerCase().includes(search.toLowerCase());

    // Branch filter - handle both string IDs and object references
    const branchId =
      typeof h.branchId === "object" ? h.branchId?._id : h.branchId || h.branch;
    const matchesBranch = branchFilter === "all" || branchId === branchFilter;

    // Admin filter
    const adminId =
      typeof h.adminId === "object" ? h.adminId?._id : h.adminId || h.admin;
    const matchesAdmin = adminFilter === "all" || adminId === adminFilter;

    // Department filter
    const deptId =
      typeof h.departmentId === "object"
        ? h.departmentId?._id
        : h.departmentId || h.department;
    const matchesDepartment =
      departmentFilter === "all" || deptId === departmentFilter;

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && isActive) ||
      (statusFilter === "inactive" && !isActive);

    return (
      matchesSearch &&
      matchesBranch &&
      matchesAdmin &&
      matchesDepartment &&
      matchesStatus
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

    // Fix: Convert mobile to string before using trim()
    const mobileStr = String(form.mobile || "").trim();
    if (!mobileStr) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?\d{10,15}$/.test(mobileStr.replace(/\s/g, ""))) {
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
        fetchDepartments(),
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

      // Handle different response structures
      let hodData = [];
      if (res.data?.data) {
        hodData = res.data.data;
      } else if (res.data?.hods) {
        hodData = res.data.hods;
      } else if (Array.isArray(res.data)) {
        hodData = res.data;
      }

      // Process the data to ensure isActive is properly set
      const processedData = (Array.isArray(hodData) ? hodData : []).map(
        (hod) => {
          return {
            ...hod,
            // Ensure isActive is a boolean - check from multiple possible sources
            isActive:
              hod.isActive === true || hod.authStatus?.isActive === true,
          };
        },
      );

      setHODs(processedData);
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
          lastname: form.lastName.trim() || "",
        },
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        password: "1", // Default password
        role: "hod",
      };


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

    // Set form with existing values - ensure all values are properly converted
    setForm({
      branch: hod.branchId?._id || hod.branchId || hod.branch || "",
      admin: hod.adminId?._id || hod.adminId || hod.admin || "",
      department:
        hod.departmentId?._id || hod.departmentId || hod.department || "",
      firstName:
        hod.firstname || hod.firstName || hod.fullname?.firstname || "",
      lastName: hod.lastname || hod.lastName || hod.fullname?.lastname || "",
      email: hod.email || "",
      mobile: hod.mobile ? String(hod.mobile) : "", // Convert to string
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
          lastname: form.lastName.trim() || "",
        },
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
      };

      const response = await updateHodData(
        editingHOD._id || editingHOD.id,
        updatedData,
      );

      // Update the HOD in the list
      setHODs(
        hods.map((h) =>
          h._id === editingHOD._id || h.id === editingHOD.id
            ? { ...h, ...updatedData, ...(response.data?.data || {}) }
            : h,
        ),
      );

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

  const handleDeactivate = (hod) => {
    setSelectedHOD(hod);
    setDeactivateDialogOpen(true);
  };

  const handleReactivate = (hod) => {
    setSelectedHODForReactivate(hod);
    setReactivateDialogOpen(true);
  };

  const confirmDeactivate = async () => {
    if (!selectedHOD) return;

    setSubmitting(true);
    try {
      const userId = selectedHOD.userId || selectedHOD._id || selectedHOD.id;

      if (!userId) {
        toast.error("Invalid HOD ID");
        return;
      }

      const response = await deactivateHod(userId);

      if (response.data?.success) {
        const updatedHodData = response.data.data || {};

        // Update the specific HOD with the complete data from backend
        setHODs((prevHODs) =>
          prevHODs.map((h) => {
            const hodId = h._id || h.id || h.userId;
            const updatedHodId =
              updatedHodData._id ||
              updatedHodData.id ||
              updatedHodData.userId ||
              userId;

            if (hodId === updatedHodId || hodId === userId) {
              return {
                ...h,
                ...updatedHodData,
                isActive: false, // Explicitly set to false
              };
            }
            return h;
          }),
        );

        // Fetch fresh data to ensure consistency
        await fetchHODs();

        toast.success("HOD deactivated successfully!");
      } else {
        toast.error(response.data?.message || "Failed to deactivate HOD");
      }

      setDeactivateDialogOpen(false);
      setSelectedHOD(null);
    } catch (error) {
      console.error("Error deactivating HOD:", error);
      toast.error(error.response?.data?.message || "Failed to deactivate HOD");
    } finally {
      setSubmitting(false);
    }
  };

 const confirmReactivate = async () => {
  if (!selectedHODForReactivate) return;

  setSubmitting(true);
  try {
    const userId =
      selectedHODForReactivate.userId ||
      selectedHODForReactivate._id ||
      selectedHODForReactivate.id;

    if (!userId) {
      toast.error("Invalid HOD ID");
      return;
    }

    const response = await reactivateHod(userId);

    // Check different possible response structures
    if (response?.success) {
      // If success is directly on response
      const updatedHodData = response.data || {};
      
      // Update the HOD in the list with proper isActive flag
      setHODs((prevHODs) =>
        prevHODs.map((h) => {
          const hodId = h._id || h.id || h.userId;
          const updatedHodId =
            updatedHodData._id ||
            updatedHodData.id ||
            updatedHodData.userId ||
            userId;

          if (hodId === updatedHodId || hodId === userId) {
            return {
              ...h,
              ...updatedHodData,
              isActive: true,
            };
          }
          return h;
        }),
      );

      await fetchHODs(); // Refresh data
      toast.success("HOD reactivated successfully!");
    } 
    // Alternative response structure
    else if (response.data?.success) {
      const updatedHodData = response.data.data || {};
      
      setHODs((prevHODs) =>
        prevHODs.map((h) => {
          const hodId = h._id || h.id || h.userId;
          const updatedHodId =
            updatedHodData._id ||
            updatedHodData.id ||
            updatedHodData.userId ||
            userId;

          if (hodId === updatedHodId || hodId === userId) {
            return {
              ...h,
              ...updatedHodData,
              isActive: true,
            };
          }
          return h;
        }),
      );

      await fetchHODs();
      toast.success("HOD reactivated successfully!");
    } 
    else {
      toast.error(response?.message || response.data?.message || "Failed to reactivate HOD");
    }

    setReactivateDialogOpen(false);
    setSelectedHODForReactivate(null);
  } catch (error) {
    console.error("Error reactivating HOD:", error);
    toast.error(error.response?.data?.message || "Failed to reactivate HOD");
  } finally {
    setSubmitting(false);
  }
};

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditDialogOpen(false);
    setDeactivateDialogOpen(false);
    setReactivateDialogOpen(false);
    setEditingHOD(null);
    setSelectedHOD(null);
    setSelectedHODForReactivate(null);
    setViewHOD(null);
    setForm(emptyForm);
    setErrors({});
  };

  const clearFilters = () => {
    setBranchFilter("all");
    setAdminFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setSearch("");
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
            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2"
              disabled={submitting}
            >
              <PlusCircle className="h-4 w-4" /> Add HOD
            </Button>
          )}
        </div>

        {/* Search & Filters */}
        <Card className="p-4">
          <div className="space-y-3">
            {/* Search row with filter toggle */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by branch, department, name, email or admin..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-primary/10" : ""}
                >
                  <Filter className="h-4 w-4" />
                </Button>

                <div className="flex border rounded-lg overflow-hidden">
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
            </div>

            {/* Filter dropdowns */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <Label className="text-xs">Branch Filter</Label>
                  <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.branchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Admin Filter</Label>
                  <Select value={adminFilter} onValueChange={setAdminFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Admins" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Admins</SelectItem>
                      {adminOptions.map((admin) => (
                        <SelectItem key={admin._id} value={admin._id}>
                          {getAdminName(admin._id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Department Filter</Label>
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Status Filter</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 text-xs"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Active filters display - ENSURE STRINGS */}
            {(branchFilter !== "all" ||
              adminFilter !== "all" ||
              departmentFilter !== "all" ||
              statusFilter !== "all" ||
              search) && (
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
                <span className="font-medium">Active filters:</span>
                {search && (
                  <span className="bg-muted px-2 py-1 rounded">
                    Search: "{search}"
                  </span>
                )}
                {branchFilter !== "all" && (
                  <span className="bg-muted px-2 py-1 rounded">
                    Branch:{" "}
                    {safeString(
                      branchOptions.find((b) => b._id === branchFilter)
                        ?.branchName || branchFilter,
                    )}
                  </span>
                )}
                {adminFilter !== "all" && (
                  <span className="bg-muted px-2 py-1 rounded">
                    Admin: {safeString(getAdminName(adminFilter))}
                  </span>
                )}
                {departmentFilter !== "all" && (
                  <span className="bg-muted px-2 py-1 rounded">
                    Department:{" "}
                    {safeString(
                      departmentOptions.find((d) => d._id === departmentFilter)
                        ?.departmentName || departmentFilter,
                    )}
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="bg-muted px-2 py-1 rounded">
                    Status: {statusFilter === "active" ? "Active" : "Inactive"}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredHODs.length} of {hods.length} HODs
        </div>

        {/* Table View */}
        {viewMode === "table" ? (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Status</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHODs.map((hod) => (
                  <TableRow
                    key={hod._id || hod.id || hod.userId || Math.random()}
                    className="hover:bg-muted/30"
                  >
                    {/* Status cell */}
                    <TableCell>
                      {hod.isActive === false ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </span>
                      )}
                    </TableCell>
                    {/* ENSURE ALL CELLS RENDER STRINGS, NOT OBJECTS */}
                    <TableCell>
                      {safeString(
                        hod.branchName ||
                          getBranchName(hod.branchId || hod.branch),
                      )}
                    </TableCell>
                    <TableCell>
                      {safeString(
                        hod.adminName || getAdminName(hod.adminId || hod.admin),
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {safeString(
                        hod.departmentName ||
                          getDepartmentName(hod.departmentId || hod.department),
                      )}
                    </TableCell>
                    <TableCell>{safeString(getFullName(hod))}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {safeString(hod.email || "-")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {safeString(hod.mobile || "-")}
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
                              disabled={hod.isActive === false}
                              title={
                                hod.isActive === false
                                  ? "Cannot edit inactive HOD"
                                  : "Edit HOD"
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Show different buttons based on status */}
                            {hod.isActive ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() => handleDeactivate(hod)}
                                title="Deactivate HOD"
                              >
                                <Power className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleReactivate(hod)}
                                title="Reactivate HOD"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHODs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No HODs found matching the filters
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
                key={hod._id || hod.id || hod.userId || Math.random()}
                className={`p-5 hover:shadow-md transition-shadow ${
                  hod.isActive === false
                    ? "opacity-75 bg-gray-50 dark:bg-gray-800/50"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  {hod.isActive === false ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      Inactive
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {safeString(getFullName(hod))}
                </h3>
                <p className="text-sm font-medium text-primary mb-1">
                  {safeString(
                    hod.departmentName ||
                      getDepartmentName(hod.departmentId || hod.department),
                  )}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Branch:{" "}
                  {safeString(
                    hod.branchName || getBranchName(hod.branchId || hod.branch),
                  )}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Admin:{" "}
                  {safeString(
                    hod.adminName || getAdminName(hod.adminId || hod.admin),
                  )}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {safeString(hod.email || "-")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {safeString(hod.mobile || "-")}
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
                  {!isStudent && hod.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(hod)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  )}
                  {!isStudent && hod.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      onClick={() => handleDeactivate(hod)}
                    >
                      <Power className="h-3.5 w-3.5 mr-1" /> Deactivate
                    </Button>
                  )}
                  {!isStudent && !hod.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleReactivate(hod)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reactivate
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {filteredHODs.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No HODs found matching the filters
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add HOD Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md !overflow-visible">
          <DialogHeader>
            <DialogTitle>Add New HOD</DialogTitle>
            <DialogDescription>
              Enter details of the new Head of Department. Default password is{" "}
              <span className="font-mono font-bold">1</span>
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
                    {admin.fullname?.firstname || admin.firstName || ""}{" "}
                    {admin.fullname?.lastname || admin.lastName || ""}
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
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
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
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
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
                <span className="font-medium">Default Password:</span> A default
                password <span className="font-mono font-bold">"1"</span> will
                be set for this HOD.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseDialog}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Adding..." : "Add HOD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit HOD Dialog */}
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
                    {admin.fullname?.firstname || admin.firstName || ""}{" "}
                    {admin.fullname?.lastname || admin.lastName || ""}
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
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
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
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseDialog}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdate} disabled={submitting}>
              {submitting ? "Updating..." : "Update HOD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate HOD Dialog */}
      <Dialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-600 flex items-center gap-2">
              <Power className="h-5 w-5" />
              Deactivate HOD
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this Head of Department?
            </DialogDescription>
          </DialogHeader>
          {selectedHOD && (
            <div className="py-4">
              <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  You are about to deactivate:
                </p>
                <p className="text-lg font-semibold mt-1 text-amber-900 dark:text-amber-300">
                  {getFullName(selectedHOD)}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                  {selectedHOD.email}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-500">
                  Department:{" "}
                  {safeString(
                    selectedHOD.departmentName ||
                      getDepartmentName(
                        selectedHOD.departmentId || selectedHOD.department,
                      ),
                  )}
                </p>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Deactivating will prevent this HOD from accessing the
                    system. The HOD's data will be preserved but they won't be
                    able to log in.
                  </span>
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseDialog}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={confirmDeactivate}
              disabled={submitting}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {submitting ? "Deactivating..." : "Confirm Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reactivate HOD Dialog */}
      <Dialog
        open={reactivateDialogOpen}
        onOpenChange={setReactivateDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Reactivate HOD
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reactivate this Head of Department?
            </DialogDescription>
          </DialogHeader>
          {selectedHODForReactivate && (
            <div className="py-4">
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  You are about to reactivate:
                </p>
                <p className="text-lg font-semibold mt-1 text-green-900 dark:text-green-300">
                  {getFullName(selectedHODForReactivate)}
                </p>
                <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                  {selectedHODForReactivate.email}
                </p>
                <p className="text-sm text-green-700 dark:text-green-500">
                  Department:{" "}
                  {safeString(
                    selectedHODForReactivate.departmentName ||
                      getDepartmentName(
                        selectedHODForReactivate.departmentId ||
                          selectedHODForReactivate.department,
                      ),
                  )}
                </p>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Reactivating will restore this HOD's access to the system.
                    They will be able to log in again.
                  </span>
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseDialog}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={confirmReactivate}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {submitting ? "Reactivating..." : "Confirm Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View HOD Dialog */}
      <Dialog open={!!viewHOD} onOpenChange={() => setViewHOD(null)}>
        <DialogContent className="max-w-md !overflow-visible">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {viewHOD ? getFullName(viewHOD) : "HOD Details"}
            </DialogTitle>
            <DialogDescription>
              Head of Department Information
            </DialogDescription>
          </DialogHeader>
          {viewHOD && (
            <div className="space-y-3 py-2">
              {/* Status */}
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Status
                </p>
                <p className="text-sm">
                  {viewHOD.isActive === false ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Branch
                </p>
                <p className="text-sm">
                  {safeString(
                    viewHOD.branchName ||
                      getBranchName(viewHOD.branchId || viewHOD.branch) ||
                      "-",
                  )}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Admin
                </p>
                <p className="text-sm">
                  {safeString(
                    viewHOD.adminName ||
                      getAdminName(viewHOD.adminId || viewHOD.admin) ||
                      "-",
                  )}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Department
                </p>
                <p className="text-sm">
                  {safeString(
                    viewHOD.departmentName ||
                      getDepartmentName(
                        viewHOD.departmentId || viewHOD.department,
                      ) ||
                      "-",
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    First Name
                  </p>
                  <p className="text-sm">
                    {safeString(
                      viewHOD.firstname ||
                        viewHOD.firstName ||
                        viewHOD.fullname?.firstname ||
                        "-",
                    )}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Last Name
                  </p>
                  <p className="text-sm">
                    {safeString(
                      viewHOD.lastname ||
                        viewHOD.lastName ||
                        viewHOD.fullname?.lastname ||
                        "-",
                    )}
                  </p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm">{safeString(viewHOD.email || "-")}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Mobile
                </p>
                <p className="text-sm">{safeString(viewHOD.mobile || "-")}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Created By
                </p>
                <p className="text-sm">
                  {safeString(
                    viewHOD.createdBy
                      ? typeof viewHOD.createdBy === "object"
                        ? getFullName(viewHOD.createdBy)
                        : viewHOD.createdBy
                      : "System",
                  )}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Created At
                </p>
                <p className="text-sm">
                  {viewHOD.createdAt
                    ? new Date(viewHOD.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewHOD(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
