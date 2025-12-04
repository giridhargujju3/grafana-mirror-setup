import { X, LineChart, BarChart3, Gauge, Table2, PieChart, MapPin, Text, AlertCircle } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const panelTypes = [
  { icon: LineChart, name: "Time series", description: "Graph time series data" },
  { icon: BarChart3, name: "Bar chart", description: "Categorical bar chart" },
  { icon: Gauge, name: "Gauge", description: "Single value gauge" },
  { icon: Table2, name: "Table", description: "Display data as a table" },
  { icon: PieChart, name: "Pie chart", description: "Proportional data visualization" },
  { icon: Text, name: "Stat", description: "Big number with optional sparkline" },
  { icon: AlertCircle, name: "Alert list", description: "Show alert states" },
  { icon: MapPin, name: "Geomap", description: "Geographic data visualization" },
];

export function AddPanelModal() {
  const { showAddPanelModal, setShowAddPanelModal } = useDashboard();

  if (!showAddPanelModal) return null;

  const handleAddPanel = (panelType: string) => {
    toast.success(`Added ${panelType} panel to dashboard`);
    setShowAddPanelModal(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setShowAddPanelModal(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-card border border-border rounded-lg shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Add Panel</h2>
          <button
            onClick={() => setShowAddPanelModal(false)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select a visualization type to add to your dashboard
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {panelTypes.map((panel) => (
              <button
                key={panel.name}
                onClick={() => handleAddPanel(panel.name)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-all group"
              >
                <div className="p-3 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors">
                  <panel.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">{panel.name}</div>
                  <div className="text-xs text-muted-foreground">{panel.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => {
                toast.info("Opening panel library...");
                setShowAddPanelModal(false);
              }}
              className="w-full grafana-btn grafana-btn-secondary"
            >
              Add panel from library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
