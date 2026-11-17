import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  projectId: z.string().nullable(),
  tagIds: z.array(z.string()).default([]),
  dueDate: z.string().nullable().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
  icon: z.string().min(1, "Ícone é obrigatório"),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(30, "Nome muito longo"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TagFormData = z.infer<typeof tagSchema>;
