import { useState } from "react";
import { cn } from "@/lib/utils";
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
  FolderOpen,
  Search,
  HelpCircle,
  User,
} from "lucide-react";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  active?: boolean;
  children?: { label: string; href: string }[];
}

const menuItems: SidebarItem[] = [
  { icon: Home, label: "Home", active: true },
  { icon: Star, label: "Starred" },
  { icon: LayoutDashboard, label: "Dashboards", children: [
    { label: "Browse", href: "#" },
    { label: "Playlists", href: "#" },
    { label: "Snapshots", href: "#" },
    { label: "Library panels", href: "#" },
    { label: "New dashboard", href: "#" },
    { label: "New folder", href: "#" },
    { label: "Import", href: "#" },
  ]},
  { icon: Compass, label: "Explore" },
  { icon: Bell, label: "Alerting", children: [
    { label: "Alert rules", href: "#" },
    { label: "Contact points", href: "#" },
    { label: "Notification policies", href: "#" },
    { label: "Silences", href: "#" },
    { label: "Alert groups", href: "#" },
  ]},
  { icon: Database, label: "Connections", children: [
    { label: "Data sources", href: "#" },
    { label: "Plugins", href: "#" },
  ]},
];

const adminItems: SidebarItem[] = [
  { icon: Settings, label: "Administration", children: [
    { label: "General", href: "#" },
    { label: "Plugins", href: "#" },
    { label: "Users", href: "#" },
    { label: "Teams", href: "#" },
    { label: "Service accounts", href: "#" },
  ]},
];

export function GrafanaSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboards"]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(i => i !== label)
        : [...prev, label]
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-grafana-orange flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <span className="font-semibold text-foreground">Grafana</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-input rounded border border-border text-muted-foreground text-sm">
            <Search size={16} />
            <span>Search or jump to...</span>
            <kbd className="ml-auto text-xs bg-secondary px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => item.children && toggleExpanded(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon size={20} className={item.active ? "text-primary" : ""} />
                {!collapsed && (
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
              {!collapsed && item.children && expandedItems.includes(item.label) && (
                <ul className="ml-8 mt-1 space-y-0.5">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <a
                        href={child.href}
                        className="block px-3 py-1.5 text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50 rounded"
                      >
                        {child.label}
                      </a>
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
                onClick={() => item.children && toggleExpanded(item.label)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <item.icon size={20} />
                {!collapsed && (
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
              {!collapsed && item.children && expandedItems.includes(item.label) && (
                <ul className="ml-8 mt-1 space-y-0.5">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <a
                        href={child.href}
                        className="block px-3 py-1.5 text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50 rounded"
                      >
                        {child.label}
                      </a>
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
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent/50">
          <HelpCircle size={20} />
          {!collapsed && <span>Help</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent/50">
          <div className="w-5 h-5 rounded-full bg-grafana-blue flex items-center justify-center">
            <User size={12} className="text-info-foreground" />
          </div>
          {!collapsed && <span>Admin</span>}
        </button>
      </div>
    </aside>
  );
}
