# asterism — modelo

Decide **o dado**: a forma do deck, a marcação que o texto aceita, a biblioteca de
elementos e presets, e onde tudo isso é guardado.

O vocabulário — o que cada termo significa — está no [`CONTEXT.md`](../CONTEXT.md) da raiz.
Aqui fica a norma: o que o sistema faz com eles.

---

## 1. Modelo de dados

```ts
type SlideId = string
type ElementId = string
type ImageId = string
type PresetId = string

type Pillar = "api" | "forge" | "log"
type DeckMeta = {
  handle: string               // "@rafael", vai no rodapé
  pillar: Pillar
}

type Deck = {
  version: 2
  id: string
  title: string
  format: { w: number; h: number }  // dado, não constante — ver architecture.md §2
  meta: DeckMeta
  slides: Slide[]
  assets: Record<ImageId, string>  // base64, apenas no arquivo exportado
}

type Slide = {
  id: SlideId
  layout: SlideLayout
  elements: Element[]
}
```

Um slide é **uma configuração de layout mais uma lista ordenada de elementos**. Foi
`template + campos fixos` até a Etapa 3½, e a ADR-0061 diz por que deixou de ser.

```ts
type SlideLayout = {
  showGrid: boolean
  showHeader: boolean
  kicker: string               // a única peça de conteúdo que mora no layout
  showFooter: boolean
  showRule: boolean
  showLogo: boolean
  showLogoPlate: boolean
  showHandle: boolean
  showChevron: boolean
  anchor: "top" | "center" | "bottom"
}
```

O layout é o **cromo** — o que existe em volta do conteúdo — mais a âncora vertical da
pilha. As oito primeiras chaves são as oito opções que todo template da v1 expunha, sem
mudança nenhuma; a `anchor` é o antigo `anchor` do `text-bullets`, promovido a propriedade
de qualquer slide.

**O `kicker` é conteúdo e mora aqui**, e é a única exceção do modelo. Ele é o que a faixa do
cabeçalho **é**, do mesmo jeito que a constelação é o que o rodapé é; promovê-lo a elemento
traria uma cardinalidade a mais, um caminho de migração a mais e uma faixa 80–148 que
deixaria de ser fixa, para permitir uma etiqueta no meio do slide que ninguém pediu.
ADR-0066, que confirma a 42.

```ts
type Element =
  | { id: ElementId; t: "statement"; heading: string }
  | { id: ElementId; t: "heading";   heading: string }
  | { id: ElementId; t: "lead";      lead: string }
  | { id: ElementId; t: "text";      body: string }
  | { id: ElementId; t: "caption";   caption: string }
  | { id: ElementId; t: "label";     label: string }
  | { id: ElementId; t: "quote";     body: string; cite: string }
  | { id: ElementId; t: "code";      file: string; lang: string; code: string }
  | { id: ElementId; t: "image";     image: ImageId; fit: Fit; bleed: Bleed }
  | { id: ElementId; t: "cta";       cta: string; arrow: boolean }
  | { id: ElementId; t: "divider" }
  | { id: ElementId; t: "columns";   ratio: Ratio; align: Align; columns: [Leaf[], Leaf[]] }

type Fit    = "cover" | "contain"
type Bleed  = "none" | "top" | "edge"
type Ratio  = "50/50" | "60/40" | "40/60"
type Align  = "top" | "center"

/** Um nível de profundidade, escrito no compilador. */
type Leaf = Exclude<Element, { t: "columns" }>
```

Doze variantes, e o que cada uma decide está na §11.11–§11.22 do documento de elementos.
Três coisas que a forma do tipo compra de graça:

- **`columns` é uma tupla de dois**, e não uma lista: três colunas em 920px dariam sete
  caracteres por linha, e a impossibilidade vive no tipo em vez de numa validação.
- **Um nível de profundidade**, pelo `Leaf`: coluna dentro de coluna não compila.
- **Campos de conteúdo e de forma convivem no mesmo objeto.** `fit`, `bleed`, `ratio`,
  `align` e `arrow` ficam ao lado de `body` e `heading`, e é isso que a ADR-0061 troca
  pela divisão `fields`/`options` da v1 — ver abaixo.

### Por que `layout` e `elements` são separados, e por que `fields` e `options` não são mais

A v1 separava conteúdo de apresentação **dentro do slide**, porque trocar o template
migrava um e resetava o outro. Essa operação não existe mais: trocar de composição é
aplicar um preset, e o que ela preserva é conteúdo casado **por tipo de elemento**, não por
chave. A divisão perdeu o que a sustentava, e mantê-la significaria carregar dois sacos
por elemento para separar `fit` de `image`, que ninguém nunca vai querer separar.

A divisão que restou é outra e vale a pena: **o layout é do slide, os elementos são o
slide**. Aplicar um preset troca a lista e escreve o layout inteiro; acrescentar um
elemento não encosta no layout. ADR-0061, que supera a 5 e a 44.

### Toda operação é por id de elemento

Com árvore, `elements[2]` deixa de identificar qualquer coisa: o índice 2 pode estar na
raiz ou dentro da segunda coluna do terceiro elemento. Toda operação do store — mover,
remover, alterar campo, adicionar ao lado — recebe o **`ElementId`**, e o store caminha a
árvore procurando pai e posição.

Numa árvore de dez nós isso é gratuito, e evita carregar caminhos do tipo
`["el_3", "left", 1]` por todo lado — que é o tipo de coisa que fica errada num canto e
some num outro. ADR-0064.

O `ElementId` vem de `crypto.randomUUID()` como o `SlideId`, e vale para ele a mesma
armadilha da §3 de `docs/architecture.md`: **id de dado não vira atributo do DOM**.

### Vocabulário canônico de campos

Elementos diferentes usam as **mesmas chaves** para papéis equivalentes:

| Chave | Papel | Elemento |
|---|---|---|
| `kicker` | Etiqueta superior (`api/ · 04`) | o layout |
| `heading` | Título — vale para a declaração e para o título de slide | `statement`, `heading` |
| `lead` | Complemento do título, um degrau abaixo | `lead` |
| `body` | Texto corrido | `text`, `quote` |
| `caption` | Texto auxiliar | `caption` |
| `label` | Etiqueta de bloco ou de coluna | `label` |
| `image` | Referência de asset | `image` |
| `code` / `file` / `lang` | Bloco de código | `code` |
| `cta` | Destino ou ação | `cta` |

A tabela é menor do que era, e é a mesma promessa. O que saiu:

- **`items` sumiu.** Lista de tópicos deixou de ser um campo `list` e passou a ser texto
  com linhas de `- ` dentro de um `text` — §2. Some com ela o tipo de campo `list` do
  descritor, e os três botões por item que o inspector desenhava.
- **O par próprio do `compare-2col` sumiu.** `beforeLabel`/`before` e `afterLabel`/`after`
  eram a única exceção que a ADR-0045 previa: um rótulo dentro de uma coluna agora é o
  elemento `label` e o conteúdo é o elemento `text`, os dois lados iguais.

A promessa continua sendo **de papel e de forma**: a mesma chave tem o mesmo tipo em toda
a biblioteca, e é isso que faz a aplicação de preset casar conteúdo sem tabela de
equivalência. As chaves são em inglês, como todo identificador do projeto.

## 2. Marcação

Sintaxe do Obsidian, subset fechado, em **duas camadas**: blocos por cima, inline por
baixo. A camada de blocos é da Etapa 3½ e a ADR-0060 diz por que ela precisou existir.

### Blocos

```ts
type Block =
  | { t: "p";  v: string }        // um parágrafo, marcação inline crua
  | { t: "ul"; items: string[] }  // lista não ordenada
  | { t: "ol"; items: string[] }  // lista ordenada

function parseBlocks(src: string): Block[]
```

| Escrita | Vira |
|---|---|
| Linha em branco | Fim de um bloco e começo de outro |
| Linha começando com `- ` | Item de lista não ordenada; linhas seguidas formam uma lista |
| Linha começando com `1. ` | Item de lista ordenada; a numeração desenhada é sequencial a partir de 1, e o número escrito é ignorado — ADR-0076. **Até dois dígitos**: `2024. ` é parágrafo, senão o ano sumiria do slide |
| Qualquer outra linha | Parágrafo |

As quatro fronteiras que a tabela não diz, e que o teste fixa:

| Caso | Resultado |
|---|---|
| `- ` numa linha logo abaixo de um parágrafo, sem linha em branco | Fecha o parágrafo e abre a lista. É o que o autor espera de quem escreve em Obsidian |
| `- ` e `1. ` em linhas seguidas | Duas listas: trocar de marcador é trocar de bloco |
| Linha indentada, `  - sub` | A linha é aparada antes de ser classificada. **Não há lista aninhada nesta camada**, e `  - sub` é item normal |
| `- ` sem texto, e string vazia | Item vazio é descartado; lista sem item nenhum não vira bloco; `parseBlocks("")` devolve `[]` |

A camada de blocos vale nos **campos de corpo**: `context.body`, `code-annotated.body`,
`split-vertical.body` e os dois lados do `compare-2col`. Fora dela ficam, de propósito, os
títulos — onde a quebra continua natural e o enter não faz nada — e o `image-caption.caption`,
que é apoio de uma linha ou duas e vira o elemento `caption` da §11.15 do documento de
elementos, sem parágrafo.

O módulo é `src/markup/parse-blocks.ts`, e não `blocks.ts`: o componente ao lado é
`blocks.tsx`, e dois arquivos com o mesmo nome fazem `@/markup/blocks` resolver para o
`.ts` — o componente sairia `undefined` em tempo de execução. O par segue o que a pasta já
tinha, `parse.ts` para o parser e `inline.tsx` para o componente.

**Sem títulos e sem cercas de código nessa camada.** Título é elemento próprio, código é
elemento próprio, e uma cerca de código dentro de um parágrafo criaria dois caminhos para
a mesma coisa — o segundo sem realce, sem barra de janela e sem `lang`.

**Uma quebra simples dentro de um parágrafo é espaço, não quebra.** É aqui que a proibição
de quebra manual continua valendo, e é a única metade dela que sempre esteve certa:

| | O que é | Vale? |
|---|---|---|
| Quebra **tipográfica** | Um enter no meio da frase, para ela ficar bonita | **Não.** Congela o layout e some com a razão de os presets existirem |
| Quebra **de conteúdo** | Uma linha em branco, ou uma linha de `- ` | **Sim.** É estrutura do pensamento, não ajuste visual |

O valor continua sendo **uma `string` no elemento**. Nada de estrutura nova no dado, nada
de migração para esta parte, e a edição continua sendo um textarea: o autor quer digitar,
não preencher formulário nem montar blocos com o mouse.

**O parser de blocos não invade o de inline.** Cada `v` e cada item saem crus, e quem os
transforma em texto desenhado é o `<Inline>` de sempre, um por bloco — dentro do `<Blocks>`,
que é quem desenha `<p>`, `<ul>` e `<ol>` com os gaps da §4.2 do design system. **Ali o
espaçamento é `gap` e nunca margem**: margem de `<p>` não sobrevive à captura, porque a
clonagem não emite valor inicial e a folha do agente de usuário devolve `1em` do outro lado
— ADR-0050. O marcador é nó de verdade, travessão em mono `azure-400` a 32px do texto, e
não `::marker`. É o que mantém
`parseInline` sendo a função pura sem dependências que ela já é, e o que faz `parseBlocks`
ser testável sozinho — as duas camadas se compõem no `<Blocks>`, que é o único módulo que
conhece as duas.

### Inline

| Sintaxe | Token | Render |
|---|---|---|
| `**texto**` | `strong` | peso 600 |
| `*texto*` | `em` | itálico |
| `~~texto~~` | `strike` | riscado, `ink-500` |
| `++texto++` | `underline` | sublinhado com offset |
| `==texto==` | `mark` | fundo `accent-bg`, cantos retos |
| `` `texto` `` | `code` | JetBrains Mono, `surface-raised` |
| `[[texto]]` | `accent` | cor de accent, sem outro efeito |

`[[...]]` substitui o campo "palavra em destaque" que existiria na capa: o destaque
passa a ser parte do texto, não um campo paralelo.

### O parser devolve AST, nunca HTML

```ts
type Inline =
  | { t: "text";      v: string }
  | { t: "strong";    v: string }
  | { t: "em";        v: string }
  | { t: "strike";    v: string }
  | { t: "underline"; v: string }
  | { t: "mark";      v: string }
  | { t: "code";      v: string }
  | { t: "accent";    v: string }

function parseInline(src: string): Inline[]
```

Devolver HTML acoplaria o conteúdo ao DOM permanentemente e mataria qualquer alvo de
exportação futuro que não seja rasterização (SVG, PDF vetorial). Como `parseInline` é
função pura sem dependências, é também o alvo de teste unitário mais barato do projeto —
e o `parseBlocks` acima dela é o segundo.

Marcadores não aninham. `**texto com *itálico* dentro**` é tratado como texto literal
no marcador externo. Simplifica o tokenizer de forma significativa e nenhum slide
precisa disso.

### O que não vira marcador

Três regras de resolução, todas com a mesma resposta — **vira texto literal**:

| Caso                    | Exemplo         | Resultado                       |
| ----------------------- | --------------- | ------------------------------- |
| Marcador não fechado    | `**sem fim`     | `[{ t: "text", v: "**sem fim" }]` |
| Conteúdo vazio          | `****`, `[[]]`  | um nó de texto com os quatro caracteres |
| Marcador dentro de outro | `**a *b* c**`  | `strong` com `v: "a *b* c"`     |

Nada de erro, nada de nó vazio: o que não fecha é o que a pessoa digitou. Num editor em
que o canvas mostra o resultado a cada tecla, o texto literal já é o aviso — enquanto se
digita `**forte**`, o estado intermediário `**forte` existe em toda edição.

**Não existe regra de limite de palavra** — ADR-0033. `micro**serviços**` marca, e
`2*3*4` vira `2`, `3` em ênfase e `4`. O tokenizer não olha o caractere anterior.

Nós de texto vizinhos são colapsados em um só: uma sequência de rejeições devolve um nó,
não um por caractere.

## 3. Elementos e presets

Um elemento é uma pasta autocontida em `src/elements/`, com a mesma forma que um template
tinha:

```
src/elements/text/
  index.tsx     componente; recebe o elemento e o contexto de render
  fields.ts     descritores de campo + schema zod
  meta.ts       { t, label, max, inColumn, defaults }
```

O que é o mesmo em vários fica em `src/elements/shared/`. O cromo das duas faixas — o
`Header` e o `Footer` — **não** é elemento: mora em `src/render/`, porque é do slide e não
da pilha.

```ts
type ElementDef<E extends Element = Element> = {
  t: E["t"]
  label: string                       // "Texto", "Código", "Duas colunas"
  fields: Field[]
  schema: ZodType<E>
  defaults: Omit<E, "id">
  max?: number                        // cardinalidade por slide; ausente = sem teto
  inColumn: boolean                   // pode ser adicionado dentro de uma coluna
  Component: FC<{ element: E; ctx: RenderContext }>
}

type RenderContext = {
  inColumn: boolean                   // é o que faz `text` cair de 40px para 32px
  deck: DeckMeta
  index: number
  total: number
}
```

O registry é o mesmo `createRegistry` genérico de `src/lib/registry.ts` que os templates e
os alvos de exportação já usavam — **passa a registrar elementos em vez de templates**, e
nada mais muda. Elemento desconhecido é erro de runtime, lançado pelo registry.

O `Field` é o descritor declarativo da v1, sem o `section`: as seções do inspector morreram
com o cartão por elemento, e a ADR-0044 está superada.

```ts
type Field =
  | { key: string; type: "text";     label: string; max?: number; placeholder?: string; md?: boolean }
  | { key: string; type: "textarea"; label: string; max?: number; md?: boolean; rows?: number }
  | { key: string; type: "image";    label: string; ratio?: string }
  | { key: string; type: "code";     label: string; maxLines: number }
  | { key: string; type: "select";   label: string; options: { value: string; label: string }[] }
  | { key: string; type: "toggle";   label: string }
```

**O tipo `list` saiu.** Ele existia para os tópicos do `text-bullets`, que agora são linhas
de `- ` dentro de um `text` — e com ele saem os três botões por item que o inspector
desenhava, que eram formulário onde devia haver digitação.

**O zod valida, o descritor desenha.** Continua valendo, e pelo mesmo motivo: gerar
formulário a partir do schema é um poço sem fundo de unions, arrays, defaults e
refinements. ADR-0004.

A flag `md` marca quais campos aceitam marcação. Na prática **todos aceitam menos os três
do `code`** — a divisão campo a campo da v1 nunca teve regra, e a §11 do documento de
elementos a substituiu por uma frase.

### Os presets

Um preset é **dado, não código**: nome, `SlideLayout` e uma lista de elementos com o
conteúdo vazio.

```ts
type Preset = {
  id: PresetId
  label: string
  layout: SlideLayout
  elements: Element[]     // ids novos a cada aplicação
}
```

Os dez presets de seed são as dez composições que a v1 tinha como template, e estão
escritos na §11.1–§11.10 do documento de elementos. **A função que converte os dez
templates em listas de elementos é a definição deles** — escrever as duas coisas em
separado é garantir que divirjam. ADR-0073.

Aplicar um preset a um slide com conteúdo **casa por tipo, na ordem**: o primeiro `text` do
preset recebe o texto do primeiro `text` do slide. É a regra de interseção da ADR-0013
levantada de chaves para tipos, e é o que impede a troca de composição de apagar trabalho.

Preset guarda o esqueleto; **snapshot** guarda também o texto, e uma caixa de seleção no
momento de salvar separa os dois sem inventar dois conceitos na interface. Os dez de seed
são fixos; preset salvo pelo autor é renomeável, substituível e apagável. ADR-0069.

Presets são **transversais aos decks** e por isso não moram dentro do `Deck` da §1: ficam
em chave própria do `localStorage`.

## 4. Estado e persistência

- `zustand` com middleware `persist` → autosave em `localStorage`.
- `zundo` sobre o store → undo/redo com histórico temporal (~700 bytes, entra na v1).
- **Imagens no IndexedDB** via `idb-keyval`. O deck guarda apenas `ImageId`.
  `localStorage` tem ~5 MB e uma única imagem em base64 estoura a cota.
- **Múltiplos decks** com tela de listagem. Um deck único vira dor na terceira semana
  de publicação.
- **Import/export `.json`** com as imagens embutidas em base64 — arquivo grande, porém
  autocontido e versionável. É documento de trabalho, não asset de produção.

O store nasce na 1D com zustand cru: deck, slide ativo, `setField` e `setOption`, e nada
mais — autosave e undo sobre um estado que ainda não sabe editar não teriam o que
guardar. A 2D acrescentou `setTemplate`, `addSlide` e `removeSlide`, que são o que faz
compor, e o `persist` por cima deste mesmo store — tarefa 2.12: a Fase 1 da §6 de `docs/product.md` promete um
carrossel publicável e um deck que some no reload não cumpre a promessa. O **IndexedDB
chegou na 3F**, com os dois templates de mídia que o pedem: um template cujo campo principal
não tem onde guardar valor não está entregue, e é a mesma razão pela qual a ADR-0030
antecipou o `addSlide`. O `zundo` fica para a **Etapa 4**, junto com o resto do editor.

### O binário mora fora do deck, e a ponte é um cache de módulo

O `idb-keyval` está em `src/images/storage.ts`, num banco próprio — `asterism`, prateleira
`images` —, e ele não sabe o que é um deck: guarda blob por id, e quem liga uma coisa à
outra é o campo `image` do template. São dois armazenamentos separados porque a cota é
diferente em uma ordem de grandeza, e nada além do `ImageId` atravessa para o `localStorage`.

Entre o id que o slide guarda e o `<img>` que o template desenha falta uma URL, e ler o
banco é assíncrono enquanto o template é síncrono. A ponte é o `src/images/cache.ts`: um
`Map<ImageId, string>` de object URLs no módulo, com `useImageUrl` para quem renderiza e
`preloadImages` para o palco de exportação, que monta uma raiz React própria e precisa das
URLs **antes** de renderizar — um `<img>` cujo `src` chega no quadro seguinte não está no
bitmap. O cache fica fora do store de propósito: o store persiste o deck e só o deck, e um
object URL não é estado a guardar, é um handle do documento vivo que morre no reload.
ADR-0055.

A URL do preview é `blob:`; a conversão para `data:` é o `modern-screenshot` que faz na
clonagem, e é lá que ela precisa acontecer, porque dentro do `foreignObject` a origem é
opaca. É a mesma armadilha que põe as três fontes em `next/font/local`.

**A imagem é reduzida a 2160px no maior lado na importação** — o 1080 do formato vezes a
escala 2 do alvo PDF, que é a maior resolução que o arquivo consegue aproveitar. O que passa
disso é peso puro em quatro lugares: o banco, o DOM, o `foreignObject` da captura e o base64
do `.json` da Etapa 4. ADR-0056.

**Deck da v1 não reidrata.** A virada da Etapa 3½ mudou a forma de `Slide` — de
`template + fields + options` para `layout + elements` —, e `deck.version` foi a **2** para
que isso seja explícito em vez de detectável por acaso. O que está salvo em v1 não é
convertido: o editor abre no carrossel de referência. É deck de um usuário só, num
aplicativo que ainda não tem import/export, e escrever um conversor de produção para uma
forma que nunca mais vai existir custa mais do que rende. ADR-0068 — e é a única exceção
à ADR-0031, que continua valendo para tudo o mais.

**Reidratar valida, e descarta slide a slide** — ADR-0031. O que está no localStorage
deixa de bater com o código quando um elemento some ou muda de chave, e a resposta é
derrubar só os slides que não passam, nunca o deck inteiro e nunca nada. Confiar sem
validar deixaria o `get()` do registry lançar dentro do render e abriria a ferramenta em
tela branca; reiniciar do semente apagaria o carrossel por causa de um slide. O que se
guarda é o **deck**, não o `activeId`: recarregar volta ao primeiro slide, e um id salvo
teria de ser validado contra o deck reidratado que a reordenação da Etapa 4 invalidaria
de qualquer jeito.

São duas perguntas por elemento, e a segunda sai de graça: o tipo ainda existe? e o
conteúdo passa no schema que **ele próprio** declara? Cada `ElementDef` carrega o seu, como
cada `TemplateDef` carregava desde a 1B — e a pergunta desce um nível, porque agora um
slide tem vários. Elemento que não passa cai; o slide fica com o resto. Quem responde é o `reviveDeck` de `src/editor/rehydrate.ts`, chamado no `merge` do
`persist`; ele mora em `src/editor` porque `src/deck/types.ts` não importa nada, nem de
biblioteca, e porque a validação por slide precisa do registry — a seta é
`templates → deck`. Deck de forma errada e deck sem nenhum slide sobrevivente voltam ao
semente, pela mesma regra que recusa remover o último slide.

**Entre as duas perguntas há um degrau: chave que falta não é dado torto, é dado velho.**
Antes de validar, o slide salvo é lido **por cima dos defaults do template**, e é isso que
separa os dois motivos de ele não bater com o código. Falta uma chave? O commit anterior
acrescentou um campo ao descritor e o que está salvo é de antes dele — nasce com o default,
e o slide fica. Uma chave tem valor de outra forma, `items` como string onde o descritor
promete lista? O default não salva ninguém, o valor errado sobrescreve o certo e o
elemento cai, que é a ADR-0031 intacta. Sem o degrau, acrescentar uma opção compartilhada apagaria
o carrossel de quem já tinha um salvo: os dez slides reprovariam de uma vez e o editor
abriria na semente — exatamente a perda de trabalho que a ADR-0031 existe para impedir,
chegando pela porta de trás. ADR-0041.

O que volta é o **resultado do parse**, não o slide cru: o zod remove a chave que o elemento
não declara mais. Sem isso o dado velho ficaria pendurado para sempre, invisível no
formulário e presente no JSON que a Etapa 4 vai exportar.

Ele mora em `src/editor/store.ts`, como uma factory mais um singleton. A factory é o que
deixa o teste montar um store isolado a partir de um deck de fixture, sem React e sem
reset global; a aplicação usa o singleton. Ver ADR-0024.

O slide ativo é guardado por **id**, não por índice: acrescentar e remover existem desde a
2D e a reordenação chega na Etapa 4, e um índice guardado passaria a apontar para outro
slide sem que nada avisasse. `addSlide` e `removeSlide` foram antecipados da Etapa 4 pela
ADR-0030 — sem eles a Etapa 2 não tem como compor os 8 a 12 slides que o próprio
critério dela exige. O deck nunca fica sem slides: remover o último é recusado, porque
deck vazio pediria um estado vazio, que é da Etapa 5.

Acrescentar põe o slide **no fim** e o torna ativo — é onde a pessoa vai escrever em
seguida —, e ele nasce `text-bullets`, que é o `n` da estrutura `capa → contexto →
desenvolvimento (n) → payoff → cta` da §3; trocar o layout está a um clique. Remover passa
o ativo ao vizinho seguinte, ou ao anterior quando o removido era o último; remover um
slide que não estava ativo não mexe no ativo.

### Imagens: escopo fechado

Apenas upload local. Imagem por URL externa contamina o canvas e faz a exportação
falhar em silêncio. Não é limitação técnica — é decisão de escopo.

**Blob órfão não é coletado, e é escolha.** Trocar a imagem de um slide, ou remover o slide,
deixa o blob anterior no banco sem ninguém apontando para ele. A 3F não apaga nada: o
`zundo` da Etapa 4 desfaz a troca e devolve o `ImageId`, e um blob apagado no caminho faria
o desfazer trazer o slide de volta sem a imagem. A varredura é do import/export da Etapa 4,
que é quem terá o deck inteiro à mão — e que numa tela de múltiplos decks precisa ter, senão
apaga a imagem do deck que não está aberto. ADR-0057.

O caso inverso já é estado válido e desenhado: **id no deck, blob ausente**. O schema passa,
porque o id é uma string válida; a imagem some e o slide fica, que é a ADR-0031 intacta. O
template desenha "Sem imagem", o mesmo estado de um slide que nunca teve uma.

