# asterism — documento de contexto

> **Versão** 1.0 · **Status** planejamento · **Autor** Rafael
> Um asterismo é um padrão reconhecível formado ao agrupar estrelas que já existem
> no céu. Você não cria as estrelas — escolhe algumas e as compõe numa forma.
> É a descrição exata do que esta ferramenta faz com uma biblioteca de layouts.

---

## 1. O problema

Publicar carrosséis no LinkedIn com identidade visual consistente exige, hoje,
uma de duas rotas ruins:

- **Canva/Figma** — WYSIWYG confortável, mas o conteúdo fica preso numa ferramenta
  proprietária, as fontes do Observatório exigem plano pago (Canva), o código nos
  slides vira captura de tela, e nada é versionável.
- **Escrever cada deck do zero em HTML** — precisão total, mas cada post custa horas
  e a consistência depende de disciplina manual.

O `asterism` ocupa o meio: os layouts são código (precisos, versionados, com o design
system real), mas o preenchimento é uma interface de edição.

## 2. O que o projeto é

Um **editor de decks com biblioteca de layouts tipada**, que roda inteiramente no
navegador e exporta o resultado em formatos publicáveis.

A distinção importa para a arquitetura: o coração do projeto é o **modelo de dados**,
não a exportação. Um deck é um documento JSON; o editor manipula esse JSON; o renderer
o transforma em DOM; o exportador transforma DOM em arquivo. Cada estágio é substituível
sem tocar nos outros.

### Duas razões de existir

1. **Uso real.** É a ferramenta com que os carrosséis do LinkedIn serão feitos,
   a partir do sistema visual *Observatório* já definido.
2. **Portfólio.** É um projeto de front-end que complementa o `pet-oasis` (back-end).
   Demonstra arquitetura extensível, tipagem forte, design system aplicado e um
   parser próprio — e tem uma história de origem concreta em vez de ser um CRUD de exemplo.

## 3. Objetivos

- Compor um carrossel escolhendo layouts de uma biblioteca e preenchendo campos.
- Preview fiel — o que aparece na tela é exatamente o que sai no arquivo.
- Exportar PDF 1080×1350 pronto para publicar, sem retoque externo.
- Adicionar um novo layout deve custar **uma pasta e uma linha de registro**.
- Adicionar um novo formato de saída deve custar **um módulo**, sem tocar em nada existente.
- O deck deve ser um arquivo portátil e autocontido.

## 4. Não-objetivos

Explicitamente fora de escopo, hoje e no médio prazo:

| Fora | Motivo |
|---|---|
| Back-end, banco, autenticação | Aplicação de usuário único, tudo local |
| Colaboração ou multiplayer | Idem |
| WYSIWYG livre (arrastar elementos, redimensionar) | Destruiria a consistência que os templates garantem |
| Editor de tema / troca de paleta | Existe um sistema visual; a ferramenta o aplica, não o edita |
| Tema claro | O Observatório é escuro por decisão |
| Geração de texto por IA | O texto é a parte que precisa ser autoral |
| Agendamento ou publicação automática | Fora do domínio |
| Estrutura de bloco na marcação (títulos, listas) | Estrutura é responsabilidade do template |

Quando surgir a tentação de adicionar qualquer um destes, esta tabela é a resposta.

## 5. Princípios de arquitetura

**Conteúdo é dado, apresentação é código.** O deck não guarda HTML, cor, tamanho ou
posição. Guarda texto, referências de imagem e escolhas de opção. Toda decisão visual
vive no template.

**Nenhum estágio conhece o seguinte.** O parser não sabe que existe DOM. O template
não sabe que existe exportação. O exportador não sabe quais templates existem.

**Registry em vez de switch.** Templates e alvos de exportação são descobertos por
registro, nunca por condicional espalhada pelo código. Um `switch (slide.template)`
fora do registry é sinal de erro de arquitetura.

**Fidelidade por identidade, não por aproximação.** O preview e a exportação usam o
mesmo DOM. Divergência entre os dois é impossível por construção, não por cuidado.

---

## 6. Modelo de dados

```ts
type SlideId = string
type ImageId = string
type TemplateId = string       // opaco: o deck não conhece a biblioteca de templates

type FieldValue = string | string[]   // list guarda array; o resto, string
type OptionValue = string | boolean   // select guarda string; toggle, booleano

type Pillar = "api" | "forge" | "log"
type DeckMeta = {
  handle: string               // "@rafael", vai no rodapé
  pillar: Pillar
}

type Deck = {
  version: 1
  id: string
  title: string
  format: { w: number; h: number }  // dado, não constante — ver §12
  meta: DeckMeta
  slides: Slide[]
  assets: Record<ImageId, string>  // base64, apenas no arquivo exportado
}

type SlideDefaults = {
  fields: Record<string, FieldValue>    // conteúdo
  options: Record<string, OptionValue>  // apresentação
}

type Slide = {
  id: SlideId
  template: TemplateId
} & SlideDefaults
```

`TemplateId` é `string` e não a união dos dez ids porque a seta de dependência é
`templates → deck`: o modelo de dados não conhece a biblioteca, e acrescentar um
template não o edita. Id desconhecido é erro de runtime, lançado pelo registry.

`SlideDefaults` existe para `createSlide` receber os defaults do template **como
argumento** — `src/deck` não importa `src/templates`. O `TemplateDef` da §8 é atribuível
a essa forma.

### Por que `fields` e `options` são separados

Ao trocar o layout de um slide, o **conteúdo migra** e as **opções resetam**. Essa
regra é impossível de aplicar se as duas coisas estiverem no mesmo objeto. A separação
também abre espaço para expor propriedades de estilo no futuro (alinhamento, densidade,
overrides de CSS) sem redesenhar nada — elas entram em `options`.

### Vocabulário canônico de campos

Templates diferentes devem usar as **mesmas chaves** para papéis equivalentes:

| Chave | Papel |
|---|---|
| `kicker` | Etiqueta superior (`api/ · 04`) |
| `heading` | Título do slide — vale para capa, conteúdo e fechamento |
| `lead` | Complemento do `heading`, um degrau abaixo na hierarquia |
| `body` | Texto corrido principal |
| `items` | Lista de tópicos |
| `image` | Referência de asset |
| `caption` | Texto auxiliar de imagem |
| `code` / `file` / `lang` | Bloco de código |
| `cta` | Destino ou ação, no fechamento |

Assim, trocar `text-bullets` por `text-impact` preserva o que a pessoa já digitou.
Sem isso, a troca de layout apaga trabalho — o pior momento possível de uso da ferramenta.

A tabela **fechou na 3A**, com a especificação dos dez templates. Nenhuma chave nova foi
precisa: a explicação do `code-annotated` é `body`, que é o texto corrido principal de
qualquer template, e as chaves de imagem e de código já estavam aqui desde a v1. O que a
3A acrescentou foi a distinção abaixo — o que é de todos, o que é de alguns e o que é de um
só.

#### Duas chaves são de todo template

O título de um slide é **sempre** `heading`, em qualquer template. A tentação de chamá-lo
de `titulo` na capa e de `heading` no miolo custa exatamente a migração que esta tabela
existe para garantir.

Mais que isso: **`kicker` e `heading` são declarados pelos dez**, mesmo onde o layout não
os desenha por padrão. São as duas chaves que atravessam qualquer troca de layout, e é o
que faz a etiqueta e o título nunca se perderem — nem indo de um slide de código para um
de imagem. Onde o valor está vazio, a região some, como o `lead` vazio do `final-cta` já
fazia.

O descritor de `kicker` é compartilhado, em `src/templates/shared/fields.ts`. O de
`heading` **não é**: o limite de caractere acompanha a região, e a região é do template —
70 na capa em 96px, 60 num slide de tópicos em 56px. O que é comum é o **rótulo**, e ele é
"Título" nos dez, pelo motivo que a §11.2 dos templates registra.

O `kicker` ficou preso ao `cover-statement` até a 2F, e o custo apareceu no deck de doze
slides: sair da capa **descartava** o que estava digitado, porque a migração é uma
interseção de chaves e uma chave que só um lado declara não atravessa. O descritor mora em
`src/templates/shared/fields.ts`, o simétrico do `shared/options.ts`, e é o mesmo objeto em
todos — declarado à mão em cada template, o rótulo divergiria no terceiro.

O mesmo caminho vale para as chaves seguintes desta tabela quando um segundo template as
quiser: o vocabulário promete a mesma chave para o mesmo papel, e um descritor compartilhado
é o que faz a promessa ser verdadeira em vez de disciplina.

#### A promessa é de papel, não de forma — e a migração cobra as duas

O vocabulário garante que `body` é texto corrido em qualquer template. Não garante que
todos o guardem com a mesma **forma de valor**, e o `migrateFields` compara as duas coisas:
`list` guarda array, todo o resto guarda string, e chave cuja forma não bate fica com o
default do destino.

Daí a regra que a 3A fixou ao escrever os dez de uma vez: **a mesma chave tem o mesmo tipo
de campo na biblioteca inteira**. `code`, `file` e `lang` são idênticos no `code-window` e
no `code-annotated`; `image` é idêntico no `split-vertical` e no `image-caption`; `items` é
`list` onde quer que apareça. Sem isso a promessa desta tabela vale no papel e falha na
troca de layout, que é o único lugar onde ela é cobrada.

#### O que é próprio de um template

Uma chave que nenhum segundo template usa não ganha linha aqui — vocabulário com um
usuário só é vocabulário por engano. Ela é declarada no template e **justificada na §11.x
dele**, que é o critério que a 3A fechou:

| Chave | Template | Papel |
|---|---|---|
| `beforeLabel` / `before` | `compare-2col` | O lado esquerdo da comparação, rótulo e conteúdo |
| `afterLabel` / `after` | `compare-2col` | O lado direito, idem |

O par antes/depois foi o único caso em dez templates. Promovê-lo à tabela canônica
reservaria à biblioteca inteira um papel que só um layout tem; se um segundo template de
comparação aparecer, é aí que ele sobe — e não antes.

As chaves são em inglês, como todo identificador do projeto. O texto dos documentos
continua em português.

## 7. Marcação inline

Sintaxe do Obsidian, subset fechado, **sem nenhuma construção de bloco**.

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
e o único lugar que exige cobertura séria na v1.

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

**Não existe regra de limite de palavra** — decisão 33. `micro**serviços**` marca, e
`2*3*4` vira `2`, `3` em ênfase e `4`. O tokenizer não olha o caractere anterior.

Nós de texto vizinhos são colapsados em um só: uma sequência de rejeições devolve um nó,
não um por caractere.

## 8. Templates

Cada template é uma pasta autocontida:

```
src/templates/cover-statement/
  index.tsx     componente; recebe props tipadas, renderiza 1080×1350
  meta.ts       { id, label, group, background, sections, defaults }
  fields.ts     descritores de fields e options + schema zod
```

O que é o mesmo em todos os dez não fica em pasta nenhuma: `src/templates/shared/` guarda
os descritores compartilhados — `fields.ts`, `options.ts`, `sections.ts` — e as peças que
todo slide desenha, o `Header` e o `Footer`. Um template os espalha e acrescenta os
próprios depois.

```ts
type TemplateDef<
  F extends Record<string, FieldValue> = any,
  O extends Record<string, OptionValue> = any,
> = {
  id: TemplateId
  label: string
  group: "cover" | "content" | "code" | "media" | "final"
  background: "plain" | "grid"
  fields: Field[]
  options: Field[]
  sections: FieldSection[]
  schema: ZodType<{ fields: F; options: O }>
  defaults: { fields: F; options: O }
  Component: React.FC<{ fields: F; options: O; deck: DeckMeta; index: number; total: number }>
}
```

Os limites em `F` e `O` são o que torna `defaults` atribuível ao `SlideDefaults` da §6 —
o contrato pelo qual `createSlide` recebe os defaults de um template sem que `src/deck`
importe o registry. O padrão `= any` fica: um template concreto sempre informa os dois.

O registry, por sua vez, guarda `TemplateDef<any, any>`. Não dá para guardar
`TemplateDef<Record<string, FieldValue>>`: `Component` é propriedade de tipo função, e
sob `strictFunctionTypes` os parâmetros são contravariantes — um componente que exige
`{ heading: string }` não é atribuível a um que promete aceitar qualquer campo.

O `Field` é um descritor declarativo — não uma derivação automática do zod:

```ts
type Field = (
  | { key: string; type: "text";     label: string; max?: number; placeholder?: string; md?: boolean }
  | { key: string; type: "textarea"; label: string; max?: number; md?: boolean; rows?: number }
  | { key: string; type: "list";     label: string; maxItems: number; maxPerItem?: number; md?: boolean }
  | { key: string; type: "image";    label: string; ratio?: string }
  | { key: string; type: "code";     label: string; maxLines: number }
  | { key: string; type: "select";   label: string; options: { value: string; label: string }[] }
  | { key: string; type: "toggle";   label: string }
) & { section?: string }

type FieldSection = { key: string; label: string; toggle?: string }
```

`sections` e `section` são **metadado de desenho**: dizem em que faixa do inspector cada
controle aparece e sob que interruptor. Não tocam no dado — `fields` e `options` continuam
sendo a lista completa e plana das chaves de cada saco, e o slide continua guardando os dois
separados. Ver a §14 e a decisão 44.

O `section` de um controle não é o `group` do template: aquele é uma faixa do formulário,
este é a função narrativa do template inteiro.

**O zod valida, o descritor desenha.** Gerar formulário automaticamente a partir do
schema parece elegante e é um poço sem fundo — unions, arrays, defaults e refinements
exigem casos especiais até o gerador ficar maior que os formulários que ele geraria.
O descritor custa uma hora e dá controle total sobre rótulos, ajuda e limites.

A flag `md` marca quais campos aceitam marcação inline. Campos sem ela são literais.

### Os dez templates da v1

Definidos previamente por **função narrativa**, não por estética:

| # | Id | Função | Fundo |
|---|---|---|---|
| 1 | `cover-statement` | Gancho | `grid` |
| 2 | `context` | Segurar o leitor | `plain` |
| 3 | `text-bullets` | Desenvolvimento | `plain` |
| 4 | `text-impact` | Respiro | `grid` |
| 5 | `code-window` | Código puro | `plain` |
| 6 | `code-annotated` | Código com explicação | `plain` |
| 7 | `compare-2col` | Antes/depois | `plain` |
| 8 | `split-vertical` | Texto + imagem | `plain` |
| 9 | `image-caption` | Imagem dominante | `plain` |
| 10 | `final-cta` | Fechamento | `grid` |

Estrutura de um deck: `capa → contexto → desenvolvimento (n) → payoff → cta`,
alvo de 8 a 12 slides.

## 9. Renderização

O template renderiza sempre em **1080×1350 px reais**. O preview aplica
`transform: scale(k)` com `transform-origin: top left` num wrapper de tamanho fixo.

Consequências: nenhuma media query, nenhuma matemática responsiva, e o preview é
literalmente o mesmo DOM que será exportado.

### O wrapper declara a escala

O wrapper também declara `--slide-scale` com o mesmo `k` que passou ao `transform`.
Detalhes que dependem de espessura de traço — o grid de fundo, hoje; bordas de 1px,
amanhã — compensam a partir dessa variável, senão desaparecem no preview. A exportação
renderiza com `k = 1` e recebe os valores de spec sem saber que a compensação existe.

É a única divergência deliberada entre preview e exportação, e ela existe para preservar
a aparência, não para quebrá-la.

O wrapper é o `SlideFrame` (`src/render/slide-frame.tsx`), e ele é o **único** dono de
`--slide-scale`: é o único ponto do sistema que sabe em que tamanho o slide está sendo
exibido. São duas camadas — um quadro externo já escalado, que ocupa espaço no editor, e
a raiz do slide em pixels reais, com o `transform`. A variável fica na raiz do slide,
porque quem desenha o grid está lá dentro e precisa enxergá-la.

**A moldura do preview mora na camada de fora.** A borda de 1px que contorna a página
fica no quadro externo, nunca na raiz. Dentro, ela encolheria junto com a escala e
entraria no nó capturado pela exportação, que é exatamente o que esta seção diz não pode
acontecer. Ver decisão 23.

### Guard de transbordo

Slide tem altura fixa, então texto longo transborda — é a falha número um deste tipo
de ferramenta. Um `ResizeObserver` mede a região de conteúdo e marca o slide como inválido
no canvas e na lista lateral. O contador de caracteres por campo vem do `max` do descritor.

Não é polimento opcional. É o que separa uma ferramenta utilizável de um brinquedo.

**Quem declara a região medida é o template**, e a §11.x de cada um a marca com **⌐** na
tabela de regiões. O guard é convenção compartilhada, não recurso de um template: vive em
`src/render/overflow.tsx` e os dez o consomem pelo mesmo hook.

**São dois nós, não um.** A faixa tem altura de spec — `h-[866px]` escrita no template — e
o bloco de conteúdo dentro dela cresce com o texto; o guard compara a altura do **conteúdo**
com a da **faixa**. Comparar `scrollHeight` com `clientHeight` no mesmo elemento, que é o
teste óbvio, reprova em silêncio nos templates que ancoram o conteúdo à base: o que estoura
sobe acima da borda superior, e o que sobe não entra no `scrollHeight` do pai. O
`cover-statement` e o `final-cta` são exatamente esse caso.

As duas propriedades são medidas de layout e **não enxergam o `transform: scale()`** do
`SlideFrame` — a mesma leitura vale a 1:1 no palco de exportação, a k ≈ 0,28 no canvas e a
k = 0,2 na miniatura da lista, e é por isso que cada `SlideView` mede a si mesmo em vez de
haver estado de transbordo no store. `getBoundingClientRect` não serve aqui: essa enxerga
a escala.

Duas condições que o guard impõe a quem o usa, as duas da mesma família da armadilha da
§13. A faixa medida **não pode ser dimensionada pelo conteúdo** — `min-h` no lugar de `h`
realimenta a medida. E a marca que o resultado desenha **não pode mexer no layout medido**,
senão medir muda o que se mede: por isso ela é a borda do quadro externo do `SlideFrame`,
que já tem 1px nos dois estados, vive fora do `transform` e fica fora do nó que a
exportação captura — o PDF não sai com borda vermelha.

A medida se repete em `document.fonts.ready`: antes de Oxanium e Sora carregarem, o texto é
medido com a fonte de fallback e a altura é outra. É a mesma espera que o palco de
exportação da §10 já faz, pelo mesmo motivo.

## 10. Exportação

PDF, PNG e JPG **não são três exportadores**. Compartilham o caminho DOM → bitmap e
divergem apenas na codificação e no empacotamento. Um plugin por formato duplicaria a
rasterização. O corte correto tem dois estágios:

```ts
// estágio 1 — único, compartilhado
type RenderSource = { slide: Slide; node: HTMLElement }
type Frame = { slide: Slide; width: number; height: number; data: string }
function rasterize(src: RenderSource, escala: number): Promise<Frame>

// estágio 2 — plugável
interface ExportTarget<O = {}> {
  id: string
  label: string
  options: Field[]
  produce(sources: RenderSource[], opts: O): Promise<ExportResult>
}

type ExportResult = { files: { name: string; blob: Blob }[] }
```

`ExportResult` sempre devolve uma lista: o alvo PDF produz um arquivo, o alvo PNG
produz N, um futuro alvo ZIP produz um. O registry é idêntico ao dos templates — e desde
a 1E é literalmente o mesmo: os dois instanciam o `createRegistry` de `src/lib/registry.ts`,
decisão 27. Quem registra alvo é `src/export/index.ts`, e cada alvo é um módulo em
`src/export/targets/`.

`RenderSource` carrega o **nó e o slide**, não o bitmap pronto — assim um alvo futuro
pode optar por ler os dados diretamente em vez de rasterizar, mantendo aberta a porta
para saída vetorial.

O `data` do `Frame` é **PNG em data URL** — decisão 26. `width` e `height` já vêm
multiplicados pela escala, e saem do tamanho medido no nó, nunca de `1080` escrito à mão:
o formato é dado, §12. Os módulos moram em `src/export/`: `types.ts` para os quatro tipos
acima e `rasterize.ts` para o estágio 1, sobre `modern-screenshot`.

### De onde vêm os nós

`withExportStage(deck, uso)`, em `src/export/stage.tsx`. Monta o deck inteiro num
container `fixed` fora da tela — fora de fluxo, nunca `display: none`, que não teria
layout para capturar —, espera `document.fonts.ready`, entrega um `RenderSource` por
slide e desmonta, inclusive quando o uso falha. Os slides são montados **sem escala**: o
default do `SlideFrame` é 1, o tamanho de spec. Ver a decisão 20.

O nó capturado é a raiz do slide, e quem o expõe é o próprio `SlideFrame`, por um
`canvasRef` opcional que o `SlideView` repassa. O quadro externo fica de fora junto com a
sua borda de 1px — decisão 23.

### Alvos

- **v1** — `pdf` (1080×1350 pt, uma página por slide)
- **futuro** — `png`, `jpg`, `zip`, `webp`

### Por que rasterizar e não gerar PDF vetorial

`@react-pdf/renderer` produz texto vetorial e arquivos menores, mas obriga a reescrever
todos os layouts num subset próprio de flexbox: sem Tailwind, sem grid, sem
`background-image` (o grid de fundo do Observatório deixaria de existir), sem shiki.
Seria jogar fora o design system.

O LinkedIn converte o PDF em imagem no feed de qualquer forma. Texto vetorial não
compra nada neste domínio.

## 11. Estado e persistência

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
compor, e o `persist` por cima deste mesmo store — tarefa 2.12: a Fase 1 do §15 promete um
carrossel publicável e um deck que some no reload não cumpre a promessa. O **IndexedDB
chega na 3F**, com os dois templates de mídia que o pedem: um template cujo campo principal
não tem onde guardar valor não está entregue, e é a mesma razão pela qual a decisão 30
antecipou o `addSlide`. O `zundo` fica para a **Etapa 4**, junto com o resto do editor.

**Reidratar valida, e descarta slide a slide** — decisão 31. O que está no localStorage
deixa de bater com o código quando um template some ou muda de chave, e a resposta é
derrubar só os slides que não passam, nunca o deck inteiro e nunca nada. Confiar sem
validar deixaria o `get()` do registry lançar dentro do render e abriria a ferramenta em
tela branca; reiniciar do semente apagaria o carrossel por causa de um slide. O que se
guarda é o **deck**, não o `activeId`: recarregar volta ao primeiro slide, e um id salvo
teria de ser validado contra o deck reidratado que a reordenação da Etapa 4 invalidaria
de qualquer jeito.

São duas perguntas por slide, e a segunda sai de graça: o template ainda existe? e o
conteúdo passa no schema que **ele próprio** declara? Cada template carrega o seu desde a
1B. Quem responde é o `reviveDeck` de `src/editor/rehydrate.ts`, chamado no `merge` do
`persist`; ele mora em `src/editor` porque `src/deck/types.ts` não importa nada, nem de
biblioteca, e porque a validação por slide precisa do registry — a seta é
`templates → deck`. Deck de forma errada e deck sem nenhum slide sobrevivente voltam ao
semente, pela mesma regra que recusa remover o último slide.

**Entre as duas perguntas há um degrau: chave que falta não é dado torto, é dado velho.**
Antes de validar, o slide salvo é lido **por cima dos defaults do template**, e é isso que
separa os dois motivos de ele não bater com o código. Falta uma chave? O commit anterior
acrescentou um campo ao descritor e o que está salvo é de antes dele — nasce com o default,
e o slide fica. Uma chave tem valor de outra forma, `items` como string onde o descritor
promete lista? O default não salva ninguém, o valor errado sobrescreve o certo e o slide
cai, que é a decisão 31 intacta. Sem o degrau, acrescentar uma opção compartilhada apagaria
o carrossel de quem já tinha um salvo: os dez slides reprovariam de uma vez e o editor
abriria na semente — exatamente a perda de trabalho que a decisão 31 existe para impedir,
chegando pela porta de trás. Decisão 41.

O que volta é o **resultado do parse**, não o slide cru: o zod remove a chave que o template
não declara mais. Sem isso o dado velho ficaria pendurado para sempre, invisível no
formulário e presente no JSON que a Etapa 4 vai exportar.

Ele mora em `src/editor/store.ts`, como uma factory mais um singleton. A factory é o que
deixa o teste montar um store isolado a partir de um deck de fixture, sem React e sem
reset global; a aplicação usa o singleton. Ver decisão 24.

O slide ativo é guardado por **id**, não por índice: acrescentar e remover existem desde a
2D e a reordenação chega na Etapa 4, e um índice guardado passaria a apontar para outro
slide sem que nada avisasse. `addSlide` e `removeSlide` foram antecipados da Etapa 4 pela
decisão 30 — sem eles a Etapa 2 não tem como compor os 8 a 12 slides que o próprio
critério dela exige. O deck nunca fica sem slides: remover o último é recusado, porque
deck vazio pediria um estado vazio, que é da Etapa 5.

Acrescentar põe o slide **no fim** e o torna ativo — é onde a pessoa vai escrever em
seguida —, e ele nasce `text-bullets`, que é o `n` da estrutura `capa → contexto →
desenvolvimento (n) → payoff → cta` da §8; trocar o layout está a um clique. Remover passa
o ativo ao vizinho seguinte, ou ao anterior quando o removido era o último; remover um
slide que não estava ativo não mexe no ativo.

### Imagens: escopo fechado

Apenas upload local. Imagem por URL externa contamina o canvas e faz a exportação
falhar em silêncio. Não é limitação técnica — é decisão de escopo.

## 12. Formato como dado

O `Deck` carrega `format: { w, h }` e os templates leem as variáveis CSS `--slide-w` /
`--slide-h` em vez de hardcodar `1080`. A v1 trava em 4:5 e não expõe nenhum controle.

Custa meia hora hoje e evita reescrever dez templates no dia em que 1:1 ou 9:16
fizerem sentido.

## 13. Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), `output: 'export'` |
| Estilo | Tailwind CSS v4, config CSS-first, tokens do Observatório |
| Componentes | shadcn/ui v4 sobre Base UI (`@base-ui/react`), preset `nova` |
| Ícones | lucide-react |
| Estado | zustand + persist + zundo |
| Validação | zod |
| Marcação | parser próprio (~40 linhas) |
| Código nos slides | shiki, tema derivado dos tokens do Observatório |
| Rasterização | modern-screenshot |
| PDF | jsPDF |
| Reordenação | @dnd-kit/sortable |
| Assets | idb-keyval |
| Testes | Vitest, com `@testing-library/react` e `happy-dom` |
| Deploy | Vercel (estático); Nginx Proxy Manager na Forge se crescer |

O tema do shiki precisa sair dos tokens do projeto. Um tema pronto faz o bloco de
código ser a única coisa do carrossel que não parece sua.

`supertest` não entra: é cliente HTTP para testar servidor, e não há servidor.

`@vitejs/plugin-react` também não entra, apesar de o guia do Next pedi-lo. Ele traz a
cadeia do Babel 8 e o `shadcn` já fixa o Babel 7 na árvore — o `npm install` falha por
conflito de peer. O que o plugin dá é Fast Refresh e ganchos de Babel, nenhum dos dois
usado numa rodada de teste: o JSX é transformado direto pelo `"jsx": "react-jsx"` do
`tsconfig.json`.

### Armadilhas conhecidas

**OKLCH quebra a serialização.** As bibliotecas de captura passam por
`foreignObject`/canvas e o suporte a `oklch()` é irregular. Os tokens da subárvore
`.slide-canvas` devem ser declarados em **hex sRGB** (conversão já existente no
documento do Observatório). OKLCH permanece no chrome do editor.

**Fontes precisam ser same-origin.** Oxanium, Sora e JetBrains Mono carregadas como
arquivos locais (`next/font/local`). Fonte servida pelo CDN do Google não é inlinada
na captura e o arquivo exportado sai em Arial.

**Gradiente não sobrevive à rasterização.** No Firefox, um `linear-gradient` ladrilhado
por `background-size` dentro do nó capturado sai como **um módulo desenhado e o resto da
página chapado com a primeira parada** — a grade da §4.3 do design system some e o fundo
inteiro troca de cor. `repeating-linear-gradient` falha igual, e `<pattern>` de SVG sai
com metade da espessura, porque o traço na borda do ladrilho é recortado. O que a
exportação precisa ver tem de ser **elemento**: um `<svg>` com linhas de verdade atravessa
intacto, e a constelação e o chevron já provavam isso no mesmo PDF que reprovou o fundo.
Medido na 1E, com quatro implementações comparadas no arquivo. Ver a decisão 28.

**O reset do Tailwind não atravessa a clonagem.** A captura copia estilo computado para
dentro de um `foreignObject`, e ali dentro vale a folha do **agente de usuário** outra vez.
Onde o `preflight` zerava por folha e não por elemento — `margin` de `<p>`, `<h2>` e
`<ul>`, o `padding-inline-start` da lista —, o clone não leva nada, e o navegador aplica os
defaults dele: `1em` de margem em cada parágrafo, medido no corpo tipográfico do slide, que
a 72px são **72px de espaço que ninguém pediu**.

O sintoma foi o `final-cta` no PDF, com o bloco de fecho 96px abaixo do lugar, por cima do
rodapé. O defeito nunca foi dele: medindo o bitmap com e sem o reset, **quatro dos cinco
templates** mudavam de desenho — a capa subia o título 96px, o `context` descia o corpo 40,
o `text-bullets` descia o título. Só o `text-impact` passava intacto, porque centralizar
nos dois eixos cancela margem simétrica. O fechamento era o único em que o deslocamento
encontrava outra coisa no caminho.

A correção é uma folha injetada no clone por `onCloneNode`, em `src/export/rasterize.ts`,
com **especificidade de seletor universal**: estilo em linha vence, então o `padding` que um
bloco declara de verdade continua valendo, e some só o que ninguém declarou. Ver a decisão
50.

E a lição de método, que custou mais que a correção: **pintar um nó para medi-lo altera a
medida**. A primeira sonda dava fundo colorido ao bloco para achá-lo no bitmap, e o atributo
`style` que ela criava mudava o que o clone copiava — o defeito sumia justamente onde se
olhava. O que serve é comparar **dois bitmaps** do mesmo nó intocado.

**Tamanho do arquivo.** PNG 2× sobre fundo escuro chapado comprime bem; dez slides
devem ficar bem abaixo de 3 MB. Se um deck com fotos estourar, o alvo PDF cai para
JPEG 0.92 apenas nos slides com imagem.

**Tailwind faz tree-shaking de token.** Variável declarada em `@theme` que nenhuma classe
referencia não chega ao CSS final, e `var(--color-ink-700)` num estilo inline resolve
para nada — silenciosamente, sem erro de build. Por isso as rampas de cor e o bloco da
superfície carrossel são declarados como `@theme static`. Só o mapeamento semântico do
shadcn, em `@theme inline`, pode ser podado sem prejuízo.

**Elemento medido não pode ser dimensionado pelo que ele contém.** O `ResizeObserver` do
canvas mede a área central para calcular a escala, e a escala desenha o quadro dentro
dela. Se a altura da área depender do conteúdo — basta um `min-height` no lugar de uma
altura no caminho até o `body` —, cada medida realimenta uma escala maior e o slide cresce
sozinho até o teto do auto-fit. Aconteceu na 1C, e o sintoma engana: parece animação, e é
laço.

São duas condições, e vale manter as duas. **O que se mede fica preso a algo de fora** —
o shell tem altura de viewport, não altura mínima. **O que o resultado desenha fica fora
do fluxo** — o quadro mora num palco `absolute` dentro da área, e conteúdo posicionado em
absoluto não contribui para o tamanho do pai. A segunda sozinha já fecha a porta, e é a
que vai valer também para o palco de exportação da §10, que monta o deck inteiro fora da
tela.

**Id de dado não vira atributo do DOM.** O deck é criado duas vezes — uma na
pré-renderização estática, no Node, e outra no navegador — e os ids saem de
`crypto.randomUUID()`, então os dois lados discordam. Id de slide em `id`, `htmlFor`,
`aria-labelledby` ou `data-*` é divergência de hidratação garantida, e o React não remenda
atributo: ele avisa no console e segue com o valor do cliente. Identificador de formulário
sai de `useId`, que o React gera pela posição na árvore e por isso casa dos dois lados.
Aconteceu na 1D, no inspector. Vale para o palco de exportação da 1E e para a lista de
arraste da Etapa 4, que também vão querer marcar nós.

**Estado que vem do navegador não pode chegar no primeiro render.** É a mesma família da
armadilha acima, e o `persist` do zustand cai nela por padrão: ele lê o storage de forma
**síncrona**, na criação do store, e a página é pré-renderizada estaticamente — o HTML do
build traz o deck semente e o primeiro render do cliente traria o deck salvo. O caminho é
`skipHydration: true` na configuração do middleware e `store.persist.rehydrate()` num
efeito, que só roda no navegador e depois do primeiro quadro. O deck salvo entra no
segundo render, e os dois lados concordam no primeiro. Não chegou a virar defeito na 2D
porque o store já nasceu assim; vale para qualquer estado que venha de `localStorage`,
`IndexedDB` ou `matchMedia` daqui em diante.

## 14. Interface

Três colunas, sem invenção:

- **Esquerda** — lista de slides com miniatura, índice, rótulo do template, marca de
  transbordo, reordenação por arraste, duplicar e remover.
- **Centro** — canvas com o slide ativo em escala, seletor de zoom, indicador de validade.
- **Direita** — inspector: seletor de layout no topo e, abaixo, as seções que o descritor
  declara, com contadores de caractere.
- **Topo** — nome do deck, ações de deck (novo, importar, exportar JSON) e o botão de
  exportação com escolha de alvo.

As quatro áreas nascem juntas, na 1C, e se preenchem por etapa. Criar o quadrilátero de
uma vez custa nada e faz o editor ter, desde o primeiro dia, as proporções que vai ter no
fim.

Estado hoje, depois da 2F: o centro funciona; o topo tem o nome do deck e a exportação —
um botão por alvo do registry, hoje um só, com spinner enquanto a captura acontece, e o
menu com escolha de alvo entra quando houver mais de um; a direita tem o seletor de layout,
que troca o template do slide preservando o conteúdo, e o formulário derivado dos
descritores, em seções que se ligam e se encolhem, com contadores; a esquerda lista os
slides com miniatura, número e nome, troca o ativo, rola até ele e tem, no pé, a barra que
acrescenta e remove — sem marca de transbordo, arraste nem duplicar.

Acrescentar e remover ficam numa barra fixa no pé da coluna, agindo sobre o slide ativo, e
não como um controle por miniatura: o item da lista é um `<button>` inteiro, e botão dentro
de botão é HTML inválido; e a §6 do design system diz que ícone nunca substitui rótulo em
ação destrutiva, o que um X pendurado em cada uma das doze miniaturas seria.

**A lista rola até o slide ativo.** Quem rola é o `<ol>`, e não a coluna — a coluna é quem
segura a barra do pé. Acrescentar já tornava o slide novo o ativo, mas num deck de doze ele
nascia abaixo da dobra: a única pista de que algo tinha acontecido ficava no canvas, e a
coluna que existe para mostrar onde se está mostrava outro lugar. A rolagem é `nearest` e
instantânea — não mexe em nada quando o item já está visível, e a §7 do design system não
anima posição por mais de 8px.

### As seções do inspector

O formulário era duas seções fixas — Conteúdo escrevendo em `fields`, Apresentação em
`options` —, o desenho espelhando a divisão do modelo da §6. Desde a 2F ele lê `sections`
do descritor e desenha uma seção por entrada, na ordem declarada:

```
Layout            o seletor de template; não é seção do descritor
▾ Cabeçalho  [●]  interruptor `showHeader`; dentro, o campo Kicker
▾ Conteúdo        os campos sem `section`
▸ Rodapé     [●]  interruptor `showFooter`; dentro, as cinco peças da faixa
▾ Apresentação    as opções sem `section` — a grade e as próprias do template
```

A ordem é a **vertical do slide**, e é declarativa: quem edita procura o controle onde a
coisa está no slide. Conteúdo e Apresentação entraram na lista como seções sem interruptor
justamente para isso — fossem duas seções fixas no componente, a posição do Cabeçalho acima
do conteúdo seria uma regra escrita em `inspector.tsx` em vez de no descritor.

**Uma seção mistura `field` e `option` no desenho, e só no desenho.** O cabeçalho do slide é
uma faixa com um texto e um interruptor; separá-los em duas seções distantes faria ligar a
coisa numa e escrever nela na outra. A seção é metadado de desenho: `fields` e `options`
continuam sendo dois sacos separados no dado, e a regra "conteúdo migra, opções resetam"
continua inteira. Mover o kicker para `options` resolveria o desenho e quebraria isso —
opção reseta na troca de layout, e o texto seria perdido justo onde o vocabulário
compartilhado acabou de garantir que sobrevive. Decisão 44.

Faixa desligada não mostra as sub-opções: não há o que ajustar numa coisa que sumiu do
slide. O valor delas continua guardado, então ligar de volta traz o que estava.

Encolher é estado do painel, não do slide: mora em `useState` no `Inspector`, sobrevive à
troca de slide porque o componente não desmonta, e não entra no `persist`, que guarda só o
deck. O Rodapé nasce encolhido — cinco interruptores que se mexe uma vez —, o resto aberto.

O cabeçalho de uma seção é um `<div>` com dois controles **irmãos**: o gatilho que encolhe e
o interruptor da faixa. Switch dentro de button é HTML inválido, a mesma armadilha que a
lista lateral já documenta, e é por isso que não há um `Collapsible` do Base UI aqui — o
`Trigger` dele envolveria o interruptor junto.

O formulário desenha cinco dos sete tipos de `Field`: `text`, `textarea` e `toggle` desde
a 1D, `list` e `select` desde a 2C. `image` e `code` continuam aparecendo como linha
inerte com o rótulo — pular um tipo sem controle em silêncio faria um campo novo sumir do
formulário sem aviso. No `list`, acrescentar, remover e reordenar são botões: o arraste é
da Etapa 4, com `@dnd-kit`, e a lista lateral é onde ele se paga.

A miniatura é o mesmo `SlideView` do canvas numa escala fixa, e não uma representação
própria: um segundo desenho do slide para a lista lateral divergiria do primeiro no
terceiro template.

## 15. Roadmap

| Fase | Escopo | Estimativa |
|---|---|---|
| **1 — Fatia vertical** | Tipos, registry, parser inline, canvas escalado, inspector, **3 templates** (`cover-statement`, `text-bullets`, `final-cta`), alvo PDF | 6–8 h |
| **2 — Biblioteca** | Os outros 7 templates, shiki com tema próprio, guard de transbordo, imagens no IndexedDB | 4–6 h |
| **3 — Editor** | dnd-kit, duplicar/remover, undo/redo, múltiplos decks, import/export JSON | 4–5 h |
| **4 — Produto** | Atalhos de teclado, estados vazios, README com GIF, deploy | 3 h |

Total aproximado: **20 horas**, dois fins de semana. A fase 1 já permite publicar um
carrossel real — a ferramenta é útil antes de estar pronta.

### Critério de conclusão da v1

Um carrossel completo, do zero ao PDF publicado no LinkedIn, sem sair da ferramenta e
sem retoque em nenhum outro programa.

## 16. Decisões registradas

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| 1 | Templates em código | Figma ou Canva | Reaproveita o design system, versiona no git, código com highlight real, e o gerador em si vira portfólio |
| 2 | Rasterizar o DOM | PDF vetorial via `@react-pdf/renderer` | Preservar Tailwind e o design system; o LinkedIn rasteriza de qualquer jeito |
| 3 | Parser devolve AST | Devolver HTML | Não acoplar conteúdo ao DOM; manter aberta a saída vetorial |
| 4 | Descritor de campos declarativo | Formulário derivado do zod | Custo e complexidade desproporcionais ao ganho |
| 5 | `fields` separado de `options` | Objeto único de props | Permitir migração de conteúdo na troca de layout e abrir espaço para overrides de estilo |
| 6 | Exportação em dois estágios | Um plugin por formato | Evitar triplicar a rasterização entre PDF, PNG e JPG |
| 7 | Imagens no IndexedDB | base64 no localStorage | Cota de ~5 MB estoura com uma única imagem |
| 8 | Apenas upload local de imagem | Aceitar URL externa | CORS contamina o canvas e quebra a exportação em silêncio |
| 9 | Marcação sem construções de bloco | Markdown completo | Estrutura é responsabilidade do template; caso contrário o design system perde o controle da tipografia |
| 10 | Marcadores não aninham | Parser recursivo | Simplifica o tokenizer; nenhum slide precisa |
| 11 | Tokens em hex sRGB no canvas | OKLCH em todo lugar | Suporte irregular a `oklch()` na serialização de captura |
| 12 | `format` como dado desde a v1 | `1080×1350` hardcoded | Meia hora agora contra reescrever dez templates depois |
| 13 | Vocabulário de campos único, em inglês | `titulo` na capa e `heading` no miolo | Migração de conteúdo na troca de layout exige a mesma chave para o mesmo papel; o id fica gravado no JSON do deck e mudar depois custaria migração de dados |
| 14 | Kicker é campo digitado | Derivar de `meta.pillar` com o índice | Liberdade de escrever qualquer coisa vence a consistência automática; o preço é reordenar não reescrever o índice |
| 15 | Grid com linha de 2px, compensada no preview | 0.5px calibrado para a rasterização 2× | A calibragem valia só para o bitmap: o slide quase nunca é visto a 1:1, e abaixo de 1080px de largura uma linha de 1px cai abaixo de um pixel e some do post publicado. 2px sobrevive ao downscale; e como nenhuma espessura fixa sobrevive a uma redução arbitrária, o preview declara `--slide-scale` e a espessura efetiva vira `max(base, 1px / k)`. Ver §4.3 do design system |
| 16 | Estrela da logo em `azure-400` | Rampa `star-*` própria, em OKLCH | Evita uma sexta rampa de azul quase idêntica à existente e tira OKLCH do canvas; a estrela passa a ser a mesma cor da constelação de progresso |
| 17 | Variantes do shadcn adaptadas à §2.4 do design system | Aceitar o preset como vem | Um padrão de cor só, no editor e no carrossel |
| 18 | `MaiahubGlyph` a 32px no rodapé do slide | `MaiahubMark`, que está dentro da própria faixa de tamanho; ou a assinatura | Decidido por comparação visual das três peças só-símbolo. A correção ótica da glyph é o que a mantém legível sobre `ink-950` num slide que depois é reduzido; a `Mark` some ali. Assinatura e wordmark trazem "maiahub" escrito e competiriam com o `@handle` no mesmo canto |
| 19 | Escala tipográfica do carrossel materializada em `@utility slide-*` | Compor as utilities do Tailwind dentro de cada template | A §3.3 do design system define cinco propriedades por token e só o tamanho vira token automático; repetir família, peso, altura e tracking em dez templates é divergência garantida. O template escreve `slide-display` e a escala vive num lugar só |
| 20 | Palco de exportação oculto, montado a 1:1 | Zerar a escala do canvas visível antes de capturar | O exportador precisa do deck inteiro, não do slide ativo — e capturar o nó do preview arrastaria a compensação de `--slide-scale` para dentro do arquivo, que é justamente o que a §9 diz não pode acontecer |
| 21 | Página do PDF em pt, 1080×1350 | Unidade `px` casada com a medida do canvas | Confirma a §10. O bitmap é 2160×2700 nos dois casos, então a diferença é só o número que o visualizador mostra; e a unidade `px` do jsPDF depende de uma conversão de 96 dpi que não vale a pena carregar |
| 22 | Escala do canvas por auto-fit na fatia vertical | Seletor de zoom desde a primeira etapa | O que a etapa precisa provar é que `--slide-scale` acompanha o `transform`; um seletor entra quando houver barra onde colocá-lo |
| 23 | Área de trabalho em `ink-900` **e** moldura de 1px `ink-700` no quadro externo, fora do `transform` | Só a inversão de superfície, sem borda, como a §2.2 previa; ou só a borda, com a área no mesmo `ink-950` do slide | A primeira versão da 1C pôs slide e área no mesmo tom e separou por hairline `ink-800`: reprovou olhando, não dava para saber onde termina a página. A inversão da §2.2 do design system resolve o grosso, e a borda dá o contorno que faltava — em `ink-700`, porque o 800 cai entre os dois tons e some. Na raiz do slide a borda encolheria com a escala e viajaria dentro do nó capturado, contra a §9; no quadro externo ela vale 1px em qualquer `k` e a exportação nunca a vê |
| 24 | Store como factory mais singleton, em `src/editor/store.ts` | Provider de contexto com o store criado no componente, como o guia do zustand para Next prescreve | O provider se paga quando há dois decks vivos ao mesmo tempo, que é a tela de listagem da Etapa 4. Até lá ele é cerimônia: a factory já dá ao teste um store isolado por deck de fixture, sem reset global, e o singleton dá à aplicação o único deck que ela tem. O preço é que o deck é criado duas vezes, uma na pré-renderização estática e outra no cliente, com ids diferentes: manter esses ids fora do DOM deixa de ser consequência do desenho e passa a ser condição que o código sustenta — ver a armadilha na §13 |
| 25 | Grade de fundo é opção do slide, com o `background` do template como padrão | Grade fixa por template, como a §4.3 do design system definia | Quem edita ganha a escolha slide a slide, e o custo é a consistência automática que a regra anterior dava de graça: nada impede uma capa com grade e outra sem no mesmo carrossel. O descritor continua dizendo com o que o slide nasce, e a §4.3 passa a chamar de recomendação o que era proibição — grade em slide de código continua má ideia, só não é mais impossível. O `SlideView` é o único ponto que lê a opção; o `SlideFrame` continua recebendo `grid` ou `plain` e não sabe de onde veio |
| 26 | `Frame` carrega o bitmap como **PNG em data URL** | Devolver o `HTMLCanvasElement`, ou um `Blob` | O jsPDF consome data URL direto em `addImage`, e é a forma que um teste inspeciona sem canvas — `happy-dom` não tem nenhum. O canvas deixaria o alvo escolher a codificação sem recapturar, que é o que o plano de contingência da §13 pediria se um deck com fotos estourasse o tamanho; o preço seria um `Frame` que deixa de ser dado e passa a ser objeto de DOM vivo, com o alvo dependendo do navegador. O `Blob` economiza a base64, mas o jsPDF a exigiria de volta a cada página |
| 27 | Um `createRegistry` genérico em `src/lib/registry.ts`, com dois usuários | Escrever o registry de alvos à mão, espelhando o de templates | A §10 já dizia "o registry é idêntico ao dos templates", e duas cópias da mesma lógica divergiriam na primeira correção — a regra de HMR, que existe para o `next dev` não cair a cada edição, vale para alvo tanto quanto para template. O genérico pede só o `id` e um rótulo para a mensagem de erro; cada registry continua sendo um módulo próprio, com o próprio tipo, e ninguém fora deles conhece a factory |
| 28 | Grade de fundo desenhada em `<svg>`, com módulo tirado do formato e moldura fechada nos quatro lados | Manter os dois `linear-gradient` ladrilhados da §4.3; ou trocá-los por `repeating-linear-gradient`; ou usar `<pattern>` de SVG | Não é preferência: o gradiente **não sobrevive à rasterização**, e as quatro alternativas foram medidas num PDF antes da escolha — as duas de gradiente saem chapadas e o `<pattern>` sai com metade da espessura, porque o traço na borda do ladrilho é recortado. Linha de verdade em SVG atravessa intacta, como a constelação e o chevron já atravessavam. O módulo passou de 60px fixos para o divisor comum de largura e altura mais próximo de 54px — 54 em 1080×1350, 20 por 25 quadrados inteiros —, o que fecha a grade em qualquer formato e resolve de uma vez a assimetria que o ladrilho tinha: linha colada no topo e na esquerda, nenhuma na direita, e a faixa de baixo cortada ao meio |
| 29 | O `final-cta` leva o rodapé completo — glyph, handle e constelação toda acesa | Espelhar a capa: só constelação, sem logo nem handle, como a §10.5 do design system dizia | Os documentos se contradiziam: a §10.5 tirava o rodapé da capa **e do final**, e a tabela de regiões da §11.3 dos templates dava ao final "Logo, handle, constelação toda acesa". Vence a §11.3, que é a mais específica — nomeia as três peças na faixa deste template — e que o `CLAUDE.md` faz autoridade sobre comportamento de template. O motivo de produto é que o último slide é onde o handle mais importa: quem chegou até o fim é quem vai seguir. A objeção real é que o bloco de CTA já carrega um destino escrito e o handle competiria com ele, que foi o que descartou o wordmark no experimento 1; a diferença é que o CTA fica no miolo, em 36px mono `azure-400`, e o handle no rodapé em 28px `ink-400` — hierarquias distintas, não duas vozes no mesmo canto. A §10.5 foi corrigida no mesmo commit |
| 30 | `addSlide` e `removeSlide` antecipados da Etapa 4 para a Etapa 2 | Deixar os dois na Etapa 4 e fechar a Etapa 2 editando um deck semente já com 8 a 12 slides; ou antecipar só o `addSlide` | O "pronto quando" da Etapa 2 é um carrossel de 8 a 12 slides composto com os três templates, e o store da 1D só tem `selectSlide`, `setField` e `setOption`: não existe caminho para acrescentar um slide sequer, então o critério da própria etapa é inalcançável sem isso. Um deck semente grande faria o "compor" da etapa virar ficção — o número de slides ficaria congelado até a Etapa 4. E `addSlide` sozinho seria pior que os dois juntos: um clique errado deixaria um slide órfão sem saída, justo na etapa em que se compõe pela primeira vez. Arraste, duplicar e undo continuam na Etapa 4, que é onde a lista lateral vira ferramenta de verdade |
| 31 | A reidratação do `persist` valida e descarta **slide a slide** | Reiniciar do deck semente a qualquer falha; ou confiar no que está no localStorage, sem validação | O que está salvo deixa de bater com o código quando um template some, muda de chave ou de tipo — e num projeto de um usuário só o autor dessa divergência é sempre o commit anterior. Tudo-ou-nada apaga o carrossel inteiro por causa de um slide, que é a perda de trabalho no pior momento possível; confiar sem validar deixa o `get()` do registry lançar dentro do render e abre a ferramenta em tela branca, com o erro só no console. Validar a forma do deck e derrubar apenas os slides que não passam preserva o resto e nunca apaga a tela. O zod já está instalado e cada template já carrega o próprio schema, então o custo é da ordem de vinte linhas |
| 32 | O guard de transbordo continua na Etapa 3 | Antecipar um guard mínimo para a Etapa 2, que é quando o primeiro carrossel real é composto | Foi considerado porque a Etapa 2 termina compondo 8 a 12 slides de conteúdo de verdade, que é exatamente quando texto longo transborda. Fica onde está: na Etapa 2 o aviso é o contador de caractere, que já existe e já fica âmbar ao passar do limite, mais o próprio canvas — quem compõe está olhando cada slide enquanto digita. Antecipar traria `ResizeObserver` medindo **dentro** do slide, que é o laço de medição da §13, e essa é a tarefa mais delicada da Etapa 3: não é trabalho para fazer de passagem no fim de outra etapa |
| 33 | O parser não conhece limite de palavra: marcador vale em qualquer posição | Exigir espaço, início ou pontuação antes do abridor e depois do fechador, como o `*` do CommonMark | É uma regra a menos para lembrar na hora de digitar e uma exceção a menos no tokenizer, que passa a ter uma só pergunta por posição: abriu e fechou com conteúdo? Casos legítimos em português dependem disso — `micro**serviços**`, plural colado ao fechador, sufixo depois de `[[destaque]]` — e a regra do CommonMark os recusaria sem nada na tela explicando por quê. A contrapartida é `2*3*4` virar ênfase sem que ninguém tenha pedido; é aceitável porque o canvas mostra o resultado a cada tecla, e porque um asterisco solto entre dígitos é raro em texto de carrossel |
| 34 | O peso de `**forte**` é `max(600, --slide-font-weight)`, lido por herança da utility de escala | Aplicar os 600 fixos que a §10.2 escreve; ou usar `font-weight: bolder`; ou o template informar o peso base ao `<Inline>` | Os documentos se contradiziam: a §10.2 dá 600 ao marcador e a §11.1 dos templates diz que ele "não tem efeito visível" no título em Oxanium 700 — com 600 fixo o trecho marcado sairia **mais leve** que a frase, que é o oposto do que o marcador significa, e a marcação passaria a depender do template em que o texto caiu. `bolder` não resolve: é relativo por degrau, levaria a Sora 400 a 700 em vez de 600 e a Oxanium 700 a 900, fora do eixo declarado da família. Passar o peso por prop faria o `<Inline>` conhecer template, quebrando a §5 — o parser e o renderer de marcação não sabem o que existe adiante. Herança de custom property resolve sem nenhum dos três preços: cada `@utility slide-*` publica o próprio peso, o marcador lê com `max()`, e as duas seções passam a ser verdadeiras ao mesmo tempo |
| 35 | As seis partes da faixa do rodapé são opção do slide, com o descritor do template dando o padrão | Manter a §10.5 do design system como regra — identidade em todo slide menos a capa, chevron só na capa, régua inexistente | É a forma da decisão 25, que já tinha feito esse caminho com a grade de fundo, e o argumento é o mesmo: o documento continua dizendo qual é a boa escolha, e passa a dizê-lo como padrão em vez de como trava. O que a conferência da 2B cobrou foi controle — poder assinar a capa, poder tirar a assinatura do miolo — e uma regra por template não tem como entregar isso. Logo e handle ficaram em **duas** chaves e não numa só porque glyph sem handle é marca d'água legítima e handle sem glyph é assinatura em texto; o par único descartaria as duas. A placa atrás da logo nasce ligada porque foi ela que venceu o experimento 5: ligar a logo tem de entregar a peça na versão escolhida, não na versão solta que o experimento descartou. A constelação é a única sem opção — um rodapé sem progresso não é um rodapé mais enxuto, é outra coisa |
| 36 | O chevron está disponível em todo template e é suprimido no último slide **por posição** | Mantê-lo exclusivo da capa; ou suprimi-lo no template `final-cta`, que é o fechamento por definição | "Último slide" é onde o deck acaba, não um layout: um carrossel pode terminar em `text-bullets` sem nunca registrar um `final-cta`, e amarrar a regra ao template deixaria a seta convidando para um próximo que não existe. O `Footer` já recebe `index` e `total` para desenhar a constelação, então a supressão sai de graça e é escrita uma vez só, em vez de repetida em dez templates. O preço é um toggle que fica inerte no último slide; é aceitável porque o efeito é visível no canvas a cada clique, e porque o inverso — esconder o controle ali — faria o formulário mudar de forma conforme a posição do slide |
| 37 | A `MaiahubGlyph` engrossou: traço 1.6 → **2.25** em opacidade cheia, estrela 3.4 → **4.0** | Não tocar na peça de marca e compensar por fora — tamanho maior, tinta mais clara, ou a placa sozinha resolvendo o contraste | Não é gosto, é medida. O traço da glyph é dado num `viewBox` de 32, então exibida a 32px cada unidade vale 1px: ela desenhava **1,6px**. O chevron ao lado, num `viewBox` de 24 exibido a 40px, desenha 3,75px; a linha da grade, 2px. Com o traço ainda a 55% de opacidade, a tinta resultante sobre `ink-950` era ≈`#858993` — mais escura que o `ink-400` do handle ao lado dela. A peça era a linha mais fina e mais apagada do slide inteiro, que é o oposto do que ela existe para fazer: a glyph quebra proporção de propósito para não sumir em tamanho pequeno, e a correção não ia longe o bastante para os 32px em que o asterism a usa. Compensar por fora trataria o sintoma e deixaria o desenho errado para todo uso futuro. A 16px, que é a faixa que a documentação da marca dá à peça, 2.25 rende 1,1px efetivo — ela continua fazendo lá o que fazia |
| 38 | A régua do rodapé fica em y 1174, em `ink-600`, e toda hairline do canvas usa a compensação de escala | Deixá-la em y 1190 e só trocar a cor; ou tingi-la de âmbar; ou aceitar `height: 1px` como as outras bordas do editor | Foi relatada como "some do PDF quando a grade está ligada", e a medida a 72 dpi mostrou outra coisa: a grade desenha horizontais em `54k + 1` com traço de 2px, o que em k = 22 ocupa 1189–1190, e a régua estava em 1190 no mesmo `ink-800`. Não sumia — era pintada dentro do traço da grade, na cor idêntica. Só trocar a cor deixaria uma listra de outro tom dentro de uma linha de 2px, que parece defeito de impressão; por isso mudam a posição **e** a cor. O âmbar foi comparado e descartado: a §2.5 do design system o reserva a pontuação, no máximo um uso por slide, e uma linha de 920px atravessando o canvas não é pontuação. A mesma medida expôs o segundo defeito: `height: 1px` a k = 0,28 dá 0,28 pixel de dispositivo e o navegador não pinta, então a régua aparecia no PDF — que rasteriza a k = 1 — e faltava no preview. É a decisão 15 outra vez, e ela deixou de ser um detalhe da grade para virar a utility `slide-hairline`, que vale para qualquer linha fina dentro do slide |
| 39 | O texto do CTA do `final-cta` usa `slide-code`, a 34px | Criar um nono degrau na escala carrossel, `slide-cta` a 36px, como a §11.3 dos templates escrevia; ou escrever os 36px direto no template | Os documentos se contradiziam outra vez, e desta vez a mais específica perde: a §11.3 dava "36px JetBrains Mono" ao texto do CTA e a §3.3 do design system — que é quem decide escala tipográfica — não tem esse degrau, porque o mono dela é `slide-code`, a 34px. A decisão 19 já tinha estabelecido que o template escreve o token e nunca recompõe família, tamanho, altura e peso; escrever 36px no `index.tsx` seria exatamente a divergência que ela existe para impedir, e criar o degrau seria pior, porque a §1 pede restrição sobre invenção e o nono degrau serviria a um uso só. Os 2px de diferença são invisíveis em mono a essa escala, e a hierarquia que a decisão 29 protege continua intacta: 34px `azure-400` no miolo contra 28px `ink-400` no rodapé são vozes distintas do mesmo jeito. A §11.3 passou a nomear o token em vez do número |
| 40 | A constelação desenha **um ponto por slide em qualquer contagem** — o recorte acima de 10 slides da §10.5 do design system foi revogado | As três leituras do recorte que o experimento 2 levantou: os cinco primeiros pontos, uma janela deslizante de cinco em torno do atual, ou cinco posições amostradas pelo deck — todas com o contador `03 / 12` ao lado | O documento pedia "5 pontos mais um contador" sem dizer quais cinco, e a pergunta que parecia de detalhe era a regra inteira: as três leituras foram montadas numa rota descartável com um deck de 12 slides e nenhuma passou. **Os cinco primeiros** congelam no slide 5 e ficam idênticos pelos oito seguintes. **A janela deslizante** é pior do que a previsão do `TODO.md`: não é só que o último aceso não se move — do slide 4 ao 10 a faixa inteira mostra `●●●○○`, sete slides sem informação nenhuma, e só as duas pontas dizem alguma coisa. **A amostragem espalhada** é a única que se mexe de ponta a ponta, mas avança em quatro degraus (slides 4, 7, 9 e 12) com espaçamento irregular, e o que ela entrega em troca de perder oito pontos é um número que ninguém pediu. O recorte existia para resolver um problema de espaço que **não se mediu antes de escrever a regra**: a faixa comporta 26 pontos antes de a constelação encostar no handle, e o teto da Etapa 2 é 12. É a §1 do design system aplicada à própria §10.5 — restrição sobre invenção —, e o custo de manter a regra simples é um limite que nenhum carrossel real alcança |
| 41 | Ao reidratar, o slide salvo é lido **por cima dos defaults do template** antes de ser validado | Manter a validação crua da decisão 31, descartando todo slide a que falte uma chave; ou escrever uma tabela de migração por versão do descritor | Um slide salvo deixa de bater com o código por dois motivos que a decisão 31 tratava como um só. Falta uma chave? O commit anterior acrescentou um campo ao descritor e o que está salvo é de antes dele — dado velho, não dado torto. Uma chave tem valor de outra forma? Aí sim é dado que o template não sabe desenhar. Sem a distinção, **acrescentar uma opção compartilhada apaga o carrossel de quem já tinha um salvo**: os dez slides reprovam de uma vez e o editor abre na semente, que é exatamente a perda de trabalho que a decisão 31 existe para impedir, chegando pela porta de trás. O `showHeader` da 2F foi o primeiro caso real, e o custo do degrau são dois espalhamentos de objeto antes do `safeParse`. Uma tabela de migração por versão é o que a decisão 31 já tinha descartado, e continua descartada pelo mesmo motivo: o schema por template já sabe o que o template quer, e os defaults por template já sabem com o que ele nasce. Guardar o **resultado do parse** em vez do slide cru fecha o outro lado — chave que o template perdeu sai do dado em vez de ficar pendurada até o import/export da Etapa 4 |
| 42 | O **cabeçalho é faixa compartilhada** de todo template, ligável por `showHeader`, e o `kicker` virou campo compartilhado | Manter o kicker como campo do `cover-statement`; ou dar a cada template um campo de etiqueta próprio, com chave própria | A §10.5 do design system prendia o kicker à capa, e o rodapé já tinha feito o caminho contrário na 2B: virou peça compartilhada com seis opções, e o que era regra virou padrão. O topo do slide ficou como a assimetria óbvia da arquitetura — uma faixa desenhada à mão dentro de um template, e nenhum outro slide podia ter etiqueta superior. Compartilhar tem dois retornos além do óbvio: a **migração passa a preservar o kicker** de graça, pela interseção de chaves da decisão 13, e a segunda peça que a faixa ganhar chega num lugar em vez de dez. O par com `showFooter` fecha o desenho: as duas faixas do slide são opção, as peças dentro delas são sub-opção, e a constelação continua sem opção própria porque quem a tira é quem tira a faixa toda |
| 43 | Ligar o cabeçalho **empurra** o conteúdo do `text-bullets`, em vez de a faixa ser reservada sempre | Reservar 80–148 em todo template, com o conteúdo começando em 212 com a faixa ligada ou não — a regra "ligar uma peça não move as outras" que o rodapé segue desde a 2B | Reservar sempre custaria **132px do topo do template mais usado do sistema**, permanentemente, por uma faixa que ali nasce desligada: a região de itens cairia de 866 para 734px em todo slide de tópicos do carrossel, inclusive nos que nunca vão ter kicker. Empurrar custa um ternário numa string de classe, do mesmo formato que o `anchor` já usa no mesmo componente. A regra do rodapé não é contrariada onde foi escrita: ela fala das peças **dentro** de uma faixa, e vale porque o rodapé nunca disputou espaço com nada — mover o que está embaixo dele seria mover o nada. A capa e o `final-cta` não pagam nada de qualquer forma, porque os dois já têm a faixa 80–148 livre |
| 44 | A seção do inspector é **metadado de desenho no descritor**, e uma delas mistura `field` e `option` | Duas seções fixas no componente, com o kicker aparecendo em "Conteúdo" e o interruptor em "Apresentação"; ou mover o texto do kicker para `options`, unificando o saco | O painel precisava de "Cabeçalho" e "Rodapé" como categorias que se ligam e se encolhem, e o cabeçalho é uma faixa com **um texto e um interruptor** — separá-los em duas seções distantes faria ligar a coisa numa e escrever nela em outra. A saída é a seção ser desenho e não dado: `fields` e `options` continuam sendo dois sacos separados no modelo, a §6 continua inteira, e o que a seção diz é onde o controle **aparece**. Mover o kicker para `options` resolveria o desenho e quebraria o modelo: opção reseta na troca de layout, e o texto digitado seria perdido justamente onde a decisão 13 acabou de garantir que sobrevive. Conteúdo e Apresentação viraram seções como as outras para que a **ordem** também fosse declarativa — sem isso, a posição do Cabeçalho acima do conteúdo seria uma regra escrita no componente em vez de no descritor. O interruptor continua declarado em `options`, e não na seção, para que `options` siga sendo a lista completa das chaves de opção, que é o invariante que os testes de paridade de cada template conferem |
| 45 | A biblioteca inteira foi especificada **como conjunto**, numa sub-etapa de documento, e o vocabulário canônico fechou sem nenhuma chave nova | Escrever cada §11.x no commit que implementa o template, que é como as três primeiras nasceram; ou abrir o vocabulário a uma chave por papel novo, incluindo o par antes/depois e uma chave própria de anotação para o `code-annotated` | A migração é uma **interseção de chave e de forma**, então a biblioteca se decide junta ou não se decide: uma chave escolhida no sétimo template obriga a voltar no terceiro, e o custo dessa volta é reescrever descritor, schema, defaults e teste de paridade de um template já entregue. Especificados os dez de uma vez, três coisas que não apareciam olhando um por um ficaram óbvias. A explicação do `code-annotated` é `body`, o mesmo texto corrido do `context` — chave própria daria ao par a incompatibilidade de graça, e o papel é o mesmo. `kicker` e `heading` passam a ser declarados pelos dez, não só pelos que os desenham: são as duas chaves que atravessam qualquer troca de layout, e é o argumento da decisão 42 aplicado ao campo mais digitado do sistema, ao preço de uma região que some quando o valor está vazio — o que o `lead` do `final-cta` já fazia. E o par antes/depois do `compare-2col` fica **próprio do template**: vocabulário com um usuário só reserva à biblioteca inteira um papel que um layout tem, e a §6 passou a registrar a chave própria numa tabela à parte em vez de promovê-la |
| 46 | **Imagem pode sangrar até a borda do canvas; conteúdo, não.** O padding de 80px da §11.0 dos templates passa a valer para conteúdo, e a imagem do `split-vertical` para em y 1174 | Manter os 80px nos quatro lados para tudo, com a imagem contida e raio de 12px como o bloco de código; ou deixar a imagem sangrar nos quatro lados, com legenda e rodapé por cima dela | Contida, a imagem vira figura ilustrando um slide de texto, e os dois templates de mídia perdem a razão de existir separados do `context`. Sangrar nos quatro lados é o oposto: põe texto sobre foto arbitrária, que só se sustenta com overlay escuro — a única exceção de gradiente que a §2.5 do design system permite, e justamente a que a decisão 28 mostrou não sobreviver à rasterização. O meio-termo é a regra acima, e o limite dela não é estético: **o rodapé precisa dos 920px**. Com a imagem do `split-vertical` descendo até a base, o rodapé caberia só na coluna de texto de 480px, e ali a placa da logo mais o handle mais doze pontos de constelação passam de 500px — não cabe, e num deck maior a constelação ainda cresce. A imagem para em y 1174, que é a linha da régua da §10.5, e a faixa de baixo continua inteira |
| 47 | O guard de transbordo mede **dois nós** — a faixa, que tem altura de spec, e o bloco de conteúdo dentro dela — e o resultado **não vai para o store** | Comparar `scrollHeight` com `clientHeight` no mesmo elemento, que é como a §9 descrevia e como o teste óbvio faria; e guardar um mapa de transbordo por slide no store, alimentado por quem estivesse exibindo o slide | Medir um nó só **reprova em silêncio nos templates que ancoram o conteúdo à base**: o que não cabe sobe acima da borda superior, e o que sobe não entra no `scrollHeight` do pai. O `cover-statement` alinha o título à base desde a 1.7 e o `final-cta` faz o mesmo com o bloco de fecho — dois dos três templates existentes, e nada no papel avisava. Comparar a altura do conteúdo com a da faixa funciona nas duas âncoras, e cobra do template só o que ele já tinha: uma faixa com altura escrita e um bloco dentro dela. O `final-cta` ganhou o bloco, que era o único dos três em que os três elementos eram filhos diretos da faixa. Sobre o store: `scrollHeight` e `clientHeight` são medidas de layout e **não enxergam o `transform: scale()`**, então a mesma leitura vale a 1:1 na exportação, a k ≈ 0,28 no canvas e a k = 0,2 na miniatura — e como a lista lateral desenha todos os slides pelo mesmo `SlideView`, cada slide desenhado mede a si mesmo. O critério da 3.5, "a lista mostra o slide inválido sem que o canvas esteja nele", sai de graça, sem estado global para manter em dia, sem sincronizar dois caminhos de medida e sem um mapa que precisaria ser limpo ao remover slide |
| 48 | A marca de transbordo é a **borda do quadro externo** do `SlideFrame`, mais um ícone na linha da lista | Marcar dentro do slide — uma borda na região que estourou, ou uma tarja no canvas; ou deixar só a borda, sem ícone | A §8 do design system dá borda `crown-400` ao estado inválido, e o único lugar onde ela pode morar é a camada de fora: dentro do `transform` ela encolheria com a escala e — pior — entraria no nó que a exportação captura, e **o PDF sairia com borda vermelha**. É a mesma razão pela qual a borda de 1px do preview já morava lá desde a decisão 23. Há um segundo motivo, e ele é do guard: a borda do quadro externo já existe em 1px nos dois estados, então marcar **não muda medida nenhuma** — uma marca que alterasse o layout medido faria medir mudar o que se mede, e o guard oscilaria. O ícone na linha da lista existe porque 1px numa miniatura de 216px é discreto demais para se ler varrendo a coluna: a borda diz qual slide, o ícone diz que há um |
| 49 | Os seis componentes shadcn **cedem ao documento** em foco, raio, hover, ativo, desabilitado e inválido — experimento 3 | Corrigir a §5 e a §8 para descrever o que o preset `nova` instalou, que é coerente consigo mesmo; ou ficar no meio, aceitando a espessura do preset sem o offset | Montadas as duas telas lado a lado, o preset perdeu em cada linha por um motivo diferente, e nenhum deles é gosto. O anel de 3px a 50% **some sobre `ink-950`** e, colado no controle, confunde-se com a borda que ele deveria destacar; o de 2px cheio com offset lê como anel. O raio de 8px em controle e 12px em cartão apaga a diferença entre os dois — e o 12px nem era escolha, era o default do Tailwind entrando porque `--radius-xl` não é declarado neste tema. `translate-y-px` move o botão para baixo, que é a direção de afundar, enquanto `scale(0.98)` é o mesmo gesto sem deslocar nada em volta. E `opacity-50` apaga o controle inteiro, inclusive a borda, quando o que a §8 quer apagar é o **rótulo** — a superfície continua sendo onde o controle está. A auditoria completa, que a tarefa 3.6 exigia, encontrou três divergências além das duas que a 1D tinha registrado, todas da mesma origem: o anel translúcido do `aria-invalid`, a `shadow-md` do popup do `select` — que contraria a §1, onde não há sombra projetada — e as duplicatas `dark:` de valores que já são os únicos que valem. A lista virou tabela de conferência na §9 do design system, porque o próximo componente instalado vai trazer as mesmas |
| 50 | O reset do `preflight` é **reinjetado no clone** pelo `onCloneNode` do `rasterize`, como folha de seletor universal | Corrigir template a template, tirando o `justify-end` do `final-cta` e ajustando o que mais aparecesse; ou declarar `m-0` em cada elemento dos templates; ou copiar mais propriedades no clone com `includeStyleProperties` | O defeito chegou como "o `final-cta` transborda no rodapé", e a tentação era corrigir o `final-cta`. Medindo o bitmap com e sem o reset, **quatro dos cinco templates mudavam de desenho** — a capa subia o título 96px, o `context` descia o corpo 40, o `text-bullets` descia o título, e só o `text-impact` passava intacto porque centralizar cancela margem simétrica. Corrigir no template seria remendar o sintoma num dos quatro e deixar os outros três errados em silêncio, além de comprometer os cinco templates que faltam com uma regra que ninguém saberia explicar. `m-0` não resolve: `margin: 0px` é o valor inicial, e é justamente o que a clonagem não emite. `includeStyleProperties` inverte o problema — vira uma lista de propriedades para manter em dia a cada elemento novo. A folha injetada é uma linha, vale para os dez templates de uma vez e tem a especificidade certa: estilo em linha vence, então o `padding` que um bloco declara de verdade continua valendo e some só o que ninguém declarou |
