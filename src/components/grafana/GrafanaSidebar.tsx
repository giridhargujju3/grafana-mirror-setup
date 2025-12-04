import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Home,
  LayoutDashboard,
  Compass,
  Bell,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  HelpCircle,
  User,
  FolderPlus,
  FileUp,
  List,
  Play,
  Camera,
  Library,
  AlertTriangle,
  Phone,
  Shield,
  Volume2,
  Users as UsersIcon,
  Plug,
  Package,
  Building,
  UserCog,
  Key,
} from "lucide-react";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: { label: string; href: string; icon?: React.ElementType }[];
}

const menuItems: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Star, label: "Starred", href: "/starred" },
  { 
    icon: LayoutDashboard, 
    label: "Dashboards", 
    href: "/dashboards",
    children: [
      { label: "Browse", href: "/dashboards", icon: List },
      { label: "Playlists", href: "/dashboards/playlists", icon: Play },
      { label: "Snapshots", href: "/dashboards/snapshots", icon: Camera },
      { label: "Library panels", href: "/dashboards/library", icon: Library },
      { label: "New dashboard", href: "/dashboards/new", icon: LayoutDashboard },
      { label: "New folder", href: "/dashboards/folder/new", icon: FolderPlus },
      { label: "Import", href: "/dashboards/import", icon: FileUp },
    ]
  },
  { icon: Compass, label: "Explore", href: "/explore" },
  { 
    icon: Bell, 
    label: "Alerting",
    href: "/alerting",
    children: [
      { label: "Alert rules", href: "/alerting/rules", icon: AlertTriangle },
      { label: "Contact points", href: "/alerting/contacts", icon: Phone },
      { label: "Notification policies", href: "/alerting/policies", icon: Shield },
      { label: "Silences", href: "/alerting/silences", icon: Volume2 },
      { label: "Alert groups", href: "/alerting/groups", icon: UsersIcon },
    ]
  },
  { 
    icon: Database, 
    label: "Connections",
    href: "/connections",
    children: [
      { label: "Data sources", href: "/connections/datasources", icon: Database },
      { label: "Plugins", href: "/connections/plugins", icon: Plug },
    ]
  },
];

const adminItems: SidebarItem[] = [
  { 
    icon: Settings, 
    label: "Administration",
    href: "/admin",
    children: [
      { label: "General", href: "/admin/general", icon: Settings },
      { label: "Plugins", href: "/admin/plugins", icon: Package },
      { label: "Users", href: "/admin/users", icon: UsersIcon },
      { label: "Teams", href: "/admin/teams", icon: Building },
      { label: "Service accounts", href: "/admin/service-accounts", icon: Key },
    ]
  },
];

export function GrafanaSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, setShowSearchModal } = useDashboard();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboards"]);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(i => i !== label)
        : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowSearchModal]);

  const handleNavigation = (item: SidebarItem) => {
    if (item.children) {
      toggleExpanded(item.label);
    }
    if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 flex-shrink-0",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded bg-grafana-orange flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <span className="font-semibold text-foreground">Grafana</span>
          </button>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="p-3">
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-input rounded border border-border text-muted-foreground text-sm hover:border-primary/50 transition-colors"
          >
            <Search size={16} />
            <span>Search or jump to...</span>
            <kbd className="ml-auto text-xs bg-secondary px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </div>
      )}

      {sidebarCollapsed && (
        <div className="p-2">
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full p-2 rounded hover:bg-sidebar-accent text-sidebar-foreground transition-colors flex justify-center"
            title="Search (⌘K)"
          >
            <Search size={20} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon size={20} className={isActive(item.href) ? "text-primary" : ""} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children && (
                      <ChevronRight
                        size={16}
                        className={cn(
                          "transition-transform",
                          expandedItems.includes(item.label) && "rotate-90"
                        )}
                      />
                    )}
                  </>
                )}
              </button>
              {!sidebarCollapsed && item.children && expandedItems.includes(item.label) && (
                <ul className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-4">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <button
                        onClick={() => navigate(child.href)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors",
                          location.pathname === child.href
                            ? "text-primary bg-sidebar-accent/50"
                            : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {child.icon && <child.icon size={14} />}
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="my-4 mx-4 border-t border-sidebar-border" />

        <ul className="space-y-0.5 px-2">
          {adminItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon size={20} className={isActive(item.href) ? "text-primary" : ""} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children && (
                      <ChevronRight
                        size={16}
                        className={cn(
                          "transition-transform",
                          expandedItems.includes(item.label) && "rotate-90"
                        )}
                      />
                    )}
                  </>
                )}
              </button>
              {!sidebarCollapsed && item.children && expandedItems.includes(item.label) && (
                <ul className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-4">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <button
                        onClick={() => navigate(child.href)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors",
                          location.pathname === child.href
                            ? "text-primary bg-sidebar-accent/50"
                            : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {child.icon && <child.icon size={14} />}
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-2">
        <button 
          onClick={() => window.open("https://grafana.com/docs/", "_blank")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <HelpCircle size={20} />
          {!sidebarCollapsed && <span>Help</span>}
        </button>
        <button 
          onClick={() => navigate("/admin/users")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-grafana-blue flex items-center justify-center">
            <User size={12} className="text-info-foreground" />
          </div>
          {!sidebarCollapsed && <span>Admin</span>}
        </button>
      </div>
    </aside>
  );
}
