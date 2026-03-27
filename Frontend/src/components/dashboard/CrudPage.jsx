import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { resourceRegistry } from "@/redux/resourceRegistry";

/**
 * CrudPage — FULLY REDUX BACKED.
 *
 * This version replaces React Query (useQuery/useMutation) with Redux Toolkit.
 * It uses the `fetchUrl` to look up corresponding actions/selectors in the `resourceRegistry`.
 * Components (CollegesPage, EventsPage, etc.) remain UNCHANGED.
 */
export default function CrudPage({ 
  title, 
  description, 
  columns, 
  fields, 
  fetchUrl, 
  readOnly = false, 
  hideAdd = false,
  addLabel,
  initialData = [] 
}) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({});

  // 1. Resolve Redux Resource for this page
  // fetchUrl usually looks like "/api/colleges"
  const resourceKey = fetchUrl?.replace(/^\/api\//, "");
  const resource = resourceRegistry[resourceKey];

  // 2. Main data selection from Redux
  const reduxData = useSelector((state) => (resource ? resource.selector(state) : null));
  const isLoading = reduxData?.isLoading || false;
  const error = reduxData?.error || null;
  const dataList = reduxData?.list || initialData;

  // 3. Select Options mapping for dropdowns (Dynamic based on fields)
  // Each field with optionsUrl is mapped to a Redux resource
  const allState = useSelector((state) => state);
  const getOptions = (field) => {
    if (field.options) return field.options.map(o => typeof o === "string" ? { label: o, value: o } : o);
    
    const optResourceKey = field.optionsUrl?.replace(/^\/api\//, "");
    const optResource = resourceRegistry[optResourceKey];
    
    if (optResource) {
      const optData = optResource.selector(allState);
      const list = optData?.list || [];
      return list.map(opt => ({
        label: opt[field.optionLabel || "name"] || opt.name,
        value: opt[field.optionValue || "_id"] || opt._id
      }));
    }
    return [];
  };

  // 4. Fetch main data and dropdown options on mount
  useEffect(() => {
    if (resource?.fetch) {
      dispatch(resource.fetch());
    }

    // Prefetch options for any select field that has an optionsUrl
    fields.forEach(field => {
      if (field.type === "select" && field.optionsUrl) {
        const optResourceKey = field.optionsUrl.replace(/^\/api\//, "");
        const optResource = resourceRegistry[optResourceKey];
        if (optResource?.fetch) {
          dispatch(optResource.fetch());
        }
      }
    });
  }, [dispatch, fetchUrl, resourceKey, fields]); // Re-fetch only when necessary

  // CRUD Handlers
  const handleSave = async () => {
    if (!resource) {
      toast.error("Resource not found in registry");
      return;
    }

    let result;
    if (editId) {
      if (resource.update) {
        result = await dispatch(resource.update({ id: editId, data: formData }));
      } else if (resource.create) {
        // Fallback for some modules that use POST for everything
        result = await dispatch(resource.create(formData));
      }
    } else {
      if (resource.create) {
        result = await dispatch(resource.create(formData));
      }
    }

    if (result && !result.error) {
      setDialogOpen(false);
      // Re-fetch list to get fully populated nested data and ensure consistency
      if (resource.fetch) {
        dispatch(resource.fetch());
      }
    }
  };

  const handleDelete = async () => {
    if (resource?.delete && deleteId) {
      const result = await dispatch(resource.delete(deleteId));
      if (!result.error) {
        setDeleteOpen(false);
      }
    }
  };

  const filtered = useMemo(() => {
    return dataList.filter((row) =>
      Object.values(row).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [dataList, search]);

  const openAdd = () => {
    setEditId(null);
    const empty = {};
    fields.forEach((f) => {
      // Set default values from field definition
      if (f.defaultValue !== undefined) {
        empty[f.key] = f.defaultValue;
      } else if (f.key === "status" && f.options?.includes("active")) {
        // Default status to active if available
        empty[f.key] = "active";
      } else {
        empty[f.key] = "";
      }
    });

    // Special case for default password if requested
    if (["admins", "hods", "faculty"].includes(resourceKey)) {
      empty["password"] = "1";
    }

    setFormData(empty);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row._id);
    const initialFormData = { ...row };
    
    // Improved mapping for nested objects and flattening
    fields.forEach(f => {
      // 1. Check if the key is nested (e.g. user_id.name)
      if (f.key.includes(".")) {
        const path = f.key.split(".");
        let val = row;
        for (const segment of path) {
          val = val?.[segment];
        }
        initialFormData[f.key] = val;
      } else {
        // 2. Handle cases where the form key (e.g. "name") is nested in the data (e.g. "user_id.name")
        // Check for common patterns like user_id, college_id, etc.
        const parentKeys = ["user_id", "college_id", "branch_id", "department_id", "batch_id"];
        for (const pk of parentKeys) {
          if (row[pk] && typeof row[pk] === "object" && row[pk][f.key] !== undefined) {
            initialFormData[f.key] = row[pk][f.key];
          }
        }

        // 3. Fallback: if value is an object with _id, use the _id (for selects)
        const val = row[f.key];
        if (val && typeof val === "object" && val._id) {
          initialFormData[f.key] = val._id;
        }
      }
    });
    setFormData(initialFormData);
    setDialogOpen(true);
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
      let v = row;
      for (const k of keys) {
        v = v?.[k];
      }
      value = v;
    } else if (typeof value === "object" && value?.name) {
      value = value.name;
    }

    if (col.badge) {
      return (
        <Badge variant={badgeVariant(col, value)}>
          {value || "N/A"}
        </Badge>
      );
    }
    return value || "-";
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
            {!readOnly && !hideAdd && (
              <Button onClick={openAdd} className="gap-2">
                <Plus className="h-4 w-4" /> {addLabel || `Add ${title.replace(/s$/, "")}`}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          {isLoading && dataList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : error && dataList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-destructive">
              <p className="text-sm font-medium">Error loading data</p>
              <p className="text-xs">{error}</p>
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
                      <TableRow key={row._id || i}>
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
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            {fields.map((field) => {
              if (field.hidden) return null;
              return (
                <div key={field.key} className="grid gap-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === "select" ? (
                    <Select
                      value={String(formData[field.key] || "")}
                      onValueChange={(v) => setFormData({ ...formData, [field.key]: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getOptions(field).map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
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
              );
            })}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
            >
              {isLoading && (
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
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading && (
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
