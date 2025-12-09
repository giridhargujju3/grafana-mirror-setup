import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboardRegistry } from "@/contexts/DashboardRegistryContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { GrafanaDashboard } from "@/components/grafana/GrafanaDashboard";
import { UnsavedChangesModal } from "@/components/grafana/modals/UnsavedChangesModal";

export default function DashboardEditorPage() {
  const navigate = useNavigate();
  const { dashboardId } = useParams();
  const {
    createNewDashboard,
    openDashboard,
    getActiveDashboard,
    getDashboard,
    hasUnsavedDraft,
    getUnsavedDraft,
    saveDashboard,
    discardDashboard,
  } = useDashboardRegistry();

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    if (dashboardId) {
      // Opening an existing dashboard
      const dashboard = getDashboard(dashboardId);
      if (dashboard) {
        openDashboard(dashboardId);
      } else {
        // Dashboard not found, redirect to dashboards list
        navigate("/dashboards");
        return;
      }
    } else {
      // Creating new dashboard OR opening existing draft
      // Check if there's already an unsaved draft
      if (hasUnsavedDraft()) {
        const draft = getUnsavedDraft();
        if (draft) {
          // Reuse existing draft instead of creating duplicate
          openDashboard(draft.id);
          navigate(`/dashboard/${draft.id}`, { replace: true });
        }
      } else {
        // Create new dashboard
        const newId = createNewDashboard();
        navigate(`/dashboard/${newId}`, { replace: true });
      }
    }
    setInitialized(true);
  }, [dashboardId, initialized]);

  const activeDashboard = getActiveDashboard();

  const handleSave = () => {
    if (activeDashboard) {
      saveDashboard(activeDashboard.id);
      setShowUnsavedModal(false);
    }
  };

  const handleDiscard = () => {
    if (activeDashboard) {
      discardDashboard(activeDashboard.id);
      setShowUnsavedModal(false);
      navigate("/dashboards");
    }
  };

  if (!activeDashboard) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <DashboardProvider
      key={activeDashboard.id}
      initialTitle={activeDashboard.title}
      initialFolder={activeDashboard.folder}
      initialTags={activeDashboard.tags}
      initialPanels={activeDashboard.panels}
      isNewDashboard={activeDashboard.isNew}
      dashboardId={activeDashboard.id}
    >
      <GrafanaDashboard />
      <UnsavedChangesModal
        open={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onDiscard={handleDiscard}
        onSave={handleSave}
        dashboardTitle={activeDashboard.title}
        isNew={activeDashboard.isNew}
      />
    </DashboardProvider>
  );
}
