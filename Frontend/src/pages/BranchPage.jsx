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
import {
  createBranches,
  getBranches,
  updateBranch,
  deleteBranch,
} from "../services/branchService";

const emptyForm = {
  branchName: "",
  branchAddress: "",
};

export default function BranchesPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isStudent ? "card" : "table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewBranch, setViewBranch] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filteredBranches = branches.filter((b) => {
    if (!b?.branchName || !b?.branchAddress) return false;
    return (
      b.branchName.toLowerCase().includes(search.toLowerCase()) ||
      b.branchAddress.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    fetchBranches();
  }, [branches]);

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      setBranches(res.data.branch);
    } catch (error) {
      toast.error("Failed to fetch branches");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.branchName.trim() || form.branchName.trim().length < 3) {
      newErrors.branchName = "Branch name must be at least 3 characters";
    }
    if (form.branchName.trim().length > 100) {
      newErrors.branchName = "Branch name must be under 100 characters";
    }

    if (!form.branchAddress.trim() || form.branchAddress.trim().length < 5) {
      newErrors.branchAddress = "Branch address must be at least 5 characters";
    }
    if (form.branchAddress.trim().length > 200) {
      newErrors.branchAddress = "Branch address must be under 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const res = await createBranches({
        branchName: form.branchName.trim(),
        branchAddress: form.branchAddress.trim(),
      });
      setBranches((prev) => [res.data, ...prev]);
      setForm(emptyForm);
      setErrors({});
      setDialogOpen(false);
      toast.success("Branch added successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add branch");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBranch(id);
      setBranches(prev => prev.filter(b => b._id !== id));
      toast.success("Branch deleted");
    } catch (error) {
      toast.success("Could not delete branch");
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
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
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
                placeholder="Search by name or address..."
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
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <TableRow key={branch.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {branch.branchName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {branch.branchAddress}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {branch.createdBy}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewBranch(branch)}
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
                              onClick={() => handleDelete(branch._id)}
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
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No branches found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBranches.map((branch) => (
              <Card
                key={branch.id}
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
                <p className="text-sm text-muted-foreground mb-4">
                  {branch.branchAddress}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Created by:{" "}
                  <span className="font-medium">{branch.createdBy}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setViewBranch(branch)}
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
            {filteredBranches.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                No branches found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Branch Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>
              Enter the name and address of the new branch.
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
              />
              {errors.branchName && (
                <p className="text-sm text-destructive">{errors.branchName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-address">Branch Address *</Label>
              <Textarea
                id="branch-address"
                placeholder="Full address of the branch..."
                rows={3}
                value={form.branchAddress}
                onChange={(e) =>
                  setForm({ ...form, branchAddress: e.target.value })
                }
              />
              {errors.branchAddress && (
                <p className="text-sm text-destructive">
                  {errors.branchAddress}
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
            <Button onClick={handleSubmit}>Add Branch</Button>
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
                <p className="text-sm font-medium">Address</p>
                <p className="text-muted-foreground">
                  {viewBranch.branchAddress}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created By</p>
                <p className="text-muted-foreground">{viewBranch.createdBy}</p>
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
