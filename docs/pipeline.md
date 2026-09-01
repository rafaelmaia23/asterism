# asterism — pipeline

Decide **o caminho do dado até o arquivo**: como o deck vira DOM e como o DOM vira
PDF.

---

## 1. Renderização

O slide renderiza sempre em **1080×1350 px reais**. O preview aplica
`transform: scale(k)` com `transform-origin: top left` num wrapper de tamanho fixo.

Consequências: nenhuma media query, nenhuma matemática responsiva, e o preview é
literalmente o mesmo DOM que será exportado.

### A região de conteúdo é uma pilha vertical

O que sobra entre o cabeçalho e o rodapé é **uma região com pilha vertical e regras de
espaçamento**, e cada elemento ocupa o que precisa. Não há faixa absoluta por composição,
porque ninguém sabe de antemão quantos blocos existem — e era exatamente isso que as
tabelas de oito geometrias do `code-annotated` e do `image-caption` estavam calculando à
mão.

**Essa é a mudança arquitetural da Etapa 3½**, maior que a lista de elementos em si. Ela
tem três consequências diretas:

- **A imagem é o elemento elástico.** Todo elemento de texto tem a altura do que contém; a
  imagem toma o que os outros deixarem, com piso de 200px. É o que substitui as oito
  geometrias escritas à mão.
- **A âncora vertical passa a ser do slide.** `top`, `center` e `bottom` no layout, em vez
  de `items-end` escrito dentro de um template.
- **O guard vira o mecanismo central de validação**, e não mais uma rede de segurança: é a
  única coisa impedindo o autor de empilhar oito elementos num slide.

Os números da pilha — topo em 80 ou 212, fim em 1160, gaps de 64, 48 e 24px — estão na
§11.0 do documento de elementos, que é quem os decide.

### O wrapper declara a escala

O wrapper também declara `--slide-scale` com o mesmo `k` que passou ao `transform`.
Detalhes que dependem de espessura de traço — o grid de fundo, a régua do rodapé, o
`divider` — compensam a partir dessa variável, senão desaparecem no preview. A exportação
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
no canvas e na lista lateral.

**São dois nós, não um.** O container tem altura de faixa — a região da pilha, ou a altura
do bloco `columns` — e o conteúdo dentro dele cresce; o guard compara a altura do
**conteúdo** com a do **container**. Comparar `scrollHeight` com `clientHeight` no mesmo
elemento, que é o teste óbvio, reprova em silêncio quando o conteúdo está ancorado à base:
o que estoura sobe acima da borda superior, e o que sobe não entra no `scrollHeight` do
pai. A âncora `bottom` é exatamente esse caso.

**E o guard é recursivo.** Com aninhamento, a medida vale em cada nível:

- a região de conteúdo do slide é um container;
- **cada coluna é um container independente**;
- a altura de um `columns` é o **máximo** das duas colunas;
- o slide reprova se **qualquer** container estourar;
- o aviso **nomeia o elemento** que estourou — o primeiro cujo `offsetTop + offsetHeight`
  passa do `clientHeight` do container —, senão o autor caça num slide de seis.

É a parte mais chata da virada e a que mais merece teste escrito antes. Decisão 65, que
estende a 47.

As duas propriedades são medidas de layout e **não enxergam o `transform: scale()`** do
`SlideFrame` — a mesma leitura vale a 1:1 no palco de exportação, a k ≈ 0,28 no canvas e a
k = 0,2 na miniatura da lista, e é por isso que cada `SlideView` mede a si mesmo em vez de
haver estado de transbordo no store. `getBoundingClientRect` não serve aqui: essa enxerga
a escala.

Duas condições que o guard impõe a quem o usa, as duas da mesma família da armadilha da
§13. O container medido **não pode ser dimensionado pelo conteúdo** — `min-h` no lugar de
`h` realimenta a medida. E a marca que o resultado desenha **não pode mexer no layout
medido**, senão medir muda o que se mede: por isso ela é a borda do quadro externo do
`SlideFrame`, que já tem 1px nos dois estados, vive fora do `transform` e fica fora do nó
que a exportação captura — o PDF não sai com borda vermelha.

A medida se repete em `document.fonts.ready`: antes de Oxanium e Sora carregarem, o texto é
medido com a fonte de fallback e a altura é outra. É a mesma espera que o palco de
exportação da §10 já faz, pelo mesmo motivo.

## 2. Exportação

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

**As imagens têm as duas esperas, e elas cercam a montagem.** Antes de montar, o palco
pré-carrega os `ImageId` do deck para o cache da §11: um `<img>` sem URL no primeiro quadro
não é um `<img>` vazio, é o estado "Sem imagem" que o template desenha de propósito, e é ele
que iria para o bitmap. Depois de montar, e ao lado do `document.fonts.ready`, ele espera o
`decode()` de cada `<img>` — `complete` mentiria num `blob:` recém-atribuído, e capturar
antes do bitmap pronto é a armadilha das fontes com outro nome. Uma imagem que falha em
decodificar não derruba a exportação: o slide sai com o que houver, pelo mesmo critério da
decisão 31.

Quais campos são imagem sai dos **descritores**, e nunca de um `"image"` escrito no palco:
ele não conhece template nenhum, e é o registry quem sabe. É também por isso que a função
mora em `src/export/stage.tsx` e não em `src/images` — aquela pasta é folha, e importar o
registry de lá fecharia um ciclo com o `ImageBand` dos templates.

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

