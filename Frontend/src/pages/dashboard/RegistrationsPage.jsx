import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "event_id.event_title", label: "Event" },
  { key: "student_id.user_id.name", label: "Student" },
  { key: "registration_date", label: "Reg. Date" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { 
    key: "event_id", 
    label: "Event", 
    type: "select", 
    optionsUrl: "/api/events", 
    optionLabel: "event_title", 
    optionValue: "_id",
    required: true 
  },
  { 
    key: "student_id", 
    label: "Student", 
    type: "select", 
    optionsUrl: "/api/students", 
    optionLabel: "enrollment_no", // Backend might need enrollment_no for selection
    optionValue: "_id",
    required: true 
  },
  { key: "team_name", label: "Team Name", placeholder: "For team events" },
  { key: "payment_status", label: "Payment Status", type: "select", options: ["free", "pending", "paid"] },
  { key: "status", label: "Status", type: "select", options: ["registered", "cancelled", "completed"] },
];

export default function RegistrationsPage() {
  return (
    <CrudPage 
      title="Event Registrations" 
      description="Manage student registrations" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/event-registrations" 
    />
  );
}
