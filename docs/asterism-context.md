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

type Deck = {
  version: 1
  id: string
  title: string
  format: { w: 1080; h: 1350 }   // dado, não constante — ver §12
  meta: {
    handle: string               // "@rafael", vai no rodapé
    pillar: "api" | "forge" | "log"
  }
  slides: Slide[]
  assets: Record<ImageId, string>  // base64, apenas no arquivo exportado
}

type Slide = {
  id: SlideId
  template: TemplateId
  fields: Record<string, FieldValue>    // conteúdo
  options: Record<string, OptionValue>  // apresentação
}
```

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

O título de um slide é **sempre** `heading`, em qualquer template. A tentação de chamá-lo
de `titulo` na capa e de `heading` no miolo custa exatamente a migração que esta tabela
existe para garantir.

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

## 8. Templates

Cada template é uma pasta autocontida:

```
src/templates/cover-statement/
  index.tsx     componente; recebe props tipadas, renderiza 1080×1350
  meta.ts       { id, label, group, background, defaults }
  fields.ts     descritores de fields e options + schema zod
```

```ts
type TemplateDef<F = any, O = any> = {
  id: TemplateId
  label: string
  group: "cover" | "content" | "code" | "media" | "final"
  background: "plain" | "grid"
  fields: Field[]
  options: Field[]
  schema: ZodType<{ fields: F; options: O }>
  defaults: { fields: F; options: O }
  Component: React.FC<{ fields: F; options: O; deck: DeckMeta; index: number; total: number }>
}
```

O `Field` é um descritor declarativo — não uma derivação automática do zod:

```ts
type Field =
  | { key: string; type: "text";     label: string; max?: number; placeholder?: string; md?: boolean }
  | { key: string; type: "textarea"; label: string; max?: number; md?: boolean; rows?: number }
  | { key: string; type: "list";     label: string; maxItems: number; maxPerItem?: number; md?: boolean }
  | { key: string; type: "image";    label: string; ratio?: string }
  | { key: string; type: "code";     label: string; maxLines: number }
  | { key: string; type: "select";   label: string; options: { value: string; label: string }[] }
  | { key: string; type: "toggle";   label: string }
```

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

### Guard de transbordo

Slide tem altura fixa, então texto longo transborda — é a falha número um deste tipo
de ferramenta. Um `ResizeObserver` no bloco de conteúdo compara `scrollHeight` com
`clientHeight` e marca o slide como inválido no canvas e na lista lateral. O contador
de caracteres por campo vem do `max` do descritor.

Não é polimento opcional. É o que separa uma ferramenta utilizável de um brinquedo.

## 10. Exportação

PDF, PNG e JPG **não são três exportadores**. Compartilham o caminho DOM → bitmap e
divergem apenas na codificação e no empacotamento. Um plugin por formato duplicaria a
rasterização. O corte correto tem dois estágios:

```ts
// estágio 1 — único, compartilhado
type RenderSource = { slide: Slide; node: HTMLElement }
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
produz N, um futuro alvo ZIP produz um. O registry é idêntico ao dos templates.

`RenderSource` carrega o **nó e o slide**, não o bitmap pronto — assim um alvo futuro
pode optar por ler os dados diretamente em vez de rasterizar, mantendo aberta a porta
para saída vetorial.

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

### Três armadilhas conhecidas

**OKLCH quebra a serialização.** As bibliotecas de captura passam por
`foreignObject`/canvas e o suporte a `oklch()` é irregular. Os tokens da subárvore
`.slide-canvas` devem ser declarados em **hex sRGB** (conversão já existente no
documento do Observatório). OKLCH permanece no chrome do editor.

**Fontes precisam ser same-origin.** Oxanium, Sora e JetBrains Mono carregadas como
arquivos locais (`next/font/local`). Fonte servida pelo CDN do Google não é inlinada
na captura e o arquivo exportado sai em Arial.

**Tamanho do arquivo.** PNG 2× sobre fundo escuro chapado comprime bem; dez slides
devem ficar bem abaixo de 3 MB. Se um deck com fotos estourar, o alvo PDF cai para
JPEG 0.92 apenas nos slides com imagem.

**Tailwind faz tree-shaking de token.** Variável declarada em `@theme` que nenhuma classe
referencia não chega ao CSS final, e `var(--color-ink-700)` num estilo inline resolve
para nada — silenciosamente, sem erro de build. Por isso as rampas de cor e o bloco da
superfície carrossel são declarados como `@theme static`. Só o mapeamento semântico do
shadcn, em `@theme inline`, pode ser podado sem prejuízo.

## 14. Interface

Três colunas, sem invenção:

- **Esquerda** — lista de slides com miniatura, índice, rótulo do template, marca de
  transbordo, reordenação por arraste, duplicar e remover.
- **Centro** — canvas com o slide ativo em escala, seletor de zoom, indicador de validade.
- **Direita** — inspector: seletor de layout no topo, campos de conteúdo, opções de
  apresentação abaixo, contadores de caractere.
- **Topo** — nome do deck, ações de deck (novo, importar, exportar JSON) e o botão de
  exportação com escolha de alvo.

## 15. Roadmap

| Fase | Escopo | Estimativa |
|---|---|---|
| **1 — Fatia vertical** | Tipos, registry, parser inline, canvas escalado, inspector, **3 templates** (`cover-statement`, `text-bullets`, `final-cta`), alvo PDF | 6–8 h |
| **2 — Biblioteca** | Os outros 7 templates, shiki com tema próprio, guard de transbordo | 4–6 h |
| **3 — Editor** | dnd-kit, duplicar/remover, undo/redo, múltiplos decks, import/export JSON, imagens no IndexedDB | 4–5 h |
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
| 17 | Variantes do shadcn adaptadas à §2.4 | Aceitar o preset como vem | Um padrão de cor só, no editor e no carrossel |
| 18 | `MaiahubGlyph` a 32px no rodapé do slide | `MaiahubMark`, que está dentro da própria faixa de tamanho; ou a assinatura | Decidido por comparação visual das três peças só-símbolo. A correção ótica da glyph é o que a mantém legível sobre `ink-950` num slide que depois é reduzido; a `Mark` some ali. Assinatura e wordmark trazem "maiahub" escrito e competiriam com o `@handle` no mesmo canto |
