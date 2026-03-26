import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "event_id.event_title", label: "Event" },
  { key: "student_id.enrollment_no", label: "Student" },
  { key: "attendance_status", label: "Present" },
  { key: "marked_at", label: "Time" },
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
    optionLabel: "enrollment_no", 
    optionValue: "_id",
    required: true 
  },
  { key: "attendance_status", label: "Is Present?", type: "select", options: ["true", "false"] },
  { 
    key: "marked_by", 
    label: "Marked By", 
    type: "select", 
    optionsUrl: "/api/users", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
];

export default function AttendancePage() {
  return (
    <CrudPage 
      title="Attendance" 
      description="Track event attendance" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/attendance/me"
    />
  );
}
