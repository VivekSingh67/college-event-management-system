import CrudPage from "@/components/dashboard/CrudPage";

/**
 * Field names here MUST match the backend Event model and validate middleware:
 * Required: branch_id, event_title, event_type, event_date, created_by, created_by_role
 */
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
  {
    key: "event_type",
    label: "Event Category",
    type: "select",
    // Must be one of backend enum: Sports, Technical, Cultural, Workshop, Seminar
    options: ["Technical", "Cultural", "Sports", "Workshop", "Seminar"],
    required: true,
  },
  {
    key: "branch_id",
    label: "Branch",
    type: "select",
    optionsUrl: "/api/branches",
    optionLabel: "branch_name",
    optionValue: "_id",
    required: true,
  },
  {
    key: "department_id",
    label: "Department",
    type: "select",
    optionsUrl: "/api/departments",
    optionLabel: "department_name",
    optionValue: "_id",
  },
  {
    key: "created_by",
    label: "Created By (User)",
    type: "select",
    optionsUrl: "/api/users",
    optionLabel: "name",
    optionValue: "_id",
    required: true,
  },
  {
    key: "created_by_role",
    label: "Creator Role",
    type: "select",
    // Backend validation: must be admin, hod, or faculty
    options: ["admin", "hod", "faculty"],
    required: true,
  },
  { key: "location", label: "Venue / Location", placeholder: "e.g. Main Auditorium" },
  { key: "organizer_name", label: "Organizer Name", placeholder: "e.g. Prof. Smith" },
  { key: "start_time", label: "Start Time", placeholder: "e.g. 10:00 AM" },
  { key: "end_time", label: "End Time", placeholder: "e.g. 12:00 PM" },
  { key: "max_participants", label: "Max Participants", type: "number" },
  { key: "event_banner", label: "Banner URL", placeholder: "URL to event banner image" },
  {
    key: "event_status",
    label: "Status",
    type: "select",
    options: ["upcoming", "ongoing", "completed", "cancelled"],
  },
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
