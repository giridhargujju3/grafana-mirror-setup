import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { PanelConfig, DashboardState } from "./DashboardContext";

export interface DashboardEntry {
  id: string;
  uid: string;
  title: string;
  tags: string[];
  folder: string;
  panels: PanelConfig[];
  time: { from: string; to: string };
  refresh: string;
  starred: boolean;
  version: number;
  isNew: boolean; // Unsaved new dashboard
  isDirty: boolean; // Has unsaved changes
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardRegistryContextType {
  dashboards: DashboardEntry[];
  activeDashboardId: string | null;
  
  // Dashboard CRUD
  createNewDashboard: () => string; // Returns the new dashboard ID
  openDashboard: (id: string) => void;
  saveDashboard: (id: string, title?: string, folder?: string, tags?: string[]) => void;
  discardDashboard: (id: string) => void;
  deleteDashboard: (id: string) => void;
  
  // Get dashboard
  getActiveDashboard: () => DashboardEntry | null;
  getDashboard: (id: string) => DashboardEntry | null;
  
  // Update dashboard
  updateDashboardPanels: (id: string, panels: PanelConfig[]) => void;
  markDashboardDirty: (id: string) => void;
  
  // Check for unsaved drafts
  hasUnsavedDraft: () => boolean;
  getUnsavedDraft: () => DashboardEntry | null;
}

const DashboardRegistryContext = createContext<DashboardRegistryContextType | undefined>(undefined);

// Sample saved dashboards
const initialDashboards: DashboardEntry[] = [
  {
    id: "system-monitoring",
    uid: "sys-mon-001",
    title: "System Monitoring",
    tags: ["monitoring", "system"],
    folder: "General",
    panels: [],
    time: { from: "now-6h", to: "now" },
    refresh: "Off",
    starred: true,
    version: 1,
    isNew: false,
    isDirty: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-08"),
  },
  {
    id: "network-overview",
    uid: "net-ovr-001",
    title: "Network Overview",
    tags: ["network", "infrastructure"],
    folder: "Infrastructure",
    panels: [],
    time: { from: "now-1h", to: "now" },
    refresh: "30s",
    starred: false,
    version: 3,
    isNew: false,
    isDirty: false,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-12-07"),
  },
];

export function DashboardRegistryProvider({ children }: { children: ReactNode }) {
  const [dashboards, setDashboards] = useState<DashboardEntry[]>(initialDashboards);
  const [activeDashboardId, setActiveDashboardId] = useState<string | null>(null);

  const generateId = () => `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const generateUid = () => `d${Math.random().toString(36).substr(2, 8)}`;

  const hasUnsavedDraft = useCallback(() => {
    return dashboards.some(d => d.isNew);
  }, [dashboards]);

  const getUnsavedDraft = useCallback(() => {
    return dashboards.find(d => d.isNew) || null;
  }, [dashboards]);

  const createNewDashboard = useCallback(() => {
    // Check if there's already an unsaved "New Dashboard" - return that one instead
    const existingDraft = dashboards.find(d => d.isNew);
    if (existingDraft) {
      setActiveDashboardId(existingDraft.id);
      return existingDraft.id;
    }

    // Create new draft dashboard
    const newId = generateId();
    const newDashboard: DashboardEntry = {
      id: newId,
      uid: generateUid(),
      title: "New Dashboard",
      tags: [],
      folder: "General",
      panels: [],
      time: { from: "now-6h", to: "now" },
      refresh: "Off",
      starred: false,
      version: 0,
      isNew: true,
      isDirty: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDashboards(prev => [...prev, newDashboard]);
    setActiveDashboardId(newId);
    return newId;
  }, [dashboards]);

  const openDashboard = useCallback((id: string) => {
    setActiveDashboardId(id);
  }, []);

  const saveDashboard = useCallback((id: string, title?: string, folder?: string, tags?: string[]) => {
    setDashboards(prev => prev.map(d => {
      if (d.id !== id) return d;
      return {
        ...d,
        title: title || d.title,
        folder: folder || d.folder,
        tags: tags || d.tags,
        isNew: false,
        isDirty: false,
        version: d.version + 1,
        updatedAt: new Date(),
      };
    }));
  }, []);

  const discardDashboard = useCallback((id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    if (!dashboard) return;

    if (dashboard.isNew) {
      // Remove unsaved new dashboard completely
      setDashboards(prev => prev.filter(d => d.id !== id));
      if (activeDashboardId === id) {
        setActiveDashboardId(null);
      }
    } else {
      // Reset dirty state (in real app, would reload from server)
      setDashboards(prev => prev.map(d => 
        d.id === id ? { ...d, isDirty: false } : d
      ));
    }
  }, [dashboards, activeDashboardId]);

  const deleteDashboard = useCallback((id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
    if (activeDashboardId === id) {
      setActiveDashboardId(null);
    }
  }, [activeDashboardId]);

  const getActiveDashboard = useCallback(() => {
    if (!activeDashboardId) return null;
    return dashboards.find(d => d.id === activeDashboardId) || null;
  }, [activeDashboardId, dashboards]);

  const getDashboard = useCallback((id: string) => {
    return dashboards.find(d => d.id === id) || null;
  }, [dashboards]);

  const updateDashboardPanels = useCallback((id: string, panels: PanelConfig[]) => {
    setDashboards(prev => prev.map(d => 
      d.id === id ? { ...d, panels, isDirty: true, updatedAt: new Date() } : d
    ));
  }, []);

  const markDashboardDirty = useCallback((id: string) => {
    setDashboards(prev => prev.map(d => 
      d.id === id ? { ...d, isDirty: true } : d
    ));
  }, []);

  return (
    <DashboardRegistryContext.Provider
      value={{
        dashboards,
        activeDashboardId,
        createNewDashboard,
        openDashboard,
        saveDashboard,
        discardDashboard,
        deleteDashboard,
        getActiveDashboard,
        getDashboard,
        updateDashboardPanels,
        markDashboardDirty,
        hasUnsavedDraft,
        getUnsavedDraft,
      }}
    >
      {children}
    </DashboardRegistryContext.Provider>
  );
}

export function useDashboardRegistry() {
  const context = useContext(DashboardRegistryContext);
  if (context === undefined) {
    throw new Error("useDashboardRegistry must be used within a DashboardRegistryProvider");
  }
  return context;
}
