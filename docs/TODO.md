# asterism — plano de execução

> **Status** bootstrap concluído · decisões pendentes resolvidas · Etapa 1 aguardando início
> Estrutura em três níveis: **etapa** → **tarefa atômica** → **critério de pronto**.
> Cada tarefa cabe num commit. Etapas 1 e 2 estão expandidas; as demais têm apenas
> objetivo e entrega, e são quebradas em tarefas quando chegarem.

## Mapeamento com o roadmap

O roadmap da §15 do documento de contexto tem quatro fases. Este plano tem cinco etapas,
porque a Fase 1 é grande demais para uma etapa só e vale a pena separar a prova de que o
caminho funciona da construção da biblioteca:

| Etapa daqui | Fase do §15 |
|---|---|
| 1 — MVP + 2 — Templates | Fase 1 — fatia vertical |
| 3 — Biblioteca | Fase 2 |
| 4 — Editor | Fase 3 |
| 5 — Produto | Fase 4 |

---

## Etapa 0 — Bootstrap ✅

Concluída. Next.js 16 com App Router, Tailwind v4 e shadcn/ui sobre Base UI; tema do
Observatório aplicado e verificado; as três fontes como arquivos locais; git com `main`
e `dev`; `CLAUDE.md`; este arquivo.

A verificação visual pegou dois bugs, corrigidos: a escala `ink` sem cor, por
tree-shaking de token do Tailwind, e o grid de fundo com linhas somindo, por causa do
meio pixel. Ver decisões 15 e as armadilhas da §13 do documento de contexto.

Os componentes de logo maiahub entraram em `src/components/maiahub/`, com a estrela
mapeada para `azure-400`. Documentação em `docs/maiahub-logo.md`.

---

## Etapa 1 — MVP, prova de conceito

**Objetivo.** Provar o caminho inteiro de ponta a ponta: um deck existir, um template
renderizar, o canvas exibir e sair um PDF. Cru é aceitável; incompleto no meio do
caminho não é.

**Fora desta etapa.** Marcação inline, os outros dois templates, persistência, undo,
guard de transbordo, imagens, shiki, reordenação por arraste, múltiplos decks,
componentes de rodapé.

**Pronto quando** um deck de um slide vira um PDF 1080×1350 que abre no visualizador,
com Oxanium e o grid de fundo visíveis no arquivo — não no preview, no arquivo.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.1 | Instalar e configurar Vitest com `@testing-library/react` e `happy-dom`; script `npm test` | `npm test` roda e um teste-sentinela falha por asserção, não por configuração |
| 1.2 | Tipos do domínio em `src/deck/types.ts` — `Deck`, `Slide`, `SlideId`, `ImageId`, `FieldValue`, `OptionValue`, `DeckMeta` | `npx tsc --noEmit` limpo; `format` é dado do deck, não constante |
| 1.3 | Factories `createDeck` e `createSlide` | Testes escritos antes passam: id único, `version: 1`, `format` 1080×1350, slide criado com os defaults do template |
| 1.4 | Tipos `TemplateDef` e `Field` em `src/templates/types.ts` — o descritor declarativo da §8 | Os sete tipos de `Field` compilam; `TemplateDef` é genérico em `F` e `O` |
| 1.5 | Registry de templates — `register`, `get`, `list` | Testes antes: registrar e recuperar, `list` preserva ordem de registro, `get` de id desconhecido lança |
| 1.6 | `cover-statement`: `meta.ts` e `fields.ts` com descritores e schema zod | `defaults` do §11.1 validam contra o próprio schema, verificado em teste. `kicker` é campo digitado, não derivado — decisão 14 |
| 1.7 | `cover-statement`: `index.tsx` com as regiões do §11.1, texto literal | Kicker em 80–148, título ancorado à **base** da região 300–1160; título de uma linha e de quatro linhas pousam na mesma altura |
| 1.8 | `SlideFrame` — raiz de tamanho fixo que injeta `--slide-w`/`--slide-h` a partir de `deck.format` | Nenhum template hardcoda 1080 ou 1350; mudar `format` muda o quadro |
| 1.9 | Canvas central com `transform: scale(k)` e `transform-origin: top left` num wrapper de tamanho fixo | O slide cabe na viewport sem media query; nenhuma matemática responsiva dentro do template |
| 1.10 | Store zustand mínimo — deck, slide ativo, `setField` | Digitar no inspector muda o canvas. Sem `persist`, sem `zundo` |
| 1.11 | Inspector: formulário derivado dos descritores, tipos `text` e `textarea`, com contador de caracteres | Campo novo no descritor aparece no formulário sem tocar no inspector |
| 1.12 | Lista lateral de slides — índice, rótulo do template, seleção | Clicar troca o slide ativo. Somente leitura: sem arraste, sem duplicar, sem remover |
| 1.13 | `rasterize(source, escala)` sobre `modern-screenshot`, escala 2 | Devolve um `Frame` de 2160×2700 com as fontes inlinadas — conferir que o bitmap não saiu em Arial |
| 1.14 | Registry de alvos de exportação + alvo `pdf` com jsPDF, uma página por slide | `ExportResult` devolve lista de arquivos mesmo com um só; o alvo não conhece nenhum template |
| 1.15 | Botão de exportação na barra superior | Clicar baixa o PDF; o botão não sabe quais alvos existem, só consulta o registry |
| 1.16 | Remover a página de verificação do tema | `src/app/page.tsx` passa a ser o editor |

---

## Etapa 2 — Templates

**Objetivo.** Os três templates da Fase 1 especificados no design system, com a marcação
inline funcionando. Ao fim desta etapa a ferramenta publica um carrossel real.

**Fora desta etapa.** Os outros sete templates, shiki, guard de transbordo, imagens,
undo/redo, múltiplos decks.

**Pronto quando** um carrossel de 8 a 12 slides é composto com os três templates,
usando marcação, e exportado para publicação no LinkedIn sem retoque externo.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.1 | `parseInline(src): Inline[]` — os sete marcadores da §7, sem aninhamento | TDD pesado, é o alvo de cobertura séria da v1: cada marcador isolado, marcadores adjacentes, marcador não fechado, `**a *b* c**` tratado como literal no marcador externo, string vazia, texto sem marcador. Devolve AST, **nunca** HTML |
| 2.2 | `<Inline>` — AST → spans, com os tokens da §10.2 | Os sete marcadores renderizam com a cor e a forma da tabela; `==marca==` com cantos retos, `` `código` `` com raio 6px |
| 2.3 | `cover-statement` passa a renderizar o título via `<Inline>` | `[[destaque]]` sai em `azure-400` dentro do título em 96px |
| 2.4 | Componentes recorrentes da §10.5 — `Kicker`, `Constelacao`, `Chevron`, `Rodape` | Constelação com dois estados apenas, sem estado para o slide atual; chevron só na capa |
| 2.4a | Escolher por teste visual a peça de logo do rodapé | Ver experimento 1 abaixo. Decidido, a §11.0 do design system é atualizada junto |
| 2.4b | Resolver o recorte da constelação acima de 10 slides | Ver experimento 2 abaixo. Decidido, a §10.5 é atualizada junto |
| 2.5 | Fundo aplicado a partir de `meta.fundo` — `plain` ou `grid` | `grid` desenha linhas de 0.5px a cada 60px; nenhum template de código ou imagem recebe grid |
| 2.6 | Inspector: tipo de campo `list`, com `maxItems` e `maxPerItem` | Adicionar, remover e reordenar itens dentro do limite do descritor |
| 2.7 | Inspector: tipos `select` e `toggle`, na seção de opções | Opções ficam visualmente separadas dos campos de conteúdo |
| 2.8 | `text-bullets` completo — regiões da §11.2, marcador travessão, opção `anchor` | `center` distribui os itens no miolo, `top` encosta abaixo do cabeçalho; três itens é o alvo, quatro o teto |
| 2.9 | `final-cta` completo — conteúdo ancorado à base, bloco de CTA, opção `showArrow` | Lead vazio faz o bloco desaparecer junto com o gap; constelação inteira acesa |
| 2.10 | `migrateFields(from, to, fields)` — migração de conteúdo na troca de template | TDD: chave compartilhada migra, chave sem correspondência é descartada, `options` sempre resetam para os defaults do template novo. O vocabulário único da §6 torna a migração uma interseção de chaves, sem tabela de equivalência |
| 2.11 | Seletor de layout no topo do inspector, usando `migrateFields` | Trocar o layout preserva o que já foi digitado e reseta as opções |
| 2.12 | `persist` do zustand em localStorage | Recarregar a página não perde o deck |

> A tarefa 2.12 é antecipada da Fase 3 do §15. Motivo: o próprio §15 afirma que a Fase 1
> já permite publicar um carrossel real, e um deck que some no reload não permite. Custa
> poucas linhas de middleware.

---

## Etapa 3 — Biblioteca

**Objetivo.** Fechar a biblioteca de dez templates e tornar a ferramenta confiável para
conteúdo denso. Corresponde à Fase 2 do §15.

**Entrega.** Os sete templates restantes — `context`, `text-impact`, `code-window`,
`code-annotated`, `compare-2col`, `split-vertical`, `image-caption`. Bloco de código
com shiki e tema derivado dos tokens da §10.4, não importado pronto. Guard de transbordo
por `ResizeObserver`, marcando o slide como inválido no canvas e na lista lateral.

O guard não é polimento opcional: slide tem altura fixa e texto longo transborda: é a
falha número um deste tipo de ferramenta.

**Mais uma tarefa nesta etapa:** alinhar as variantes do shadcn à §2.4 do design system.
O preset `nova` desenha o botão destrutivo como fundo tingido a 10%, e o padrão do
sistema é tom 400 de preenchimento com tom 950 de texto. A decisão já está tomada — o
Observatório vence, decisão 17 — e fica para cá porque com três componentes instalados
seria ajustar no escuro. Auditar todas as variantes na mesma passada.

---

## Etapa 4 — Editor

**Objetivo.** Transformar o protótipo funcional em algo que aguenta uso semanal.
Corresponde à Fase 3 do §15.

**Entrega.** Reordenação por arraste com `@dnd-kit/sortable`; duplicar e remover slide;
undo/redo com `zundo`; múltiplos decks com tela de listagem; import/export `.json` com
imagens embutidas em base64; imagens no IndexedDB via `idb-keyval`, com o deck guardando
apenas `ImageId`.

Apenas upload local de imagem. URL externa contamina o canvas e faz a exportação falhar
em silêncio.

---

## Etapa 5 — Produto

**Objetivo.** Deixar a ferramenta apresentável como projeto de portfólio e publicá-la.
Corresponde à Fase 4 do §15.

**Entrega.** Atalhos de teclado; estados vazios; README com GIF de demonstração
substituindo o do `create-next-app`; deploy estático na Vercel.

**Critério de conclusão da v1.** Um carrossel completo, do zero ao PDF publicado no
LinkedIn, sem sair da ferramenta e sem retoque em nenhum outro programa.

---

## A resolver por experimento

As cinco decisões que estavam pendentes foram respondidas e registradas na §16 do
documento de contexto, decisões 13 a 17. Sobraram dois pontos que não se resolvem no
papel — precisam dos dois lados renderizados lado a lado.

### Experimento 1 — a peça de logo do rodapé · tarefa 2.4a

A §11.0 descreve o rodapé como duas coisas: "logo de 32px, gap 20px, handle em
`slide-meta` `ink-400`". O `MaiahubSignature` já é marca, divisória e nome numa peça só
— e o nome que ele carrega é "maiahub", não o `@handle` do deck.

Os dois caminhos:

- **`MaiahubMark` + handle**, como a §11.0 diz. O rodapé fica com o handle do deck, que
  é o que a pessoa procura para seguir. A marca aparece como símbolo, sem repetir texto.
- **`MaiahubSignature`**, que traz a marca escrita. Mais institucional, mas ou o handle
  some do rodapé ou o slide passa a ter dois nomes competindo no mesmo canto.

Renderizar os dois num slide real, a 32px, e decidir olhando. O que perder é removido do
projeto — cinco peças de logo para um uso só é peso morto.

### Experimento 2 — constelação acima de 10 slides · tarefa 2.4b

A §10.5 diz "5 pontos mais um contador `03 / 12`" e não diz quais cinco. Três leituras:

- **Cinco primeiros.** Simples, mas para de comunicar progresso a partir do sexto slide.
- **Janela deslizante** em torno do atual. É a leitura mais provável, e colide com a
  regra de que "o atual é simplesmente o último aceso" — numa janela deslizante o último
  aceso é sempre o mesmo ponto, e a constelação vira decoração.
- **Amostragem espalhada** pelo deck, tipo 1, 4, 7, 10, 12. Mantém a noção de progresso e
  perde a de contagem, que o contador ao lado já cobre.

Montar as três com um deck de 12 slides e escolher.
