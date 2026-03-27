import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "user_id.name", label: "Name" },
  { key: "employee_id", label: "Employee ID" },
  { key: "department_id.department_name", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "name", label: "Full Name", required: true, placeholder: "e.g. Dr. Amit Shah" },
  { key: "email", label: "Email Address", type: "email", required: true, placeholder: "e.g. amit@cems.com" },
  { key: "phone", label: "Phone Number", required: true, placeholder: "10-digit number" },
  { key: "password", label: "Password", type: "password", defaultValue: "1", required: true, placeholder: "Default: 1" },
  { key: "employee_id", label: "Employee ID", required: true, placeholder: "e.g. FAC001" },
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
  { key: "designation", label: "Designation", placeholder: "e.g. Assistant Professor" },
  { key: "qualification", label: "Qualification", placeholder: "e.g. Ph.D" },
  { key: "experience_years", label: "Experience (Years)", type: "number" },
  { key: "joining_date", label: "Joining Date", type: "date", required: true },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

export default function FacultyPage() {
  return (
    <CrudPage 
      title="Faculty" 
      description="Manage Faculty Members" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/faculty" 
    />
  );
}
