import { MoreVertical, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  name: string;
  state: "firing" | "pending" | "resolved" | "silenced";
  severity: "critical" | "warning" | "info";
  message: string;
  time: string;
}

interface AlertListPanelProps {
  title: string;
  alerts: Alert[];
  panelId?: string;
}

const stateConfig = {
  firing: {
    icon: XCircle,
    color: "text-grafana-red",
    bg: "bg-grafana-red/10",
    label: "Firing",
  },
  pending: {
    icon: Clock,
    color: "text-grafana-yellow",
    bg: "bg-grafana-yellow/10",
    label: "Pending",
  },
  resolved: {
    icon: CheckCircle,
    color: "text-grafana-green",
    bg: "bg-grafana-green/10",
    label: "Resolved",
  },
  silenced: {
    icon: AlertTriangle,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    label: "Silenced",
  },
};

const severityColors = {
  critical: "border-l-grafana-red",
  warning: "border-l-grafana-yellow",
  info: "border-l-grafana-blue",
};

export function AlertListPanel({ title, alerts }: AlertListPanelProps) {
  return (
    <div className="grafana-panel h-full flex flex-col">
      <div className="grafana-panel-header">
        <h3 className="grafana-panel-title">{title}</h3>
        <button className="p-1 rounded hover:bg-secondary/50 text-muted-foreground">
          <MoreVertical size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No alerts
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts.map((alert, i) => {
              const config = stateConfig[alert.state];
              const StateIcon = config.icon;
              
              return (
                <div
                  key={i}
                  className={cn(
                    "px-4 py-3 border-l-4 hover:bg-secondary/30 transition-colors",
                    severityColors[alert.severity]
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("p-1 rounded", config.bg)}>
                      <StateIcon size={16} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">
                          {alert.name}
                        </span>
                        <span className={cn("text-xs px-2 py-0.5 rounded", config.bg, config.color)}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {alert.message}
                      </p>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
