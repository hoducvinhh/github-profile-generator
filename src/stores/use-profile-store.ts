import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProfileConfig, SectionConfig, SectionItem, SectionType, TemplateId, ThemeId } from "@/types/profile";
import { getTemplate } from "@/lib/templates/registry";
import { createSection } from "@/lib/sections/registry";

interface HistoryState {
  past: ProfileConfig[];
  future: ProfileConfig[];
}

interface ProfileStoreState {
  config: ProfileConfig;
  activeSectionId: string | null;
  history: HistoryState;

  // Actions
  setActiveSectionId: (id: string | null) => void;
  setTemplate: (templateId: TemplateId) => void;
  setTheme: (themeId: ThemeId) => void;
  setGithubUsername: (username: string) => void;

  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  toggleSectionVisibility: (id: string) => void;
  updateSectionConfig: (id: string, partialConfig: Record<string, any>) => void;
  updateSectionTitle: (id: string, title: string) => void;

  importProfileConfig: (config: ProfileConfig) => void;
  resetToTemplate: (templateId?: TemplateId) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const MAX_HISTORY = 25;

const initialConfig = getTemplate("modern").createConfig("alexrivera");

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set, get) => {
      const pushHistory = (currentConfig: ProfileConfig) => {
        const { history } = get();
        return {
          past: [...history.past.slice(-MAX_HISTORY + 1), currentConfig],
          future: [],
        };
      };

      return {
        config: initialConfig,
        activeSectionId: initialConfig.sections[0]?.id || null,
        history: { past: [], future: [] },
        canUndo: false,
        canRedo: false,

        setActiveSectionId: (id) => set({ activeSectionId: id }),

        setTemplate: (templateId) => {
          const current = get().config;
          const newConfig = getTemplate(templateId).createConfig(current.githubUsername);
          set({
            config: newConfig,
            activeSectionId: newConfig.sections[0]?.id || null,
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        setTheme: (themeId) => {
          const current = get().config;
          set({
            config: { ...current, themeId },
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        setGithubUsername: (username) => {
          const current = get().config;
          // Synchronize username across stats cards if they had the previous username
          const prevUser = current.githubUsername;
          const updatedSections = current.sections.map((sec) => {
            if (
              ["github-stats", "streak-stats", "top-langs", "quote-counter"].includes(sec.type)
            ) {
              const cfg = { ...sec.config };
              if ("username" in cfg && (cfg.username === prevUser || !cfg.username)) {
                cfg.username = username;
              }
              if ("counterUsername" in cfg && (cfg.counterUsername === prevUser || !cfg.counterUsername)) {
                cfg.counterUsername = username;
              }
              return { ...sec, config: cfg };
            }
            return sec;
          });

          set({
            config: {
              ...current,
              githubUsername: username,
              sections: updatedSections,
            },
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        addSection: (type) => {
          const current = get().config;
          const newSection = createSection(type);
          if (current.githubUsername) {
            if ("username" in newSection.config) {
              (newSection.config as any).username = current.githubUsername;
            }
            if ("counterUsername" in newSection.config) {
              (newSection.config as any).counterUsername = current.githubUsername;
            }
          }

          set({
            config: {
              ...current,
              sections: [...current.sections, newSection],
            },
            activeSectionId: newSection.id,
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        removeSection: (id) => {
          const current = get().config;
          const remaining = current.sections.filter((s) => s.id !== id);
          const nextActive =
            get().activeSectionId === id ? remaining[0]?.id || null : get().activeSectionId;

          set({
            config: {
              ...current,
              sections: remaining,
            },
            activeSectionId: nextActive,
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        duplicateSection: (id) => {
          const current = get().config;
          const index = current.sections.findIndex((s) => s.id === id);
          if (index === -1) return;

          const target = current.sections[index];
          const cloned: SectionItem = {
            ...target,
            id: `sec_${target.type}_${Date.now()}`,
            title: `${target.title} (Copy)`,
            config: JSON.parse(JSON.stringify(target.config)),
          };

          const newSections = [...current.sections];
          newSections.splice(index + 1, 0, cloned);

          set({
            config: { ...current, sections: newSections },
            activeSectionId: cloned.id,
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        reorderSections: (activeId, overId) => {
          const current = get().config;
          const oldIndex = current.sections.findIndex((s) => s.id === activeId);
          const newIndex = current.sections.findIndex((s) => s.id === overId);
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

          const reordered = [...current.sections];
          const [movedItem] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, movedItem);

          set({
            config: { ...current, sections: reordered },
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        toggleSectionVisibility: (id) => {
          const current = get().config;
          const updated = current.sections.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          );
          set({
            config: { ...current, sections: updated },
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        updateSectionConfig: (id, partialConfig) => {
          const current = get().config;
          const updated = current.sections.map((s) =>
            s.id === id
              ? { ...s, config: { ...s.config, ...partialConfig } }
              : s
          );
          set({
            config: { ...current, sections: updated },
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        updateSectionTitle: (id, title) => {
          const current = get().config;
          const updated = current.sections.map((s) =>
            s.id === id ? { ...s, title } : s
          );
          set({
            config: { ...current, sections: updated },
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        importProfileConfig: (newConfig) => {
          const current = get().config;
          set({
            config: newConfig,
            activeSectionId: newConfig.sections[0]?.id || null,
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        resetToTemplate: (templateId) => {
          const current = get().config;
          const tid = templateId || current.templateId;
          const fresh = getTemplate(tid).createConfig(current.githubUsername);
          set({
            config: fresh,
            activeSectionId: fresh.sections[0]?.id || null,
            history: pushHistory(current),
            canUndo: true,
            canRedo: false,
          });
        },

        undo: () => {
          const { history, config } = get();
          if (history.past.length === 0) return;

          const previous = history.past[history.past.length - 1];
          const newPast = history.past.slice(0, history.past.length - 1);

          set({
            config: previous,
            activeSectionId: previous.sections[0]?.id || null,
            history: {
              past: newPast,
              future: [config, ...history.future],
            },
            canUndo: newPast.length > 0,
            canRedo: true,
          });
        },

        redo: () => {
          const { history, config } = get();
          if (history.future.length === 0) return;

          const next = history.future[0];
          const newFuture = history.future.slice(1);

          set({
            config: next,
            activeSectionId: next.sections[0]?.id || null,
            history: {
              past: [...history.past, config],
              future: newFuture,
            },
            canUndo: true,
            canRedo: newFuture.length > 0,
          });
        },
      };
    },
    {
      name: "profileforge-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ config: state.config }),
    }
  )
);
