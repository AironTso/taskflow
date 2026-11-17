import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Project } from "../../../../shared/types";
import { generateId, getDefaultProject } from "../../../../shared/utils/date";

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  loadFromStorage: () => void;
}

const defaultProjects: Project[] = [getDefaultProject()];

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: defaultProjects,

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id, updates) => {
        if (id === "default") return; // Prevent editing default project
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProject: (id) => {
        if (id === "default") return; // Prevent deleting default project
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      getProject: (id) => {
        return get().projects.find((p) => p.id === id);
      },

      loadFromStorage: () => {
        // Persist middleware handles this automatically
      },
    }),
    {
      name: "taskflow-projects",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
