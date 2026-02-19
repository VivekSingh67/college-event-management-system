import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  Shield,
  Edit3,
  Save,
  Lock,
  Camera,
  Award,
  Calendar,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

const roleLabels = {
  super_admin: { label: "Super Admin", color: "bg-primary/10 text-primary border-0" },
  branch_admin: { label: "Branch Admin", color: "bg-chart-2/10 text-chart-2 border-0" },
  hod: { label: "HOD", color: "bg-warning/10 text-warning border-0" },
  student: { label: "Student", color: "bg-success/10 text-success border-0" },
};

const activityLog = [
  { action: "Registered for Hackathon 3.0", date: "Feb 12, 2026" },
  { action: "Submitted feedback for Tech Fest", date: "Feb 10, 2026" },
  { action: "Profile information updated", date: "Feb 5, 2026" },
  { action: "Applied for Cultural Night", date: "Feb 1, 2026" },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91 98765 43210",
    address: "123, College Road, Mumbai, Maharashtra",
    bio: "Passionate about technology and innovation.",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const roleInfo = roleLabels[user?.role || "student"];

  const handleSaveProfile = () => {
    setEditing(false);
    toast({
      title: "Profile Updated ✓",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleChangePassword = () => {
    if (!passwords.current) {
      toast({
        title: "Error",
        description: "Enter current password.",
        variant: "destructive",
      });
      return;
    }
    if (passwords.newPass.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setPasswords({ current: "", newPass: "", confirm: "" });
    toast({
      title: "Password Changed ✓",
      description: "Your password has been updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Hero Card */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="h-24 gradient-primary" />
          <div className="px-6 pb-6 relative">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-background">
                  <span className="text-2xl font-bold text-primary">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full gradient-primary flex items-center justify-center shadow-md">
                  <Camera className="h-3.5 w-3.5 text-white" />
                </button>
              </div>

              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="gradient-primary border-0 gap-1"
                      onClick={handleSaveProfile}
                    >
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setEditing(true)}
                  >
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <Badge className={roleInfo.color}>
                  <Shield className="h-3 w-3 mr-1" />
                  {roleInfo.label}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                {user?.branch && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" /> {user.branch}
                  </span>
                )}
                {user?.department && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" /> {user.department}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats - only for students */}
        {user?.role === "student" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Events Applied", value: "7", icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
              { label: "Approved", value: "5", icon: Award, color: "text-success", bg: "bg-success/10" },
              { label: "Pending", value: "1", icon: Calendar, color: "text-warning", bg: "bg-warning/10" },
              { label: "Certificates", value: "4", icon: Award, color: "text-chart-2", bg: "bg-chart-2/10" },
            ].map((stat, index) => (
              <Card key={index} className="p-4 border-0 shadow-card text-center">
                <div
                  className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        )}

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Card className="p-6 border-0 shadow-card space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Email Address</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={!editing}
                    className="mt-1"
                    type="email"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Branch</Label>
                  <Input value={user?.branch || "N/A"} disabled className="mt-1" />
                </div>

                {user?.department && (
                  <div>
                    <Label>Department</Label>
                    <Input value={user.department} disabled className="mt-1" />
                  </div>
                )}

                <div className={user?.department ? "" : "sm:col-span-2"}>
                  <Label>Role</Label>
                  <Input value={roleInfo.label} disabled className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Bio</Label>
                  <Input
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <Card className="p-6 border-0 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </div>

              <Separator className="mb-5" />

              <div className="space-y-4 max-w-sm">
                <div>
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    placeholder="Repeat new password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <Button className="gradient-primary border-0 w-full" onClick={handleChangePassword}>
                  Update Password
                </Button>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold text-foreground mb-1">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Once you logout, you will need to sign in again.
                </p>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={logout}
                >
                  Logout from Account
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card className="border-0 shadow-card divide-y divide-border">
              {activityLog.map((log, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.date}</p>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}