import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function GenericDashboardPage({ title, description }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="bg-card rounded-xl p-12 shadow-card border border-border text-center">
          <p className="text-muted-foreground">This page is under development.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
