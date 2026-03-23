import CrudPage from "@/components/dashboard/CrudPage";

const columns = [
  { key: "certificate_title", label: "Title" },
  { key: "event_id.event_title", label: "Event" },
  { key: "student_id.enrollment_no", label: "Student" },
  { key: "issued_date", label: "Issue Date" },
];

const fields = [
  { key: "certificate_title", label: "Certificate Title", required: true },
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
  { 
    key: "issued_by", 
    label: "Issued By", 
    type: "select", 
    optionsUrl: "/api/users", 
    optionLabel: "name", 
    optionValue: "_id",
    required: true 
  },
  { key: "certificate_file", label: "File URL", placeholder: "URL to certificate file" },
];

export default function CertificatesPage() {
  return (
    <CrudPage 
      title="Certificates" 
      description="Manage and issue event certificates" 
      columns={columns} 
      fields={fields} 
      fetchUrl="/api/certificates" 
    />
  );
}
