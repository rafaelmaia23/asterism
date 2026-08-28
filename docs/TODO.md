# asterism — plano de execução

> **Status** bootstrap concluído · decisões resolvidas · **Etapas 1, 2 e 3 concluídas — a
> ferramenta publica um carrossel real com a biblioteca inteira. A 3A fechou a especificação
> dos dez templates, a 3B entregou o guard de transbordo e o alinhamento dos controles, a 3C
> acrescentou os dois de texto, a 3D trouxe o shiki e o `code-window`, a 3E fechou os dois
> mais densos, a 3F trouxe as imagens com os dois de mídia e a 3G recompôs o carrossel de
> referência com os dez, conferido no navegador e no PDF; a próxima sessão abre a Etapa 4**
> Estrutura em três níveis: **etapa** → **tarefa atômica** → **critério de pronto**.
> Cada tarefa cabe num commit. As Etapas 1 a 3 têm um nível a mais — **sub-etapa**, uma
> por sessão de trabalho. As Etapas 4 e 5 têm apenas objetivo e entrega, e são quebradas
> em tarefas quando chegarem.

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
  design system era o experimento 2, na 2.4b — e a 2E o **revogou**: o que aqui era
  provisório virou a regra, sem uma linha de código a mais.
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

## Etapa 2 — Templates ✅

**Objetivo.** Os três templates da Fase 1 especificados no design system, com a marcação
inline funcionando. Ao fim desta etapa a ferramenta publica um carrossel real.

**Fora desta etapa.** Os outros sete templates, shiki, guard de transbordo — decisão 32 —,
imagens, undo/redo, múltiplos decks, e o resto do que a Etapa 4 promete para a lista
lateral: reordenação por arraste e duplicar. Acrescentar e remover slide são a exceção,
pela decisão 30.

**Pronto quando** um carrossel de 8 a 12 slides é composto com os três templates,
usando marcação, e exportado para publicação no LinkedIn sem retoque externo.

**Cumprido na 2E:** o carrossel de referência nasceu ali com doze slides — quatro
`cover-statement`, sete `text-bullets` e o `final-cta` —, em `src/editor/seed.ts`, e é o que
a ferramenta abre na primeira execução. A composição mudou duas vezes depois: a 3C trocou
duas capas pelo `text-impact` e a 3G o recompôs com os dez templates. As quinze tarefas saíram; a 2.5 dissolveu-se na 2.8 e na 2.9, a
2.4a e a 2.4b nasceram de experimentos, e a 2.13 da decisão 30.

A **2F** veio depois disso, e é o que compor o carrossel de verdade cobrou do que já
existia: quatro ajustes de uso, nenhum template novo. Ela não reabre o critério de pronto —
ele já estava cumprido —, e fica aqui em vez de na Etapa 3 porque o que ela mexe é o
material da Etapa 2.

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

### 2D — troca de layout, composição e persistência ✅

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

Três decisões de produto foram fechadas antes de escrever a primeira linha, e as três
couberam no que os documentos já diziam — nenhuma virou decisão da §16:

| Pergunta | Resposta |
|---|---|
| Chave que só o template novo declara, na troca de layout | Nasce com o **default do descritor**, que é o mesmo que um slide recém-criado recebe |
| As seis opções compartilhadas resetam junto com as outras? | **Resetam**, como a §6 e a decisão 5 escrevem |
| Onde ficam acrescentar e remover | Numa **barra no pé da lista lateral**, agindo sobre o ativo |

Resolvido na sessão:

- **A migração compara forma de valor, não só chave.** O vocabulário canônico da §6
  promete a mesma chave para o mesmo **papel**, e não a mesma forma: nada impede que um
  template declare `items` como `list` e outro como `text`. Migrar por cima disso
  entregaria ao componente um array onde ele espera string. A interseção passou a ser de
  chave **e** de forma — `list` guarda array, todo o resto guarda string —, e quem não
  bate fica com o default do destino.
- **O `migrateFields` mora em `src/templates`, e não em `src/editor`.** A regra é
  propriedade do vocabulário, não do formulário: ela conhece dois descritores e um mapa de
  valores, nem o registry. `src/deck` estava fora de questão pela seta de dependência.
- **A barra do pé não foi escolha estética.** O item da lista é um `<button>` inteiro
  desde a 1D, e um X por miniatura seria botão dentro de botão, que é HTML inválido; e a
  §6 do design system diz que ícone nunca substitui rótulo em ação destrutiva, o que doze
  X pendurados nas miniaturas seriam exatamente. A barra resolve os dois de uma vez e dá
  um lugar só para o "desabilitado com um slide só".
- **Fixture pela metade reprova na reidratação e em nenhum outro lugar.** Os slides de
  `store.test.ts` carregavam só a opção que cada caso olhava, e passavam — até o
  `reviveDeck` validá-los contra o schema do template, que pede as seis. O fixture passou
  a sair do descritor. É a decisão 31 cobrando de volta o preço que ela promete: o que
  está salvo tem de ser um slide de verdade, e o teste também.
- **`removeSlide` recusa em silêncio, `id` desconhecido lança.** São dois erros de
  natureza diferente: id fora do deck é erro de programação, como o template desconhecido
  do registry; remover o último slide é uma tela que insiste, e o controle já está
  desabilitado antes do clique. Lançar ali derrubaria o editor por um clique legítimo.
- **A armadilha da 2.12 não chegou a acontecer** porque o store nasceu com
  `skipHydration`. A §13 do documento de contexto ganhou a armadilha assim mesmo, na forma
  geral: estado que vem do navegador não pode chegar no primeiro render — vale para
  `localStorage` hoje e para o IndexedDB da 3F.
- **Conferido no navegador.** Os quatro critérios de pronto passaram olhando: a troca de
  layout preservando o título e resetando as opções, a barra acrescentando e removendo com
  a escolha do vizinho, o deck sobrevivendo ao reload sem aviso de hidratação no console, e
  o slide corrompido à mão no localStorage caindo sozinho.

### 2E — constelação e fecho da etapa ✅

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.4b | Resolver o recorte da constelação acima de 10 slides | Ver experimento 2 abaixo. Decidido, a §10.5 do design system é atualizada junto |

A 2.4b veio por último de propósito: o alvo da etapa são 8 a 12 slides, então é aqui que o
recorte deixa de ser hipótese. O experimento se montou como o 4 se montou — as candidatas
lado a lado numa rota descartável, com um deck de 12 slides fabricado, e a escolha feita
olhando.

Fechado o experimento, a sessão compôs **o carrossel de verdade** com os três templates,
usando marcação. É o critério de pronto da etapa e é também o teste de aceitação que acha o
que teste unitário não acha — como a conferência do PDF na 1E achou a grade.

Resolvido na sessão:

- **O experimento apagou uma regra em vez de escolher entre candidatas.** As três leituras
  do recorte foram montadas com um deck de 12 slides e nenhuma sobreviveu à comparação com
  o **controle** — o comportamento sem recorte, que só entrou na rota porque sem ele a
  pergunta não era respondível. A §10.5 passou a dizer "um ponto por slide, em qualquer
  contagem", e o `Constellation` não mudou uma linha. Decisão 40.
- **A regra revogada resolvia um problema que nunca foi medido.** A faixa comporta 26
  pontos antes de a constelação encostar no handle — 920px de largura útil menos o grupo
  da esquerda, o chevron e os gaps —, e o teto da Etapa 2 é 12. A medida entrou na §10.5
  junto com a revogação: o dia em que alguém quiser reabrir o assunto, o número está lá.
- **Dois testes novos existem só para impedir a regra de voltar.** Um cerca o limiar que
  existia — 10 e 11 slides se comportam igual —, e o outro conta 24 pontos, muito além de
  qualquer limiar que alguém pense em reintroduzir.
- **A semente virou o carrossel de referência**, com doze slides, quatro capas e sete
  listas. Duas capas caem no miolo, nos slides 6 e 11: a §11.1 dá ao `cover-statement` a
  função de gancho, e o template de frase isolada é o `text-impact`, que é da Etapa 3.
  Enquanto a biblioteca não fecha, a capa faz o papel — limitação de biblioteca, não
  escolha de arquitetura, e não virou decisão da §16 por isso.
- **O kicker passou a numerar a posição no deck.** Com capa no miolo, numerar as capas
  entre si faria o slide 6 se anunciar como o terceiro. A §10.5 sempre disse `pilar/ ·
  índice`; até aqui as duas leituras coincidiam e a diferença não aparecia.
- **"Um nível de ênfase por bloco" é nível, não ocorrência.** O teste da semente contou
  ocorrências e reprovou um item com dois `` `código` ``. Nível é o que a §3.4 escreve, e
  nomear duas variáveis não é enfatizar duas vezes: o teste passou a contar marcadores
  **distintos** por bloco, que é o que a regra proíbe misturar.
- **Conteúdo quebra teste que casa por texto solto.** O `editor-shell.test.tsx` clicava no
  botão da lista com `name: /02/`, e o nome acessível do botão inclui o slide inteiro — o
  "2023" do slide 7 passou a casar também. Ancorado no início do nome, que é onde o índice
  fica.
- **Conferido no navegador e no PDF.** O carrossel de doze slides saiu limpo, sem nada a
  corrigir — a primeira vez em três sub-etapas que a conferência do arquivo não devolve
  trabalho, depois da grade na 1E e da régua camuflada na 2B. Com ela, o critério de pronto
  da Etapa 2 está cumprido: um carrossel real, do zero ao PDF, sem retoque externo.

---

### 2F — ajustes de uso, depois do fecho ✅

Quatro incômodos que o carrossel de doze slides da 2E expôs. A etapa já estava fechada, e
nenhum deles é template novo — é o que o uso real cobrou do que já existia.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.14 | Spinner no botão de exportar | O ícone vira `loader-circle` girando enquanto a captura acontece, o rótulo e a largura não mudam, e o botão leva `aria-busy` |
| 2.15 | A lista lateral rola até o slide ativo | Acrescentar um slide num deck de doze leva a lista até ele |
| 2.16 | Cabeçalho como faixa compartilhada, ligável em todo template | O `kicker` é campo de todos, migra na troca de layout, e `showHeader`/`showFooter` ligam e desligam as duas faixas |
| 2.17 | Inspector por seções, com interruptor e colapso | O painel desenha as seções que o descritor declara; sub-opção só aparece com a faixa ligada; cada seção encolhe |

Resolvido na sessão:

- **Desabilitado não é sinal de progresso.** O botão de exportar ficava vários segundos com
  o `opacity-50` do `disabled`, que lê como "não pode" e não como "está indo". A §8 do
  design system pedia "texto do botão trocado, largura preservada", e a troca virou **do
  ícone**: `PDF` → `Exportando` mudaria a largura, e preservá-la exigiria uma largura mínima
  escrita à mão para um estado que dura três segundos. A §8 foi corrigida junto.
- **O `running` já guardava o id do alvo**, não um booleano, então o spinner aparece só no
  botão que trabalha enquanto todos desabilitam. Com um alvo só não se nota; com o PNG da
  §10 do contexto, nota.
- **A lista já tornava o slide novo o ativo desde a 2.13** — o que faltava era ir junto.
  Num deck de doze o item nascia abaixo da dobra, e a coluna que existe para mostrar onde se
  está mostrava outro lugar. Os refs moram num `Map` no `<li>` e não dentro do `Item`, que é
  `memo` e recebe `onSelect` por id justamente para não receber prop nova por quadro.
- **Reidratar precisou de um degrau antes de a faixa existir.** Acrescentar `showHeader` como
  chave obrigatória faria **todo deck salvo ser descartado** pela decisão 31 — os doze slides
  reprovariam de uma vez e o editor abriria na semente. Chave que falta é dado velho, não
  dado torto: o slide passou a ser lido por cima dos defaults do template antes de validar, e
  valor de forma errada continua derrubando o slide. Decisão 41, e ela vale para todo campo
  futuro, não só para estes.
- **O topo do slide era a assimetria óbvia da arquitetura.** O rodapé virou peça
  compartilhada com seis opções na 2B; o cabeçalho continuou um `<div>` escrito à mão dentro
  da capa, o único template que tinha um. Compartilhá-lo trouxe dois retornos além do óbvio:
  a migração passou a **preservar o kicker de graça**, pela interseção de chaves da decisão
  13, e a segunda peça que a faixa ganhar chega num lugar em vez de dez. Decisão 42.
- **Ligar o cabeçalho empurra o `text-bullets`, em vez de a faixa ser reservada sempre.**
  Reservar custaria 132px do topo do template mais usado, permanentemente, por uma faixa que
  ali nasce desligada; empurrar custa um ternário do mesmo formato que o `anchor` já usa no
  mesmo componente. É a única quebra da regra "ligar uma peça não move as outras", e ela vale
  porque o rodapé nunca disputou espaço com nada. Decisão 43.
- **`showFooter` é a faixa, não uma sétima peça.** Desligado, não sobra nada — nem a
  constelação. Ela continua sem opção própria, e a frase da §10.5 é a mesma de sempre: quem a
  tira é quem tira o rodapé todo, e um slide sem rodapé não é um rodapé mais enxuto.
- **A seção do inspector é desenho, e uma delas mistura os dois sacos.** O cabeçalho é uma
  faixa com um texto e um interruptor, e separá-los em duas seções distantes faria ligar a
  coisa numa e escrever nela na outra. `fields` e `options` continuam separados no dado, a §6
  continua inteira, e o que a seção diz é onde o controle aparece. Conteúdo e Apresentação
  viraram seções como as outras para que a **ordem** também fosse declarativa. Decisão 44.
- **O interruptor de uma seção vaza para outra se o filtro for só o da própria.** O
  `showHeader` não declara `section`, então caía em "Apresentação" como linha solta ao lado
  do mesmo interruptor que já estava no cabeçalho da seção. O filtro passou a excluir **toda**
  chave que é interruptor de alguma seção, e o teste que pegou isso ficou.
- **Dois controles com o mesmo nome na mesma coluna.** O `heading` do `text-bullets` se
  chamava "Cabeçalho" no formulário, e o cabeçalho virou a faixa. Passou a "Título", que é
  também o nome do papel no vocabulário canônico da §6 — `heading` é o título em todo
  template. A §11.2 foi atualizada junto.
- **Nada de `Collapsible` do Base UI.** O `Trigger` dele quer envolver o cabeçalho da seção e
  envolveria o interruptor junto: switch dentro de button é HTML inválido, a mesma armadilha
  que a lista lateral documenta para o X por miniatura. São quinze linhas de renderização
  condicional, e a §7 não pede animação — nada anima posição por mais de 8px.
- **Conferido no navegador.** Os doze slides da semente saem com quatro cabeçalhos ligados,
  as quatro capas, e os sete `text-bullets` no layout de sempre. As classes condicionais
  chegam ao CSS final, que é a armadilha de tree-shaking do `CLAUDE.md`.

---

## Etapa 3 — Biblioteca ✅

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
Observatório vence, decisão 17 — e ficou para cá porque com três componentes instalados
seria ajustar no escuro; hoje são seis. Auditar todas as variantes na mesma passada, que é
a tarefa 3.6.

**Fora desta etapa.** Múltiplos decks com tela de listagem, undo/redo, reordenação por
arraste, duplicar slide, import/export `.json`, atalhos de teclado, estados vazios e
deploy — tudo isso continua nas Etapas 4 e 5. Imagem por URL externa está fora por
escopo, não por etapa: a §11 do documento de contexto fecha o assunto em upload local.

**Pronto quando** um carrossel de 8 a 12 slides usa os **dez** templates — com bloco de
código realçado e imagem —, nenhum slide transborda sem aviso, e o PDF sai sem retoque
externo.

**Cumprido na 3G:** o carrossel de referência tem doze slides com os dez templates, e mora
onde sempre morou, em `src/editor/seed.ts`. As dezenove tarefas saíram. A conferência foi
medida no PDF exportado pelo botão de verdade: doze páginas de 2160×2700, as duas imagens
nas faixas que a §11.9 e a §11.10 prometem, o realce do shiki atravessando a rasterização,
nenhum slide marcado pelo guard — e o guard marcando quando o texto passa. Ver a 3G.

As dezenove tarefas são grandes demais para uma sessão só, então a etapa está dividida em
**sete sub-etapas**, no mesmo formato das Etapas 1 e 2: dependências resolvidas, critério
de pronto que se verifica sozinho e um estado do repositório que compila, passa nos testes
e pode ser abandonado sem deixar meio caminho. Uma sub-etapa por sessão, uma branch por
sub-etapa.

São sete e não cinco porque esta etapa carrega quatro assuntos de naturezas diferentes —
sete templates, uma dependência nova com risco de rasterização, um mecanismo transversal e
uma auditoria de componente — e misturá-los numa sessão faria a conferência de cada um
disputar espaço com a do outro.

Três coisas que a divisão tornou visíveis, e que ela teve de resolver antes de existir:

- **Os sete templates não estavam especificados.** O `observatorio-templates.md` tinha
  §11.0–§11.3 e a tabela de status da §11 marcava os outros sete como "a especificar".
  Escrever §11.4–§11.10 é trabalho desta etapa, e é trabalho de decisão de produto — pela
  Regra 2 o documento vem antes do código. Virou a **3A**, uma sub-etapa inteira de
  documento, porque a biblioteca se decide como **conjunto**: são as chaves compartilhadas
  que fazem o `migrateFields` da 2.10 funcionar entre os dez, pela interseção da §6.
- **O caminho mínimo de imagem foi antecipado da Etapa 4.** A entrega desta etapa lista
  `split-vertical` e `image-caption`; o upload local, o `idb-keyval` e o `ImageId` eram
  entrega da Etapa 4. É a mesma contradição que a decisão 30 resolveu na Etapa 2 com o
  `addSlide`, e a resposta é a mesma: sem eles o critério de pronto **desta** etapa é
  inalcançável, e um template cujo campo principal não tem controle não está entregue. Sobe
  o mínimo — guardar, escolher e rasterizar uma imagem local. O `.json` com as imagens em
  base64 continua na Etapa 4.
- **O guard de transbordo é uma convenção, não um recurso isolado.** Ele mede um bloco de
  conteúdo que todo template precisa declarar. Entra **cedo**, na 3B: assim os sete novos
  nascem seguindo-a e só os três atuais são adaptados. No fim da etapa, os dez seriam
  revisitados de uma vez.

### 3A — especificação da biblioteca ✅

Sessão de documento, sem uma linha de código. É onde moram quase todas as decisões de
produto da etapa.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.1 | §11.4–§11.10 dos sete templates restantes | Cada um com regiões, elementos, campos, opções, comportamento e o bloco `defaults`, no formato da §11.2 |
| 3.2 | O vocabulário canônico da §6 do documento de contexto recebe as chaves novas | Toda chave dos sete ou está na §6 ou está justificada como própria do template |
| 3.3 | A tabela de status da §11 e as tabelas compartilhadas da §11.0 dos templates | Nenhuma linha diz "a especificar". Se o conjunto pedir opção compartilhada nova, ela entra na §11.0 aqui e em `shared/options.ts` na sub-etapa que a usar |

Pontos que só aparecem olhando os sete juntos, e que a 3A tem de fechar: quais nascem com
o cabeçalho ligado; se `code`, `caption`, `image` e o par antes/depois entram no
vocabulário canônico ou ficam próprios de um template; e como `compare-2col` e
`split-vertical` dividem os 920px de largura útil.

Especificar tudo de uma vez, em vez de cada §11.x no commit que implementa o template, é
o que impede uma chave decidida na 3E de obrigar a voltar no que a 3C escreveu.

Decidido na sessão, antes de escrever qualquer §11.x:

| Questão | Decisão |
|---|---|
| A explicação do `code-annotated` | `body`, a chave canônica — a mesma do `context` e do `split-vertical` |
| O par antes/depois do `compare-2col` | Quatro chaves **próprias**: `beforeLabel` / `before` / `afterLabel` / `after`, com os rótulos em `text` e os conteúdos em `textarea` |
| Quais dos sete nascem com o cabeçalho ligado | Nenhum. A capa continua sendo o único |
| A divisão dos 920px do `compare-2col` | 428 + 64 + 428, com o texto das colunas a 32px |
| O que "vertical" quer dizer em `split-vertical` | Corte vertical: texto à esquerda, imagem à direita sangrando |
| O `image-caption` | Imagem sangrando por três lados, com título e legenda na faixa de baixo |
| Os campos do `text-impact` | Só `heading`. Nem lead, nem atribuição |
| Opção compartilhada nova | Nenhuma. `imageFit` é própria, declarada igual nos dois de mídia |

Resolvido na sessão:

- **O vocabulário canônico fechou sem nenhuma chave nova.** A suspeita registrada aqui era
  que `code`, `caption`, `image` e o par antes/depois precisassem de decisão; três dos
  quatro já estavam na §6 desde a v1, e o quarto — o par — é o único caso em dez templates
  de um papel que um layout tem e a biblioteca não. Ele ficou próprio e a §6 ganhou uma
  tabela à parte para chave própria, em vez de promovê-lo. Vocabulário com um usuário só
  reserva à biblioteca inteira o que um template usa.
- **`kicker` e `heading` passaram a ser declarados pelos dez.** É a decisão 42 aplicada ao
  campo mais digitado do sistema: as duas chaves atravessam qualquer troca de layout, e o
  preço é uma região que some quando o valor está vazio — o que o `lead` do `final-cta` já
  fazia desde a 2C. O descritor de `heading` **não** virou compartilhado, porque o limite
  acompanha a região e a região é do template; o que é comum é o rótulo.
- **A regra que faltava era de forma, não de chave.** A migração compara chave **e** forma
  de valor, e nada garantia que dois templates declarassem a mesma chave com o mesmo tipo.
  A §6 passou a exigir: a mesma chave tem o mesmo tipo de campo na biblioteca inteira —
  `code`/`file`/`lang` idênticos nos dois de código, `image` idêntico nos dois de mídia.
  Sem isso a tabela vale no papel e falha na troca de layout, que é onde ela é cobrada.
- **A conta do rodapé decidiu a geometria da imagem.** O `split-vertical` ia sangrar de
  ponta a ponta, e a conta reprovou: com a imagem descendo até a base, o rodapé teria os
  480px da coluna de texto, e a placa com o handle mais doze pontos de constelação passam
  de 500px. A imagem para em y 1174 — a linha da régua da §10.5 —, e a §11.0 ganhou a regra
  geral: imagem sangra, mas nenhuma entra na faixa do rodapé.
- **A explicação do `code-annotated` fica abaixo do código, não ao lado.** Não é composição:
  a 34px mono, uma coluna de 428px comporta 21 caracteres por linha. O `compare-2col` pode
  dividir a largura porque compara texto; código exige os 920px. E como consequência, é o
  único template em que ligar o cabeçalho encolhe **o código** em vez de empurrar tudo:
  prosa que perde duas linhas vira pensamento cortado ao meio.
- **Duas colunas num canvas de 1080 custam um degrau da escala.** `compare-2col` e
  `split-vertical` descem o texto para `slide-caption` 32px, porque em 40px uma coluna de
  428px daria 21 caracteres por linha contra os 28 a 42 que a §3.4 do design system pede. É
  o preço honesto do layout, e ficou escrito nas duas seções em vez de descoberto na 3E.
- **Duas regras do design system ganharam exceção nomeada**, e a §11 de lá foi corrigida no
  mesmo commit: o padding de 80px passou a valer para conteúdo, e o alinhamento à esquerda
  abriu para o `text-impact` — que já era a exceção que a própria §3.4 previa.
- **A §11.0 ganhou a convenção do guard**, antes de a 3B existir: toda tabela de regiões
  marca com **⌐** a região cuja altura o guard mede. Os três templates atuais foram marcados
  junto, então a 3B chega com os dez declarados em vez de dez decisões para tomar.
- **O que a 3A não decidiu, e de propósito.** O realce de linha e o diff da §10.3 não têm
  controle na v1 — a seção diz como aparecem, e expor a faixa de linhas é assunto de outra
  etapa. A lista de linguagens do `lang` está escrita na §11.6, mas quem a fecha contra o
  bundle é a 3D.

### 3B — guard de transbordo e estados dos controles ✅

As duas coisas transversais ao que já existe, antes de os sete chegarem. As duas são
questões da §8 do design system — o estado **Inválido** e o de **Foco** —, o que faz a
conferência ser a mesma passada.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.4 | O bloco de conteúdo medido por `ResizeObserver`, comparando `scrollHeight` com `clientHeight` — §9 do documento de contexto | Um `text-bullets` com cinco itens longos marca; três itens não. O elemento medido **não** é dimensionado pelo que contém — a armadilha da §13 que a 1C documentou |
| 3.5 | A marca de transbordo no canvas e na lista lateral | Borda `crown-400`, como a §8 do design system pede para o inválido. A lista mostra o slide inválido sem que o canvas precise estar nele |
| 3.6 | Experimento 3 — foco e raio dos controles de formulário | Os componentes de uma vez: `button`, `card`, `input`, `select`, `switch` e `textarea`. Decidido, ou os componentes cedem ou a §5 e a §8 do design system são corrigidas junto |

Os três templates atuais são adaptados aqui; os sete de 3C em diante já nascem com o bloco
declarado. A auditoria das variantes do shadcn contra a §2.4 acontece na mesma passada da
3.6 — é mexer nos mesmos arquivos, e a §9 do design system já manda conferir toda
instalação de componente.

Resolvido na sessão:

- **Medir um nó só reprovaria em silêncio em dois dos três templates.** A tarefa dizia
  "comparando `scrollHeight` com `clientHeight`", que é o teste óbvio e o que a §9 do
  contexto escrevia — e ele não pega conteúdo ancorado à **base**, porque o que estoura sobe
  acima da borda de cima e não entra no `scrollHeight` do pai. A capa alinha o título à base
  desde a 1.7; o `final-cta` faz o mesmo com o bloco de fecho. O guard passou a medir dois
  nós: a faixa, que tem altura de spec, e o bloco de conteúdo dentro dela. Decisão 47.
- **O guard não precisou de estado no store.** `scrollHeight` e `clientHeight` são medidas de
  layout e não enxergam o `transform: scale()`, então a mesma leitura vale a 1:1 na
  exportação, a k ≈ 0,28 no canvas e a k = 0,2 na miniatura. Como a lista lateral desenha
  todos os slides pelo mesmo `SlideView`, **cada slide desenhado mede a si mesmo**, e o
  critério "a lista mostra o inválido sem o canvas estar nele" saiu de graça.
- **A marca mora fora do nó capturado**, na borda do quadro externo — senão o PDF sairia com
  borda vermelha. E há um segundo motivo, que é do guard: aquela borda já existe em 1px nos
  dois estados, então marcar não muda medida nenhuma. Marca que altera o layout medido faz
  medir mudar o que se mede. Decisão 48.
- **O `final-cta` ganhou um bloco de conteúdo.** Era o único dos três em que título, lead e
  CTA eram filhos diretos da faixa, e sem um nó que cresça não há o que comparar.
- **`describeGuardedRegion` é uma linha por template.** O teste não pergunta se existe uma
  `div` com altura fixa: ele engorda o conteúdo da faixa e exige que o slide marque. Um
  template que esquecesse de pendurar os refs passaria em qualquer teste de classe, e os sete
  que faltam vão chegar por aqui.
- **A auditoria achou três divergências além das duas registradas.** A 1D tinha anotado anel
  de foco e raio; olhando as seis linhas da §8 de uma vez, hover, ativo e desabilitado também
  divergiam, mais o anel translúcido do `aria-invalid` e a `shadow-md` do popup do `select` —
  esta contra a §1, que não tem sombra projetada. **Os componentes cederam em tudo**, decisão
  49, e a lista virou tabela de conferência na §9 do design system para o próximo componente
  instalado.
- **Duas armadilhas de token, das que só aparecem mexendo.** `--radius-xl` não é declarado
  neste tema, então `rounded-xl` do cartão caía no default do Tailwind — 12px, e não uma
  medida do sistema; a divergência do cartão era de 4px, e não dos 2px que este arquivo tinha
  calculado. E a folha ordena por **peso de variante**, não pela ordem das classes na string:
  o polegar desabilitado do interruptor perdia para duas regras `dark:` do preset escritas
  antes dele. As duas ficaram na §9 do design system.
- **Desabilitar sem `pointer-events: none`.** A §8 pede `cursor: not-allowed`, e com o
  ponteiro desligado o cursor é o do pai — a regra não tinha como valer. Tirar o
  `pointer-events-none` obrigou cada variante a dizer que o hover não vale desabilitado, e é
  o que `not-disabled:hover:` faz hoje nos seis componentes.

### 3C — os dois de texto: `context` e `text-impact` ✅

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.7 | `context` completo — §11.4 dos templates | Regiões, campos e `defaults` batendo com o documento; nasce `plain` e expõe as oito compartilhadas |
| 3.8 | `text-impact` completo — §11.5 dos templates | Nasce `grid`; é o template de frase isolada, o respiro da série |
| 3.9 | A semente troca as duas capas do miolo por `text-impact` | Os slides 6 e 11 do carrossel de referência deixam de ser `cover-statement`. A 2E registrou isso como limitação de biblioteca, e é esta tarefa que a fecha |

São os dois que não pedem nada novo do inspector — usam os tipos que a 1D e a 2C já
desenham. É por isso que abrem a sequência de templates: a primeira sessão de template da
etapa não precisa gastar nada com formulário.

Resolvido na sessão:

- **A sessão custou o que a 3A prometeu que custaria.** Nenhum token novo, nenhuma linha em
  `globals.css`, nenhum componente e nenhuma dependência: os dois templates são três
  arquivos cada, duas linhas em `templates/index.ts` e nada mais. É o retorno de ter
  especificado a biblioteca como conjunto — os `defaults` da §11.4 e da §11.5 foram
  transcritos do documento, não decididos aqui.
- **A §11.4 tinha um estado a menos do que o template tem.** "Título vazio — a região some e
  o corpo sobe para 80" só descrevia metade: com o cabeçalho ligado o corpo sobe para
  **212**, porque a faixa do topo continua ocupada. São quatro combinações de cabeçalho e
  título, não duas, e nas quatro o corpo acaba em 1160. A §11.4 ganhou a linha no mesmo
  commit, pela Regra 2. Não virou decisão da §16: é o caso particular da regra que a §11.0
  já dava aos dez — região com valor vazio some junto com o gap.
- **Quatro geometrias não cabem num ternário.** As classes do `context` viraram uma tabela
  de quatro chaves no módulo, e não um encadeamento dentro da string de classe. É a mesma
  restrição do `text-bullets` — classe literal, porque o Tailwind varre o fonte —, só que
  com o dobro dos estados: escritas como expressão, seriam ilegíveis exatamente no lugar em
  que a geometria do template mora.
- **O `text-impact` não precisou de código para recentralizar.** A §11.5 diz que ligar o
  cabeçalho desce a frase 66px, metade do que as outras regiões descem inteiro. Isso é o que
  centralizar dentro de uma faixa 132px menor faz sozinho: as duas alturas são a única
  diferença entre os dois estados, e os 66px saem da conta, não de uma regra.
- **A troca da semente levaria embora a capa de quatro linhas.** Os slides 6 e 11 eram as
  duas capas mais longas do deck, e sem elas sobravam duas de uma e duas linhas — a faixa
  que a 2E montou de propósito para conferir a âncora de base da §11.1 olhando. A capa do
  slide 2 alongou para 65 caracteres e as duas frases de impacto encurtaram, que é o que a
  §11.5 pede de qualquer forma: "frase curta é o alvo", e acima de três linhas o template
  está sendo usado como capa — que é justamente o que elas eram. Os dois pares ficaram
  vizinhos na lista lateral, e é ali que se vê o **mesmo corpo tipográfico com o gesto
  oposto**: 96px ancorado à base contra 96px centralizado nos dois eixos.
- **O kicker posicional passou a valer para os dois templates de `slide-display`.** Custa
  nada e fica certo no dia em que alguém ligar o cabeçalho num respiro; sem isso os slides 6
  e 11 herdariam o `log/ · 06` do descritor, e o 11 se anunciaria como o sexto.
- **A conferência das classes arbitrárias foi feita no CSS construído, não no navegador.**
  `h-[1080px]`, `h-[948px]`, `max-w-[760px]` e as outras saíram no bundle — é a armadilha
  do `CLAUDE.md` conferida onde ela se manifesta, que é no build de produção e não no teste.

### 3D — shiki e `code-window` ✅

A sub-etapa de maior risco técnico da etapa.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.10 | Instalar shiki e derivar o tema dos tokens da §10.4 do design system | O tema é **gerado** dos tokens, não importado pronto — §13 do documento de contexto. Bundle fino: só as linguagens que o carrossel usa |
| 3.11 | Inspector: tipo de campo `code`, com `maxLines` | Hoje é linha inerte com o rótulo — §14 do contexto. O contador de linhas fica âmbar acima do `maxLines` e não trava: limite é conselho, como na §11.0 dos templates |
| 3.12 | `code-window` completo — §11.6 dos templates, com o bloco da §10.3 | Superfície `--slide-raised`, raio 12px, sem borda, barra com os três pontos `ink-700` e o nome do arquivo, padding interno 32px |

**Armadilha esperada.** O realce do shiki é assíncrono. O palco de exportação da 1.13a
espera `document.fonts.ready` e mais nada; se o HTML realçado chegar depois da captura, o
PDF sai com o código cru. É a mesma família de problema que as fontes, e o palco ganha uma
segunda espera. Se a sessão confirmar, a §13 do documento de contexto e a §10 ganham a nota
no mesmo commit.

Fecha conferindo **no PDF**, medindo cor no bitmap como a 2A e a 2B fizeram: o realce sai
como `<span>` colorido, que é a classe de risco que já atravessou a rasterização duas vezes
— o que não atravessa é gradiente.

Resolvido na sessão:

- **A armadilha não foi enfrentada: foi retirada do caminho.** O shiki tem um modo
  síncrono — `createHighlighterCoreSync` com o motor de regex em JavaScript e as gramáticas
  importadas estaticamente —, e com ele não existe realce que chegue depois de nada. O
  palco continua esperando só as fontes, o guard mede uma vez, nenhum teste de template
  precisa de `await` e não há um quadro em que o código apareça sem cor. Decisão 51. O que
  a escolha custa é bundle, e ele foi medido nos dois lados: **1.881KB antes, 2.766KB
  depois** — 864KB crus, 133KB comprimidos. Numa ferramenta local de um usuário só, é o
  lado barato da troca.
- **A lista de linguagens ficou nas nove da §11.6.** A conta por gramática — `ts` 190KB,
  `tsx` 186, `js` 185, `python` 77, `bash` 78, `css` 52, `sql` 25, `json` 3 — mostrou que
  `js` é a única cara e dispensável, porque a gramática de TypeScript é superconjunto da de
  JavaScript. Ficou mesmo assim: escolher a linguagem certa no select vale os 185KB numa
  ferramenta que roda local. As nove são todas compatíveis com o motor em JavaScript,
  conferido na tabela do shiki **antes** de escolher o caminho síncrono, e não depois.
- **"Gerado dos tokens" precisava de um teste para ser verdade.** A §10.4 já mandava gerar
  o tema, e um módulo com os dez hex escritos à mão cumpre a letra e não a regra: o dia em
  que a rampa mudar no `globals.css`, o tema fica para trás em silêncio. O `theme.test.ts`
  lê o CSS e compara cor por cor, e é ele que faz a §10.4 e o código serem a mesma coisa.
  Ler `var()` em tempo de execução não serve — a cor vai para `style` inline e teria de
  resolver dentro do `foreignObject` do palco, e um token sem classe é podado pelo Tailwind
  antes de existir. Decisão 52.
- **Duas correções que o teste pegou e a revisão não pegaria.** O shiki devolve o token em
  `content`, não em `text`, e devolve hex em **caixa alta** — `#60A5FA` contra o `#60a5fa`
  do sistema. A primeira o `tsc` acharia; a segunda não acharia ninguém, e o sintoma seria
  uma busca por cor que não encontra o slide. As duas normalizações moram no `tokenize`.
- **O nome do arquivo é o único `slide-meta` em caixa baixa.** A utility versaliza, e a
  §10.5 justifica: a caixa alta é da escala, não do conteúdo. Nome de arquivo inverte a
  justificativa — `CACHE.TS` não é o mesmo nome em outra caixa, é um arquivo que não existe
  no repositório, num slide cujo assunto é o código daquele arquivo. Decisão 53, escrita na
  §10.3 e na §11.6 no mesmo commit.
- **A janela é a forma mais fácil de errar a armadilha da §13.** A tentação é dar
  `h-[866px]` à janela e deixá-la ocupar a região: isso desenharia um painel vazio de 866px
  para quatro linhas de código e faria o guard medir uma coisa dimensionada pelo que ela
  contém. A faixa tem altura de spec, a janela tem a altura do código, e o teste do
  template exige que a janela **não** tenha classe de altura.
- **A conta da §11.6 fecha na régua.** Região de 866px menos os 92 da barra e os 32 do
  padding de baixo dão 742px, e a 51px por linha são 14 — o mesmo teto que a §10.3 escreve
  por outro caminho. Os 92px da barra também se decompuseram: 32 de padding, 28 do nome do
  arquivo, 32 até a primeira linha. A §11.6 ganhou as duas contas por extenso.
- **O realce atravessou a rasterização, e foi medido no bitmap** — método da 2A e da 2B,
  numa página de 2160×2700 extraída do PDF com `pdfimages`. A janela: **2.952.408px** de
  `#1e293b`. O realce: `#60a5fa` 38.205px na palavra-chave, `#94a3b8` 18.884 no operador,
  `#bfdbfe` 15.777 na função, `#fada8d` 10.424 no tipo, `#e2e8f0` 20.718 na base, `#d4e373`
  1.832 na string, e `#334155` 1.484 nos três pontos da barra. Comentário e número saíram
  em zero porque o código do slide não tinha nenhum dos dois — ausência de conteúdo, não de
  cor. **O que não atravessa continua sendo o gradiente**, e o tema não tem nenhum: as seis
  cores presentes chegaram inteiras, sem uma cor intermediária no meio.
- **A geometria também foi medida, e não conferida a olho.** No mesmo bitmap, a janela
  ocupa **x 80–1000 e y 308–1146**: 920px de largura, que são os úteis da §11.0 com os 80
  de padding dos dois lados, e 838px de altura dentro da região de 866 — centralizada com
  14px sobrando em cima e embaixo, exatamente o que "centralizada verticalmente" quer
  dizer. E 838 é 92 da barra mais 714 de código mais 32 de padding: **14 linhas a 51px**,
  o teto da §10.3 batendo no arquivo exportado. A placa da logo aparece em y 1227–1280, com
  o rodapé inteiro abaixo da janela.

### 3E — `code-annotated` e `compare-2col` ✅

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.13 | `code-annotated` completo — §11.7 dos templates | Reusa o bloco de código da 3D; o que muda é a região de explicação ao lado ou abaixo |
| 3.14 | `compare-2col` completo — §11.8 dos templates | As duas colunas dentro dos 920px úteis, com o par de rótulos |

Os dois mais densos da biblioteca, e é aqui que o guard da 3B começa a pagar.

Decidido na sessão, antes de escrever código:

| Questão | Decisão |
|---|---|
| O rótulo do `code-annotated` no seletor | **Código anotado** — ao lado de "Código", e a diferença numa palavra |
| O rótulo do `compare-2col` | **Comparação** — a função, e não o par de rótulos, que é editável |
| Até onde vai a conferência | Navegador nos dois, bitmap medido no caminho real de exportação |

Resolvido na sessão:

- **"Reusa o bloco de código da 3D" não era só a janela.** A peça de `shared/code-window.tsx`
  já estava em `shared/` esperando o segundo template, mas os **descritores** de `file`,
  `lang` e `code` moravam dentro do `code-window` — e a §6 do documento de contexto exige que
  a mesma chave tenha o mesmo **tipo de campo** na biblioteca inteira, porque a migração
  compara chave e forma. Copiados, os dois passariam em qualquer teste de propriedade e
  divergiriam no dia em que um limite mudasse num só, com o sintoma mais caro que a
  ferramenta tem: trocar o layout de um slide de código e perder o código. Subiram para
  `shared/fields.ts`, ao lado do kicker, e o teste é de **identidade de objeto**. Decisão 54.
  `heading` **não** subiu junto, apesar de os dois o declararem com os mesmos 60: o limite
  acompanha a região, e a região é do template.
- **O `code-annotated` tem oito faixas, não quatro.** A §11.7 dava duas tabelas — cabeçalho
  ligado e desligado —, e cruzá-las com a regra de região vazia da §11.0 e com a cláusula de
  explicação vazia da própria §11.7 dá **três** interruptores, não dois: o topo do bloco sai
  do cabeçalho e do título, como em todos, e o **fim** sai da explicação — 826 com ela, 1160
  sem. As oito entraram na §11.7 em vez de ficarem só na tabela literal do componente, que é
  o que faria a próxima sessão redecidi-las.
- **Duas regiões guardadas num template só não pediram nada de novo.** O `useOverflowGuard`
  é por chamada, com chave de `useId`, então dois guards convivem no mesmo escopo e basta um
  reprovar. O `describeGuardedRegion` da 3B já tinha o parâmetro `regions` escrito para este
  dia, e o `code-annotated` é o primeiro a passar 2.
- **O `compare-2col` tem uma região guardada, e não duas.** A §11.8 marca "Colunas ⌐" numa
  linha só, e o nó que cresce é a **linha flex**: num flex-row a altura é a da coluna mais
  alta, que é exatamente o que precisa ser comparado com os 866px da faixa. Dois guards
  mediriam a mesma coisa por dois caminhos.
- **Os 24px da coluna são da coluna.** A §11.8 dava o gap entre o rótulo e a régua e não
  dizia nada do que vem depois dela; ficou o mesmo degrau entre a régua e o conteúdo, e a
  seção passou a dizê-lo. É o raciocínio dos 32px dentro da janela de código: dentro de um
  bloco, o ritmo é o do bloco, e não os degraus da §4.2, que são da grade do slide.
- **A geometria foi medida em dois bitmaps, e o segundo é o da exportação.** A conferência
  saiu em rota descartável com firefox headless, e depois pelo **caminho real** — o palco da
  §10 com `withExportStage`, `rasterize` na mesma escala 2 do alvo PDF, e o bitmap de
  2160×2700 medido com o ImageMagick. No `code-annotated`: janela em y 945–1294, que são os
  472,5–647 de canvas — **centralizada nos 532px da faixa** com 178,5px sobrando de cada lado
  —, e as quatro linhas da explicação em 904, 964, 1024 e 1084, todas dentro da faixa
  890–1160. No `compare-2col`: as duas réguas em y 692, com segmentos de 856px em x 160–1015
  e 1144–1999, que são **428 + 64 + 428** dentro dos 920 úteis. Os números do preview e os da
  exportação batem linha a linha, que é o que o reset reinjetado da decisão 50 promete.
- **A régua da coluna saiu com 1px de spec no arquivo.** Dois pixels no bitmap de escala 2,
  que é a `slide-hairline` da decisão 38 se comportando dos dois lados: compensa no preview
  reduzido, onde 1px fixo não pintaria, e não engorda a k = 1, onde a compensação não entra.

### 3F — imagens: `split-vertical` e `image-caption` ✅

A antecipação decidida acima. **Só o caminho mínimo**: guardar, escolher, exibir e
rasterizar uma imagem local.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.15 | `idb-keyval` com o deck guardando apenas `ImageId` — §11 do documento de contexto | O `localStorage` continua guardando só o deck; a imagem nunca entra nele. O `ImageId` já existe nos tipos desde a 1.2 |
| 3.16 | Inspector: tipo de campo `image`, com upload local | Hoje é linha inerte — §14 do contexto. Sem campo de URL, e não por falta de tempo: a §11 fecha o escopo em upload local |
| 3.17 | `split-vertical` completo — §11.9 dos templates | Texto e imagem dividindo o slide conforme a especificação da 3A |
| 3.18 | `image-caption` completo — §11.10 dos templates | Imagem dominante com legenda |

**Armadilha esperada, da mesma família das fontes.** A rasterização não busca recurso de
outra origem — é justamente por isso que as fontes são `next/font/local`. A imagem tem de
chegar ao DOM como `blob:` ou `data:` da própria origem, e o palco de exportação tem de
esperar o `decode()` antes de capturar, como já espera as fontes.

**E um caso que a decisão 31 não cobre.** Reidratar um deck cujo `ImageId` não está mais no
IndexedDB não é slide torto: o schema passa, porque o id é uma string válida. A imagem some
e o slide fica — a regra continua sendo derrubar só o que não passa, e um id órfão passa.

Decidido na sessão, antes de escrever código:

| Questão | Decisão |
|---|---|
| Até onde vai o `ratio` do descritor | **Moldura de preview**, e nada além. Recorte com alça, travado na proporção, é dívida anotada |
| Blob órfão no IndexedDB | **Nada apaga na 3F.** A varredura é do import/export da Etapa 4 |
| Foto de 4000×3000 | **Reduz para 2160px no maior lado** na importação |
| Os rótulos no seletor | **Texto e imagem** e **Imagem e legenda** — cada um diz as duas peças e a ordem delas no slide |

Resolvido na sessão:

- **A armadilha das fontes tem duas metades, e a primeira não é a esperada.** A esperada era
  o `decode()`, e ela é real. A outra é anterior à montagem: um `<img>` sem URL no primeiro
  quadro **não é um `<img>` vazio** — é o estado "Sem imagem" que o template desenha de
  propósito, e é ele que iria para o bitmap. Por isso o palco pré-carrega os `ImageId` do
  deck *antes* de `createRoot`, e espera o `decode()` *depois*, ao lado do
  `document.fonts.ready`. As duas esperas cercam a montagem, e nenhuma das duas sozinha
  basta.
- **Quais campos são imagem sai dos descritores, e isso decidiu onde a função mora.** O
  `collectImageIds` ficou em `src/export/stage.tsx` e não em `src/images` porque aquela pasta
  é **folha**: o `ImageBand` dos templates importa `src/images`, então `src/images` importar o
  registry fecharia um ciclo. O efeito colateral é o certo — o campo de imagem do template
  que a Etapa 4 acrescentar entra na lista sozinho, sem uma linha aqui.
- **O `image` não subiu para `shared/fields.ts`, e a decisão 54 não se aplica.** A §6 exige
  mesma chave com o mesmo **tipo de campo**, e está cumprida — há teste de migração provando
  que trocar entre os dois preserva a imagem. O que difere é o `ratio`, e ele acompanha a
  região: um descritor compartilhado teria de escolher um dos dois e mentir para o outro. É
  o precedente do `heading` da 3E. Decisão 58.
- **A §11.10 tinha o mesmo defeito que a §11.7 tinha antes da 3E**: duas tabelas para cruzar
  na hora de implementar, o que vira oito decisões em vez de uma. As oito geometrias entraram
  na seção. E uma delas o documento não decidia — com o título vazio, a legenda **sobe sem
  crescer**: os 90px são as duas linhas que a própria §11.10 promete, e é essa promessa que o
  guard cobra. Uma faixa que crescesse até 1160 aceitaria três linhas onde o desenho quer
  duas, e a diferença só apareceria num slide publicado.
- **A conferência foi medida no PDF, e ela responde à pergunta que só o arquivo responde.**
  Sonda descartável com firefox headless, uma foto sintética de 4000×3000 em magenta — cor
  que o Observatório não tem, então qualquer pixel magenta no arquivo é pixel de imagem —,
  importada pelo caminho real e exportada pelo alvo PDF de verdade. Cinco páginas de
  2160×2700 extraídas com `pdfimages` e medidas com o ImageMagick.
  **A imagem atravessa**: `#ff00ff` chega ao arquivo em `srgb(255,0,255)`, sem desvio.
  `split-vertical` em `cover`: x 1280–2160 e y 0–2348, que são os 640–1080 e 0–1174 da §11.9
  na escala 2, com o rodapé inteiro abaixo. Em `contain` e com o cabeçalho ligado: a faixa
  **não se move** — mesmos x 1280–2160 e y 0–2348 — e a imagem cabe inteira em 880×660,
  centralizada em y 844–1504, com o que sobra em `srgb(15,23,42)`, que é o `slide-surface`
  exato. `image-caption` com título e legenda: y 0–1820; com os dois campos vazios: y 0–2348,
  o teto da §11.0 e nem um pixel além. A legenda saiu com máximo 184 no canal, que é o
  `ink-400` `#94a3b8` no arquivo, e o título com 249, que é o `ink-100`.
- **A redução foi medida, e não conferida por leitura.** 4000×3000 entrou e 2160×1620 ficou
  guardado — o `fitWithin` na única resolução que o PDF aproveita. Decisão 56.
- **Os dois critérios da 3.15 se conferem no navegador, e passam.** O deck salvo tem 5.550
  bytes, **não contém `data:` nem `base64`** e contém o `ImageId`. E o caso do id órfão:
  reidratando um deck de doze slides com um `ImageId` que o banco não tem, voltam **doze de
  doze**, com o id órfão intacto no campo — a decisão 31 fazendo exatamente o que promete.

### 3G — fecho da etapa ✅

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.19 | Recompor o carrossel de referência com os dez templates | O critério de pronto da etapa, conferido no navegador **e** no PDF |

A biblioteca chegou aos dez na 3F, então esta sessão só compôs: nenhum template a escrever.
É a sessão que acha o que teste unitário não acha, como a conferência da 1E achou a grade e
a da 2B achou a régua camuflada. Também foi a primeira vez que o guard da 3B teve os dez
templates para provar contra, e a primeira em que a semente exercita a biblioteca inteira.

Decidido na sessão, antes de escrever código:

| Questão | Decisão |
|---|---|
| Quais templates se repetem nos doze slides | **A lista e o respiro** — `text-bullets` ×2 e `text-impact` ×2. Os outros oito aparecem uma vez |
| Os dois slides de mídia da semente | **Nascem sem imagem.** A do critério de pronto entra pelo inspector, na conferência |
| O que a composição perde | A **segunda capa**, e com ela a conferência da âncora de base feita com dois títulos de comprimento oposto. Decisão 59 |

Resolvido na sessão:

- **Os testes da semente passaram a sair do descritor, e é o que fez a sessão ser curta.**
  Havia um bloco de limites por template, com os números da §11.x copiados à mão; com dez
  templates isso viraria dez blocos mantidos em dia contra o documento. Os descritores já
  carregam `max`, `maxItems`, `maxPerItem`, `maxLines` e a flag `md`, e o registry os entrega
  por `list()` — as quatro varreduras que sobraram cobrem os dez sem citar uma §11.x. O teste
  que amarra a semente ao critério da etapa também é derivado: o conjunto de templates do
  deck é comparado com o do `list()`, então **um template novo na biblioteca reprova a
  semente até entrar no carrossel**.
- **O kicker passou a ser escrito nos doze.** Os dez declaram `kicker` desde a 3A, e o
  `build` só o preenchia na capa e no respiro: os outros dez slides herdavam o kicker do
  *default do template* — `api/ · 04` na quinta posição. Nove nascem com o cabeçalho
  desligado, então a divergência ficaria invisível até alguém ligar a faixa, que é
  exatamente o momento em que ela precisa entregar o número certo.
- **A janela de código comporta 41 caracteres, e a §11.6 dizia 45.** O número do documento
  saía de dividir os 920px da janela pelo avanço de 20,4px da JetBrains Mono a 34px, **sem
  descontar** os 32px de `--slide-pad-code` de cada lado: o corpo tem 856px, e 856 ÷ 20,4 =
  41,9. A divergência atravessou a 3D e a 3E porque nenhum código escrito até então passava
  de 40 caracteres; a semente escreveu uma linha de 43 e ela vazou por cima do padding, à
  vista. Largura é o defeito mais silencioso do template — `maxLines` conta linhas e o guard
  mede altura, então **nada reprova uma linha larga**. A §11.6 foi corrigida no mesmo commit
  e a semente ganhou o teste dos 41.
- **A conferência foi medida no arquivo, não lida na tela.** Firefox headless dirigido por
  Marionette, as duas imagens importadas pelo caminho real do inspector e o PDF exportado
  pelo botão de verdade. Doze páginas de 2160×2700. `split-vertical`: a imagem chega em
  x 1281–2159 e y 0–2347, que são os 640–1080 e 0–1174 da §11.9 na escala 2, com o rodapé
  inteiro abaixo. `image-caption`: x 0–2159 e y 0–1819, que são os 0–1080 e 0–910 da §11.10.
  Seis cores da paleta da §10.4 chegam às páginas de código — palavra-chave, número,
  comentário, função, tipo e base — mais o `#1e293b` da janela, o que prova o realce
  atravessando a rasterização. Nenhum pixel `crown-400` em página nenhuma: a marca do guard
  não vaza para o arquivo.
- **O guard foi provado nos dois sentidos.** Quieto: os doze slides da semente passam, no
  canvas e nas doze miniaturas. Ativo: texto além do limite no `context`, no `split-vertical`
  e no `compare-2col` — os três mais densos — marca a borda do quadro, acende o triângulo na
  linha da lista, e a marca **continua na miniatura com o canvas em outro slide**, que é o
  critério da 3.5 conferido contra os templates que a 3B não tinha para provar.
- **A redução e a persistência se conferiram de novo, agora com o deck inteiro.** Uma foto
  de 4000×3000 entra e 2160×1620 fica guardado. O deck salvo tem 5.484 bytes, doze slides,
  **dez templates**, nenhum `data:` nem `base64`, e só o `ImageId` — e recarregar devolve a
  imagem e o `imageFit` escolhido. Trocar `cover` por `contain` não move a faixa: os mesmos
  640–1080 e 0–1174.
- **O que o headless quase fez passar por defeito.** A primeira captura, com
  `firefox --screenshot`, mostrou a área central vazia: o `SlideCanvas` só desenha com
  `scale > 0` e a captura acontecia antes de o layout effect medir, então o que estava na
  imagem era a **pré-renderização estática** — lista e inspector desenhados, canvas não.
  Sonda que não espera a hidratação mede o servidor achando que mede o navegador.

---

## Etapa 4 — Editor

**Objetivo.** Transformar o protótipo funcional em algo que aguenta uso semanal.
Corresponde à Fase 3 do §15.

**Entrega.** Reordenação por arraste com `@dnd-kit/sortable`; duplicar e remover slide;
undo/redo com `zundo`; múltiplos decks com tela de listagem; import/export `.json` com
imagens embutidas em base64.

**O IndexedDB saiu daqui.** As imagens no `idb-keyval`, com o deck guardando apenas
`ImageId`, subiram para a 3F junto com os dois templates de mídia que as pedem: sem elas o
critério de pronto da Etapa 3 é inalcançável. O que fica aqui é o `.json` autocontido, que
é assunto de import/export e não de armazenamento.

**E fica a coleta de blob órfão**, que a 3F deixou de propósito — decisão 57. Trocar a
imagem de um slide ou remover o slide deixa o binário no banco sem ninguém apontando para
ele. Apagar cedo quebraria o undo desta mesma etapa: o `zundo` devolve o `ImageId` e o blob
não voltaria com ele. O lugar é o import/export, que é quem terá o deck inteiro à mão — e
que na tela de múltiplos decks **precisa** ter, senão a limpeza apaga a imagem do deck que
não está aberto.

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
33 e 34, a 2B as 35 a 38, a 2C a 39, a 2E a 40, a 2F as 41 a 44, a 3A as 45 e 46 e a 3B as
47 a 49. **Nenhum ponto continua aberto**: o experimento 3, que era o último, foi resolvido
na 3B.

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

### ~~Experimento 2 — constelação acima de 10 slides~~ · resolvido

A §10.5 do design system dizia "5 pontos mais um contador `03 / 12`" e não dizia quais
cinco. As três leituras foram montadas numa rota descartável com um deck de 12 slides,
mais o **controle** — o comportamento sem recorte —, que é o que faltava para a pergunta
ser respondível. A tabela do recorte em cada posição, com `●` aceso, `○` apagado e `·`
não desenhado:

| Slide | Cinco primeiros | Janela deslizante | Amostragem | Controle |
|---|---|---|---|---|
| 01 | `●○○○○·······` | `●○○○○·······` | `●··○··○·○··○` | `●○○○○○○○○○○○` |
| 03 | `●●●○○·······` | `●●●○○·······` | `●··○··○·○··○` | `●●●○○○○○○○○○` |
| 05 | `●●●●●·······` | `··●●●○○·····` | `●··●··○·○··○` | `●●●●●○○○○○○○` |
| 08 | `●●●●●·······` | `·····●●●○○··` | `●··●··●·○··○` | `●●●●●●●●○○○○` |
| 11 | `●●●●●·······` | `·······●●●●○` | `●··●··●·●··○` | `●●●●●●●●●●●○` |

**Venceu o controle** — um ponto por slide, em qualquer contagem, sem janela e sem
contador. Os cinco primeiros congelam no slide 5 e ficam idênticos pelos oito seguintes;
a janela deslizante é pior do que a previsão acima, porque do slide 4 ao 10 a faixa
inteira mostra `●●●○○` e só as duas pontas dizem alguma coisa; a amostragem é a única que
se mexe de ponta a ponta, mas avança em quatro degraus irregulares.

O que a comparação expôs é que o recorte resolvia um problema de espaço que **nunca foi
medido**: a faixa comporta 26 pontos antes de a constelação encostar no handle, e o teto
da Etapa 2 é 12. A §10.5 foi reescrita, e o `Constellation` não mudou uma linha — o
experimento serviu para **apagar** uma regra, que é um resultado tão legítimo quanto
escolher entre candidatas. Registrado na decisão 40 do documento de contexto e na §10.5
do design system.

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

### ~~Experimento 3 — foco e raio dos controles de formulário~~ · resolvido

A auditoria da 1D encontrou duas divergências entre os componentes shadcn instalados e o
design system. As duas vêm do preset `nova`, entraram no bootstrap com `button`, `input` e
`card`, se repetiram no `textarea` e no `switch`, e voltaram no `select` da 2C:

- **Anel de foco.** Os componentes trazem `focus-visible:ring-3` com `ring/50` e sem
  offset; a §5 do design system diz "anel de 2px `azure-500` com offset de 2px", e a §8
  repete. O anel do preset é mais grosso, mais apagado e colado no controle.
- **Raio.** Os controles usam `rounded-lg`, que o `globals.css` resolve em 8px; a §5 dá
  8px a cartões e blocos de código e 6px ao resto.

Não são erros de instalação: o preset é coerente consigo mesmo, e a §9 é explícita em que
quem cede é o componente, não o documento. O trabalho é mexer nos seis componentes de uma
vez, ver as duas telas e decidir se o documento estava certo — corrigir só os dois
componentes novos seria pior que a divergência.

O `card` não tem anel de foco e não usa `rounded-lg`: ele traz `rounded-xl`, que com o
`--radius` de 6px da §9 resolve em 10px, onde a §5 dá 8px a cartão. É uma terceira
divergência, da mesma origem, e por isso a auditoria da tarefa 3.6 olha **todas** as
variantes na mesma passada, e não só as duas desta lista.

**Resolvido na 3B.** Os seis componentes foram montados numa rota descartável, no molde dos
experimentos 4 e 5, com cada linha em duas colunas: o preset como instalado e o que o
documento pede. **O documento venceu em todas**, e a §9 do design system, que já dizia que
quem cede é o componente, ganhou a tabela de conferência para a próxima instalação.

A auditoria completa encontrou mais do que a lista acima previa:

| Linha | Preset `nova` | O que passou a valer |
| --- | --- | --- |
| Foco | `ring-3`, `ring/50`, sem offset | 2px `azure-500` cheio, offset 2px — §5 |
| Raio, controle | `rounded-lg`, 8px | `rounded-md`, 6px — §5 |
| Raio, cartão | `rounded-xl`, **12px** | `rounded-lg`, 8px — §5 |
| Hover | a cor a 80% de opacidade | um degrau acima: `azure-300`, `ink-700` — §8 |
| Ativo | `translate-y-px` | `scale(0.98)` — §8 |
| Desabilitado | `opacity-50`, sem cursor | texto `ink-600`, `not-allowed` — §8 |
| Inválido | borda mais anel translúcido | só a borda `crown-400` — §8 |
| Popup do `select` | `shadow-md` | sem sombra — §1 |
| Destrutivo | fundo tingido a 10% | `crown-400` com texto `crown-950` — §2.4 |

O cartão era **12px e não 10px**: `--radius-xl` não é declarado neste tema, então
`rounded-xl` caía no default do Tailwind em vez de sair do `--radius`. A conta acima estava
errada porque a variável que ela supunha existir não existe.

Registrado na decisão 49 do documento de contexto, na §8 e na §9 do design system.
