import { useState } from "react";
import { X, Save } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useTagStore } from "@/features/tags/store/tagStore";
import type { Tag } from "@/shared/types";
import { tagSchema } from "@/shared/utils/validation";

const COLORS = [
  "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#a855f7",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

interface TagFormProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: Tag | null;
}

export function TagForm({ isOpen, onClose, tag }: TagFormProps) {
  const { addTag, updateTag } = useTagStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState(tag?.color || "#0ea5e9");

  const [formData, setFormData] = useState({
    name: "",
    color: selectedColor,
  });

  const validate = (): boolean => {
    const result = tagSchema.safeParse({ ...formData, color: selectedColor });
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
      if (tag) {
        updateTag(tag.id, { ...formData, color: selectedColor });
      } else {
        addTag({ ...formData, color: selectedColor });
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tag ? "Editar Tag" : "Nova Tag"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome *"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          error={errors.name}
          placeholder="Ex: Urgente, Trabalho, Pessoal..."
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

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save className="h-4 w-4" />
            {tag ? "Salvar alterações" : "Criar tag"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
