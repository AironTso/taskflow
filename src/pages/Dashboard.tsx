import { CheckCircle2, Circle, AlertTriangle, Clock, TrendingUp, Target } from "lucide-react";
import { useTaskStore } from "@/features/tasks/store/taskStore";
import { useProjectStore } from "@/features/projects/store/projectStore";
import { formatDate, isOverdue, isDueSoon } from "@/shared/utils/date";
import { Button } from "@/shared/components/Button";

export function Dashboard() {
  const { tasks, getTaskStats } = useTaskStore();
  const { projects } = useProjectStore();
  const stats = getTaskStats();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const dueToday = tasks.filter((t) => t.dueDate === todayStr && t.status === "pending").length;
  const dueThisWeek = tasks.filter((t) => isDueSoon(t.dueDate, 7) && t.status === "pending").length;
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate) && t.status === "pending").length;

  const recentTasks = tasks
    .filter((t) => t.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const priorityDistribution = {
    low: tasks.filter((t) => t.priority === "low" && t.status === "pending").length,
    medium: tasks.filter((t) => t.priority === "medium" && t.status === "pending").length,
    high: tasks.filter((t) => t.priority === "high" && t.status === "pending").length,
    urgent: tasks.filter((t) => t.priority === "urgent" && t.status === "pending").length,
  };

  const projectStats = projects.map((p) => ({
    ...p,
    count: tasks.filter((t) => t.projectId === p.id && t.status === "pending").length,
  })).filter((p) => p.count > 0).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Visão geral da sua produtividade</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total"
          value={stats.total}
          icon={Target}
          color="primary"
        />
        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={Circle}
          color="blue"
        />
        <StatCard
          title="Concluídas"
          value={stats.completed}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Atrasadas"
          value={stats.overdue}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Tarefas Recentes</h2>
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Circle className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p>Nenhuma tarefa pendente</p>
              <Button variant="ghost" className="mt-4" onClick={() => window.location.hash = "#/tasks"}>
                Criar primeira tarefa
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`
                        w-2 h-2 rounded-full flex-shrink-0
                        ${task.priority === "low" ? "bg-gray-400" : ""}
                        ${task.priority === "medium" ? "bg-yellow-400" : ""}
                        ${task.priority === "high" ? "bg-orange-400" : ""}
                        ${task.priority === "urgent" ? "bg-red-400 animate-pulse" : ""}
                      `}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.dueDate ? formatDate(task.dueDate) : "Sem data"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => window.location.hash = `#/tasks/${task.id}`}>
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Próximos Prazos</h2>
          <div className="space-y-3">
            <DeadlineItem label="Hoje" count={dueToday} icon={Clock} color="blue" />
            <DeadlineItem label="Esta semana" count={dueThisWeek} icon={TrendingUp} color="purple" />
            <DeadlineItem label="Atrasadas" count={overdueCount} icon={AlertTriangle} color="red" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Por Prioridade</h2>
          <div className="space-y-3">
            {Object.entries(priorityDistribution).map(([priority, count]) => (
              <PriorityBar key={priority} priority={priority} count={count} total={stats.pending} />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Por Projeto</h2>
          {projectStats.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhum projeto com tarefas</p>
          ) : (
            <div className="space-y-3">
              {projectStats.map((project) => (
                <ProjectBar key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  const colors = {
    primary: "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
        </div>
        <div className={`${colors[color as keyof typeof colors]} p-3 rounded-xl`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function DeadlineItem({ label, count, icon: Icon, color }: { label: string; count: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className={`${colors[color as keyof typeof colors]} p-2 rounded-lg`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{count} tarefa{count !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}

function PriorityBar({ priority, count, total }: { priority: string; count: number; total: number }) {
  const colors = {
    low: "bg-gray-400",
    medium: "bg-yellow-400",
    high: "bg-orange-400",
    urgent: "bg-red-400",
  };
  const labels = { low: "Baixa", medium: "Média", high: "Alta", urgent: "Urgente" };
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-300">{labels[priority as keyof typeof labels]}</span>
        <span className="text-gray-500 dark:text-gray-400">{count}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[priority as keyof typeof colors]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ProjectBar({ project }: { project: { name: string; color: string; count: number } }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-300 truncate pr-2">{project.name}</span>
        <span className="text-gray-500 dark:text-gray-400">{project.count}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: "100%", backgroundColor: project.color }}
        />
      </div>
    </div>
  );
}
