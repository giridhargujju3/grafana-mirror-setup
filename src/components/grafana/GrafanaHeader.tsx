import {
  Search,
  Plus,
  Clock,
  RefreshCw,
  ChevronDown,
  Settings,
  Share2,
  Star,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const timeRanges = [
  "Last 5 minutes",
  "Last 15 minutes",
  "Last 30 minutes",
  "Last 1 hour",
  "Last 3 hours",
  "Last 6 hours",
  "Last 12 hours",
  "Last 24 hours",
  "Last 2 days",
  "Last 7 days",
  "Last 30 days",
];

const refreshIntervals = [
  "Off",
  "5s",
  "10s",
  "30s",
  "1m",
  "5m",
  "15m",
  "30m",
  "1h",
];

export function GrafanaHeader() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 6 hours");
  const [selectedRefresh, setSelectedRefresh] = useState("Off");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showRefreshDropdown, setShowRefreshDropdown] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStarred(!isStarred)}
            className="p-1.5 rounded hover:bg-secondary"
          >
            <Star
              size={18}
              className={cn(
                isStarred ? "fill-grafana-yellow text-grafana-yellow" : "text-muted-foreground"
              )}
            />
          </button>
          <h1 className="text-lg font-medium text-foreground">System Monitoring</h1>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="grafana-badge grafana-badge-success">Production</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Add panel button */}
        <button className="grafana-btn grafana-btn-secondary">
          <Plus size={16} />
          <span className="hidden sm:inline">Add</span>
        </button>

        {/* Time range picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTimeDropdown(!showTimeDropdown);
              setShowRefreshDropdown(false);
            }}
            className="grafana-btn grafana-btn-secondary min-w-[180px] justify-between"
          >
            <Clock size={16} />
            <span>{selectedTimeRange}</span>
            <ChevronDown size={14} />
          </button>
          {showTimeDropdown && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-popover border border-border rounded-md shadow-lg z-50 py-1 animate-fade-in">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Relative time ranges
              </div>
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedTimeRange(range);
                    setShowTimeDropdown(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors",
                    selectedTimeRange === range && "bg-secondary text-primary"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRefreshDropdown(!showRefreshDropdown);
              setShowTimeDropdown(false);
            }}
            className="grafana-btn grafana-btn-secondary"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">{selectedRefresh}</span>
            <ChevronDown size={14} />
          </button>
          {showRefreshDropdown && (
            <div className="absolute top-full right-0 mt-1 w-32 bg-popover border border-border rounded-md shadow-lg z-50 py-1 animate-fade-in">
              {refreshIntervals.map((interval) => (
                <button
                  key={interval}
                  onClick={() => {
                    setSelectedRefresh(interval);
                    setShowRefreshDropdown(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors",
                    selectedRefresh === interval && "bg-secondary text-primary"
                  )}
                >
                  {interval}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Share button */}
        <button className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          <Share2 size={18} />
        </button>

        {/* Settings button */}
        <button className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          <Settings size={18} />
        </button>

        {/* More options */}
        <button className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
}
