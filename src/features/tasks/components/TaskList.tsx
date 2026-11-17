import { ClipboardList, CheckCircle2, Circle } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { TaskFilters } from "./TaskFilters";
import { Button } from "../../../../shared/components/Button";
import { Modal } from "../../../../shared/components/Modal";
import { useTaskStore } from "../../store/taskStore";
import { useToast } from "../../../../shared/components/Toast";

export function TaskList() {
  const { getFilteredTasks, toggleTask, deleteTask } = useTaskStore();
  const { success, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<import("../../../../shared/types").Task | null>(null);
  const tasks = getFilteredTasks();
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const handleCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task: import("../../../../shared/types").Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleToggle = (task: import("../../../../shared/types").Task) => {
    toggleTask(task.id);
    success(task.status === "pending" ? "Tarefa concluída!" : "Tarefa reaberta");
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    success("Tarefa excluída");
  };

  if (tasks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <ClipboardList className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {pendingTasks.length === 0 && tasks.length > 0
            ? "Todas as tarefas foram concluídas! ??"
            : "Comece criando sua primeira tarefa"}
        </p>
        <Button onClick={handleCreate}>
          <span className="text-sm">+ Nova tarefa</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskFilters />

      {pendingTasks.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <Circle className="h-5 w-5 text-primary-600" />
            Pendentes ({pendingTasks.length})
          </h2>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Concluídas ({completedTasks.length})
          </h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-4 right-4 z-10">
        <Button onClick={handleCreate} className="rounded-full p-3 shadow-lg" aria-label="Nova tarefa">
          <span className="text-2xl">+</span>
        </Button>
      </div>

      <TaskForm isOpen={showForm} onClose={handleCloseForm} task={editingTask} />
    </div>
  );
}

import { useState } from "react";
