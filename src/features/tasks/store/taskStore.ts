import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, Priority, TaskStatus } from "../../../shared/types";
import { generateId } from "../../../shared/utils/date";

interface TaskState {
  tasks: Task[];
  filter: {
    status: TaskStatus | "all";
    priority: Priority | "all";
    projectId: string | null;
    tagIds: string[];
    search: string;
    sortBy: "createdAt" | "dueDate" | "priority" | "title";
    sortOrder: "asc" | "desc";
  };
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: Partial<TaskState["filter"]>) => void;
  clearFilters: () => void;
  getFilteredTasks: () => Task[];
  getTaskStats: () => { total: number; pending: number; completed: number; overdue: number };
  loadFromStorage: () => void;
}

const defaultFilter = {
  status: "all" as TaskStatus | "all",
  priority: "all" as Priority | "all",
  projectId: null as string | null,
  tagIds: [] as string[],
  search: "",
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: defaultFilter,

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          completedAt: taskData.status === "completed" ? now : null,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  completedAt:
                    updates.status === "completed" && task.status !== "completed"
                      ? new Date().toISOString()
                      : updates.status === "pending"
                      ? null
                      : task.completedAt,
                }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === "pending" ? "completed" : "pending",
                  updatedAt: new Date().toISOString(),
                  completedAt:
                    task.status === "pending" ? new Date().toISOString() : null,
                }
              : task
          ),
        }));
      },

      setFilter: (filter) => {
        set((state) => ({ filter: { ...state.filter, ...filter } }));
      },

      clearFilters: () => {
        set({ filter: defaultFilter });
      },

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        let filtered = [...tasks];

        if (filter.status !== "all") {
          filtered = filtered.filter((t) => t.status === filter.status);
        }
        if (filter.priority !== "all") {
          filtered = filtered.filter((t) => t.priority === filter.priority);
        }
        if (filter.projectId) {
          filtered = filtered.filter((t) => t.projectId === filter.projectId);
        }
        if (filter.tagIds.length > 0) {
          filtered = filtered.filter((t) =>
            filter.tagIds.some((tagId) => t.tagIds.includes(tagId))
          );
        }
        if (filter.search) {
          const search = filter.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.title.toLowerCase().includes(search) ||
              t.description.toLowerCase().includes(search)
          );
        }

        filtered.sort((a, b) => {
          let aVal: string | number = a[filter.sortBy] as string | number;
          let bVal: string | number = b[filter.sortBy] as string | number;
          if (filter.sortBy === "priority") {
            const priorityOrder = { low: 0, medium: 1, high: 2, urgent: 3 };
            aVal = priorityOrder[a.priority];
            bVal = priorityOrder[b.priority];
          }
          if (typeof aVal === "string" && typeof bVal === "string") {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return filter.sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
      },

      getTaskStats: () => {
        const { tasks } = get();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return {
          total: tasks.length,
          pending: tasks.filter((t) => t.status === "pending").length,
          completed: tasks.filter((t) => t.status === "completed").length,
          overdue: tasks.filter((t) => {
            if (!t.dueDate || t.status === "completed") return false;
            const due = new Date(t.dueDate);
            return due < today;
          }).length,
        };
      },

      loadFromStorage: () => {
        // Persist middleware handles this automatically
      },
    }),
    {
      name: "taskflow-tasks",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
