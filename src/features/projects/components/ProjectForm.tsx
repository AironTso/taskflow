import { useState } from "react";
import { X, Save, Palette, Layout } from "lucide-react";
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";
import { Input } from "../../../../shared/components/Input";
import { useProjectStore } from "../../store/projectStore";
import type { Project } from "../../../../shared/types";
import { projectSchema } from "../../../../shared/utils/validation";

const ICONS = [
  "folder", "briefcase", "home", "book", "code", "music", "dumbbell",
  "shopping-cart", "plane", "graduation-cap", "heart", "star",
];

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export function ProjectForm({ isOpen, onClose, project }: ProjectFormProps) {
  const { addProject, updateProject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState(project?.color || "#0ea5e9");
  const [selectedIcon, setSelectedIcon] = useState(project?.icon || "folder");

  const [formData, setFormData] = useState({
    name: "",
    color: selectedColor,
    icon: selectedIcon,
  });

  const COLORS = [
    "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#a855f7",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
  ];

  const validate = (): boolean => {
    const result = projectSchema.safeParse({ ...formData, color: selectedColor, icon: selectedIcon });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (project) {
        updateProject(project.id, { ...formData, color: selectedColor, icon: selectedIcon });
      } else {
        addProject({ ...formData, color: selectedColor, icon: selectedIcon });
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? "Editar Projeto" : "Novo Projeto"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome *"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          error={errors.name}
          placeholder="Ex: Trabalho, Pessoal, Estudos..."
          autoFocus
          required
        />

        <div>
          <label className="label">Cor</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`
                  w-10 h-10 rounded-lg border-4 transition-all
                  ${selectedColor === color ? "border-white ring-2 ring-offset-2" : "border-transparent hover:scale-110"}
                `}
                style={{ backgroundColor: color, borderColor: selectedColor === color ? color : "transparent" }}
                aria-label={`Cor ${color}`}
                aria-pressed={selectedColor === color}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="label">Ícone</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`
                  w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all
                  ${selectedIcon === icon
                    ? "bg-primary-100 border-primary-500 text-primary-600 dark:bg-primary-900/30"
                    : "bg-gray-100 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-primary-300"
                  }
                `}
                aria-label={`Ícone ${icon}`}
                aria-pressed={selectedIcon === icon}
              >
                <IconRenderer name={icon} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save className="h-4 w-4" />
            {project ? "Salvar alterações" : "Criar projeto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function IconRenderer({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    folder: <Layout className={className} />,
    briefcase: <Layout className={className} />,
    home: <Layout className={className} />,
    book: <Layout className={className} />,
    code: <Layout className={className} />,
    music: <Layout className={className} />,
    dumbbell: <Layout className={className} />,
    "shopping-cart": <Layout className={className} />,
    plane: <Layout className={className} />,
    "graduation-cap": <Layout className={className} />,
    heart: <Layout className={className} />,
    star: <Layout className={className} />,
  };
  return icons[name] || <Layout className={className} />;
}
