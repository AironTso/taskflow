import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Tag } from "../../../shared/types";
import { generateId } from "../../../shared/utils/date";

interface TagState {
  tags: Tag[];
  addTag: (tag: Omit<Tag, "id">) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  getTag: (id: string) => Tag | undefined;
  loadFromStorage: () => void;
}

const defaultTags: Tag[] = [
  { id: "tag-1", name: "Trabalho", color: "#0ea5e9" },
  { id: "tag-2", name: "Pessoal", color: "#22c55e" },
  { id: "tag-3", name: "Urgente", color: "#ef4444" },
  { id: "tag-4", name: "Estudos", color: "#a855f7" },
];

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      tags: defaultTags,

      addTag: (tagData) => {
        const newTag: Tag = {
          ...tagData,
          id: generateId(),
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
      },

      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTag: (id) => {
        set((state) => ({ tags: state.tags.filter((t) => t.id !== id) }));
      },

      getTag: (id) => {
        return get().tags.find((t) => t.id === id);
      },

      loadFromStorage: () => {
        // Persist middleware handles this automatically
      },
    }),
    {
      name: "taskflow-tags",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
