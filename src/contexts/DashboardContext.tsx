import { createContext, useContext, useState, ReactNode } from "react";

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
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  dashboardTitle: string;
  setDashboardTitle: (title: string) => void;
  isStarred: boolean;
  setIsStarred: (starred: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRange] = useState("Last 6 hours");
  const [refreshInterval, setRefreshInterval] = useState("Off");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddPanelModal, setShowAddPanelModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("System Monitoring");
  const [isStarred, setIsStarred] = useState(false);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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
        sidebarCollapsed,
        setSidebarCollapsed,
        dashboardTitle,
        setDashboardTitle,
        isStarred,
        setIsStarred,
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
