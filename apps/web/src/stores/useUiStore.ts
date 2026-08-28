import { create } from 'zustand';

interface UiState {
  sidebarCollapsed: boolean;
  selectedZoneId: string | null;
  zoneDrawerOpen: boolean;
  alertDrawerOpen: boolean;
  activeRegion: string;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openZoneDrawer: (zoneId: string) => void;
  closeZoneDrawer: () => void;
  toggleAlertDrawer: () => void;
  setAlertDrawerOpen: (open: boolean) => void;
  setActiveRegion: (region: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  selectedZoneId: null,
  zoneDrawerOpen: false,
  alertDrawerOpen: false,
  activeRegion: 'North-Eastern Region (NER) Operational Grid',

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  openZoneDrawer: (zoneId) => set({ selectedZoneId: zoneId, zoneDrawerOpen: true }),
  closeZoneDrawer: () => set({ zoneDrawerOpen: false }),
  toggleAlertDrawer: () => set((state) => ({ alertDrawerOpen: !state.alertDrawerOpen })),
  setAlertDrawerOpen: (open) => set({ alertDrawerOpen: open }),
  setActiveRegion: (region) => set({ activeRegion: region }),
}));
