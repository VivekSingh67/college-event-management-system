import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "event_id.event_title", label: "Event" },
  { key: "event_id.event_date", label: "Date" },
  { key: "event_id.location", label: "Venue" },
  { key: "payment_status", label: "Payment" },
  { key: "status", label: "Status", badge: true },
];

export default function MyRegistrationsPage() {
  return (
    <CrudPage 
      title="My Registrations" 
      description="View and manage your event registrations" 
      columns={columns} 
      fields={[]} 
      fetchUrl="/api/event-registrations/me" 
      readOnly={true} 
    />
  );
}
