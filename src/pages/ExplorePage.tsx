import { GrafanaSidebar } from "@/components/grafana/GrafanaSidebar";
import { SearchModal } from "@/components/grafana/modals/SearchModal";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { useState } from "react";
import { Play, Clock, ChevronDown, Database, Search } from "lucide-react";
import { toast } from "sonner";

const dataSources = [
  { name: "Prometheus", type: "prometheus" },
  { name: "Loki", type: "loki" },
  { name: "InfluxDB", type: "influxdb" },
  { name: "Elasticsearch", type: "elasticsearch" },
];

function ExploreContent() {
  const [selectedSource, setSelectedSource] = useState(dataSources[0]);
  const [query, setQuery] = useState("");
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  const handleRunQuery = () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }
    toast.success("Query executed successfully");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GrafanaSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-foreground">Explore</h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Query Builder */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Data source selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded hover:border-primary transition-colors"
                >
                  <Database size={16} className="text-muted-foreground" />
                  <span className="font-medium">{selectedSource.name}</span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
                {showSourceDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50 py-1">
                    {dataSources.map((source) => (
                      <button
                        key={source.name}
                        onClick={() => {
                          setSelectedSource(source);
                          setShowSourceDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <Database size={14} />
                        {source.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Time range */}
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded hover:border-primary transition-colors">
                <Clock size={16} className="text-muted-foreground" />
                <span>Last 1 hour</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>

              {/* Run button */}
              <button
                onClick={handleRunQuery}
                className="grafana-btn grafana-btn-primary ml-auto"
              >
                <Play size={16} />
                Run query
              </button>
            </div>

            {/* Query input */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Enter a ${selectedSource.name} query...`}
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              />
            </div>

            <div className="mt-3 text-sm text-muted-foreground">
              Example queries:
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSource.type === "prometheus" && (
                  <>
                    <button onClick={() => setQuery("up")} className="px-2 py-1 bg-secondary rounded hover:bg-secondary/80">up</button>
                    <button onClick={() => setQuery("rate(http_requests_total[5m])")} className="px-2 py-1 bg-secondary rounded hover:bg-secondary/80">rate(http_requests_total[5m])</button>
                    <button onClick={() => setQuery("node_cpu_seconds_total")} className="px-2 py-1 bg-secondary rounded hover:bg-secondary/80">node_cpu_seconds_total</button>
                  </>
                )}
                {selectedSource.type === "loki" && (
                  <>
                    <button onClick={() => setQuery('{job="nginx"}')} className="px-2 py-1 bg-secondary rounded hover:bg-secondary/80">{'{job="nginx"}'}</button>
                    <button onClick={() => setQuery('{level="error"}')} className="px-2 py-1 bg-secondary rounded hover:bg-secondary/80">{'{level="error"}'}</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results area */}
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-muted-foreground">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Enter a query to explore your data</p>
              <p className="text-sm mt-2">Select a data source and enter a query above to visualize your metrics, logs, or traces.</p>
            </div>
          </div>
        </main>
      </div>
      <SearchModal />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <DashboardProvider>
      <ExploreContent />
    </DashboardProvider>
  );
}
