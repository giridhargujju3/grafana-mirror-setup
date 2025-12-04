import {
  Plus,
  Clock,
  RefreshCw,
  ChevronDown,
  Settings,
  Share2,
  Star,
  MoreVertical,
  Copy,
  Download,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  { label: "Off", value: "Off" },
  { label: "5s", value: "5s" },
  { label: "10s", value: "10s" },
  { label: "30s", value: "30s" },
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "30m", value: "30m" },
  { label: "1h", value: "1h" },
];

export function GrafanaHeader() {
  const {
    timeRange,
    setTimeRange,
    refreshInterval,
    setRefreshInterval,
    isRefreshing,
    triggerRefresh,
    isStarred,
    setIsStarred,
    dashboardTitle,
    setShowAddPanelModal,
    setShowShareModal,
    setShowSettingsModal,
  } = useDashboard();

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showRefreshDropdown, setShowRefreshDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  const handleStarToggle = () => {
    setIsStarred(!isStarred);
    toast.success(isStarred ? "Removed from starred" : "Added to starred");
  };

  const handleShare = () => {
    setShowShareModal(true);
    toast.info("Share modal opened");
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
    toast.info("Settings opened");
  };

  const handleAddPanel = () => {
    setShowAddPanelModal(true);
    toast.info("Add panel dialog opened");
  };

  const handleRefreshClick = () => {
    triggerRefresh();
    toast.success("Dashboard refreshed");
  };

  const handleExport = () => {
    toast.success("Dashboard exported as JSON");
    setShowMoreDropdown(false);
  };

  const handleDuplicate = () => {
    toast.success("Dashboard duplicated");
    setShowMoreDropdown(false);
  };

  const handleViewJSON = () => {
    toast.info("Viewing dashboard JSON");
    setShowMoreDropdown(false);
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStarToggle}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
            title={isStarred ? "Remove from starred" : "Add to starred"}
          >
            <Star
              size={18}
              className={cn(
                "transition-colors",
                isStarred ? "fill-grafana-yellow text-grafana-yellow" : "text-muted-foreground"
              )}
            />
          </button>
          <h1 className="text-lg font-medium text-foreground">{dashboardTitle}</h1>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="grafana-badge grafana-badge-success">Production</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Add panel button */}
        <button 
          onClick={handleAddPanel}
          className="grafana-btn grafana-btn-secondary"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add</span>
        </button>

        {/* Time range picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTimeDropdown(!showTimeDropdown);
              setShowRefreshDropdown(false);
              setShowMoreDropdown(false);
            }}
            className="grafana-btn grafana-btn-secondary min-w-[180px] justify-between"
          >
            <Clock size={16} />
            <span>{timeRange}</span>
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
                    setTimeRange(range);
                    setShowTimeDropdown(false);
                    toast.success(`Time range set to ${range}`);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors",
                    timeRange === range && "bg-secondary text-primary"
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
              setShowMoreDropdown(false);
            }}
            className={cn(
              "grafana-btn grafana-btn-secondary",
              isRefreshing && "animate-pulse"
            )}
          >
            <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">{refreshInterval}</span>
            <ChevronDown size={14} />
          </button>
          {showRefreshDropdown && (
            <div className="absolute top-full right-0 mt-1 w-32 bg-popover border border-border rounded-md shadow-lg z-50 py-1 animate-fade-in">
              <button
                onClick={handleRefreshClick}
                className="w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors text-primary font-medium border-b border-border"
              >
                Refresh now
              </button>
              {refreshIntervals.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => {
                    setRefreshInterval(interval.value);
                    setShowRefreshDropdown(false);
                    if (interval.value !== "Off") {
                      toast.success(`Auto-refresh set to ${interval.label}`);
                    } else {
                      toast.info("Auto-refresh disabled");
                    }
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors",
                    refreshInterval === interval.value && "bg-secondary text-primary"
                  )}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Share button */}
        <button 
          onClick={handleShare}
          className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Share dashboard"
        >
          <Share2 size={18} />
        </button>

        {/* Settings button */}
        <button 
          onClick={handleSettings}
          className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Dashboard settings"
        >
          <Settings size={18} />
        </button>

        {/* More options */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowMoreDropdown(!showMoreDropdown);
              setShowTimeDropdown(false);
              setShowRefreshDropdown(false);
            }}
            className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="More options"
          >
            <MoreVertical size={18} />
          </button>
          {showMoreDropdown && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50 py-1 animate-fade-in">
              <button
                onClick={handleViewJSON}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
              >
                <Eye size={16} />
                View JSON
              </button>
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={handleDuplicate}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors"
              >
                <Copy size={16} />
                Duplicate
              </button>
              <div className="my-1 border-t border-border" />
              <button
                onClick={() => {
                  toast.error("Dashboard deleted");
                  setShowMoreDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
