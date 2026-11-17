# TaskFlow - Gerenciador de Tarefas Pessoal

![TaskFlow](docs/screenshot-dashboard.png)

> Aplicação web full-stack para gerenciamento de tarefas pessoais com organização por projetos, prioridades, tags e datas de vencimento.

## ? Funcionalidades

- ? **Tarefas**: Criar, editar, excluir, marcar como concluída
- ?? **Projetos**: Organize tarefas em projetos com cores e ícones
- ??? **Tags**: Categorize com tags personalizadas coloridas
- ?? **Prioridades**: Baixa, Média, Alta, Urgente com indicadores visuais
- ?? **Datas de vencimento**: Alertas visuais para tarefas atrasadas e próximas
- ?? **Dashboard**: Estatísticas de produtividade, distribuição por prioridade/projeto
- ?? **Filtros avançados**: Por status, prioridade, projeto, tags, busca textual
- ?? **Tema**: Claro, escuro ou sistema
- ?? **Persistência local**: Dados salvos no localStorage (sem backend necessário)
- ?? **Import/Export**: Backup e restauração de dados em JSON
- ? **Acessibilidade**: WCAG 2.1 AA, navegação por teclado, ARIA labels
- ?? **Responsivo**: Mobile-first, funciona em qualquer dispositivo

## ?? Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + TypeScript |
| Build | Vite 5 |
| Estilização | Tailwind CSS |
| Estado | Zustand |
| Roteamento | React Router v6 |
| Validação | Zod |
| Datas | date-fns |
| Ícones | Lucide React |
| Testes | Vitest + React Testing Library |
| Lint/Format | ESLint + Prettier |

## ?? Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## ?? Estrutura do Projeto

```
taskflow/
+-- public/                 # Assets estáticos
+-- specs/                  # Especificações (.md)
¦   +-- 01-visao-geral.md
¦   +-- 02-requisitos-funcionais.md
¦   +-- 03-requisitos-nao-funcionais.md
¦   +-- 04-arquitetura.md
¦   +-- 05-processo-desenvolvimento.md
¦   +-- 06-deploy.md
+-- src/
¦   +-- app/               # Configuração da app
¦   ¦   +-- providers/     # Theme, Store, Router providers
¦   ¦   +-- routes/        # Rotas
¦   +-- features/          # Features (domain-driven)
¦   ¦   +-- tasks/         # Feature: Tarefas
¦   ¦   +-- projects/      # Feature: Projetos
¦   ¦   +-- tags/          # Feature: Tags
¦   +-- pages/             # Páginas da aplicação
¦   +-- shared/            # Código compartilhado
¦   ¦   +-- components/    # UI components genéricos
¦   ¦   +-- hooks/         # Hooks genéricos
¦   ¦   +-- utils/         # Utilitários
¦   ¦   +-- types/         # Types globais
¦   +-- styles/            # Estilos globais
¦   +-- test/              # Configuração de testes
¦   +-- App.tsx            # Componente raiz
¦   +-- main.tsx           # Entry point
+-- docs/                  # Documentação e apresentação
+-- index.html
+-- package.json
+-- tsconfig.json
+-- vite.config.ts
+-- tailwind.config.js
+-- README.md
```

## ??? Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run lint       # ESLint
npm run format     # Prettier
npm run typecheck  # TypeScript check
npm run test       # Testes (Vitest)
npm run test:ui    # Testes com UI
```

## ?? Decisões de Design

### Arquitetura Feature-Based
Organização por domínio (tasks, projects, tags) ao invés de tipo técnico. Cada feature é autocontida com seus próprios components, hooks, store e types.

### Estado com Zustand + Persist
- Store global mínimo, slices por feature
- Middleware `persist` sincroniza automaticamente com localStorage
- Seletores tipados para performance

### Validação com Zod
Schemas compartilhados entre formulários e store, inferência de tipos TypeScript automática.

### Componentes Acessíveis
- Labels associados corretamente
- ARIA attributes em modais, toast, formulários
- Foco visível e navegação por teclado
- Contraste WCAG AA em ambos temas

## ?? Responsividade

| Breakpoint | Layout |
|------------|--------|
| < 640px | Mobile: sidebar colapsável, FAB para nova tarefa |
| 640-1024px | Tablet: sidebar fixa, grid 2 colunas |
| > 1024px | Desktop: sidebar fixa, grid 3-4 colunas |

## ?? Configuração de Deploy (Vercel)

O projeto inclui `vercel.json` com:
- SPA rewrites para React Router
- Security headers (CSP, X-Frame-Options, etc.)
- Cache otimizado para assets estáticos

```bash
# Deploy via Vercel CLI
npm i -g vercel
vercel --prod
```

Ou conecte o repositório no [Vercel Dashboard](https://vercel.com/new).

## ?? Licença

MIT License - sinta-se livre para usar e modificar.

---

Desenvolvido com ?? seguindo **Spec-Driven Development** com GitHub Copilot.
