# TaskFlow — Apresentação do Projeto

> **Gerenciador de Tarefas Pessoal** | React 18 + TypeScript + Vite + Tailwind + Zustand

---

## 🎯 O Que É o TaskFlow?

Uma **SPA (Single Page Application)** completa para gerenciamento de tarefas pessoais, construída com foco em:

- ✨ **Simplicidade** — Interface limpa, sem distrações
- ⚡ **Performance** — < 150KB gzipped, carregamento < 3s em 3G
- 🔒 **Privacidade** — Dados 100% no seu navegador (localStorage)
- ♿ **Acessibilidade** — WCAG 2.1 AA, navegação por teclado
- 📱 **Responsivo** — Mobile-first, funciona em qualquer dispositivo

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | React + TypeScript | 18 / 5.2 |
| **Build** | Vite | 5.1 |
| **Estilização** | Tailwind CSS | 3.4 |
| **Estado** | Zustand | 4.5 |
| **Roteamento** | React Router | 6.22 |
| **Validação** | Zod | 3.22 |
| **Datas** | date-fns | 3.3 |
| **Ícones** | Lucide React | 0.330 |
| **Testes** | Vitest + RTL | 1.3 / 14.2 |
| **Qualidade** | ESLint + Prettier | 8.56 / 3.2 |

---

## ✨ Funcionalidades Principais

### 📝 Tarefas
- **CRUD completo** — Criar, editar, excluir, concluir
- **4 Prioridades** — Baixa 🟢, Média 🟡, Alta 🟠, Urgente 🔴 (pulsa)
- **Datas de Vencimento** — Alertas visuais: hoje, esta semana, atrasadas
- **Descrição Rica** — Até 500 caracteres
- **Filtros Avançados** — Status, prioridade, projeto, tags, busca textual
- **Ordenação** — Por criação, vencimento, prioridade, alfabética

### 📁 Projetos
- Organização hierárquica com **cores** e **ícones** (Lucide)
- Projeto **"Sem Projeto"** padrão (protegido)
- Grid responsivo com contagem de tarefas

### 🏷️ Tags
- Tags personalizadas com **seletor de cor**
- Associação **múltipla** por tarefa
- 4 tags padrão: Trabalho, Pessoal, Urgente, Estudos

### 📊 Dashboard Analytics
- **Cards de Resumo** — Total, Pendentes, Concluídas, Atrasadas
- **Tarefas Recentes** — 5 mais novas pendentes
- **Próximos Prazos** — Hoje / Semana / Atrasadas
- **Distribuição por Prioridade** — Barras animadas
- **Distribuição por Projeto** — Top 5 projetos

### ⚙️ Configurações
- **Tema** — Claro / Escuro / Sistema (auto)
- **Import/Export** — Backup completo em JSON
- **Persistência** — localStorage automático

---

## 🏗️ Arquitetura: Feature-Based

```
src/
├── app/                    # Providers (Theme, Store, Router)
├── features/               # 🎯 DOMÍNIOS ISOLADOS
│   ├── tasks/              # Tudo sobre tarefas
│   │   ├── components/     # TaskList, TaskItem, TaskForm, TaskFilters
│   │   ├── store/          # taskStore.ts (Zustand + persist)
│   │   └── ...
│   ├── projects/           # Tudo sobre projetos
│   └── tags/               # Tudo sobre tags
├── pages/                  # Páginas roteadas
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Projects.tsx
│   ├── Tags.tsx
│   └── Settings.tsx
└── shared/                 # 🔄 COMPARTILHADO
    ├── components/         # Button, Input, Modal, Toast, Card...
    ├── hooks/              # useLocalStorage, useDebounce...
    ├── utils/              # date, validation (Zod), constants
    └── types/              # Types globais
```

### Por Que Feature-Based?
- ✅ **Colocação** — Código relacionado fica junto
- ✅ **Escalabilidade** — Features crescem independentemente
- ✅ **Manutenibilidade** — Fácil encontrar e modificar
- ✅ **Reutilização** — Shared para o que é genérico

---

## 🔄 Estado: Zustand + Persist

```typescript
// Cada feature tem seu store isolado
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: defaultFilter,
      addTask: (data) => { ... },
      updateTask: (id, updates) => { ... },
      deleteTask: (id) => { ... },
      toggleTask: (id) => { ... },
      getFilteredTasks: () => { ... },  // Filtros + ordenação
      getTaskStats: () => { ... },      // Dashboard stats
    }),
    { name: "taskflow-tasks", storage: createJSONStorage(() => localStorage) }
  )
);
```

### Vantagens
- 🎯 **Seletores tipados** — Re-render apenas quando necessário
- 💾 **Persistência automática** — Middleware `persist` sincroniza localStorage
- 🔒 **Type-safe** — TypeScript inferido em toda a cadeia
- ⚡ **Performance** — Estado granular, sem Context API overhead

---

## 📊 Modelo de Dados

```typescript
// Tipos centrais (shared/types/index.ts)
type Priority = "low" | "medium" | "high" | "urgent";
type TaskStatus = "pending" | "completed";

interface Task {
  id: string;
  title: string;           // 1-100 chars (Zod)
  description: string;     // max 500 chars
  status: TaskStatus;
  priority: Priority;
  projectId: string | null;
  tagIds: string[];
  dueDate: string | null;  // YYYY-MM-DD
  createdAt: string;       // ISO 8601
  updatedAt: string;
  completedAt: string | null;
}

interface Project {
  id: string;
  name: string;            // 1-50 chars
  color: string;           // #RRGGBB
  icon: string;            // Lucide icon name
  createdAt: string;
}

interface Tag {
  id: string;
  name: string;            // 1-30 chars
  color: string;           // #RRGGBB
}
```

---

## 🎨 UI/UX: Design System

### Cores (Tailwind + CSS Variables)
```css
:root {
  --primary-500: #0ea5e9;   /* Azul principal */
  --primary-600: #0284c7;   /* Hover */
  /* ... escala completa 50-900 */
}
```

### Componentes Base (`shared/components/`)
| Componente | Variantes | Estados |
|------------|-----------|---------|
| **Button** | primary, secondary, ghost, danger | loading, disabled |
| **Input** | text, email, date | error, focus |
| **Select** | single | placeholder |
| **Modal** | — | backdrop/ESC close |
| **Toast** | success, error, info | auto-dismiss 3s |
| **Card** | — | hover variants |

### Responsividade
| Breakpoint | Sidebar | Dashboard Grid | FAB |
|------------|---------|----------------|-----|
| **Mobile** (<640px) | Hamburger ☰ | 1 coluna | Fixado ↘️ |
| **Tablet** (640-1024px) | Fixa (w-64) | 2 colunas | Fixado ↘️ |
| **Desktop** (>1024px) | Fixa (w-64) | 3-4 colunas | Fixado ↘️ |

---

## ♿ Acessibilidade (WCAG 2.1 AA)

| Critério | Implementação |
|----------|---------------|
| **Contraste** | 4.5:1 mínimo em ambos temas |
| **Foco Visível** | `focus-visible:ring-2` em todos interativos |
| **Teclado** | Tab lógico, ESC fecha modais, Enter/Space ativa |
| **ARIA** | Labels em botões-ícone, `role="status"` no Toast |
| **Semântica** | `<main>`, `<nav>`, `<aside>`, `<section>`, `<button>` |
| **Live Regions** | Toast anuncia mudanças para screen readers |

---

## 🚀 Deploy: Vercel Ready

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    { "source": "/(.*)", "headers": [CSP, X-Frame-Options, ...] },
    { "source": "/assets/(.*)", "headers": [{ "Cache-Control": "1 year" }] }
  ]
}
```

```bash
# Deploy em 1 comando
vercel --prod
```

### Security Headers Inclusos
- ✅ `Content-Security-Policy` — Restringe fontes
- ✅ `X-Frame-Options: DENY` — Anti-clickjacking
- ✅ `X-Content-Type-Options: nosniff` — Anti-MIME sniffing
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🧪 Qualidade: Zero Tolerance

```bash
# Gates obrigatórios antes de commit
npm run typecheck   # TypeScript strict → 0 erros
npm run lint        # ESLint → 0 warnings
npm run format      # Prettier → consistente
npm run test        # Vitest → passing + coverage
```

### Testes Implementados
- **Unitários** — Utils (date, generateId), Validação (Zod)
- **Componentes** — Button, Modal, Form interactions
- **Integração** — Fluxos CRUD completos (planejado)

---

## 📦 Dados: localStorage Structure

```
localStorage
├── taskflow-tasks     → { tasks: Task[], filter: {...} }
├── taskflow-projects  → { projects: Project[] }
├── taskflow-tags      → { tags: Tag[] }
└── taskflow-theme     → "light" | "dark" | "system"
```

### Export/Import (Settings)
```json
{
  "tasks": [...],
  "projects": [...],
  "tags": [...],
  "theme": "system",
  "exportedAt": "2024-01-15T10:30:00.000Z",
  "version": 1
}
```

---

## 🔮 Roadmap

| Prioridade | Feature | Status |
|------------|---------|--------|
| 🔥 **Alta** | PWA (Service Worker + Manifest) | Planejado |
| 🔥 **Alta** | Testes E2E (Playwright) | Planejado |
| 🔥 **Alta** | Atalhos teclado (Cmd+K busca) | Planejado |
| 🟡 **Média** | Drag-and-drop reordenar | Planejado |
| 🟡 **Média** | Backend opcional (Supabase) | Pesquisa |
| 🟢 **Baixa** | Tarefas recorrentes | Backlog |
| 🟢 **Baixa** | Subtarefas/checklists | Backlog |
| 🟢 **Baixa** | Colaboração multi-usuário | Backlog |

---

## 📋 Como Começar

```bash
# 1. Clone
git clone https://github.com/AironTso/taskflow.git
cd taskflow

# 2. Instale
npm install

# 3. Desenvolva
npm run dev        # http://localhost:5173

# 4. Qualidade
npm run typecheck  # TS check
npm run lint       # ESLint
npm run test       # Testes

# 5. Deploy
npm run build
vercel --prod
```

---

## 📄 Licença

**MIT** — Use, modifique, distribua livremente.

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra Pull Request

---

<div align="center">

**Desenvolvido com Spec-Driven Development + GitHub Copilot**

[📖 Documentação Técnica Completa](./DOCUMENTACAO_TECNICA.md) | [🐛 Reportar Bug](https://github.com/AironTso/taskflow/issues) | [💡 Sugerir Feature](https://github.com/AironTso/taskflow/issues/new)

</div>