import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "batch_name", label: "Batch Name" },
  { key: "department_id.department_name", label: "Department" },
  { key: "start_year", label: "Start Year" },
  { key: "end_year", label: "End Year" },
  { key: "current_semester", label: "Semester" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "batch_name", label: "Batch Name", required: true, placeholder: "e.g. 2022-26" },
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
    optionValue: "_id",
    required: true 
  },
  { key: "start_year", label: "Start Year", type: "number", required: true },
  { key: "end_year", label: "End Year", type: "number", required: true },
  { key: "current_semester", label: "Current Semester", type: "number", defaultValue: 1 },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function BatchPage() {
  return (
    <CrudPage 
      title="Batches" 
      description="Manage student batches" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/batches" 
    />
  );
}
