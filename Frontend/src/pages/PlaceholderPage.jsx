import { useLocation } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  const location = useLocation();

  // Convert pathname to title case breadcrumb style
  // Example: "/reports/sales" → "Reports > Sales"
  const pageName = location.pathname
    .slice(1)                           // remove leading "/"
    .split("/")                         // split into segments
    .map(segment =>
      segment
        .replace(/-/g, " ")             // optional: handle kebab-case
        .replace(/\b\w/g, c => c.toUpperCase())
    )
    .join(" > ") || "Dashboard";

  return (
    <DashboardLayout>
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md border-0 bg-card/80 shadow-lg p-10 text-center transition-all">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Construction className="h-10 w-10 text-primary" />
          </div>

          <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
            {pageName}
          </h2>

          <p className="text-base text-muted-foreground">
            This section is currently under development.
            <br />
            Please check back later — we're working on it!
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}