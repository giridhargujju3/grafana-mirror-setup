import { useState, useEffect } from "react";
import { X, Play, ChevronDown, Database, Plus, Trash2, Save } from "lucide-react";
import { useDashboard, PanelConfig } from "@/contexts/DashboardContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const visualizationTypes = [
  { id: "timeseries", name: "Time series" },
  { id: "stat", name: "Stat" },
  { id: "gauge", name: "Gauge" },
  { id: "barchart", name: "Bar chart" },
  { id: "table", name: "Table" },
  { id: "piechart", name: "Pie chart" },
  { id: "alertlist", name: "Alert list" },
  { id: "logs", name: "Logs" },
  { id: "text", name: "Text" },
];

const dataSources = [
  { id: "prometheus", name: "Prometheus" },
  { id: "loki", name: "Loki" },
  { id: "influxdb", name: "InfluxDB" },
  { id: "elasticsearch", name: "Elasticsearch" },
];

// Generate preview data
const generatePreviewData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 50 + 30),
    });
  }
  return data;
};

export function PanelEditorModal() {
  const { showPanelEditor, setShowPanelEditor, editingPanel, setEditingPanel, updatePanel, addPanel } = useDashboard();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vizType, setVizType] = useState<string>("timeseries");
  const [queries, setQueries] = useState<{ refId: string; expr: string; datasource: string }[]>([]);
  const [showVizDropdown, setShowVizDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"query" | "transform" | "alert">("query");
  const [previewData, setPreviewData] = useState(generatePreviewData());

  useEffect(() => {
    if (editingPanel) {
      setTitle(editingPanel.title);
      setVizType(editingPanel.type);
      setQueries(editingPanel.targets || [{ refId: "A", expr: "", datasource: "prometheus" }]);
    } else {
      setTitle("New Panel");
      setVizType("timeseries");
      setQueries([{ refId: "A", expr: "", datasource: "prometheus" }]);
    }
  }, [editingPanel]);

  if (!showPanelEditor) return null;

  const handleRunQuery = () => {
    setPreviewData(generatePreviewData());
    toast.success("Query executed");
  };

  const handleAddQuery = () => {
    const nextRefId = String.fromCharCode(65 + queries.length); // A, B, C, etc.
    setQueries([...queries, { refId: nextRefId, expr: "", datasource: "prometheus" }]);
  };

  const handleRemoveQuery = (index: number) => {
    setQueries(queries.filter((_, i) => i !== index));
  };

  const handleUpdateQuery = (index: number, field: string, value: string) => {
    const updated = [...queries];
    updated[index] = { ...updated[index], [field]: value };
    setQueries(updated);
  };

  const handleSave = () => {
    if (editingPanel) {
      updatePanel(editingPanel.id, {
        title,
        type: vizType as PanelConfig["type"],
        targets: queries,
      });
      toast.success("Panel updated");
    } else {
      const newPanel: PanelConfig = {
        id: `panel-${Date.now()}`,
        type: vizType as PanelConfig["type"],
        title,
        gridPos: { x: 0, y: 0, w: 6, h: 4 },
        options: {},
        targets: queries,
      };
      addPanel(newPanel);
      toast.success("Panel added to dashboard");
    }
    setShowPanelEditor(false);
    setEditingPanel(null);
  };

  const handleDiscard = () => {
    setShowPanelEditor(false);
    setEditingPanel(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleDiscard}
            className="p-2 rounded hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium bg-transparent border-none focus:outline-none text-foreground"
            placeholder="Panel title"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDiscard} className="grafana-btn grafana-btn-secondary">
            Discard
          </button>
          <button onClick={handleSave} className="grafana-btn grafana-btn-primary">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main content - Preview + Query */}
        <div className="flex-1 flex flex-col">
          {/* Preview panel */}
          <div className="h-1/2 border-b border-border p-4">
            <div className="grafana-panel h-full">
              <div className="grafana-panel-header">
                <h3 className="grafana-panel-title">{title || "Panel Preview"}</h3>
              </div>
              <div className="grafana-panel-content">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={previewData}>
                    <defs>
                      <linearGradient id="preview-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 22%)" vertical={false} />
                    <XAxis dataKey="time" stroke="hsl(210, 15%, 55%)" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(210, 15%, 55%)" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 18%, 15%)",
                        border: "1px solid hsl(220, 18%, 22%)",
                        borderRadius: "6px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(24, 100%, 50%)"
                      strokeWidth={2}
                      fill="url(#preview-gradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Query section */}
          <div className="flex-1 overflow-auto">
            {/* Tabs */}
            <div className="border-b border-border flex">
              {(["query", "transform", "alert"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2",
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "query" && (
              <div className="p-4 space-y-4">
                {queries.map((query, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-primary/20 text-primary text-sm font-medium flex items-center justify-center">
                          {query.refId}
                        </span>
                        
                        {/* Data source selector */}
                        <div className="relative">
                          <select
                            value={query.datasource}
                            onChange={(e) => handleUpdateQuery(index, "datasource", e.target.value)}
                            className="appearance-none bg-secondary border border-border rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {dataSources.map((ds) => (
                              <option key={ds.id} value={ds.id}>{ds.name}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleRunQuery}
                          className="grafana-btn grafana-btn-primary text-xs py-1"
                        >
                          <Play size={14} />
                          Run
                        </button>
                        {queries.length > 1 && (
                          <button
                            onClick={() => handleRemoveQuery(index)}
                            className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Query input */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Metric / Query</label>
                      <input
                        type="text"
                        value={query.expr}
                        onChange={(e) => handleUpdateQuery(index, "expr", e.target.value)}
                        placeholder={query.datasource === "prometheus" ? "rate(http_requests_total[5m])" : "{job=\"nginx\"}"}
                        className="w-full px-3 py-2 bg-input border border-border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    {/* Query hints */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">Examples:</span>
                      {query.datasource === "prometheus" && (
                        <>
                          <button
                            onClick={() => handleUpdateQuery(index, "expr", "up")}
                            className="text-xs px-2 py-0.5 bg-secondary rounded hover:bg-secondary/80"
                          >
                            up
                          </button>
                          <button
                            onClick={() => handleUpdateQuery(index, "expr", "rate(http_requests_total[5m])")}
                            className="text-xs px-2 py-0.5 bg-secondary rounded hover:bg-secondary/80"
                          >
                            rate(http_requests_total[5m])
                          </button>
                          <button
                            onClick={() => handleUpdateQuery(index, "expr", "node_cpu_seconds_total")}
                            className="text-xs px-2 py-0.5 bg-secondary rounded hover:bg-secondary/80"
                          >
                            node_cpu_seconds_total
                          </button>
                        </>
                      )}
                      {query.datasource === "loki" && (
                        <>
                          <button
                            onClick={() => handleUpdateQuery(index, "expr", '{job="nginx"}')}
                            className="text-xs px-2 py-0.5 bg-secondary rounded hover:bg-secondary/80"
                          >
                            {'{job="nginx"}'}
                          </button>
                          <button
                            onClick={() => handleUpdateQuery(index, "expr", '{level="error"}')}
                            className="text-xs px-2 py-0.5 bg-secondary rounded hover:bg-secondary/80"
                          >
                            {'{level="error"}'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddQuery}
                  className="w-full py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add query
                </button>
              </div>
            )}

            {activeTab === "transform" && (
              <div className="p-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Transformations</p>
                  <p className="text-sm">Add transformations to manipulate your query results</p>
                  <button className="grafana-btn grafana-btn-secondary mt-4">
                    <Plus size={16} />
                    Add transformation
                  </button>
                </div>
              </div>
            )}

            {activeTab === "alert" && (
              <div className="p-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Alert Rules</p>
                  <p className="text-sm">Create alert rules for this panel's query</p>
                  <button className="grafana-btn grafana-btn-secondary mt-4">
                    <Plus size={16} />
                    Create alert rule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Panel options */}
        <div className="w-80 border-l border-border bg-card overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground mb-3">Panel options</h3>
            
            {/* Title */}
            <div className="space-y-2 mb-4">
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Panel description"
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={2}
              />
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-foreground mb-3">Visualization</h3>
            
            {/* Visualization type selector */}
            <div className="relative">
              <button
                onClick={() => setShowVizDropdown(!showVizDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 bg-secondary border border-border rounded hover:border-primary transition-colors"
              >
                <span className="capitalize">{vizType.replace("-", " ")}</span>
                <ChevronDown size={14} />
              </button>
              {showVizDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10 py-1 max-h-60 overflow-y-auto">
                  {visualizationTypes.map((viz) => (
                    <button
                      key={viz.id}
                      onClick={() => {
                        setVizType(viz.id);
                        setShowVizDropdown(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left hover:bg-secondary transition-colors",
                        vizType === viz.id && "bg-secondary text-primary"
                      )}
                    >
                      {viz.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
