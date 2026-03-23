import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "event_id.event_title", label: "Event" },
  { key: "event_id.event_date", label: "Date" },
  { key: "attendance_status", label: "Attended", badge: true },
  { key: "marked_by.name", label: "Verified By" },
];

export default function ParticipationPage() {
  return (
    <CrudPage 
      title="My Participation" 
      description="View your event participation history" 
      columns={columns} 
      fields={[]} 
      fetchUrl="/api/attendance/me" 
      readOnly={true} 
    />
  );
}
