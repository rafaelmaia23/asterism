---
status: accepted
---

# 49. Os seis componentes shadcn cedem ao documento em foco, raio, hover, ativo, desabilitado e inválido — experimento 3

Montadas as duas telas lado a lado, o preset perdeu em cada linha por um motivo diferente, e nenhum deles é gosto. O anel de 3px a 50% **some sobre `ink-950`** e, colado no controle, confunde-se com a borda que ele deveria destacar; o de 2px cheio com offset lê como anel. O raio de 8px em controle e 12px em cartão apaga a diferença entre os dois — e o 12px nem era escolha, era o default do Tailwind entrando porque `--radius-xl` não é declarado neste tema. `translate-y-px` move o botão para baixo, que é a direção de afundar, enquanto `scale(0.98)` é o mesmo gesto sem deslocar nada em volta. E `opacity-50` apaga o controle inteiro, inclusive a borda, quando o que a §8 quer apagar é o **rótulo** — a superfície continua sendo onde o controle está. A auditoria completa, que a tarefa 3.6 exigia, encontrou três divergências além das duas que a 1D tinha registrado, todas da mesma origem: o anel translúcido do `aria-invalid`, a `shadow-md` do popup do `select` — que contraria a §1, onde não há sombra projetada — e as duplicatas `dark:` de valores que já são os únicos que valem. A lista virou tabela de conferência na §9 do design system, porque o próximo componente instalado vai trazer as mesmas.

## Alternativas consideradas

Corrigir a §5 e a §8 para descrever o que o preset `nova` instalou, que é coerente consigo mesmo; ou ficar no meio, aceitando a espessura do preset sem o offset.
