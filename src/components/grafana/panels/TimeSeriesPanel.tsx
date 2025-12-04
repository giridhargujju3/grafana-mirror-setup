import { MoreVertical, Maximize2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TimeSeriesPanelProps {
  title: string;
  data: any[];
  dataKeys: { key: string; color: string; name: string }[];
}

export function TimeSeriesPanel({ title, data, dataKeys }: TimeSeriesPanelProps) {
  return (
    <div className="grafana-panel h-full flex flex-col">
      <div className="grafana-panel-header">
        <h3 className="grafana-panel-title">{title}</h3>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-secondary/50 text-muted-foreground">
            <Maximize2 size={14} />
          </button>
          <button className="p-1 rounded hover:bg-secondary/50 text-muted-foreground">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
      <div className="grafana-panel-content flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {dataKeys.map((dk) => (
                <linearGradient key={dk.key} id={`gradient-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dk.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={dk.color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 22%)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="hsl(210, 15%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(210, 15%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 15%)",
                border: "1px solid hsl(220, 18%, 22%)",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              iconType="line"
            />
            {dataKeys.map((dk) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={dk.color}
                strokeWidth={2}
                fill={`url(#gradient-${dk.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
