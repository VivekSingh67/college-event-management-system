import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "title", label: "Title" },
  { key: "announcement_type", label: "Type" },
  { key: "publish_date", label: "Published" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "title", label: "Title", required: true, placeholder: "Enter announcement title" },
  { key: "message", label: "Message", type: "textarea", required: true },
  { 
    key: "branch_id", 
    label: "Branch", 
    type: "select", 
    optionsUrl: "/api/branches", 
    optionLabel: "branch_name", 
    optionValue: "_id",
    required: true 
  },
  { 
    key: "department_id", 
    label: "Department", 
    type: "select", 
    optionsUrl: "/api/departments", 
    optionLabel: "department_name", 
    optionValue: "_id" 
  },
  { key: "announcement_type", label: "Type", type: "select", options: ["event", "notice", "information", "academic"] },
  { key: "publish_date", label: "Publish Date", type: "date", required: true },
  { key: "expiry_date", label: "Expiry Date", type: "date" },
  { 
    key: "created_by", 
    label: "Created By", 
    type: "select", 
    optionsUrl: "/api/users", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { key: "created_by_role", label: "Creator Role", type: "select", options: ["admin", "hod", "faculty"] },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function AnnouncementsPage() {
  return (
    <CrudPage 
      title="Announcements" 
      description="Broadcast messages to students and staff" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/announcements" 
    />
  );
}
