import { useState } from "react";
import { Plus, Folder, Trash2, Edit2, MoreVertical } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import { Modal, ConfirmDialog } from "../../../../shared/components/Modal";
import { ProjectForm } from "./ProjectForm";
import { useProjectStore } from "../../store/projectStore";
import { useTaskStore } from "../../../../features/tasks/store/taskStore";
import { useToast } from "../../../../shared/components/Toast";
import type { Project } from "../../../../shared/types";

export function ProjectList() {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const { tasks, updateTask } = useTaskStore();
  const { success } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Project | null>(null);

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (project: Project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    projectTasks.forEach((task) => updateTask(task.id, { projectId: "default" }));
    deleteProject(project.id);
    setShowDeleteConfirm(null);
    success(`Projeto "${project.name}" excluído. Tarefas movidas para "Geral".`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projetos</h2>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const taskCount = tasks.filter((t) => t.projectId === project.id).length;
          const isDefault = project.id === "default";

          return (
            <div
              key={project.id}
              className="card p-4 hover:shadow-md transition-shadow group relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <Folder className="h-5 w-5" style={{ color: project.color }} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{project.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{taskCount} tarefa{taskCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                {!isDefault && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                        setShowForm(true);
                      }}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Editar ${project.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(project)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Excluir ${project.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: "100%", backgroundColor: project.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <ProjectForm isOpen={showForm} onClose={handleCloseForm} project={editingProject} />

      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleDelete(showDeleteConfirm!)}
          title="Excluir projeto"
          message={`Tem certeza que deseja excluir "${showDeleteConfirm.name}"? As tarefas serão movidas para "Geral".`}
          confirmText="Excluir"
          variant="danger"
        />
      )}
    </div>
  );
}
