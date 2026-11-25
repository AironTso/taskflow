import { useState } from "react";
import { Plus, Tag as TagIcon, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/Modal";
import { TagForm } from "./TagForm";
import { useTagStore } from "@/features/tags/store/tagStore";
import { useTaskStore } from "@/features/tasks/store/taskStore";
import { useToast } from "@/shared/components/Toast";
import type { Tag } from "@/shared/types";

export function TagList() {
  const { tags, deleteTag } = useTagStore();
  const { tasks, updateTask } = useTaskStore();
  const { success } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Tag | null>(null);

  const handleCreate = () => {
    setEditingTag(null);
    setShowForm(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleDelete = (tag: Tag) => {
    const taggedTasks = tasks.filter((t) => t.tagIds.includes(tag.id));
    taggedTasks.forEach((task) => {
      updateTask(task.id, { tagIds: task.tagIds.filter((id) => id !== tag.id) });
    });
    deleteTag(tag.id);
    setShowDeleteConfirm(null);
    success(`Tag "${tag.name}" excluída.`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTag(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tags</h2>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4" />
          Nova
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const taskCount = tasks.filter((t) => t.tagIds.includes(tag.id)).length;
          return (
            <div
              key={tag.id}
              className="card p-3 flex items-center gap-3 group"
              style={{ borderColor: `${tag.color}40` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${tag.color}20` }}
              >
                <TagIcon className="h-4 w-4" style={{ color: tag.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{tag.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{taskCount} tarefa{taskCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(tag)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={`Editar ${tag.name}`}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(tag)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={`Excluir ${tag.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <TagForm isOpen={showForm} onClose={handleCloseForm} tag={editingTag} />

      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleDelete(showDeleteConfirm!)}
          title="Excluir tag"
          message={`Tem certeza que deseja excluir "${showDeleteConfirm.name}"?`}
          confirmText="Excluir"
          variant="danger"
        />
      )}
    </div>
  );
}
