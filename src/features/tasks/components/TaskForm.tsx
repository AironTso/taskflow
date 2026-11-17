import { useState, useEffect } from "react";
import { X, Save, Calendar, Tag, Folder, Flag } from "lucide-react";
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";
import { Input } from "../../../../shared/components/Input";
import { Textarea } from "../../../../shared/components/Textarea";
import { Select } from "../../../../shared/components/Select";
import { useTaskStore } from "../../store/taskStore";
import { useProjectStore } from "../../../../features/projects/store/projectStore";
import { useTagStore } from "../../../../features/tags/store/tagStore";
import type { Task, Priority } from "../../../../shared/types";
import { PRIORITY_OPTIONS } from "../../../../shared/utils/date";
import { taskSchema } from "../../../../shared/utils/validation";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskForm({ isOpen, onClose, task }: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore();
  const { projects } = useProjectStore();
  const { tags } = useTagStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    projectId: null as string | null,
    tagIds: [] as string[],
    dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        projectId: task.projectId,
        tagIds: task.tagIds,
        dueDate: task.dueDate || "",
      });
      setErrors({});
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        projectId: null,
        tagIds: [],
        dueDate: "",
      });
      setErrors({});
    }
  }, [task, isOpen]);

  const validate = (): boolean => {
    const result = taskSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (task) {
        updateTask(task.id, {
          ...formData,
          dueDate: formData.dueDate || null,
          projectId: formData.projectId,
        });
      } else {
        addTask({
          ...formData,
          status: "pending",
          dueDate: formData.dueDate || null,
          projectId: formData.projectId,
        });
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | string[] | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Editar Tarefa" : "Nova Tarefa"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título *"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          placeholder="O que precisa ser feito?"
          autoFocus
          required
        />

        <Textarea
          label="Descrição"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Detalhes adicionais (opcional)"
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Prioridade *"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value as Priority)}
            error={errors.priority}
            options={PRIORITY_OPTIONS.map((p) => ({ value: p.value, label: p.label }))}
            placeholder="Selecione a prioridade"
          />

          <Select
            label="Projeto"
            value={formData.projectId || ""}
            onChange={(e) => handleChange("projectId", e.target.value || null)}
            options={[{ value: "", label: "Sem projeto" }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
            placeholder="Selecione um projeto"
          />
        </div>

        <div>
          <label className="label">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  const newTags = formData.tagIds.includes(tag.id)
                    ? formData.tagIds.filter((id) => id !== tag.id)
                    : [...formData.tagIds, tag.id];
                  handleChange("tagIds", newTags);
                }}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${formData.tagIds.includes(tag.id)
                    ? `text-white border-0`
                    : `border-2 text-gray-700 dark:text-gray-300`
                  }
                `}
                style={{
                  backgroundColor: formData.tagIds.includes(tag.id) ? tag.color : "transparent",
                  borderColor: formData.tagIds.includes(tag.id) ? tag.color : `${tag.color}40`,
                }}
              >
                <Tag className="h-3.5 w-3.5" />
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Data de vencimento</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save className="h-4 w-4" />
            {task ? "Salvar alterações" : "Criar tarefa"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
