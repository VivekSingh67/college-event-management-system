import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "College Event Management System",
    adminEmail: "admin@college.edu",
    timezone: "Asia/Kolkata",
    emailNotifications: true,
    autoApproval: false,
    maxRegistrations: "500",
    certificateTemplate: "default",
    maintenanceMode: false,
  });

  const update = (key, value) => setSettings({ ...settings, [key]: value });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">System settings and configuration</p>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground font-display">General</h3>
            <Separator className="my-3" />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Platform Name</Label>
                <Input value={settings.platformName} onChange={(e) => update("platformName", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Admin Email</Label>
                <Input type="email" value={settings.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <Select value={settings.timezone} onValueChange={(v) => update("timezone", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-card-foreground font-display">Events</h3>
            <Separator className="my-3" />
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-approve Events</Label>
                  <p className="text-xs text-muted-foreground">Skip approval workflow for new events</p>
                </div>
                <Switch checked={settings.autoApproval} onCheckedChange={(v) => update("autoApproval", v)} />
              </div>
              <div className="grid gap-2">
                <Label>Max Registrations per Event</Label>
                <Input type="number" value={settings.maxRegistrations} onChange={(e) => update("maxRegistrations", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Certificate Template</Label>
                <Select value={settings.certificateTemplate} onValueChange={(v) => update("certificateTemplate", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-card-foreground font-display">Notifications</h3>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Send email alerts for important events</p>
              </div>
              <Switch checked={settings.emailNotifications} onCheckedChange={(v) => update("emailNotifications", v)} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-card-foreground font-display">System</h3>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">Take the platform offline for maintenance</p>
              </div>
              <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => update("maintenanceMode", v)} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => toast.success("Settings saved successfully")}>Save Settings</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
