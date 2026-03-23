import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export default function CrudPage({ 
  title, 
  description, 
  columns, 
  fields, 
  fetchUrl, 
  readOnly = false, 
  addLabel,
  initialData = [] 
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch Data
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: [fetchUrl],
    queryFn: async () => {
      const response = await apiClient.get(fetchUrl);
      return response.data;
    },
    enabled: !!fetchUrl,
  });

  const data = fetchUrl ? (apiResponse?.data || []) : initialData;

  // Fetch Options for Selects
  const optionQueries = useQueries({
    queries: fields
      .filter(f => f.type === "select" && f.optionsUrl)
      .map(f => ({
        queryKey: [f.optionsUrl],
        queryFn: async () => {
          const res = await apiClient.get(f.optionsUrl);
          return { key: f.key, data: res.data.data };
        }
      }))
  });

  const getOptions = (field) => {
    if (field.options) return field.options;
    const query = optionQueries.find(q => q.data?.key === field.key);
    if (!query?.data?.data) return [];
    return query.data.data.map(opt => ({
      label: opt[field.optionLabel || "name"] || opt.name,
      value: opt[field.optionValue || "_id"] || opt._id
    }));
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newData) => apiClient.post(fetchUrl, newData),
    onSuccess: () => {
      queryClient.invalidateQueries([fetchUrl]);
      toast.success(`${title.replace(/s$/, "")} added successfully`);
      setDialogOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || `Failed to add ${title}`),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData) => apiClient.put(`${fetchUrl}/${editId}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries([fetchUrl]);
      toast.success(`${title.replace(/s$/, "")} updated successfully`);
      setDialogOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || `Failed to update ${title}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`${fetchUrl}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries([fetchUrl]);
      toast.success(`${title.replace(/s$/, "")} deleted successfully`);
      setDeleteOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || `Failed to delete ${title}`),
  });

  const filtered = data.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const openAdd = () => {
    setEditId(null);
    const empty = {};
    fields.forEach((f) => (empty[f.key] = ""));
    setFormData(empty);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row._id);
    const initialFormData = { ...row };
    // Flatten nested objects if needed for initial display (e.g., college_id._id)
    fields.forEach(f => {
      if (typeof row[f.key] === "object" && row[f.key]?._id) {
        initialFormData[f.key] = row[f.key]._id;
      }
    });
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const badgeVariant = (col, value) => {
    if (col.badgeVariants?.[value]) return col.badgeVariants[value];
    const val = String(value).toLowerCase();
    if (["active", "approved", "completed", "resolved", "issued", "upcoming"].includes(val)) return "default";
    if (["pending", "in progress", "ongoing"].includes(val)) return "secondary";
    if (["inactive", "rejected", "cancelled"].includes(val)) return "destructive";
    return "outline";
  };

  const renderCell = (row, col) => {
    let value = row[col.key];
    
    // Handle nested display if key contains dot (like college_id.name)
    if (col.key.includes(".")) {
      const keys = col.key.split(".");
      value = row;
      for (const k of keys) {
        value = value?.[k];
      }
    } else if (typeof value === "object" && value?.name) {
      value = value.name;
    }

    if (col.badge) {
      return (
        <Badge variant={badgeVariant(col, value)}>
          {value}
        </Badge>
      );
    }
    return value;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            {!readOnly && (
              <Button onClick={openAdd} className="gap-2">
                <Plus className="h-4 w-4" /> {addLabel || `Add ${title.replace(/s$/, "")}`}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-destructive">
              <p className="text-sm font-medium">Error loading data</p>
              <p className="text-xs">{error.response?.data?.message || error.message}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.key} className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        {col.label}
                      </TableHead>
                    ))}
                    {!readOnly && (
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold text-right">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + (readOnly ? 0 : 1)} className="text-center py-8 text-muted-foreground">
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row, i) => (
                      <TableRow key={i}>
                        {columns.map((col) => (
                          <TableCell key={col.key} className="text-sm">
                            {renderCell(row, col)}
                          </TableCell>
                        ))}
                        {!readOnly && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setDeleteId(row._id);
                                  setDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Add"} {title.replace(/s$/, "")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.key} className="grid gap-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "select" ? (
                  <Select
                    value={formData[field.key] || ""}
                    onValueChange={(v) => setFormData({ ...formData, [field.key]: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {getOptions(field).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type || "text"}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSave} 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {title.replace(/s$/, "")}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
