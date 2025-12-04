import { MoreVertical, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
}

interface TablePanelProps {
  title: string;
  columns: Column[];
  data: any[];
}

export function TablePanel({ title, columns, data }: TablePanelProps) {
  return (
    <div className="grafana-panel h-full flex flex-col">
      <div className="grafana-panel-header">
        <h3 className="grafana-panel-title">{title}</h3>
        <button className="p-1 rounded hover:bg-secondary/50 text-muted-foreground">
          <MoreVertical size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-secondary">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={12} className="opacity-50" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-foreground",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
