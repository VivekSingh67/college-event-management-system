import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function DataTable({ columns, data, title }) {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-card-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className="text-sm">
                    {["status", "event_status", "approval_status"].includes(col.key) ? (
                      <Badge variant={["Active", "Approved", "upcoming", "approved", "ongoing"].includes(row[col.key]) ? "default" : "secondary"}>
                        {row[col.key]}
                      </Badge>
                    ) : (
                      row[col.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
