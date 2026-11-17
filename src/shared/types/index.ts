export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "completed";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string | null;
  tagIds: string[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  theme: "light" | "dark" | "system";
}

export type Theme = "light" | "dark" | "system";
