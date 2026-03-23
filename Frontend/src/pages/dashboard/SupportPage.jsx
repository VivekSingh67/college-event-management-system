import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "student_id.enrollment_no", label: "Student" },
  { key: "subject", label: "Subject" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { 
    key: "student_id", 
    label: "Student", 
    type: "select", 
    optionsUrl: "/api/students", 
    optionLabel: "enrollment_no", 
    optionValue: "_id",
    required: true 
  },
  { key: "subject", label: "Subject", required: true },
  { key: "message", label: "Message", type: "textarea", required: true },
  { key: "priority", label: "Priority", type: "select", options: ["low", "medium", "high"] },
  { key: "status", label: "Status", type: "select", options: ["open", "in_progress", "resolved", "closed"] },
  { key: "reply", label: "Reply", type: "textarea" },
];

export default function SupportPage() {
  return (
    <CrudPage 
      title="Support Queries" 
      description="Manage student support requests" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/queries" 
    />
  );
}
