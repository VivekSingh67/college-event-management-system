import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    batch: "",
    rollNumber: "",
  });

  const [password, setPassword] = useState({ current: "", newPass: "", confirm: "" });

  // Fetch student profile if user is a student
  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ["student-me"],
    queryFn: () => apiClient.get("/api/students/me").then(res => res.data.data),
    enabled: user?.role === "student"
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
    if (studentData) {
      setFormData(prev => ({
        ...prev,
        department: studentData.department_id?.department_name || "",
        batch: studentData.batch_id?.batch_name || "",
        rollNumber: studentData.enrollment_no || ""
      }));
    }
  }, [user, studentData]);

  const updateMutation = useMutation({
    mutationFn: (data) => apiClient.put(`/api/users/${user._id}`, data),
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update profile")
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => apiClient.put("/api/auth/update-password", data),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPassword({ current: "", newPass: "", confirm: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to change password")
  });

  const handleUpdate = () => {
    updateMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
  };

  const handlePasswordChange = () => {
    if (password.newPass !== password.confirm) {
      return toast.error("Passwords do not match");
    }
    passwordMutation.mutate({
      currentPassword: password.current,
      newPassword: password.newPass
    });
  };

  if (studentLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile</p>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {formData.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">{formData.name}</h3>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-card-foreground font-display">Personal Information</h3>
            <div className="grid gap-4 mt-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  />
                </div>
                {user?.role === "student" && (
                  <div className="grid gap-2">
                    <Label>Enrollment No.</Label>
                    <Input value={formData.rollNumber} disabled />
                  </div>
                )}
              </div>
              {user?.role === "student" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Department</Label>
                    <Input value={formData.department} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Batch</Label>
                    <Input value={formData.batch} disabled />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-card-foreground font-display">Change Password</h3>
            <div className="grid gap-4 mt-3">
              <div className="grid gap-2">
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  value={password.current} 
                  onChange={(e) => setPassword({ ...password, current: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    value={password.newPass} 
                    onChange={(e) => setPassword({ ...password, newPass: e.target.value })} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Confirm Password</Label>
                  <Input 
                    type="password" 
                    value={password.confirm} 
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })} 
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={handlePasswordChange}
                disabled={passwordMutation.isPending}
              >
                {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
