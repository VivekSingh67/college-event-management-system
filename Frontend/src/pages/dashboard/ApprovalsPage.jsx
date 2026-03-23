import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "event_id.event_title", label: "Event" },
  { key: "approved_by.name", label: "Approver" },
  { key: "approver_role", label: "Role" },
  { key: "approval_status", label: "Status", badge: true },
  { key: "approval_date", label: "Date" },
];

const fields = [
  { 
    key: "event_id", 
    label: "Event", 
    type: "select", 
    optionsUrl: "/api/events", 
    optionLabel: "event_title", 
    optionValue: "_id",
    required: true 
  },
  { 
    key: "approved_by", 
    label: "Approver", 
    type: "select", 
    optionsUrl: "/api/users", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { key: "approver_role", label: "Approver Role", type: "select", options: ["admin", "super_admin"] },
  { key: "approval_status", label: "Status", type: "select", options: ["pending", "approved", "rejected"] },
  { key: "remarks", label: "Remarks", type: "textarea" },
];

export default function ApprovalsPage() {
  return (
    <CrudPage 
      title="Event Approvals" 
      description="Review and approve event requests" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/event-approvals" 
    />
  );
}
