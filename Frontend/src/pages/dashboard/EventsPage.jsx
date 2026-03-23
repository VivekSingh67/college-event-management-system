import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "event_title", label: "Event Name" },
  { key: "event_date", label: "Date" },
  { key: "location", label: "Venue" },
  { key: "event_type", label: "Category" },
  { key: "event_status", label: "Status", badge: true },
];

const fields = [
  { key: "event_title", label: "Event Title", required: true, placeholder: "Enter event title" },
  { key: "event_description", label: "Description", type: "textarea", placeholder: "Enter event details" },
  { key: "event_date", label: "Event Date", type: "date", required: true },
  { key: "registration_deadline", label: "Reg. Deadline", type: "date" },
  { key: "location", label: "Venue/Location", required: true, placeholder: "e.g. Auditorium" },
  { key: "event_type", label: "Event Category", type: "select", options: ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Other"] },
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
    optionValue: "_id"
  },
  { 
    key: "organizer_id", 
    label: "Organizer", 
    type: "select", 
    optionsUrl: "/api/users", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { key: "max_participants", label: "Max Participants", type: "number" },
  { key: "event_status", label: "Status", type: "select", options: ["upcoming", "ongoing", "completed", "cancelled"] },
];

export default function EventsPage() {
  return (
    <CrudPage 
      title="Events" 
      description="Manage all college events" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/events" 
    />
  );
}
