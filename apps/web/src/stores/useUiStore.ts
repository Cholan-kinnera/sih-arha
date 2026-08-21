import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  assistantDockExpanded: boolean;
  activeLanguage: string;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setAssistantDockExpanded: (expanded: boolean) => void;
  toggleAssistantDock: () => void;
  setActiveLanguage: (lang: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  assistantDockExpanded: false,
  activeLanguage: 'en',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setAssistantDockExpanded: (expanded) => set({ assistantDockExpanded: expanded }),
  toggleAssistantDock: () => set((state) => ({ assistantDockExpanded: !state.assistantDockExpanded })),
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
}));
