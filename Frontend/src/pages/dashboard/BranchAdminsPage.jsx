import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "user_id.name", label: "Name" },
  { key: "employee_id", label: "Employee ID" },
  { key: "branch_id.branch_name", label: "Branch" },
  { key: "designation", label: "Designation" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { 
    key: "user_id", 
    label: "User Account", 
    type: "select", 
    optionsUrl: "/api/users", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { key: "employee_id", label: "Employee ID", required: true, placeholder: "e.g. ADM001" },
  { 
    key: "college_id", 
    label: "College", 
    type: "select", 
    optionsUrl: "/api/colleges", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { 
    key: "branch_id", 
    label: "Branch", 
    type: "select", 
    optionsUrl: "/api/branches", 
    optionLabel: "branch_name", 
    optionValue: "_id",
    required: true 
  },
  { key: "designation", label: "Designation", placeholder: "e.g. Branch Admin" },
  { key: "joining_date", label: "Joining Date", type: "date", required: true },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function BranchAdminsPage() {
  return (
    <CrudPage 
      title="Branch Admins" 
      description="Manage Branch Administrators" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/admins" 
    />
  );
}
