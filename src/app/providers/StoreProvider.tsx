import { createContext, useContext, ReactNode, useEffect } from "react";
import { useStore } from "../../features/tasks/store/taskStore";
import { useProjectStore } from "../../features/projects/store/projectStore";
import { useTagStore } from "../../features/tags/store/tagStore";

interface StoreContextValue {
  tasks: ReturnType<typeof useStore>;
  projects: ReturnType<typeof useProjectStore>;
  tags: ReturnType<typeof useTagStore>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const tasks = useStore();
  const projects = useProjectStore();
  const tags = useTagStore();

  useEffect(() => {
    tasks.loadFromStorage();
    projects.loadFromStorage();
    tags.loadFromStorage();
  }, [tasks, projects, tags]);

  return (
    <StoreContext.Provider value={{ tasks, projects, tags }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStores() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStores must be used within StoreProvider");
  return context;
}
