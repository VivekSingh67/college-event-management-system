import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "user_id.name", label: "Name" },
  { key: "user_id.email", label: "Email" },
  { key: "employee_id", label: "Employee ID" },
  { key: "branch_id.branch_name", label: "Branch" },
  { key: "designation", label: "Designation" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "name", label: "Full Name", required: true, placeholder: "e.g. Vivek Singh" },
  { key: "email", label: "Email Address", type: "email", required: true, placeholder: "e.g. vivek@cems.com" },
  { key: "phone", label: "Phone Number", required: true, placeholder: "10-digit number" },
  { key: "password", label: "Password", type: "password", required: true, placeholder: "Minimum 6 characters" },
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
  { 
    key: "designation", 
    label: "Designation", 
    hidden: true, 
    defaultValue: "admin" 
  },
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
