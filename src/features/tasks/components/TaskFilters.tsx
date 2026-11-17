import { useDebounce } from "../../../../shared/hooks/useLocalStorage";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import { Input } from "../../../../shared/components/Input";
import { Select } from "../../../../shared/components/Select";
import { useTaskStore } from "../../store/taskStore";
import { useProjectStore } from "../../../../features/projects/store/projectStore";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../../../shared/utils/date";

export function TaskFilters() {
  const { filter, setFilter, clearFilters, getFilteredTasks } = useTaskStore();
  const { projects } = useProjectStore();
  const [search, setSearch] = useState(filter.search);
  const debouncedSearch = useDebounce(search, 300);

  const hasActiveFilters =
    filter.status !== "all" ||
    filter.priority !== "all" ||
    filter.projectId ||
    filter.tagIds.length > 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setFilter({ search: value });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar tarefas..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filter.status}
            onChange={(e) => setFilter({ status: e.target.value as "all" | "pending" | "completed" })}
            options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })).concat([{ value: "all", label: "Todos" }]).reverse()}
            className="w-36"
          />

          <Select
            value={filter.priority}
            onChange={(e) => setFilter({ priority: e.target.value as "all" | "low" | "medium" | "high" | "urgent" })}
            options={PRIORITY_OPTIONS.map((p) => ({ value: p.value, label: p.label })).concat([{ value: "all", label: "Todas" }]).reverse()}
            className="w-36"
          />

          <Select
            value={filter.projectId || ""}
            onChange={(e) => setFilter({ projectId: e.target.value || null })}
            options={[{ value: "", label: "Todos projetos" }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
            className="w-40"
          />

          <Select
            value={filter.sortBy}
            onChange={(e) => setFilter({ sortBy: e.target.value as "createdAt" | "dueDate" | "priority" | "title" })}
            options={[
              { value: "createdAt", label: "Criadas" },
              { value: "dueDate", label: "Vencimento" },
              { value: "priority", label: "Prioridade" },
              { value: "title", label: "Alfabética" },
            ]}
            className="w-36"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter({ sortOrder: filter.sortOrder === "asc" ? "desc" : "asc" })}
            aria-label={filter.sortOrder === "asc" ? "Ordem decrescente" : "Ordem crescente"}
          >
            <ChevronDown className={filter.sortOrder === "asc" ? "rotate-180" : ""} />
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{filteredTasks.length} tarefa{filteredTasks.length !== 1 ? "s" : ""}</span>
        {hasActiveFilters && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            <Filter className="h-3.5 w-3.5" />
            Filtros ativos
          </span>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
