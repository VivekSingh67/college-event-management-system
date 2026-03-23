import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "is_read", label: "Read" },
  { key: "createdAt", label: "Date" },
];

const fields = [
  { 
    key: "user_id", 
    label: "User", 
    type: "select", 
    optionsUrl: "/api/users", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { key: "title", label: "Title", required: true },
  { key: "message", label: "Message", type: "textarea", required: true },
  { key: "type", label: "Type", type: "select", options: ["event", "system", "registration", "announcement"] },
];

export default function NotificationsPage() {
  return (
    <CrudPage 
      title="Notifications" 
      description="System and event notifications" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/notifications" 
    />
  );
}
