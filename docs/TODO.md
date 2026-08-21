# asterism — plano de execução

> **Status** bootstrap concluído · decisões resolvidas · **1C concluída; a próxima
> sessão é a 1D**
> Estrutura em três níveis: **etapa** → **tarefa atômica** → **critério de pronto**.
> Cada tarefa cabe num commit. A Etapa 1 tem um nível a mais — **sub-etapa**, uma por
> sessão de trabalho. Etapas 1 e 2 estão expandidas; as demais têm apenas objetivo e
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

## Etapa 1 — MVP, prova de conceito

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
  existiria para eles.
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
- **A moldura do preview mora no quadro externo, fora do `transform`** — decisão 23. O
  slide e o fundo do editor são os dois `ink-950` e precisam de separação; dentro do
  `transform` a borda encolheria com a escala e viajaria dentro do nó capturado.
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

### 1D — estado e inspector · ~1,5 h

Instala `zustand` e acrescenta o `textarea` do shadcn, que ainda não está em
`src/components/ui/`.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.10 | Store zustand mínimo — deck, slide ativo, `setField` | Digitar no inspector muda o canvas. Sem `persist`, sem `zundo` |
| 1.11 | Inspector: formulário derivado dos descritores, tipos `text` e `textarea`, com contador de caracteres | Campo novo no descritor aparece no formulário sem tocar no inspector. O contador fica âmbar ao passar do `max` e não trava a digitação — §11.0 dos templates, limite é conselho |
| 1.12 | Lista lateral de slides — índice, rótulo do template, seleção | Clicar troca o slide ativo. Somente leitura: sem arraste, sem duplicar, sem remover |

O deck semente tem **três slides `cover-statement`**. Com um slide só, a lista lateral, a
troca de slide ativo e o laço de páginas do alvo PDF ficariam sem prova até a Etapa 2 — e
é exatamente ali que os erros de exportador aparecem.

### 1E — exportação · ~1,5 h

Instala `modern-screenshot` e `jspdf`.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.13 | `rasterize(source, escala)` sobre `modern-screenshot`, escala 2 | Devolve um `Frame` de 2160×2700 com as fontes inlinadas — conferir que o bitmap não saiu em Arial |
| 1.13a | Palco de exportação oculto — decisão 20 | Monta todos os slides do deck fora da tela, com layout real e `--slide-scale: 1`, espera `document.fonts.ready`, entrega os `RenderSource` e desmonta. Nunca captura o nó de dentro do wrapper escalado, senão a compensação de espessura do preview vaza para o arquivo |
| 1.14 | Registry de alvos de exportação + alvo `pdf` com jsPDF, uma página por slide | `unit: "pt"`, `format: [1080, 1350]` — decisão 21. `ExportResult` devolve lista de arquivos mesmo com um só; o alvo não conhece nenhum template |
| 1.15 | Botão de exportação na barra superior | Clicar baixa o PDF; o botão não sabe quais alvos existem, só consulta o registry |

Fecho da etapa: abrir o PDF fora da ferramenta e conferir as três páginas, a Oxanium e o
grid. Se o título sair em Arial, o problema é inlining de fonte, não o alvo.

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
| 2.1 | `parseInline(src): Inline[]` — os sete marcadores da §7 do documento de contexto, sem aninhamento | TDD pesado, é o alvo de cobertura séria da v1: cada marcador isolado, marcadores adjacentes, marcador não fechado, `**a *b* c**` tratado como literal no marcador externo, string vazia, texto sem marcador. Devolve AST, **nunca** HTML |
| 2.2 | `<Inline>` — AST → spans, com os tokens da §10.2 do design system | Os sete marcadores renderizam com a cor e a forma da tabela; `==marca==` com cantos retos, `` `código` `` com raio 6px |
| 2.3 | `cover-statement` passa a renderizar o título via `<Inline>` | `[[destaque]]` sai em `azure-400` dentro do título em 96px |
| 2.4 | Componentes recorrentes da §10.5 do design system — falta o `Footer`; `Kicker`, `Constellation` e `Chevron` vieram na 1B | Rodapé com `MaiahubGlyph` a 32px, gap 20px, handle em `slide-meta` `ink-400` e constelação à direita, em todo template menos capa e final |
| 2.4a | Remover as quatro peças de logo não usadas | Decidido: o rodapé usa `MaiahubGlyph` a 32px. Sobram `logo-shared.ts`, a glyph e o `index.ts`; `Wordmark`, `Mark`, `Seal` e `Signature` saem do projeto. Quatro peças para nenhum uso é peso morto |
| 2.4b | Resolver o recorte da constelação acima de 10 slides | Ver experimento 2 abaixo. Decidido, a §10.5 do design system é atualizada junto |
| 2.5 | Conferir o fundo dos dois templates novos — a aplicação a partir de `meta.background` veio na 1C | `text-bullets` é `plain` e `final-cta` é `grid`; nenhum template de código ou imagem recebe grid |
| 2.6 | Inspector: tipo de campo `list`, com `maxItems` e `maxPerItem` | Adicionar, remover e reordenar itens dentro do limite do descritor |
| 2.7 | Inspector: tipos `select` e `toggle`, na seção de opções | Opções ficam visualmente separadas dos campos de conteúdo |
| 2.8 | `text-bullets` completo — regiões da §11.2 dos templates, marcador travessão, opção `anchor` | `center` distribui os itens no miolo, `top` encosta abaixo do cabeçalho; três itens é o alvo, quatro o teto |
| 2.9 | `final-cta` completo — conteúdo ancorado à base, bloco de CTA, opção `showArrow` | Lead vazio faz o bloco desaparecer junto com o gap; constelação inteira acesa |
| 2.10 | `migrateFields(from, to, fields)` — migração de conteúdo na troca de template | TDD: chave compartilhada migra, chave sem correspondência é descartada, `options` sempre resetam para os defaults do template novo. O vocabulário único da §6 do documento de contexto torna a migração uma interseção de chaves, sem tabela de equivalência |
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
contexto, decisões 13 a 18. Sobrou **um** ponto, que não se resolve no papel — precisa dos
três lados renderizados e comparados. Ele não bloqueia o início da Etapa 1: aparece só na
tarefa 2.4b.

### ~~Experimento 1 — a peça de logo do rodapé~~ · resolvido

`MaiahubGlyph` a 32px, escolhida comparando as três peças só-símbolo lado a lado sobre a
superfície do slide. A glyph está acima da faixa de 16–24px que a documentação da marca
dá a ela, e o desvio é consciente — a correção ótica dela é justamente o que a mantém
legível sobre `ink-950`, enquanto a `MaiahubMark`, apesar de estar dentro da própria
faixa, some ali.

Registrado na §11.0 dos templates e na §10.5 do design system, na decisão 18 da §16 do documento de
contexto, e em `maiahub-logo.md`. A remoção das quatro peças perdedoras virou a tarefa
2.4a.

### Experimento 2 — constelação acima de 10 slides · tarefa 2.4b

A §10.5 do design system diz "5 pontos mais um contador `03 / 12`" e não diz quais cinco. Três leituras:

- **Cinco primeiros.** Simples, mas para de comunicar progresso a partir do sexto slide.
- **Janela deslizante** em torno do atual. É a leitura mais provável, e colide com a
  regra de que "o atual é simplesmente o último aceso" — numa janela deslizante o último
  aceso é sempre o mesmo ponto, e a constelação vira decoração.
- **Amostragem espalhada** pelo deck, tipo 1, 4, 7, 10, 12. Mantém a noção de progresso e
  perde a de contagem, que o contador ao lado já cobre.

Montar as três com um deck de 12 slides e escolher.
