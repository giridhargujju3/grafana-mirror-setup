import { useMemo, useEffect } from "react";
import { GrafanaSidebar } from "./GrafanaSidebar";
import { GrafanaHeader } from "./GrafanaHeader";
import { SearchModal } from "./modals/SearchModal";
import { ShareModal } from "./modals/ShareModal";
import { SettingsModal } from "./modals/SettingsModal";
import { AddPanelModal } from "./modals/AddPanelModal";
import { PanelEditorModal } from "./modals/PanelEditorModal";
import { TimeSeriesPanel } from "./panels/TimeSeriesPanel";
import { StatPanel } from "./panels/StatPanel";
import { GaugePanel } from "./panels/GaugePanel";
import { BarChartPanel } from "./panels/BarChartPanel";
import { TablePanel } from "./panels/TablePanel";
import { AlertListPanel } from "./panels/AlertListPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { DashboardProvider, useDashboard, PanelConfig } from "@/contexts/DashboardContext";
import { cn } from "@/lib/utils";

// Generate sample data based on time range
const generateTimeSeriesData = (dataRefreshKey: number) => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60000);
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      cpu: Math.floor(Math.random() * 30 + 40 + Math.sin(i / 5 + dataRefreshKey) * 10),
      memory: Math.floor(Math.random() * 20 + 55 + Math.cos(i / 5 + dataRefreshKey) * 8),
      network: Math.floor(Math.random() * 15 + 20 + Math.sin(i / 3 + dataRefreshKey) * 5),
    });
  }
  return data;
};

const requestsData = [
  { name: "/api/users", requests: 1234, errors: 12 },
  { name: "/api/orders", requests: 987, errors: 5 },
  { name: "/api/products", requests: 756, errors: 8 },
  { name: "/api/auth", requests: 654, errors: 23 },
  { name: "/api/payments", requests: 432, errors: 2 },
];

const servicesData = [
  { name: "api-gateway", status: "healthy", cpu: "23%", memory: "45%", requests: "12.3k/s", latency: "12ms" },
  { name: "user-service", status: "healthy", cpu: "45%", memory: "62%", requests: "5.2k/s", latency: "8ms" },
  { name: "order-service", status: "warning", cpu: "78%", memory: "81%", requests: "3.1k/s", latency: "45ms" },
  { name: "payment-service", status: "healthy", cpu: "12%", memory: "34%", requests: "1.8k/s", latency: "23ms" },
  { name: "notification-service", status: "healthy", cpu: "8%", memory: "22%", requests: "890/s", latency: "5ms" },
];

const generateAlerts = (dataRefreshKey: number) => [
  { name: "High CPU Usage", state: "firing" as const, severity: "critical" as const, message: "CPU usage above 90% on node-3", time: "2 minutes ago" },
  { name: "Memory Warning", state: "pending" as const, severity: "warning" as const, message: "Memory usage approaching threshold", time: "5 minutes ago" },
  { name: "Disk Space", state: "resolved" as const, severity: "warning" as const, message: "Disk space recovered after cleanup", time: "15 minutes ago" },
  { name: "API Latency", state: "silenced" as const, severity: "info" as const, message: "Elevated latency on /api/search", time: "1 hour ago" },
];

const generateLogs = (dataRefreshKey: number) => [
  { timestamp: "14:32:45", level: "info" as const, message: "Request completed successfully", labels: { service: "api" } },
  { timestamp: "14:32:44", level: "warn" as const, message: "Slow query detected (>500ms)", labels: { service: "db" } },
  { timestamp: "14:32:43", level: "error" as const, message: "Connection timeout to redis-primary", labels: { service: "cache" } },
  { timestamp: "14:32:42", level: "info" as const, message: "User authentication successful", labels: { service: "auth" } },
  { timestamp: "14:32:41", level: "debug" as const, message: "Cache hit for user:12345", labels: { service: "cache" } },
  { timestamp: "14:32:40", level: "info" as const, message: "Order #98765 processed", labels: { service: "orders" } },
  { timestamp: "14:32:39", level: "warn" as const, message: "Rate limit approaching for IP 192.168.1.100", labels: { service: "gateway" } },
  { timestamp: "14:32:38", level: "info" as const, message: "Health check passed", labels: { service: "monitor" } },
];

interface PanelWrapperProps {
  panel: PanelConfig;
  children: React.ReactNode;
}

function PanelWrapper({ panel, children }: PanelWrapperProps) {
  const { isEditMode, setEditingPanel, setShowPanelEditor, removePanel, duplicatePanel } = useDashboard();
  
  return (
    <div 
      className={cn(
        "h-full",
        isEditMode && "ring-2 ring-transparent hover:ring-primary/50 cursor-move rounded-lg transition-all"
      )}
    >
      {children}
    </div>
  );
}

function DashboardContent() {
  const { isRefreshing, panels, dataRefreshKey, isEditMode } = useDashboard();

  const timeSeriesData = useMemo(() => generateTimeSeriesData(dataRefreshKey), [dataRefreshKey]);
  const alerts = useMemo(() => generateAlerts(dataRefreshKey), [dataRefreshKey]);
  const logs = useMemo(() => generateLogs(dataRefreshKey), [dataRefreshKey]);

  const renderPanel = (panel: PanelConfig) => {
    switch (panel.type) {
      case "stat":
        return (
          <StatPanel
            key={panel.id}
            panelId={panel.id}
            title={panel.title}
            value={panel.options.value}
            unit={panel.options.unit}
            subtitle={panel.options.subtitle}
            trend={panel.options.trend}
            trendValue={panel.options.trendValue}
            color={panel.options.color}
            sparklineData={panel.options.sparklineData}
          />
        );
      case "timeseries":
        return (
          <TimeSeriesPanel
            key={panel.id}
            panelId={panel.id}
            title={panel.title}
            data={timeSeriesData}
            dataKeys={[
              { key: "cpu", color: "hsl(24, 100%, 50%)", name: "CPU %" },
              { key: "memory", color: "hsl(199, 89%, 48%)", name: "Memory %" },
              { key: "network", color: "hsl(142, 71%, 45%)", name: "Network I/O" },
            ]}
          />
        );
      case "alertlist":
        return <AlertListPanel key={panel.id} panelId={panel.id} title={panel.title} alerts={alerts} />;
      case "gauge":
        return <GaugePanel key={panel.id} panelId={panel.id} title={panel.title} value={panel.options.value || 50} />;
      case "barchart":
        return (
          <BarChartPanel
            key={panel.id}
            panelId={panel.id}
            title={panel.title}
            data={requestsData}
            layout={panel.options.layout || "horizontal"}
            dataKeys={[
              { key: "requests", color: "hsl(199, 89%, 48%)", name: "Requests" },
              { key: "errors", color: "hsl(0, 72%, 51%)", name: "Errors" },
            ]}
          />
        );
      case "table":
        return (
          <TablePanel
            key={panel.id}
            panelId={panel.id}
            title={panel.title}
            columns={[
              { key: "name", label: "Service" },
              {
                key: "status",
                label: "Status",
                render: (value) => (
                  <span
                    className={`grafana-badge ${
                      value === "healthy" ? "grafana-badge-success" : "grafana-badge-warning"
                    }`}
                  >
                    {value}
                  </span>
                ),
              },
              { key: "cpu", label: "CPU", align: "right" },
              { key: "memory", label: "Memory", align: "right" },
              { key: "requests", label: "Req/s", align: "right" },
              { key: "latency", label: "P99", align: "right" },
            ]}
            data={servicesData}
          />
        );
      case "logs":
        return <LogsPanel key={panel.id} panelId={panel.id} title={panel.title} logs={logs} />;
      default:
        return null;
    }
  };

  // Group panels by row based on gridPos
  const panelsByRow: Record<string, PanelConfig[]> = {};
  panels.forEach(panel => {
    const rowKey = `row-${panel.gridPos.y}`;
    if (!panelsByRow[rowKey]) panelsByRow[rowKey] = [];
    panelsByRow[rowKey].push(panel);
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GrafanaSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <GrafanaHeader />
        <main className={cn("flex-1 overflow-auto p-4", isRefreshing && "opacity-60 pointer-events-none")}>
          {isEditMode && (
            <div className="mb-4 p-3 bg-grafana-yellow/10 border border-grafana-yellow/30 rounded-lg text-sm text-grafana-yellow">
              Edit mode enabled. Click on panels to edit them or drag to reorder.
            </div>
          )}
          <div className="grid grid-cols-12 gap-4 auto-rows-min">
            {/* Render panels based on their grid positions */}
            {panels.map((panel) => {
              const colSpan = `col-span-${panel.gridPos.w}`;
              const heightClass = panel.gridPos.h <= 2 ? "h-36" : panel.gridPos.h <= 3 ? "h-72" : "h-80";
              
              return (
                <div 
                  key={panel.id} 
                  className={cn(
                    "col-span-12",
                    panel.gridPos.w <= 3 && "md:col-span-6 lg:col-span-3",
                    panel.gridPos.w === 4 && "md:col-span-6 lg:col-span-4",
                    panel.gridPos.w === 6 && "lg:col-span-6",
                    panel.gridPos.w === 8 && "lg:col-span-8",
                    panel.gridPos.w === 12 && "col-span-12",
                    heightClass
                  )}
                >
                  <PanelWrapper panel={panel}>
                    {renderPanel(panel)}
                  </PanelWrapper>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      
      {/* Modals */}
      <SearchModal />
      <ShareModal />
      <SettingsModal />
      <AddPanelModal />
      <PanelEditorModal />
    </div>
  );
}

export function GrafanaDashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
