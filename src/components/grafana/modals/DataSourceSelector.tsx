import { useState } from "react";
import { X, Search, Database, Cloud, Server, Table2, Zap, Check } from "lucide-react";
import { useDashboard, DataSource } from "@/contexts/DashboardContext";
import { cn } from "@/lib/utils";

const dataSourceIcons: Record<string, React.ReactNode> = {
  prometheus: <Cloud size={24} className="text-grafana-orange" />,
  loki: <Zap size={24} className="text-grafana-yellow" />,
  postgres: <Database size={24} className="text-grafana-blue" />,
  mysql: <Database size={24} className="text-grafana-blue" />,
  influxdb: <Server size={24} className="text-grafana-purple" />,
  elasticsearch: <Search size={24} className="text-grafana-green" />,
  testdata: <Table2 size={24} className="text-muted-foreground" />,
};

const dataSourceDescriptions: Record<string, string> = {
  prometheus: "Open-source monitoring and alerting toolkit",
  loki: "Log aggregation system designed for cloud native",
  postgres: "PostgreSQL database for structured data",
  mysql: "MySQL relational database",
  influxdb: "Time series database for metrics and events",
  elasticsearch: "Search and analytics engine",
  testdata: "Generate test data for development",
};

interface DataSourceSelectorProps {
  onSelect?: (ds: DataSource) => void;
  showAsPopup?: boolean;
}

export function DataSourceSelector({ onSelect, showAsPopup = false }: DataSourceSelectorProps) {
  const { 
    showDataSourceSelector, 
    setShowDataSourceSelector, 
    dataSources,
    selectedDataSource,
    setSelectedDataSource 
  } = useDashboard();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!showDataSourceSelector && !showAsPopup) return null;

  const categories = [
    { id: "all", label: "All" },
    { id: "time-series", label: "Time series" },
    { id: "logging", label: "Logging" },
    { id: "sql", label: "SQL" },
  ];

  const filteredDataSources = dataSources.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "time-series") return matchesSearch && ["prometheus", "influxdb"].includes(ds.type);
    if (selectedCategory === "logging") return matchesSearch && ["loki", "elasticsearch"].includes(ds.type);
    if (selectedCategory === "sql") return matchesSearch && ["postgres", "mysql"].includes(ds.type);
    return matchesSearch;
  });

  const handleSelect = (ds: DataSource) => {
    setSelectedDataSource(ds);
    if (onSelect) onSelect(ds);
    setShowDataSourceSelector(false);
  };

  const content = (
    <div className="w-full max-w-lg">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search data sources..."
            className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 p-4 border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Data sources list */}
      <div className="max-h-80 overflow-y-auto p-2">
        {filteredDataSources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data sources found
          </div>
        ) : (
          <div className="space-y-1">
            {filteredDataSources.map((ds) => (
              <button
                key={ds.id}
                onClick={() => handleSelect(ds)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                  selectedDataSource?.id === ds.id
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-secondary"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  {dataSourceIcons[ds.type] || <Database size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{ds.name}</span>
                    {ds.isDefault && (
                      <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">default</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {dataSourceDescriptions[ds.type]}
                  </p>
                </div>
                {selectedDataSource?.id === ds.id && (
                  <Check size={18} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-secondary/30">
        <p className="text-xs text-muted-foreground">
          Tip: Configure data sources in <span className="text-primary cursor-pointer hover:underline">Connections → Data sources</span>
        </p>
      </div>
    </div>
  );

  if (showAsPopup) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setShowDataSourceSelector(false)}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Select data source</h2>
          <button
            onClick={() => setShowDataSourceSelector(false)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>
        {content}
      </div>
    </div>
  );
}