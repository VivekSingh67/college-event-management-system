// components/StatCard.jsx
import { Card } from "../ui/card";

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "primary" }) {
  return (
    <Card className="p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in border-0">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && <p className="text-xs font-medium text-success">{trend}</p>}
        </div>

        <div className={`p-3 rounded-xl ${variantStyles[variant] || variantStyles.primary}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}