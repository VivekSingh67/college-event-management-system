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
  MapPin,
  Globe,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  createBranches,
  getBranches,
  updateBranch,
  deleteBranch,
} from "../services/branchService";

const emptyForm = {
  branchName: "",
  city: "",
  address: "",
};

export default function BranchesPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewBranch, setViewBranch] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const filteredBranches = branches.filter((b) => {
    if (!b?.branchName || !b?.city || !b?.address) return false;
    const searchLower = search.toLowerCase();
    return (
      b.branchName.toLowerCase().includes(searchLower) ||
      b.city.toLowerCase().includes(searchLower) ||
      b.address.toLowerCase().includes(searchLower)
    );
  });

  // Initial data fetch
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const res = await getBranches();
      // Handle different response structures
      const branchesData = res.data.branch || res.data || [];
      setBranches(branchesData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch branches");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.branchName.trim() || form.branchName.trim().length < 3) {
      newErrors.branchName = "Branch name must be at least 3 characters";
    } else if (form.branchName.trim().length > 100) {
      newErrors.branchName = "Branch name must be under 100 characters";
    }

    if (!form.city.trim() || form.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters";
    } else if (form.city.trim().length > 50) {
      newErrors.city = "City must be under 50 characters";
    }

    if (!form.address.trim() || form.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    } else if (form.address.trim().length > 200) {
      newErrors.address = "Address must be under 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBranch = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await createBranches({
        branchName: form.branchName.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
      });
      
      // Refetch all branches to get proper data from API
      await fetchBranches();
      
      setForm(emptyForm);
      setErrors({});
      setDialogOpen(false);
      toast.success("Branch added successfully!");
      
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add branch");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBranch = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await updateBranch(editingBranch._id, {
        branchName: form.branchName.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
      });
      
      // Refetch all branches to get proper data from API
      await fetchBranches();
      
      setForm(emptyForm);
      setEditingBranch(null);
      setErrors({});
      setDialogOpen(false);
      toast.success("Branch updated successfully!");
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update branch");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteBranch(id);
      
      // Refetch all branches to get updated list
      await fetchBranches();
      
      toast.success("Branch deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Could not delete branch");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (branch) => {
    setEditingBranch(branch);
    setForm({
      branchName: branch.branchName,
      city: branch.city,
      address: branch.address,
    });
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingBranch(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingBranch(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleSubmit = () => {
    if (editingBranch) {
      handleUpdateBranch();
    } else {
      handleAddBranch();
    }
  };

  // Helper function to get creator name safely (handles different data structures)
  const getCreatorName = (branch) => {
    try {
      // If no createdBy at all
      if (!branch?.createdBy) return 'Unknown';
      
      const createdBy = branch.createdBy;
      
      // Case 1: createdBy has fullname object with firstname
      if (createdBy.fullname?.firstname) {
        return createdBy.fullname.firstname;
      }
      
      // Case 2: createdBy has direct name property
      if (createdBy.name) {
        return createdBy.name;
      }
      
      // Case 3: createdBy has firstName property
      if (createdBy.firstName) {
        return createdBy.firstName;
      }
      
      // Case 4: createdBy is just a string (user ID)
      if (typeof createdBy === 'string') {
        return 'User';
      }
      
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  // Helper function to get full creator info safely
  const getCreatorInfo = (branch) => {
    try {
      if (!branch?.createdBy) return 'Unknown';
      
      const createdBy = branch.createdBy;
      
      // Case 1: Fullname object structure
      if (createdBy.fullname) {
        const firstName = createdBy.fullname.firstname || '';
        const lastName = createdBy.fullname.lastname || '';
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        } else if (firstName) {
          return firstName;
        }
      }
      
      // Case 2: Direct name property
      if (createdBy.name) {
        return createdBy.name;
      }
      
      // Case 3: Direct firstName/lastName
      if (createdBy.firstName) {
        if (createdBy.lastName) {
          return `${createdBy.firstName} ${createdBy.lastName}`;
        }
        return createdBy.firstName;
      }
      
      // Case 4: Email only
      if (createdBy.email) {
        return createdBy.email;
      }
      
      // Case 5: String ID
      if (typeof createdBy === 'string') {
        return 'User';
      }
      
      return 'Unknown';
    } catch (error) {
      console.error("Error in getCreatorInfo:", error);
      return 'Unknown';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Branches</h1>
            <p className="text-muted-foreground">
              {isStudent ? "View college branches" : "Manage college branches"}
            </p>
          </div>
          {!isStudent && (
            <Button 
              onClick={handleAddClick} 
              className="gap-2"
              disabled={isLoading}
            >
              <PlusCircle className="h-4 w-4" /> Add Branch
            </Button>
          )}
        </div>

        {/* Search & View Toggle */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>

            <div className="flex border rounded-lg overflow-hidden shrink-0">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                disabled={isLoading}
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
                disabled={isLoading}
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-muted-foreground">Loading branches...</p>
          </div>
        )}

        {/* Table View */}
        {!isLoading && viewMode === "table" && (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Branch Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <TableRow key={branch._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {branch.branchName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {branch.city}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {branch.address}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getCreatorName(branch)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewBranch(branch)}
                          disabled={isLoading}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isStudent && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(branch)}
                              disabled={isLoading}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(branch._id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBranches.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No branches found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Card View */}
        {!isLoading && viewMode === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBranches.map((branch) => (
              <Card
                key={branch._id}
                className="p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {branch.branchName}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{branch.city}</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Globe className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>
                    Created by:{" "}
                    <span className="font-medium">{getCreatorInfo(branch)}</span>
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setViewBranch(branch)}
                    disabled={isLoading}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  {!isStudent && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditClick(branch)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {filteredBranches.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No branches found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Branch Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBranch ? "Edit Branch" : "Add New Branch"}
            </DialogTitle>
            <DialogDescription>
              {editingBranch 
                ? "Update the branch information below." 
                : "Enter the branch details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch Name *</Label>
              <Input
                id="branch-name"
                placeholder="e.g. Engineering"
                value={form.branchName}
                onChange={(e) =>
                  setForm({ ...form, branchName: e.target.value })
                }
                disabled={isLoading}
              />
              {errors.branchName && (
                <p className="text-sm text-destructive">{errors.branchName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Full address of the branch..."
                rows={3}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">Loading...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                </>
              ) : (
                editingBranch ? "Update Branch" : "Add Branch"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Branch Dialog */}
      <Dialog open={!!viewBranch} onOpenChange={() => setViewBranch(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewBranch?.branchName}</DialogTitle>
            <DialogDescription>Branch Information</DialogDescription>
          </DialogHeader>
          {viewBranch && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">City</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {viewBranch.city}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Address</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {viewBranch.address}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created By</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {getCreatorInfo(viewBranch)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewBranch(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}