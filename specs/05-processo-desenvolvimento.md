# Processo de Desenvolvimento

## Metodologia
Desenvolvimento guiado por especificações (Spec-Driven Development) com IA (GitHub Copilot).

## Ciclo de Desenvolvimento

### 1. Especificação (.md)
- Todos os requisitos documentados em specs/
- Cada feature começa com especificação escrita
- Aprovação humana antes da implementação

### 2. Geração de Código (Copilot)
- Prompts baseados nas specs
- Iteração: especificação ? código ? revisão ? ajustes
- Commits atômicos por feature/requisito

### 3. Validação
- TypeScript strict mode (zero erros)
- ESLint + Prettier (formatação consistente)
- Testes unitários (Vitest) para lógica crítica
- Testes de componente (React Testing Library)

### 4. Definition of Done
- [ ] Código implementado conforme spec
- [ ] TypeScript compila sem erros
- [ ] Lint passa sem warnings
- [ ] Testes passam (>80% cobertura em features)
- [ ] Funcionalidade testada manualmente
- [ ] Documentação atualizada se necessário

## Branching Strategy (GitFlow Simplificado)

`
main (producao)
  +-- develop (integracao)
        +-- feature/RF-01-tasks
        +-- feature/RF-02-projects
        +-- feature/RF-03-tags
        +-- feature/RF-04-dashboard
        +-- feature/RF-05-settings
`

## Convenções de Commits (Conventional Commits)

`
feat(tasks): add create task form with validation
fix(projects): prevent delete default project
refactor(store): extract task selectors to hooks
docs(specs): update RF-04 with chart requirements
test(tasks): add unit tests for priority sorting
chore(deps): update tailwind to v3.4
`

## Ferramentas de Qualidade

| Ferramenta | Comando | Uso |
|------------|---------|-----|
| TypeScript | 
pm run typecheck | Validação estática |
| ESLint | 
pm run lint | Qualidade de código |
| Prettier | 
pm run format | Formatação |
| Vitest | 
pm run test | Testes unitários |
| Husky | Pre-commit hook | Automatização |
