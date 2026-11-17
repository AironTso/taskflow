import { format, isToday, isTomorrow, isPast, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    const diff = differenceInDays(date, new Date());
    if (diff < 0) return `Atrasado ${Math.abs(diff)} dia${Math.abs(diff) > 1 ? "s" : ""}`;
    if (diff === 0) return "Vence hoje";
    if (diff === 1) return "Vence amanhã";
    return `Vence em ${diff} dias`;
  } catch {
    return dateString;
  }
}

export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
}

export function isDueSoon(dateString: string | null, days: number = 3): boolean {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    const diff = differenceInDays(date, new Date());
    return diff >= 0 && diff <= days;
  } catch {
    return false;
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "low": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case "low": return "Baixa";
    case "medium": return "Média";
    case "high": return "Alta";
    case "urgent": return "Urgente";
    default: return priority;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDefaultProject(): Project {
  return {
    id: "default",
    name: "Geral",
    color: "#0ea5e9",
    icon: "folder",
    createdAt: new Date().toISOString(),
  };
}

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "completed", label: "Concluída" },
];
