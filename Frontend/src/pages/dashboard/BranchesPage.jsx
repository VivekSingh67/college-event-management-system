import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "branch_name", label: "Branch Name" },
  { key: "branch_code", label: "Code" },
  { key: "college_id.name", label: "College" },
  { key: "campus_type", label: "Campus Type" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "branch_name", label: "Branch Name", required: true, placeholder: "e.g. Computer Science" },
  { key: "branch_code", label: "Branch Code", required: true, placeholder: "e.g. CSE" },
  { 
    key: "college_id", 
    label: "College", 
    type: "select", 
    optionsUrl: "/api/colleges", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { key: "campus_type", label: "Campus Type", type: "select", options: ["Main Campus", "City Campus", "Regional Campus"] },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function BranchesPage() {
  return (
    <CrudPage 
      title="Branches" 
      description="Manage branches" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/branches" 
    />
  );
}
