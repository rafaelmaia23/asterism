# asterism — plano de execução

> **Status** bootstrap concluído · decisões resolvidas · **Etapa 1 concluída; Etapa 2 em
> curso: 2A, 2B e 2C concluídas — a próxima sessão abre a 2D**
> Estrutura em três níveis: **etapa** → **tarefa atômica** → **critério de pronto**.
> Cada tarefa cabe num commit. As Etapas 1 e 2 têm um nível a mais — **sub-etapa**, uma
> por sessão de trabalho. Etapas 1 e 2 estão expandidas; as demais têm apenas objetivo e
> entrega, e são quebradas em tarefas quando chegarem.

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

## Etapa 1 — MVP, prova de conceito ✅

**Objetivo.** Provar o caminho inteiro de ponta a ponta: um deck existir, um template
renderizar, o canvas exibir e sair um PDF. Cru é aceitável; incompleto no meio do
caminho não é.

**Fora desta etapa.** Marcação inline, os outros dois templates, persistência, undo,
guard de transbordo, imagens, shiki, reordenação por arraste, múltiplos decks,
componentes de rodapé.

**Pronto quando** um deck vira um PDF 1080×1350 que abre no visualizador, com Oxanium e o
grid de fundo visíveis no arquivo — não no preview, no arquivo.

As dezesseis tarefas são grandes demais para uma sessão só, então a etapa está dividida em
**cinco sub-etapas**. Cada uma tem as dependências resolvidas, um critério de pronto que
se verifica sozinho e um estado do repositório que compila, passa nos testes e pode ser
abandonado sem deixar meio caminho. Uma sub-etapa por sessão, uma branch por sub-etapa.

Dois ajustes de escopo que a divisão tornou visíveis:

- **A tarefa 2.5 subiu para cá**, dentro da 1C. O critério de pronto desta etapa exige o
  grid de fundo visível no arquivo, então o `SlideFrame` já precisa aplicar o fundo a
  partir de `meta.background`. Na Etapa 2 sobra conferir o `plain` dos templates novos.
- **A tarefa 1.16 deixou de existir sozinha.** Remover a página de verificação de tema é o
  mesmo commit que a transforma no shell do editor, na 1C.

### 1A — fundação testável ✅

Instalou `vitest`, `happy-dom`, `@testing-library/react`, `@testing-library/dom` e
`vite-tsconfig-paths`. A configuração segue o guia do próprio Next em
`node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`, com duas trocas:
`happy-dom` no lugar de jsdom e **sem `@vitejs/plugin-react`**, que conflita com o Babel
7 fixado pelo `shadcn` e não serve para nada numa rodada de teste — o JSX sai do
`"jsx": "react-jsx"` do `tsconfig.json`. Ver a §13 do documento de contexto. É
`vite-tsconfig-paths` que faz o alias `@/` resolver.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.1 | Instalar e configurar Vitest com `@testing-library/react` e `happy-dom`; script `npm test` | `npm test` roda e um teste-sentinela falha por asserção, não por configuração |
| 1.2 | Tipos do domínio em `src/deck/types.ts` — `Deck`, `Slide`, `SlideId`, `ImageId`, `TemplateId`, `FieldValue`, `OptionValue`, `DeckMeta` | `npx tsc --noEmit` limpo; `format` é dado do deck, não constante |
| 1.3 | Factories `createDeck` e `createSlide` | Testes escritos antes passam: id único, `version: 1`, `format` 1080×1350, slide criado com os defaults recebidos |

`createSlide` precisa dos `defaults` do template, mas `src/deck` **não** importa o
registry: a seta é `templates → deck` e nunca o contrário. Então os defaults chegam como
argumento, tipados por uma forma mínima declarada no próprio `deck/types.ts` —
`SlideDefaults`. O teste passa um objeto literal e a 1A fechou antes de existir qualquer
template.

Resolvido na sessão: `FieldValue` é `string | string[]` e `OptionValue` é
`string | boolean`; `TemplateId` é `string`; `DeckMeta` é só `handle` e `pillar`;
`createDeck` recebe um init parcial opcional e nasce com `slides: []`. A cópia dos
defaults em `createSlide` é profunda — `structuredClone` — senão dois slides do mesmo
template compartilhariam o array de um campo `list`. A §6 do documento de contexto foi
atualizada junto.

### 1B — registry e o primeiro template ✅

Instalou `zod` 4.4.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.4 | Tipos `TemplateDef` e `Field` em `src/templates/types.ts` — o descritor declarativo da §8 do documento de contexto | Os sete tipos de `Field` compilam; `TemplateDef` é genérico em `F` e `O` |
| 1.5 | Registry de templates — `register`, `get`, `list` | Testes antes: registrar e recuperar, `list` preserva ordem de registro, `get` de id desconhecido lança |
| 1.5a | As oito `@utility slide-*` da escala tipográfica da §3.3 do design system — decisão 19 | `globals.css` e `docs/theme.css` recebem o mesmo bloco; cada utility carrega família, tamanho, altura, peso e tracking, e `slide-meta` inclui a caixa alta. A §3.3 do design system ganha a nota no mesmo commit |
| 1.6 | `cover-statement`: `meta.ts` e `fields.ts` com descritores e schema zod | `defaults` da §11.1 dos templates validam contra o próprio schema, verificado em teste. `kicker` é campo digitado, não derivado — decisão 14 |
| 1.7 | `cover-statement`: `index.tsx` com as regiões da §11.1 dos templates, texto literal | Kicker em 80–148, título ancorado à **base** da região 300–1160; título de uma linha e de quatro linhas pousam na mesma altura |

`src/templates/index.ts` é o único lugar que importa e registra template. A conferência
visual do componente é da 1C — aqui ele só precisa compilar.

Resolvido na sessão:

- **As peças recorrentes do rodapé foram extraídas já**, antecipando parte da 2.4:
  `Kicker`, `Constellation` e `Chevron` moram em `src/templates/shared/`. O `Footer` de
  identidade não veio junto: a capa é justamente o template que não o tem, e seria a
  única peça sem consumidor. Nomes em inglês, como manda o CLAUDE.md.
- **A constelação acima de dez slides não recebe tratamento** nesta etapa: desenha um
  ponto por slide em qualquer contagem, sem janela e sem contador. O recorte da §10.5 do
  design system continua sendo o experimento 2, na 2.4b, e a seção recebeu a nota do que
  está implementado até lá.
- **`register` com id repetido lança**, simétrico ao `get` de id desconhecido: quem
  registra é um módulo só, que roda uma vez, então id duplicado é erro de programação e
  não estado de runtime. O registry é uma factory `createRegistry()` com uma instância
  módulo-nível exportada — os testes criam a sua e não precisam de um `clear()` que só
  existiria para eles. **Menos em desenvolvimento**, onde registrar de novo substitui:
  ajuste da 1D, porque ali o segundo registro é o HMR reavaliando `templates/index.ts` sem
  reavaliar o registry, e lançar derrubava o `next dev` a cada edição.
- `meta.ts` guarda os cinco campos que a §8 do documento de contexto lhe dá; o
  `TemplateDef` completo é montado no `index.tsx`, que é quem tem o `Component`.
- O critério de pronto da 1.7 — uma linha e quatro linhas pousando na mesma altura — não
  é verificável em `happy-dom`, que não faz layout. O teste do template é smoke; a
  âncora se confere olhando, na 1C.
- A §8 do documento de contexto ganhou os limites de `F` e `O`, que são o que torna
  `defaults` atribuível ao `SlideDefaults` da §6, e a nota de por que o registry guarda
  `TemplateDef<any, any>`.

### 1C — quadro, canvas e shell ✅

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.8 | `SlideFrame` — raiz de tamanho fixo que injeta `--slide-w`/`--slide-h` a partir de `deck.format`, e `--slide-scale` a partir da prop de escala | Nenhum template hardcoda 1080 ou 1350; mudar `format` muda o quadro. O `SlideFrame` é o **único** dono de `--slide-scale` — é o único que sabe em que tamanho o slide está sendo exibido |
| 1.8a | Fundo aplicado a partir de `meta.background` — antecipada da 2.5 | `grid` desenha linhas de 2px a cada 60px; conferir no preview **e**, na 1E, no PDF exportado: são os dois lados da compensação de `--slide-scale` |
| 1.9 | Canvas central com `transform: scale(k)` e `transform-origin: top left` num wrapper de tamanho fixo | O slide cabe na viewport sem media query; nenhuma matemática responsiva dentro do template. O mesmo `k` do `transform` vai para `--slide-scale`, senão o grid de fundo some no preview |
| 1.16 | `src/app/page.tsx` deixa de ser a página de verificação do tema e vira o shell de três colunas | Centro com o canvas funcionando; laterais como espaço reservado. A página de tema já cumpriu o papel e está no histórico |

O `k` vem de um `ResizeObserver` na área central, `min(w / 1080, h / 1350)`: auto-fit, sem
seletor de zoom — decisão 22.

Resolvido na sessão:

- **Duas pastas novas, cortadas por quem as usa.** `src/render/` guarda o que preview e
  exportação compartilham — `SlideFrame` e `SlideView` —, e `src/editor/` guarda o chrome:
  shell, canvas, escala e deck semente. O palco oculto da 1E monta o deck reusando
  `src/render/` e não passa perto do `src/editor/`.
- **`SlideView` é quem traduz `slide.template` em componente**, pedindo o descritor ao
  registry. Ficou fora do canvas de propósito: o canvas sabe de escala e de mais nada, e
  a 1E precisa da tradução sem precisar do canvas.
- **A área de trabalho é `ink-900` e o quadro tem moldura de 1px `ink-700`** — decisão
  23, corrigida na conferência visual. A primeira tentativa pôs slide e área no mesmo
  `ink-950` separados por hairline `ink-800`, e não dava para ver onde termina a página;
  a §2.2 do design system já mandava inverter a escada, e a borda entrou por cima. Ela
  mora no quadro externo, fora do `transform`: dentro, encolheria com a escala e viajaria
  dentro do nó capturado.
- **Auto-fit com teto de 1.** Numa tela grande a área central passa de 1080×1350, e
  exibir o slide acima do tamanho real não ajuda — o carrossel é publicado reduzido.
  Enquanto a escala for 0, o canvas não desenha quadro nenhum: `calc(1px / 0)` na
  compensação do grid não pode acontecer.
- **A barra superior nasceu junto, reservada**, com o nome do deck. A 1E acha onde pôr o
  botão de exportação e o editor já tem as proporções finais. A §14 do documento de
  contexto ganhou a nota.
- **O deck semente é um módulo**, `src/editor/seed.ts`, com os defaults vindos do
  registry e três títulos de comprimentos diferentes — um de uma linha, um de quatro. É
  o que faz a âncora de base da 1.7 ser conferível olhando. A 1D o move para dentro do
  store sem editá-lo.
- **`createSeedDeck()` é chamado dentro do componente**, em `useState`, não em módulo:
  `crypto.randomUUID()` avaliado no import daria ids diferentes na pré-renderização
  estática e no cliente.
- **A conferência visual reprovou a primeira versão, por laço de medição.** O slide abria
  pequeno e crescia sozinho até o teto de 1, estourando a tela: a área observada pelo
  `ResizeObserver` tinha altura dirigida pelo conteúdo, então o quadro esticava a área que
  o media e cada medida realimentava uma escala maior. Corrigido em dois pontos, e os dois
  ficam: o `body` passou a ter altura de viewport em vez de altura mínima, e o quadro saiu
  do fluxo, num palco `absolute` dentro da área. A §13 do documento de contexto e o
  `CLAUDE.md` ganharam a armadilha, que volta na 1E com o palco de exportação.
- **A medição roda em layout effect, com uma primeira leitura síncrona.** Sem isso o
  quadro aparece num tamanho e se ajusta no quadro seguinte, o que se lê como animação.

### 1D — estado e inspector ✅

Instala `zustand` e acrescenta o `textarea` e o `switch` do shadcn, que ainda não estão em
`src/components/ui/`.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.10 | Store zustand mínimo — deck, slide ativo, `setField` e `setOption` | Digitar no inspector muda o canvas. Sem `persist`, sem `zundo` |
| 1.11 | Inspector: formulário derivado dos descritores, tipos `text`, `textarea` e `toggle`, com contador de caracteres | Campo novo no descritor aparece no formulário sem tocar no inspector. O contador fica âmbar ao passar do `max` e não trava a digitação — §11.0 dos templates, limite é conselho |
| 1.12 | Lista lateral de slides — índice, rótulo do template, miniatura, seleção | Clicar troca o slide ativo. A miniatura é o próprio `SlideView` numa escala fixa, com o grid de fundo sobrevivendo à redução. Somente leitura: sem arraste, sem duplicar, sem remover |

O deck semente tem **três slides `cover-statement`**. Com um slide só, a lista lateral, a
troca de slide ativo e o laço de páginas do alvo PDF ficariam sem prova até a Etapa 2 — e
é exatamente ali que os erros de exportador aparecem.

**Ajuste de escopo, decidido na sessão.** A 1.11 escrevia `text` e `textarea` só. O
`toggle` entrou junto, com `setOption` no store e o `switch` do shadcn: sem ele o
`showChevron` do `cover-statement` nasceria sem controle e a separação `fields`/`options`
da §6 do documento de contexto ficaria sem prova até a Etapa 2. Os tipos que sobram —
`list`, `image`, `code`, `select` — não têm controle ainda, e o inspector os desenha como
linha inerte com o rótulo, para que um campo novo nunca suma do formulário em silêncio.

Resolvido na sessão:

- **O store é uma factory mais um singleton**, em `src/editor/store.ts`, sem provider de
  contexto — decisão 24. A factory é o que deixa cada teste montar um deck de fixture sem
  estado global atravessando de um caso para o outro, e o inspector e a lista recebem o
  store por prop com o singleton como padrão. Provider só se paga com dois decks vivos ao
  mesmo tempo, que é a tela de listagem da Etapa 4.
- **O slide ativo é guardado por id, não por índice.** Reordenar e remover chegam na Etapa
  4, e um índice guardado passaria a apontar para outro slide sem que nada avisasse.
- **Id desconhecido lança**, nas três ações, como o registry faz com template
  desconhecido. Nenhuma tela oferece um slide que o deck não tem, então é erro de
  programação e não estado de runtime a tratar.
- **A lista distingue três capas seguidas pelo trecho do `heading`.** É o primeiro uso
  prático do vocabulário canônico da §6 do documento de contexto fora dos templates: a
  lista lê a mesma chave em qualquer template e continua sem conhecer nenhum.
- **A auditoria do `textarea` e do `switch` contra a §9 do design system não pediu
  ajuste.** O switch ligado já é `primary` com o polegar em `primary-foreground`, que é o
  padrão "400 de preenchimento, 950 de texto" da §2.4. Sobraram duas divergências do
  preset que **já vinham do bootstrap** e valem para `button`, `input` e `card` também:
  anel de foco `ring-3` a 50% sem offset, onde a §5 pede 2px com offset 2px, e
  `rounded-lg` (8px) em controle de formulário, onde a §5 pede o raio padrão de 6px.
  Corrigir só nos dois componentes novos criaria divergência interna; virou o
  **experimento 3**, abaixo.
- **Um teste de integração do shell**, além dos testes isolados de cada coluna: é o que
  garante que lista, inspector e canvas falam com o mesmo store, que é justamente o que os
  testes isolados — cada um com o seu store de fixture — não podem ver.

A conferência visual no navegador rendeu mais cinco ajustes, e todos entraram na 1D:

- **Erro de hidratação no inspector.** Os `id` dos controles saíam de `slide.id`, que vem
  de `crypto.randomUUID()`: um valor na pré-renderização estática, outro no cliente, e o
  React não remenda atributo. Passaram a sair do `useId`. Virou armadilha na §13 do
  documento de contexto e no `CLAUDE.md`, e a decisão 24 foi corrigida — manter id de dado
  fora do DOM é condição que o código sustenta, não consequência do desenho.
- **`register` derrubava o `next dev` a cada edição**, porque o HMR reavalia
  `templates/index.ts` sem reavaliar o registry. Em desenvolvimento passa a substituir.
- **A miniatura da lista lateral entrou**, e ela nunca tinha sido agendada: a §14 do
  contexto a prometia e nenhuma tarefa a entregava. É o próprio `SlideView` numa escala
  fixa — sem `ResizeObserver`, que num item de lista traria de volta o laço da 1C — e o
  item da lista é memoizado por referência de slide, senão cada tecla digitada
  re-renderizaria a árvore completa de todos os slides do deck.
- **A grade de fundo virou opção do slide** — decisão 25, e a §4.3 do design system mudou
  junto. Era propriedade fixa do template; agora o `background` do descritor é só o padrão
  com que o slide nasce. O descritor de `showGrid` mora em `src/templates/shared/`, um só
  para os dez templates.
- **O seletor de layout apareceu no topo do inspector**, desabilitado. A troca continua
  sendo a 2.11, que depende do `migrateFields` da 2.10; desabilitar é o honesto, porque a
  2.8 e a 2.9 registram mais dois templates antes disso.

### 1E — exportação ✅

Instala `modern-screenshot` e `jspdf`.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.13 | `rasterize(source, escala)` sobre `modern-screenshot`, escala 2 | Devolve um `Frame` de 2160×2700 com as fontes inlinadas — conferir que o bitmap não saiu em Arial |
| 1.13a | Palco de exportação oculto — decisão 20 | Monta todos os slides do deck fora da tela, com layout real e `--slide-scale: 1`, espera `document.fonts.ready`, entrega os `RenderSource` e desmonta. Nunca captura o nó de dentro do wrapper escalado, senão a compensação de espessura do preview vaza para o arquivo |
| 1.14 | Registry de alvos de exportação + alvo `pdf` com jsPDF, uma página por slide | `unit: "pt"`, `format: [1080, 1350]` — decisão 21. `ExportResult` devolve lista de arquivos mesmo com um só; o alvo não conhece nenhum template |
| 1.15 | Botão de exportação na barra superior | Clicar baixa o PDF; o botão não sabe quais alvos existem, só consulta o registry |

Fecho da etapa: abrir o PDF fora da ferramenta e conferir as três páginas, a Oxanium e o
grid. Se o título sair em Arial, o problema é inlining de fonte, não o alvo.

Resolvido na sessão:

- **`Frame` carrega PNG em data URL** — decisão 26. É o que o jsPDF consome direto em
  `addImage` e o que um teste inspeciona sem canvas, que `happy-dom` não tem. Devolver o
  `HTMLCanvasElement` deixaria o alvo trocar de codificação sem recapturar — o plano de
  contingência da §13 do documento de contexto, se um deck com fotos estourar o tamanho —
  ao preço de o `Frame` deixar de ser dado e passar a ser objeto de DOM vivo.
- **O registry virou genérico**, em `src/lib/registry.ts` — decisão 27. A §10 já dizia que
  o registry de alvos é idêntico ao dos templates; agora é literalmente o mesmo, e a regra
  de HMR que a 1D descobriu vale para alvo sem ser escrita duas vezes.
- **O palco expõe o nó pelo `SlideFrame`, não por seletor no DOM.** O quadro ganhou um
  `canvasRef` opcional que o `SlideView` repassa. O `SlideFrame` já era o dono do nó
  capturável pela §9, e caçar `data-testid` no documento faria a exportação depender de um
  atributo de teste.
- **O palco é imperativo — `withExportStage(deck, run)` —, não componente do shell.** O
  fluxo é one-shot e nasce de um clique: montar, esperar `document.fonts.ready`, entregar,
  desmontar. Em estado e efeito do shell, o mesmo fluxo ficaria espalhado por três lugares
  sem ganhar nada. O parâmetro se chama `run` porque o eslint lê `use` como o hook homônimo
  do React e reprova a chamada dentro do `try`.
- **O palco fica `fixed` fora da tela, nunca `display: none`.** Sem caixa não há layout, e
  sem layout não há o que capturar. Fora de fluxo, ele também não realimenta medida
  nenhuma — a segunda condição da §13.
- **O alvo não conhece o deck, então não nomeia o arquivo.** Ele devolve `carrossel.pdf` e
  quem sabe o título é o `exportDeck`, que troca o nome pelo slug do deck. Foi o que
  manteve a §10 intacta: o alvo recebe `RenderSource[]` e mais nada.
- **Nem 1080 nem 1350 aparecem no alvo PDF.** A medida da página sai do primeiro `Frame`
  dividido pela escala, que é o que a §12 pede — o dia em que um deck 1:1 existir, o alvo
  não muda.
- **O teste do shell deixou de clicar por posição.** O botão de exportação entrou na barra
  superior e empurrou o índice do segundo slide; agora a busca é pelo número do slide, que
  o próximo controle da barra não quebra.

A conferência do PDF aprovou tudo menos a grade, e o conserto rendeu a mudança visual da
sub-etapa:

- **A grade de fundo virou elemento** — decisão 28, e a §4.3 do design system reescrita.
  O que o arquivo mostrava era um módulo desenhado no canto e o resto da página chapado de
  `ink-800`: gradiente não sobrevive à rasterização. Virou um `<svg>` com linhas de
  verdade, desenhado por `src/render/slide-grid.tsx`.
- **O módulo passou de 60px fixos para o divisor comum do formato mais próximo de 54px.**
  Em 1080×1350 são 54 — 20 por 25 quadrados inteiros — e a moldura fecha nos quatro lados.
  Some a assimetria que o ladrilho tinha e que ninguém tinha reparado: linha colada no topo
  e na esquerda, nenhuma na direita, e a faixa de baixo cortada ao meio. O `--slide-grid-size`
  saiu do `@theme`; a espessura e a compensação continuam onde estavam, no CSS.
- **O que o PDF já provava antes do conserto**, medido no bitmap e não a olho: três
  páginas, 1080×1350 pt, bitmap 2160×2700 a 144 ppi, Oxanium inlinada e nítida a 2×,
  espessura de linha de 2px de spec e módulo de 60px corretos. O único defeito era a
  repetição — e os três sintomas relatados eram esse um.

---

## Etapa 2 — Templates

**Objetivo.** Os três templates da Fase 1 especificados no design system, com a marcação
inline funcionando. Ao fim desta etapa a ferramenta publica um carrossel real.

**Fora desta etapa.** Os outros sete templates, shiki, guard de transbordo — decisão 32 —,
imagens, undo/redo, múltiplos decks, e o resto do que a Etapa 4 promete para a lista
lateral: reordenação por arraste e duplicar. Acrescentar e remover slide são a exceção,
pela decisão 30.

**Pronto quando** um carrossel de 8 a 12 slides é composto com os três templates,
usando marcação, e exportado para publicação no LinkedIn sem retoque externo.

As quinze tarefas são grandes demais para uma sessão só, então a etapa está dividida em
**cinco sub-etapas**, no mesmo formato da Etapa 1: dependências resolvidas, critério de
pronto que se verifica sozinho e um estado do repositório que compila, passa nos testes e
pode ser abandonado sem deixar meio caminho. Uma sub-etapa por sessão, uma branch por
sub-etapa.

Dois ajustes de escopo que a divisão tornou visíveis, e quatro decisões que ela cobrou —
as decisões 29 a 32 da §16 do documento de contexto:

- **A tarefa 2.5 deixou de existir sozinha.** "Conferir o padrão de fundo dos dois
  templates novos" é verificar que `text-bullets/meta.ts` nasce `plain`, que
  `final-cta/meta.ts` nasce `grid` e que os dois expõem o `showGridOption` compartilhado.
  Isso é critério de pronto de quem escreve o template, não commit próprio: dissolveu-se
  na 2.8 e na 2.9, como a 1.16 se dissolveu na 1C.
- **Nasceu a 2.13** — `addSlide` e `removeSlide`, decisão 30. O "pronto quando" desta
  etapa pede um carrossel de 8 a 12 slides e o store da 1D não tem como acrescentar um
  slide sequer: sem ela o critério da própria etapa é inalcançável.

> A tarefa 2.12 é antecipada da Fase 3 do §15. Motivo: o próprio §15 afirma que a Fase 1
> já permite publicar um carrossel real, e um deck que some no reload não permite. Custa
> poucas linhas de middleware.

### 2A — marcação inline ✅

Nada a instalar. Pasta nova `src/markup/`, autocontida: o parser, os tipos e o
componente. Quem chama é o template, que escreve `<Inline>` e nunca vê a AST.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.1 | `parseInline(src): Inline[]` — os sete marcadores da §7 do documento de contexto, sem aninhamento | TDD pesado, é o alvo de cobertura séria da v1. Devolve AST, **nunca** HTML |
| 2.2 | `<Inline>` — AST → spans, com os tokens da §10.2 do design system | Os sete marcadores renderizam com a cor e a forma da tabela; `==marca==` com cantos retos, `` `código` `` com raio 6px |
| 2.3 | `cover-statement` passa a renderizar o título via `<Inline>` | `[[destaque]]` sai em `azure-400` dentro do título em 96px |

A matriz de teste da 2.1 é onde mora o valor desta sub-etapa: cada marcador isolado;
marcadores adjacentes sem texto entre eles; marcador não fechado; `**a *b* c**` tratado
como literal no marcador externo; marcador no meio de palavra; string vazia; texto sem
marcador; conteúdo vazio (`****`, que sai como texto e não como marcador vazio); nós de
texto vizinhos colapsados em um só.

Fecha conferindo no navegador **e no PDF**. Cor de span atravessa a rasterização, mas o
fundo de `==marca==` é da mesma classe de risco que a grade foi na 1E — fundo desenhado
por CSS é justamente o que não sobreviveu lá.

Resolvido na sessão:

- **O risco do fundo de `==marca==` não se confirmou.** Medido no bitmap do PDF, com uma
  sonda dos sete marcadores no título da capa: 83.922 px de `#441504` atrás da marca,
  `#f8c251` no texto dela, 897 blocos sólidos de `#1e293b` no chip de código com `#bfdbfe`
  em cima, `#60a5fa` no destaque e `#64748b` no riscado. O que matou a grade na 1E era o
  **gradiente**, não o fundo — cor chapada atravessa a rasterização inteira. Fica como
  medida, não como suposição.
- **O parser não conhece limite de palavra** — decisão 33. `micro**serviços**` marca. Três
  regras de resolução caíram de graça do desenho de uma varredura só, e todas dão no mesmo
  lugar: marcador não fechado, conteúdo vazio (`****`) e marcador dentro de marcador viram
  **texto literal**. A §7 do documento de contexto ganhou a tabela.
- **O peso de `**forte**` virou piso, não valor** — decisão 34, e a §10.2 do design system
  corrigida junto. Os documentos se contradiziam: 600 fixo sobre a Oxanium 700 do título
  deixaria o trecho marcado mais **leve** que a frase, e a §11.1 dos templates promete que
  ele "não tem efeito visível" ali. Cada `@utility slide-*` passou a publicar o próprio
  peso em `--slide-font-weight`, e a utility nova `slide-strong` lê com
  `max(600, var(--slide-font-weight, 400))`. Medido nas oito escalas: 600 em `slide-body`,
  700 em `slide-display`, 600 fora de qualquer escala. Herança de custom property foi o que
  evitou o `<Inline>` ter de receber o peso do template — o renderer de marcação não conhece
  template, §5.
- **Marcador vira elemento HTML de verdade**, não `<span>` com classe: `<strong>`, `<em>`,
  `<s>`, `<u>`, `<mark>`, `<code>`. Nó de texto puro não ganha wrapper nenhum. Sai teste por
  tag em vez de `data-testid`, e o DOM que a exportação captura fica semântico. O
  `[[destaque]]` é a exceção que confirma: como é só cor, não há elemento com esse
  significado e o `<span>` é o honesto.
- **`==marca==` e `` `código` `` levam `box-decoration-break: clone`**, senão o padding
  lateral apareceria só nas duas pontas de um trecho que quebra de linha. Confirmado
  `clone` no estilo computado e no arquivo.
- **O deck semente ganhou marcação.** Os três títulos abrem com `[[destaque]]`, e o teste
  que mede comprimento de título passou a medir o **texto renderizado** — os colchetes não
  chegam ao canvas e não podem contar contra o limite de linha da §11.1.

### 2B — rodapé e `text-bullets` ✅

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.4 | `Footer` em `src/templates/shared/` — o que falta da §10.5 do design system; `Kicker`, `Constellation` e `Chevron` vieram na 1B | `MaiahubGlyph` a 32px, gap 20px, handle em `slide-meta` `ink-400` à esquerda, constelação à direita |
| 2.4a | Remover as quatro peças de logo não usadas | Sobram `logo-shared.ts`, a glyph e o `index.ts`; `Wordmark`, `Mark`, `Seal` e `Signature` saem do projeto. Quatro peças para nenhum uso é peso morto |
| 2.8 | `text-bullets` completo — regiões da §11.2 dos templates, marcador travessão, opção `anchor` | `center` centraliza o bloco de itens no miolo, `top` encosta abaixo do cabeçalho; três itens é o alvo, quatro o teto. Nasce `plain` e expõe `showGrid` — o que era a 2.5 |

Quatro tarefas nasceram na própria sessão, da conferência olhando e do PDF:

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.4c | Semente com dois `text-bullets`, um por `anchor` | Sem `addSlide` (2.13) e sem troca de layout (2.11), a semente é o único lugar que decide o que existe na tela, e o select de `anchor` só fica editável na 2C. Sem isto o critério da 2.8 não é conferível |
| 2.4d | As seis partes do rodapé viram opção do slide — decisões 35 e 36 | Grade, régua, logo, fundo da logo, handle e chevron ligáveis em qualquer template; o descritor dá o padrão. Chevron suprimido no último slide por posição |
| 2.4e | Experimento 5 — a peça de logo e a faixa do rodapé | Ver abaixo. Decidido, a §10.5 e o `maiahub-logo.md` são atualizados junto |
| 2.4f | A régua fora do módulo da grade, e a compensação de hairline — decisão 38 | y 1174 em `ink-600`, e `slide-hairline` valendo para qualquer linha fina do canvas. Medido no PDF, não suposto |

O `Footer` finalmente tem consumidor: foi por não ter que ele ficou de fora da 1B, quando
a capa era o único template e é justamente o que não o tem. A 2.4a vem logo atrás porque
é a 2.4 que prova que as outras quatro peças não têm uso.

Nesta sessão o `items` e o `anchor` aparecem no inspector como linha inerte com o rótulo,
que é o que a 1D desenhou para tipo sem controle. É honesto e dura uma sub-etapa — os
controles são a 2C.

`anchor: "center"` centraliza o bloco de itens mantendo o gap de 48px da tabela de
elementos da §11.2, em vez de distribuir o espaço sobrando entre eles: o gap está
especificado como valor, não como mínimo.

Resolvido na sessão:

- **O rodapé virou uma peça só, e a capa deixou de ser exceção por regra.** A §10.5 dizia
  "presente em todos os slides exceto a capa" e "chevron somente na capa"; as duas frases
  viraram o **padrão** de cada descritor, na forma da decisão 25. São seis opções —
  decisões 35 e 36 —, e a capa continua nascendo sem identidade porque a §11.1 tem razão,
  não porque o código a impeça. O `Footer` passou a posicionar a si mesmo, e a capa perdeu
  a linha de rodapé própria: a faixa dela era 1240–1270 e virou 1238–1270, igual à de todos.
- **A glyph estava apagada, e a medida disse quanto.** Traço de **1,6px** contra 3,75px do
  chevron ao lado e 2px da linha da grade, e a 55% de opacidade — tinta resultante
  ≈`#858993`, mais escura que o `ink-400` do handle. A linha mais fina e mais apagada do
  slide inteiro. Passou a 2.25 em opacidade cheia com estrela 4.0, decisão 37.
- **A régua não sumia do PDF: estava camuflada.** Rasterizado a 72 dpi, o arquivo mostrou
  `#1e293b` nas linhas 1189–1190 com a grade ligada e só em 1190 sem ela. A grade desenha
  horizontais em `54k + 1` com traço de 2px — em k = 22, exatamente 1189–1190 — e a régua
  estava em 1190, no mesmo token. Exportação e rasterização estavam corretas o tempo todo.
  Decisão 38: y 1174 e `ink-600`. **Conferido depois da correção**, no mesmo PDF e com a
  mesma sonda: régua em 1174 `#475569`, grade em 1189–1190 `#1e293b`, quinze linhas entre
  as duas. E um sinal a mais, que não estava previsto: a régua tem os **920px** da largura
  útil e a linha da grade atravessa os **1080px** inteiros, então as duas se distinguem
  mesmo sem cor.
- **Fundo chapado com borda atravessa a rasterização** — a placa da logo saiu inteira no
  PDF: preenchimento `#1e293b`, glyph `#e2e8f0` dentro, e a borda `ink-700` antialiasada
  pelo raio de 12px nos cantos. É a segunda medida na mesma direção, depois do fundo de
  `==marca==` na 2A: o que matou a grade na 1E era o **gradiente**, não o fundo.
- **A compensação de escala da decisão 15 não era um detalhe da grade.** `height: 1px` a
  k = 0,28 dá 0,28 pixel de dispositivo e o navegador não pinta, então a régua aparecia no
  PDF e faltava no preview — o inverso do sintoma que se procura. Virou a utility
  `slide-hairline`, e a §4.3 passou a dizer que a regra vale para qualquer linha fina do
  canvas.
- **A placa entra 12px na faixa de padding.** O fundo dela chega a 68px da borda, contra os
  80px da §4.2, e fica dentro da zona morta de 60px da §11.0. É o preço de a glyph ficar
  oticamente alinhada com o handle: encostá-la nos 80px desalinharia os dois em 12px.
- **O `showChevron` mudou de dono sem mudar de chave.** Era próprio da capa, virou
  compartilhado. Como a chave é a mesma, nenhum deck salvo precisaria de migração — o que
  importa para a 2.12, que chega na 2D.

### 2C — `final-cta` e os controles que faltam no inspector ✅

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.9 | `final-cta` completo — conteúdo ancorado à base, bloco de CTA, opção `showArrow` | Lead vazio faz o bloco desaparecer junto com o gap; constelação inteira acesa; rodapé completo, decisão 29. Nasce `grid` e expõe `showGrid` — o que era a 2.5 |
| 2.6 | Inspector: tipo de campo `list`, com `maxItems` e `maxPerItem` | Adicionar, remover e reordenar itens dentro do limite do descritor, com contador por item |
| 2.7 | Inspector: tipo `select`, na seção de opções | O `anchor` do `text-bullets` passa a ser trocável |

O `final-cta` não pede nada novo do inspector — `heading`, `lead` e `cta` são
`textarea`/`text` e `showArrow` é `toggle`, os três tipos que a 1D já desenha. É por isso
que a sessão comporta os dois assuntos: fecha os três templates e fecha o inspector na
mesma passada.

**A 2.7 é menor do que a tabela original prometia.** A 1D antecipou o `toggle` e já
separou "Conteúdo" de "Apresentação" no formulário; sobra o controle de `select`, sobre o
componente shadcn que já está instalado. Reordenar item de `list` é por botão, subir e
desce — `@dnd-kit` é da Etapa 4, e trazê-lo agora seria instalar dependência de etapa
futura para o menor dos dois usos que ela vai ter.

Uma tarefa nasceu na própria sessão, da contradição que a 2.6 expôs:

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.6a | O teto de `maxItems` volta a ser conselho | O botão de acrescentar não desabilita; o contador de itens fica âmbar acima do teto. Nenhuma correção de documento — é a §8 do documento de contexto sendo cumprida |

Resolvido na sessão:

- **O CTA em 36px contradizia a escala, e a escala venceu** — decisão 39. A §11.3 dos
  templates dava "36px JetBrains Mono" ao texto do CTA e a §3.3 do design system não tem
  esse degrau: o mono dela é `slide-code`, a 34px. Vence a §3.3, porque a decisão 19 diz
  que o template escreve o token e nunca recompõe a escala, e porque um nono degrau para
  um uso só seria invenção onde a §1 pede restrição. A §11.3 passou a nomear o token.
- **A constelação inteira acesa sai de graça, por posição.** A §11.3 prometia "sempre
  inteira acesa, independentemente da contagem", o que exigiria o template mentir sobre a
  própria posição — `index = total - 1` no `Footer`. Não foi preciso: como o fechamento é
  o último slide, a peça compartilhada já acende tudo. É a decisão 36 aplicada à peça
  vizinha do chevron, e o rodapé nunca discorda da lista lateral.
- **O gap do lead mora no lead**, não no contêiner. Os dois espaços do miolo são
  diferentes — 48px do título ao lead, 64px do lead ao CTA — e um `gap` de flex publica
  um valor só. Como `margin-top` do próprio bloco, apagar o lead leva o gap junto e o CTA
  sobe para 64px do título, que é o que a §11.3 promete.
- **`maxItems` era trava e virou conselho** — a 2.6a. A primeira versão desabilitava o
  botão de acrescentar no quarto tópico, e a §8 do documento de contexto lista `maxItems`
  entre os limites que são **conselho**. Não houve documento a corrigir: cinco itens
  curtos podem caber onde três longos não cabem, e quem sabe disso é o guard de
  transbordo, medindo altura. O `list-field.ts` deixou de conhecer o teto; quem o conhece
  é o contador.
- **O `Select` do Base UI é dirigível sob `happy-dom`** — o risco previsto não se
  confirmou. O popup monta e as opções saem por `getByRole("option")`. O que não passa é
  o clique: o caminho de ponteiro exige a sequência inteira — `pointerdown`, `pointerup`,
  `mouseup` e `click` —, que existe para o popup não capturar o clique que o abriu, e o
  `fireEvent` dispara um evento por vez. A confirmação por teclado é um `keyDown` só, é o
  mesmo caminho de commit, e é o que o teste usa.
- **Conferido no navegador e no PDF.** Os três critérios de pronto passaram olhando: o
  bloco de CTA e o desaparecimento do lead com o gap, os quatro controles da lista com o
  contador por item, e o `anchor` trocando no select com o canvas respondendo.

### 2D — troca de layout, composição e persistência

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.10 | `migrateFields(from, to, fields)` — migração de conteúdo na troca de template | TDD: chave compartilhada migra, chave sem correspondência é descartada, `options` sempre resetam para os defaults do template novo. O vocabulário único da §6 do documento de contexto torna a migração uma interseção de chaves, sem tabela de equivalência |
| 2.11 | Ligar o seletor de layout ao `migrateFields` — o controle em si veio na 1D, desabilitado | Trocar o layout preserva o que já foi digitado e reseta as opções. Sai a legenda "Trocar de layout chega na Etapa 2" |
| 2.13 | `addSlide` e `removeSlide` no store, com controles na lista lateral — decisão 30 | Acrescentar põe um slide no fim e o torna ativo; remover escolhe o vizinho como ativo. O deck nunca fica sem slides: com um slide só, o controle de remover fica desabilitado |
| 2.12 | `persist` do zustand em localStorage, com validação na reidratação — decisão 31 | Recarregar a página não perde o deck; deck salvo com template desconhecido perde só aquele slide, não o carrossel |

A 2.10 é a tarefa que cobra a decisão 13: é o vocabulário canônico que a torna uma
interseção de chaves. A 2.13 fica ao lado da 2.11 porque é o par que faz a composição
funcionar — o slide nasce `text-bullets`, o mais usado do carrossel, e o seletor de
layout está a um clique de trocá-lo.

O `persist` guarda o deck e **não** o `activeId`: recarregar volta ao primeiro slide. Um
id salvo teria de ser validado contra o deck reidratado, e a reordenação da Etapa 4 o
invalidaria de qualquer jeito.

**Armadilha esperada na 2.12.** O `persist` reidrata de forma síncrona na criação do
store, e a página é pré-renderizada estaticamente: o servidor desenha o deck semente e o
cliente desenha o deck salvo. É divergência de hidratação, da mesma família do
`crypto.randomUUID()` que a 1D pegou, e o caminho é `skipHydration` com a reidratação
disparada em efeito. Se a sessão confirmar, a §13 do documento de contexto ganha a
armadilha no mesmo commit.

### 2E — constelação e fecho da etapa

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.4b | Resolver o recorte da constelação acima de 10 slides | Ver experimento 2 abaixo. Decidido, a §10.5 do design system é atualizada junto |

A 2.4b vem por último de propósito: o alvo da etapa são 8 a 12 slides, então é aqui que o
recorte deixa de ser hipótese. O experimento se monta como o 4 se montou — as três
candidatas lado a lado numa rota descartável, com um deck de 12 slides fabricado, e a
escolha feita olhando.

Fechado o experimento, a sessão compõe **o carrossel de verdade** com os três templates,
usando marcação, e o exporta. É o critério de pronto da etapa e é também o teste de
aceitação que acha o que teste unitário não acha — como a conferência do PDF na 1E achou
a grade.

---

## Etapa 3 — Biblioteca

**Objetivo.** Fechar a biblioteca de dez templates e tornar a ferramenta confiável para
conteúdo denso. Corresponde à Fase 2 do §15.

**Entrega.** Os sete templates restantes — `context`, `text-impact`, `code-window`,
`code-annotated`, `compare-2col`, `split-vertical`, `image-caption`. Bloco de código
com shiki e tema derivado dos tokens da §10.4 do design system, não importado pronto. Guard de transbordo
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

As decisões que estavam pendentes foram respondidas e registradas na §16 do documento de
contexto, decisões 13 a 18; a divisão da Etapa 2 rendeu as decisões 29 a 32, a 2A as
33 e 34, e a 2B as 35 a 38. Continuam
**dois** pontos abertos: o recorte da constelação, que se resolve na 2E, e o foco e raio
dos controles de formulário, do experimento 3. Nenhum dos dois bloqueia nada.

O padrão é sempre o mesmo: o que não se decide no papel se decide montando os candidatos
lado a lado e comparando o resultado — de preferência medido, como nos experimentos 4 e 5.

### ~~Experimento 1 — a peça de logo do rodapé~~ · resolvido

`MaiahubGlyph` a 32px, escolhida comparando as três peças só-símbolo lado a lado sobre a
superfície do slide. A glyph está acima da faixa de 16–24px que a documentação da marca
dá a ela, e o desvio é consciente — a correção ótica dela é justamente o que a mantém
legível sobre `ink-950`, enquanto a `MaiahubMark`, apesar de estar dentro da própria
faixa, some ali.

Registrado na §11.0 dos templates e na §10.5 do design system, na decisão 18 da §16 do documento de
contexto, e em `maiahub-logo.md`. A remoção das quatro peças perdedoras virou a tarefa
2.4a.

### Experimento 2 — constelação acima de 10 slides · tarefa 2.4b, na 2E

A §10.5 do design system diz "5 pontos mais um contador `03 / 12`" e não diz quais cinco. Três leituras:

- **Cinco primeiros.** Simples, mas para de comunicar progresso a partir do sexto slide.
- **Janela deslizante** em torno do atual. É a leitura mais provável, e colide com a
  regra de que "o atual é simplesmente o último aceso" — numa janela deslizante o último
  aceso é sempre o mesmo ponto, e a constelação vira decoração.
- **Amostragem espalhada** pelo deck, tipo 1, 4, 7, 10, 12. Mantém a noção de progresso e
  perde a de contagem, que o contador ao lado já cobre.

Montar as três com um deck de 12 slides e escolher.

### ~~Experimento 4 — como desenhar a grade que sobrevive à exportação~~ · resolvido

Apareceu na 1E, na conferência do PDF: a grade saía uma vez e o resto da página vinha
chapado. Quatro implementações montadas numa rota descartável e **medidas no arquivo**,
não julgadas a olho:

| Variante | Campo | Verticais | Espessura | Espaçamento |
|---|---|---|---|---|
| `linear-gradient` + `background-size` | ❌ `#1e293b` | 0 | — | — |
| `repeating-linear-gradient` | ❌ `#1e293b` | 0 | — | — |
| `<svg>` + `<path>` | ✅ `#020617` | 18 | 4px (2px de spec) | 120px (60px) |
| `<svg>` + `<pattern>` | ✅ `#020617` | 18 | 2px — metade | 120px |

O problema é o **gradiente**, não o ladrilho: o repetente falha igual. O `<pattern>` sai
com metade da espessura porque o traço na borda do ladrilho é recortado, e no visualizador
umas linhas caem em pixel inteiro e outras não — daí o efeito irregular.

Uma segunda rodada comparou quatro tratamentos de borda sobre o `<path>` vencedor, e a
escolha foi a moldura fechada nos quatro lados com módulo de 54px, sem nenhum quadrado
cortado. Registrado na decisão 28 do documento de contexto, na §4.3 do design system e na
armadilha da §13.

### ~~Experimento 5 — a peça de logo e a faixa do rodapé~~ · resolvido

Apareceu na 2B, na conferência olhando: "a logo está meio pequena e morta". A medida
explicou o adjetivo — a glyph desenhava a linha mais fina e mais apagada do slide:

| Elemento | Traço efetivo no slide | Tinta sobre `ink-950` |
|---|---|---|
| Glyph a 32px, desenho original | **1,6px** | ≈`#858993` — entre `ink-500` e `ink-400` |
| Chevron a 40px | 3,75px | `azure-400` |
| Linha da grade | 2px | `ink-800` |
| Handle, `slide-meta` | chapado | `#94a3b8` — `ink-400` |

Montado numa rota descartável, no molde do experimento 4: nove desenhos da peça a 1:1
sobre `ink-950`, uma escada de tamanho com o traço normalizado, dez tratamentos do rodapé
inteiro na largura real de 1080px, e cada um deles dentro de um slide de verdade a k = 0,28
e k = 0,5 — a escala do editor é onde "some no feed" se responde, e nenhuma comparação a
1:1 responde por ela.

Venceram a **peça `f`** — traço 2.25 em opacidade cheia, tinta `ink-200`, estrela 4.0 — e o
**tratamento 6**, a glyph sobre placa de `slide-raised` com borda de 1px `ink-700` e raio
12px. A régua entrou como sétima peça a pedido da sessão, e a cor dela foi uma segunda
rodada com nove candidatas em `ink`, `azure` e `sun`, comparadas em recorte 1:1 sobre a
grade e em slide reduzido: ficou `ink-600`. As três candidatas `sun` foram descartadas pela
§2.5 — âmbar é pontuação, e uma linha de 920px não é pontuação.

Registrado nas decisões 35 a 38 do documento de contexto, na §10.5 e na §4.3 do design
system, na §11.0 e na §11.1 dos templates, e em `maiahub-logo.md`.

### Experimento 3 — foco e raio dos controles de formulário · a agendar

A auditoria da 1D encontrou duas divergências entre os componentes shadcn instalados e o
design system. As duas vêm do preset `nova`, entraram no bootstrap com `button`, `input` e
`card`, e se repetiram no `textarea` e no `switch`:

- **Anel de foco.** Os componentes trazem `focus-visible:ring-3` com `ring/50` e sem
  offset; a §5 do design system diz "anel de 2px `azure-500` com offset de 2px", e a §8
  repete. O anel do preset é mais grosso, mais apagado e colado no controle.
- **Raio.** Os controles usam `rounded-lg`, que o `globals.css` resolve em 8px; a §5 dá
  8px a cartões e blocos de código e 6px ao resto.

Não são erros de instalação: o preset é coerente consigo mesmo, e a §9 é explícita em que
quem cede é o componente, não o documento. O trabalho é mexer nos cinco componentes de uma
vez, ver as duas telas e decidir se o documento estava certo — corrigir só os dois
componentes novos seria pior que a divergência.
