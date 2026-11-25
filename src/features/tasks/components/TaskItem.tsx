import { useState } from "react";
import { CheckCircle2, MoreVertical, Trash2, Edit2, Flag, Calendar, Tag as TagIcon } from "lucide-react";
import { formatRelativeDate, isOverdue, getPriorityColor, getPriorityLabel } from "@/shared/utils/date";
import type { Task } from "@/shared/types";
import { ConfirmDialog } from "@/shared/components/Modal";
import { useTaskStore } from "@/features/tasks/store/taskStore";
import { useProjectStore } from "@/features/projects/store/projectStore";
import { useTagStore } from "@/features/tags/store/tagStore";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();
  const { getProject } = useProjectStore();
  const { tags } = useTagStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const project = task.projectId ? getProject(task.projectId) : null;
  const taskTags = task.tagIds.map((id) => tags.find((t) => t.id === id)).filter(Boolean);
  const overdue = isOverdue(task.dueDate);

  const handleToggle = () => toggleTask(task.id);
  const handleEdit = () => onEdit(task);
  const handleDelete = () => {
    deleteTask(task.id);
    setShowMenu(false);
  };

  return (
    <div className="group relative card p-4 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`
            flex-shrink-0 mt-1 h-5 w-5 rounded border-2 transition-all duration-200
            ${task.status === "completed"
              ? "bg-primary-600 border-primary-600 text-white"
              : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
            }
          `}
          aria-label={task.status === "completed" ? "Marcar como pendente" : "Marcar como concluída"}
        >
          {task.status === "completed" && <CheckCircle2 className="h-4 w-4" />}
        </button>

        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-start gap-2">
            <h3 className={`
              flex-1 text-sm font-medium break-words transition-colors
              ${task.status === "completed" ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-gray-100"}
            `}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Mais opções"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className={`
              mt-2 text-sm line-clamp-2 break-words
              ${task.status === "completed" ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"}
            `}>
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {project && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${project.color}20`, color: project.color }}
              >
                {project.name}
              </span>
            )}

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              <Flag className="h-3 w-3" />
              {getPriorityLabel(task.priority)}
            </span>

            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${overdue ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                <Calendar className="h-3 w-3" />
                {formatRelativeDate(task.dueDate)}
              </span>
            )}

            {taskTags.map((tag) => (
              <span
                key={tag!.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${tag!.color}20`, color: tag!.color }}
              >
                <TagIcon className="h-3 w-3" />
                {tag!.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
      )}

      {showMenu && (
        <div className="fixed right-4 top-full z-20 mt-1 w-40 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
          <button onClick={handleEdit} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Edit2 className="inline h-4 w-4 mr-2" />
            Editar
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Trash2 className="inline h-4 w-4 mr-2" />
            Excluir
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Excluir tarefa"
        message={`Tem certeza que deseja excluir "${task.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  );
}
