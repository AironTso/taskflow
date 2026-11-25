import { TaskList } from "@/features/tasks/components/TaskList";

export function Tasks() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tarefas</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie suas tarefas e projetos</p>
      </div>
      <TaskList />
    </div>
  );
}
