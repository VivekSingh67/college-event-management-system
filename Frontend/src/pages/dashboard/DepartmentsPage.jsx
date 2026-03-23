import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "department_name", label: "Department Name" },
  { key: "department_code", label: "Code" },
  { key: "branch_id.branch_name", label: "Branch" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "department_name", label: "Department Name", required: true, placeholder: "e.g. Computer Science" },
  { key: "department_code", label: "Department Code", required: true, placeholder: "e.g. CS" },
  { 
    key: "branch_id", 
    label: "Branch", 
    type: "select", 
    optionsUrl: "/api/branches", 
    optionLabel: "branch_name", 
    optionValue: "_id",
    required: true 
  },
  { key: "description", label: "Description", type: "textarea", placeholder: "Enter description" },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function DepartmentsPage() {
  return (
    <CrudPage 
      title="Departments" 
      description="Manage academic departments" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/departments" 
    />
  );
}
