import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "venue_name", label: "Venue Name" },
  { key: "location", label: "Location" },
  { key: "capacity", label: "Capacity" },
  { key: "status", label: "Status", badge: true },
];

const fields = [
  { key: "venue_name", label: "Venue Name", required: true, placeholder: "e.g. Auditorium" },
  { 
    key: "branch_id", 
    label: "Branch", 
    type: "select", 
    optionsUrl: "/api/branches", 
    optionLabel: "branch_name", 
    optionValue: "_id",
    required: true 
  },
  { key: "location", label: "Location", placeholder: "e.g. Ground Floor" },
  { key: "capacity", label: "Capacity", type: "number" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: ["available", "occupied", "maintenance"] },
];

export default function VenuesPage() {
  return (
    <CrudPage 
      title="Venues" 
      description="Manage event venues" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/event-venues" 
    />
  );
}
