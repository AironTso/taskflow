# Requisitos Não-Funcionais

## RNF-01: Performance
| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RNF-01.1 | Tempo de carregamento inicial | < 3s em conexão 3G |
| RNF-01.2 | Tempo de resposta interações | < 100ms para ações locais |
| RNF-01.3 | Bundle size (gzipped) | < 150KB |

## RNF-02: Usabilidade
| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RNF-02.1 | Responsividade | Funcional em 320px - 1920px |
| RNF-02.2 | Acessibilidade | WCAG 2.1 AA (contraste, foco, ARIA) |
| RNF-02.3 | Feedback visual | Loading states, toasts, confirmações |

## RNF-03: Confiabilidade
| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RNF-03.1 | Persistência local | Dados sobrevivem a refresh/fechar browser |
| RNF-03.2 | Tratamento de erros | Error boundaries + toasts amigáveis |
| RNF-03.3 | Validação de dados | Zod schemas em formulários |

## RNF-04: Segurança
| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RNF-04.1 | Sanitização de inputs | Prevenção XSS em campos de texto |
| RNF-04.2 | CSP | Content Security Policy configurado |

## RNF-05: Manutenibilidade
| ID | Requisito | Critério de Aceitação |
|----|-----------|----------------------|
| RNF-05.1 | Cobertura de testes | > 80% linhas críticas |
| RNF-05.2 | Documentação | README + specs + comentários complexos |
| RNF-05.3 | TypeScript strict mode | Zero erros ny não justificados |
