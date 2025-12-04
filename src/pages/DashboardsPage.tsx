import { GrafanaSidebar } from "@/components/grafana/GrafanaSidebar";
import { SearchModal } from "@/components/grafana/modals/SearchModal";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, FolderPlus, FileUp, Clock, Star } from "lucide-react";

const recentDashboards = [
  { name: "System Monitoring", folder: "General", updated: "2 hours ago" },
  { name: "Network Overview", folder: "Infrastructure", updated: "5 hours ago" },
  { name: "Application Metrics", folder: "Applications", updated: "1 day ago" },
  { name: "Business KPIs", folder: "Business", updated: "2 days ago" },
];

const starredDashboards = [
  { name: "Production Overview", folder: "General" },
  { name: "Error Tracking", folder: "Applications" },
];

function DashboardsContent() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GrafanaSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-foreground">Dashboards</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="grafana-btn grafana-btn-primary"
            >
              <Plus size={16} />
              New Dashboard
            </button>
            <button className="grafana-btn grafana-btn-secondary">
              <FolderPlus size={16} />
              New Folder
            </button>
            <button className="grafana-btn grafana-btn-secondary">
              <FileUp size={16} />
              Import
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Starred Section */}
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground mb-4">
              <Star size={20} className="text-grafana-yellow" />
              Starred dashboards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {starredDashboards.map((dashboard) => (
                <button
                  key={dashboard.name}
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors text-left"
                >
                  <div className="p-2 bg-grafana-yellow/20 rounded">
                    <LayoutDashboard size={20} className="text-grafana-yellow" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{dashboard.name}</div>
                    <div className="text-sm text-muted-foreground">{dashboard.folder}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground mb-4">
              <Clock size={20} className="text-muted-foreground" />
              Recently viewed
            </h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Folder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Last viewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentDashboards.map((dashboard) => (
                    <tr
                      key={dashboard.name}
                      onClick={() => navigate("/")}
                      className="hover:bg-secondary/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <LayoutDashboard size={18} className="text-muted-foreground" />
                          <span className="font-medium text-foreground">{dashboard.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{dashboard.folder}</td>
                      <td className="px-4 py-3 text-muted-foreground">{dashboard.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
      <SearchModal />
    </div>
  );
}

export default function DashboardsPage() {
  return (
    <DashboardProvider>
      <DashboardsContent />
    </DashboardProvider>
  );
}
