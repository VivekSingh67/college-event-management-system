import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "name", label: "Category Name" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "name", label: "Category Name", required: true, placeholder: "e.g. Technical" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Enter description" },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function CategoriesPage() {
  return (
    <CrudPage 
      title="Event Categories" 
      description="Manage types of events" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/event-categories" 
    />
  );
}
