import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface GaugePanelProps {
  title: string;
  value: number;
  min?: number;
  max?: number;
  thresholds?: { value: number; color: string }[];
  unit?: string;
}

export function GaugePanel({
  title,
  value,
  min = 0,
  max = 100,
  thresholds = [
    { value: 70, color: "hsl(var(--grafana-green))" },
    { value: 85, color: "hsl(var(--grafana-yellow))" },
    { value: 100, color: "hsl(var(--grafana-red))" },
  ],
  unit = "%",
}: GaugePanelProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180;
  
  // Determine color based on thresholds
  let currentColor = thresholds[0]?.color || "hsl(var(--grafana-green))";
  for (const threshold of thresholds) {
    if (value <= threshold.value) {
      currentColor = threshold.color;
      break;
    }
    currentColor = threshold.color;
  }

  return (
    <div className="grafana-panel h-full flex flex-col">
      <div className="grafana-panel-header">
        <h3 className="grafana-panel-title">{title}</h3>
        <button className="p-1 rounded hover:bg-secondary/50 text-muted-foreground">
          <MoreVertical size={14} />
        </button>
      </div>
      <div className="grafana-panel-content flex-1 flex flex-col items-center justify-center">
        <div className="relative w-40 h-20">
          {/* Background arc */}
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                {thresholds.map((t, i) => (
                  <stop
                    key={i}
                    offset={`${(t.value / max) * 100}%`}
                    stopColor={t.color}
                  />
                ))}
              </linearGradient>
            </defs>
            
            {/* Background track */}
            <path
              d="M 10 45 A 40 40 0 0 1 90 45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            {/* Colored progress */}
            <path
              d="M 10 45 A 40 40 0 0 1 90 45"
              fill="none"
              stroke={currentColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(angle / 180) * 126} 126`}
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
            
            {/* Needle */}
            <g style={{ transform: `rotate(${angle - 90}deg)`, transformOrigin: "50px 45px", transition: "transform 0.5s ease" }}>
              <line
                x1="50"
                y1="45"
                x2="50"
                y2="15"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="45" r="4" fill="hsl(var(--foreground))" />
            </g>
          </svg>
        </div>
        
        <div className="text-center mt-2">
          <span className="text-3xl font-semibold tabular-nums" style={{ color: currentColor }}>
            {value}
          </span>
          <span className="text-lg ml-1 text-muted-foreground">{unit}</span>
        </div>
        
        <div className="flex justify-between w-full max-w-[160px] mt-2 text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
