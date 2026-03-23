import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "name", label: "College Name" },
  { key: "short_name", label: "Short Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "name", label: "College Name", required: true, placeholder: "Enter college name" },
  { key: "short_name", label: "Short Name", required: true, placeholder: "Enter short name (e.g. DIT)" },
  { key: "email", label: "Email", type: "email", placeholder: "Enter email" },
  { key: "phone", label: "Phone", placeholder: "Enter phone number" },
  { key: "city", label: "City", placeholder: "Enter city" },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function CollegesPage() {
  return (
    <CrudPage 
      title="Colleges" 
      description="Manage affiliated colleges" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/colleges" 
    />
  );
}
