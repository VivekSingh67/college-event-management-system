import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "user_id.name", label: "User" },
  { key: "action", label: "Action" },
  { key: "module", label: "Module" },
  { key: "ip_address", label: "IP Address" },
  { key: "createdAt", label: "Timestamp" },
];

export default function ActivityPage() {
  return (
    <CrudPage 
      title="Activity Logs" 
      description="Audit trail of system actions" 
      columns={columns} 
      fields={[]} 
      fetchUrl="/api/activity-logs" 
      readOnly={true}
    />
  );
}
