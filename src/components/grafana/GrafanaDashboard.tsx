import { GrafanaSidebar } from "./GrafanaSidebar";
import { GrafanaHeader } from "./GrafanaHeader";
import { TimeSeriesPanel } from "./panels/TimeSeriesPanel";
import { StatPanel } from "./panels/StatPanel";
import { GaugePanel } from "./panels/GaugePanel";
import { BarChartPanel } from "./panels/BarChartPanel";
import { TablePanel } from "./panels/TablePanel";
import { AlertListPanel } from "./panels/AlertListPanel";
import { LogsPanel } from "./panels/LogsPanel";

// Generate sample data
const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60000);
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      cpu: Math.floor(Math.random() * 30 + 40),
      memory: Math.floor(Math.random() * 20 + 55),
      network: Math.floor(Math.random() * 15 + 20),
    });
  }
  return data;
};

const timeSeriesData = generateTimeSeriesData();

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

const alerts = [
  { name: "High CPU Usage", state: "firing" as const, severity: "critical" as const, message: "CPU usage above 90% on node-3", time: "2 minutes ago" },
  { name: "Memory Warning", state: "pending" as const, severity: "warning" as const, message: "Memory usage approaching threshold", time: "5 minutes ago" },
  { name: "Disk Space", state: "resolved" as const, severity: "warning" as const, message: "Disk space recovered after cleanup", time: "15 minutes ago" },
  { name: "API Latency", state: "silenced" as const, severity: "info" as const, message: "Elevated latency on /api/search", time: "1 hour ago" },
];

const logs = [
  { timestamp: "14:32:45", level: "info" as const, message: "Request completed successfully", labels: { service: "api" } },
  { timestamp: "14:32:44", level: "warn" as const, message: "Slow query detected (>500ms)", labels: { service: "db" } },
  { timestamp: "14:32:43", level: "error" as const, message: "Connection timeout to redis-primary", labels: { service: "cache" } },
  { timestamp: "14:32:42", level: "info" as const, message: "User authentication successful", labels: { service: "auth" } },
  { timestamp: "14:32:41", level: "debug" as const, message: "Cache hit for user:12345", labels: { service: "cache" } },
  { timestamp: "14:32:40", level: "info" as const, message: "Order #98765 processed", labels: { service: "orders" } },
  { timestamp: "14:32:39", level: "warn" as const, message: "Rate limit approaching for IP 192.168.1.100", labels: { service: "gateway" } },
  { timestamp: "14:32:38", level: "info" as const, message: "Health check passed", labels: { service: "monitor" } },
];

export function GrafanaDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GrafanaSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <GrafanaHeader />
        <main className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-12 gap-4 auto-rows-min">
            {/* Top row - Stats */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 h-36">
              <StatPanel
                title="CPU Usage"
                value={72}
                unit="%"
                subtitle="Average across all nodes"
                trend="up"
                trendValue="+5%"
                color="orange"
                sparklineData={[40, 45, 42, 55, 60, 58, 65, 70, 68, 72]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3 h-36">
              <StatPanel
                title="Memory Usage"
                value={64}
                unit="%"
                subtitle="4.2 GB / 6.5 GB"
                trend="neutral"
                trendValue="0%"
                color="blue"
                sparklineData={[60, 62, 61, 63, 64, 63, 65, 64, 63, 64]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3 h-36">
              <StatPanel
                title="Active Users"
                value="12.4k"
                subtitle="Current sessions"
                trend="up"
                trendValue="+12%"
                color="green"
                sparklineData={[80, 85, 82, 88, 90, 92, 95, 93, 97, 100]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3 h-36">
              <StatPanel
                title="Error Rate"
                value={0.23}
                unit="%"
                subtitle="Last 5 minutes"
                trend="down"
                trendValue="-0.05%"
                color="red"
                sparklineData={[35, 32, 30, 28, 25, 27, 24, 23, 24, 23]}
              />
            </div>

            {/* Main charts row */}
            <div className="col-span-12 lg:col-span-8 h-80">
              <TimeSeriesPanel
                title="System Metrics"
                data={timeSeriesData}
                dataKeys={[
                  { key: "cpu", color: "hsl(24, 100%, 50%)", name: "CPU %" },
                  { key: "memory", color: "hsl(199, 89%, 48%)", name: "Memory %" },
                  { key: "network", color: "hsl(142, 71%, 45%)", name: "Network I/O" },
                ]}
              />
            </div>
            <div className="col-span-12 lg:col-span-4 h-80">
              <AlertListPanel title="Active Alerts" alerts={alerts} />
            </div>

            {/* Middle row */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 h-72">
              <GaugePanel title="CPU Load Average" value={72} />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 h-72">
              <GaugePanel
                title="Memory Pressure"
                value={64}
                thresholds={[
                  { value: 60, color: "hsl(var(--grafana-green))" },
                  { value: 80, color: "hsl(var(--grafana-yellow))" },
                  { value: 100, color: "hsl(var(--grafana-red))" },
                ]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 h-72">
              <GaugePanel
                title="Disk Usage"
                value={45}
                thresholds={[
                  { value: 70, color: "hsl(var(--grafana-green))" },
                  { value: 85, color: "hsl(var(--grafana-yellow))" },
                  { value: 100, color: "hsl(var(--grafana-red))" },
                ]}
              />
            </div>

            {/* Bar chart and table */}
            <div className="col-span-12 lg:col-span-6 h-72">
              <BarChartPanel
                title="Top Endpoints by Requests"
                data={requestsData}
                layout="horizontal"
                dataKeys={[
                  { key: "requests", color: "hsl(199, 89%, 48%)", name: "Requests" },
                  { key: "errors", color: "hsl(0, 72%, 51%)", name: "Errors" },
                ]}
              />
            </div>
            <div className="col-span-12 lg:col-span-6 h-72">
              <TablePanel
                title="Service Status"
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
            </div>

            {/* Logs panel */}
            <div className="col-span-12 h-64">
              <LogsPanel title="Recent Logs" logs={logs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
