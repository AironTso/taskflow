import { useState } from "react";
import { Moon, Sun, Monitor, Download, Upload, Trash2, RefreshCw } from "lucide-react";
import { useTheme } from "../app/providers/ThemeProvider";
import { useTaskStore } from "../features/tasks/store/taskStore";
import { useProjectStore } from "../features/projects/store/projectStore";
import { useTagStore } from "../features/tags/store/tagStore";
import { Button } from "../shared/components/Button";
import { Card } from "../shared/components/Card";
import { Modal, ConfirmDialog } from "../shared/components/Modal";
import { useToast } from "../shared/components/Toast";

export function Settings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { tasks, loadFromStorage: loadTasks } = useTaskStore();
  const { projects, loadFromStorage: loadProjects } = useProjectStore();
  const { tags, loadFromStorage: loadTags } = useTagStore();
  const { success, error } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportData, setExportData] = useState("");

  const handleExport = () => {
    const data = { tasks, projects, tags, exportedAt: new Date().toISOString() };
    const json = JSON.stringify(data, null, 2);
    setExportData(json);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success("Dados exportados com sucesso!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.tasks) localStorage.setItem("taskflow-tasks", JSON.stringify({ state: data.tasks, version: 1 }));
        if (data.projects) localStorage.setItem("taskflow-projects", JSON.stringify({ state: data.projects, version: 1 }));
        if (data.tags) localStorage.setItem("taskflow-tags", JSON.stringify({ state: data.tags, version: 1 }));
        loadTasks();
        loadProjects();
        loadTags();
        success("Dados importados com sucesso!");
      } catch {
        error("Arquivo inválido");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    localStorage.removeItem("taskflow-tasks");
    localStorage.removeItem("taskflow-projects");
    localStorage.removeItem("taskflow-tags");
    localStorage.removeItem("taskflow-theme");
    loadTasks();
    loadProjects();
    loadTags();
    setTheme("system");
    setShowResetConfirm(false);
    success("Todos os dados foram resetados");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configurações</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Personalize sua experiência</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Aparência
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Claro", icon: Sun },
            { value: "dark", label: "Escuro", icon: Moon },
            { value: "system", label: "Sistema", icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${theme === value
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              <Icon className="h-5 w-5 mx-auto mb-2" />
              <p className="text-center font-medium text-gray-900 dark:text-gray-100">{label}</p>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
          Tema atual: <span className="font-medium capitalize">{resolvedTheme}</span>
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Download className="h-5 w-5" />
          Dados
        </h2>
        <div className="space-y-3">
          <Button variant="secondary" onClick={handleExport} className="w-full justify-start">
            <Download className="h-4 w-4" />
            Exportar dados (JSON)
          </Button>
          <div>
            <label className="label">Importar dados</label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="input cursor-pointer"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selecione um arquivo JSON exportado anteriormente</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-red-200 dark:border-red-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-red-600" />
          Zona de Perigo
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Esta ação apagará <strong>todos os seus dados</strong> (tarefas, projetos, tags) e restaurará as configurações padrão.
          Esta ação <strong>não pode ser desfeita</strong>.
        </p>
        <Button variant="danger" onClick={() => setShowResetConfirm(true)} className="w-full">
          <Trash2 className="h-4 w-4" />
          Resetar tudo
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Estatísticas</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Tarefas</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{tasks.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Projetos</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{projects.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Tags</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{tags.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Tema</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100 capitalize">{theme}</dd>
          </div>
        </dl>
      </Card>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Confirmar reset total"
        message="Tem certeza absoluta? Todos os seus dados serão perdidos permanentemente."
        confirmText="Sim, apagar tudo"
        variant="danger"
      />
    </div>
  );
}
