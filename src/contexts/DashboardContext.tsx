import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

export interface PanelConfig {
  id: string;
  type: "timeseries" | "stat" | "gauge" | "barchart" | "table" | "alertlist" | "logs" | "piechart" | "text";
  title: string;
  gridPos: { x: number; y: number; w: number; h: number };
  options: Record<string, any>;
  targets?: QueryTarget[];
}

export interface QueryTarget {
  refId: string;
  expr: string;
  datasource: string;
}

export interface Dashboard {
  id: string;
  uid: string;
  title: string;
  tags: string[];
  panels: PanelConfig[];
  time: { from: string; to: string };
  refresh: string;
  starred: boolean;
}

interface DashboardContextType {
  timeRange: string;
  setTimeRange: (range: string) => void;
  refreshInterval: string;
  setRefreshInterval: (interval: string) => void;
  isRefreshing: boolean;
  triggerRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchModal: boolean;
  setShowSearchModal: (show: boolean) => void;
  showAddPanelModal: boolean;
  setShowAddPanelModal: (show: boolean) => void;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  showPanelEditor: boolean;
  setShowPanelEditor: (show: boolean) => void;
  editingPanel: PanelConfig | null;
  setEditingPanel: (panel: PanelConfig | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  dashboardTitle: string;
  setDashboardTitle: (title: string) => void;
  isStarred: boolean;
  setIsStarred: (starred: boolean) => void;
  panels: PanelConfig[];
  setPanels: (panels: PanelConfig[]) => void;
  addPanel: (panel: PanelConfig) => void;
  updatePanel: (id: string, updates: Partial<PanelConfig>) => void;
  removePanel: (id: string) => void;
  duplicatePanel: (id: string) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  variables: Record<string, string>;
  setVariables: (vars: Record<string, string>) => void;
  dataRefreshKey: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultPanels: PanelConfig[] = [
  {
    id: "cpu-stat",
    type: "stat",
    title: "CPU Usage",
    gridPos: { x: 0, y: 0, w: 3, h: 2 },
    options: { value: 72, unit: "%", color: "orange", trend: "up", trendValue: "+5%", sparklineData: [40, 45, 42, 55, 60, 58, 65, 70, 68, 72] },
  },
  {
    id: "memory-stat",
    type: "stat",
    title: "Memory Usage",
    gridPos: { x: 3, y: 0, w: 3, h: 2 },
    options: { value: 64, unit: "%", color: "blue", trend: "neutral", trendValue: "0%", sparklineData: [60, 62, 61, 63, 64, 63, 65, 64, 63, 64] },
  },
  {
    id: "users-stat",
    type: "stat",
    title: "Active Users",
    gridPos: { x: 6, y: 0, w: 3, h: 2 },
    options: { value: "12.4k", color: "green", trend: "up", trendValue: "+12%", sparklineData: [80, 85, 82, 88, 90, 92, 95, 93, 97, 100] },
  },
  {
    id: "error-stat",
    type: "stat",
    title: "Error Rate",
    gridPos: { x: 9, y: 0, w: 3, h: 2 },
    options: { value: 0.23, unit: "%", color: "red", trend: "down", trendValue: "-0.05%", sparklineData: [35, 32, 30, 28, 25, 27, 24, 23, 24, 23] },
  },
  {
    id: "system-metrics",
    type: "timeseries",
    title: "System Metrics",
    gridPos: { x: 0, y: 2, w: 8, h: 4 },
    options: {},
    targets: [
      { refId: "A", expr: "cpu_usage", datasource: "prometheus" },
      { refId: "B", expr: "memory_usage", datasource: "prometheus" },
    ],
  },
  {
    id: "alerts",
    type: "alertlist",
    title: "Active Alerts",
    gridPos: { x: 8, y: 2, w: 4, h: 4 },
    options: {},
  },
  {
    id: "cpu-gauge",
    type: "gauge",
    title: "CPU Load Average",
    gridPos: { x: 0, y: 6, w: 4, h: 3 },
    options: { value: 72 },
  },
  {
    id: "memory-gauge",
    type: "gauge",
    title: "Memory Pressure",
    gridPos: { x: 4, y: 6, w: 4, h: 3 },
    options: { value: 64 },
  },
  {
    id: "disk-gauge",
    type: "gauge",
    title: "Disk Usage",
    gridPos: { x: 8, y: 6, w: 4, h: 3 },
    options: { value: 45 },
  },
  {
    id: "top-endpoints",
    type: "barchart",
    title: "Top Endpoints by Requests",
    gridPos: { x: 0, y: 9, w: 6, h: 3 },
    options: { layout: "horizontal" },
  },
  {
    id: "service-status",
    type: "table",
    title: "Service Status",
    gridPos: { x: 6, y: 9, w: 6, h: 3 },
    options: {},
  },
  {
    id: "logs",
    type: "logs",
    title: "Recent Logs",
    gridPos: { x: 0, y: 12, w: 12, h: 3 },
    options: {},
  },
];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRange] = useState("Last 6 hours");
  const [refreshInterval, setRefreshInterval] = useState("Off");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddPanelModal, setShowAddPanelModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPanelEditor, setShowPanelEditor] = useState(false);
  const [editingPanel, setEditingPanel] = useState<PanelConfig | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("System Monitoring");
  const [isStarred, setIsStarred] = useState(false);
  const [panels, setPanels] = useState<PanelConfig[]>(defaultPanels);
  const [isEditMode, setIsEditMode] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({ env: "production", region: "us-east-1" });
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setIsRefreshing(true);
    setDataRefreshKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval === "Off") return;
    
    const intervalMs: Record<string, number> = {
      "5s": 5000,
      "10s": 10000,
      "30s": 30000,
      "1m": 60000,
      "5m": 300000,
      "15m": 900000,
      "30m": 1800000,
      "1h": 3600000,
    };
    
    const ms = intervalMs[refreshInterval];
    if (!ms) return;
    
    const interval = setInterval(() => {
      triggerRefresh();
    }, ms);
    
    return () => clearInterval(interval);
  }, [refreshInterval, triggerRefresh]);

  const addPanel = useCallback((panel: PanelConfig) => {
    setPanels(prev => [...prev, panel]);
  }, []);

  const updatePanel = useCallback((id: string, updates: Partial<PanelConfig>) => {
    setPanels(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removePanel = useCallback((id: string) => {
    setPanels(prev => prev.filter(p => p.id !== id));
  }, []);

  const duplicatePanel = useCallback((id: string) => {
    setPanels(prev => {
      const panel = prev.find(p => p.id === id);
      if (!panel) return prev;
      const newPanel = {
        ...panel,
        id: `${panel.id}-copy-${Date.now()}`,
        title: `${panel.title} (copy)`,
        gridPos: { ...panel.gridPos, y: panel.gridPos.y + panel.gridPos.h },
      };
      return [...prev, newPanel];
    });
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        timeRange,
        setTimeRange,
        refreshInterval,
        setRefreshInterval,
        isRefreshing,
        triggerRefresh,
        searchQuery,
        setSearchQuery,
        showSearchModal,
        setShowSearchModal,
        showAddPanelModal,
        setShowAddPanelModal,
        showShareModal,
        setShowShareModal,
        showSettingsModal,
        setShowSettingsModal,
        showPanelEditor,
        setShowPanelEditor,
        editingPanel,
        setEditingPanel,
        sidebarCollapsed,
        setSidebarCollapsed,
        dashboardTitle,
        setDashboardTitle,
        isStarred,
        setIsStarred,
        panels,
        setPanels,
        addPanel,
        updatePanel,
        removePanel,
        duplicatePanel,
        isEditMode,
        setIsEditMode,
        variables,
        setVariables,
        dataRefreshKey,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
