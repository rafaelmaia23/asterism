# maiahub — componentes de logo

Cinco componentes React para o sistema de marca, com Tailwind v4 e os tokens do shadcn.

## No asterism

**O asterism carrega uma das cinco: a `MaiahubGlyph`.** As outras quatro entraram no
bootstrap junto com o sistema de marca e ficaram sem consumidor — o único lugar da
ferramenta que mostra a logo é o rodapé do slide, e lá a peça é a glyph. Saíram na
tarefa 2.4a; a origem delas continua no sistema de marca, e o git guarda o desenho.

A que sobrou vive em `src/components/maiahub/`, com `logo-shared.ts` reduzido à interface
`MaiahubLogoProps`. Dependência única: o helper `cn` do shadcn, em `@/lib/utils`.

Este documento continua descrevendo as cinco: ele é do sistema de marca, não do asterism.
A coluna **No asterism** da tabela abaixo diz o que está no repositório.

### Adaptação ao Observatório

A versão original deste sistema trazia uma rampa própria para o acento, `star-*`, em
OKLCH. Ela **não** é usada aqui, por duas razões:

- `star-400` é `oklch(62.3% 0.149 251.5)` = `#378add`, que cai entre `azure-500` e
  `azure-600`. Seria uma sexta rampa de azul quase idêntica à que o sistema já tem,
  contra o princípio "restrição sobre invenção" da §1 do design system.
- OKLCH dentro do canvas do slide quebra a serialização na rasterização — decisão 11 do
  documento de contexto.

A estrela usa `azure-radiance-400` `#60a5fa`, a mesma cor que o Observatório já dá ao
kicker, aos pontos acesos da constelação de progresso e ao marcador `[[destaque]]`. A
estrela da logo e a constelação do rodapé passam a ser a mesma linguagem visual, que é
justamente o argumento do projeto se chamar *asterism*.

Na prática: os componentes usam `fill-azure-radiance-400` onde o original usava
`fill-star-400`. Nada mais muda.

### A glyph no rodapé do slide, a 32px

O rodapé dos slides usa a `MaiahubGlyph` a 32px, acima da faixa de 16–24px que esta
documentação dá a ela. É desvio consciente, decidido comparando as três peças só-símbolo
lado a lado a 32px sobre `ink-950`.

O motivo é o mesmo que justifica a glyph existir. Ela quebra a proporção de propósito —
traço mais grosso, pontos maiores, vértice central removido — para não sumir em tamanho
pequeno. Acontece que 32px **sobre fundo quase preto, dentro de um slide de 1080px que
depois é reduzido para caber num feed**, é opticamente um tamanho pequeno, mesmo não
sendo pequeno em pixels. A `MaiahubMark`, que a faixa apontaria como correta, é a que
some ali.

A regra da faixa continua valendo para interface comum. Este caso é a exceção, e está
registrada aqui para não parecer descuido.

### O traço engrossado, e por quê

O desenho original saía com `strokeWidth` 1.6 e o traço a 55% de opacidade
(`stroke-current/55`). O experimento 5 mediu o que isso dá **no rodapé do slide**, que é
onde a peça é usada aqui:

| Elemento | Traço efetivo no slide de 1080px | Tinta sobre `ink-950` |
|---|---|---|
| Glyph a 32px, desenho original | **1,6px** | ≈`#858993`, entre `ink-500` e `ink-400` |
| Chevron a 40px | 3,75px | `azure-400` |
| Linha da grade | 2px | `ink-800` |

O traço da glyph é dado em unidades de um `viewBox` de 32, então exibida a 32px cada
unidade vale exatamente 1px; o chevron, num `viewBox` de 24 exibido a 40px, multiplica o
dele por 1,67. O resultado é que a peça desenhava **a linha mais fina e mais apagada do
slide inteiro** — mais escura, inclusive, que o `@handle` em `ink-400` ao lado dela.

Isso é o oposto do que a glyph existe para fazer. Ela quebra a proporção de propósito para
não sumir em tamanho pequeno, e a correção simplesmente não ia longe o bastante para os
32px em que o asterism a usa. Passou a **2.25 em opacidade cheia**, com a estrela de 3.4
para **4.0** — a mesma espessura do chevron em unidades declaradas, escolhida comparando
nove variantes lado a lado sobre `ink-950` e depois dentro de um slide reduzido a 28%.

Nas miniaturas de 16px que a faixa original prevê, 2.25 dá 1,1px efetivo. A peça continua
fazendo o que fazia lá; o que mudou é que agora ela também funciona aqui.

## Componentes

| Componente | Papel | Tamanho mínimo | No asterism |
|---|---|---|---|
| `MaiahubWordmark` | Institucional. Home, open graph, hero. | 200px de largura | não |
| `MaiahubMark` | Versão curta. Ícone, marca d'água. | 24px de altura | não |
| `MaiahubSeal` | Avatar, contextos circulares. | 40px | não |
| `MaiahubGlyph` | Versão simplificada para miniaturas. **No asterism, também o rodapé do slide, a 32px** — ver acima. | 16px | **sim** |
| `MaiahubSignature` | Uso corrido em texto. Rodapé, cabeçalho. | 120px de largura | não |

## Uso

```tsx
import { MaiahubGlyph } from "@/components/maiahub";

<MaiahubGlyph />                                    // herda text-foreground
<MaiahubGlyph className="size-[32px] text-ink-100" />  // o rodapé do slide
<MaiahubGlyph mono />                               // estrela vira currentColor
```

As peças que não estão no repositório se usam do mesmo jeito, trocando o tamanho pelo
mínimo da tabela: `<MaiahubWordmark className="h-14" />`, `<MaiahubSignature bare />`.

## Como a cor funciona

A tinta do desenho é `currentColor`. Os componentes trazem `text-foreground` como padrão e você troca passando qualquer utilitário de `text-*` no `className` — o `cn` garante que a sua classe vence a padrão.

No asterism não existe tema claro, então a tinta é sempre `foreground` `ink-100` sobre
`background` `ink-950`. Nenhuma variante `dark:` é necessária.

A estrela é a única exceção: cor fixa em `fill-azure-radiance-400`, para permanecer constante em qualquer fundo. Se precisar que ela também siga o contexto:

```tsx
<MaiahubMark mono />   // estrela vira currentColor
```

Use `mono` em impressão, PDF, gravação, ou sobre um fundo onde o azul perde contraste. No
rodapé do slide ele fica desligado de propósito: a estrela em `azure-400` é a mesma cor
dos pontos acesos da constelação, do outro lado da mesma faixa.

## Escala

Os componentes não têm `width` e `height` — só `viewBox`. Controle o tamanho com `h-*` e `w-auto` (ou `size-*` no selo, que é quadrado). Se você adicionar os atributos de volta, eles vão brigar com as classes.

O `MaiahubGlyph` existe porque redução linear não funciona em tamanhos pequenos: a 16px, os pontos do `MaiahubMark` ficariam com menos de 1px de raio e sumiriam. O glyph quebra a proporção de propósito — traço mais grosso, pontos maiores, vértice central removido. Prática comum em ótica de logo, e é a mesma lógica do favicon.

## Notas de implementação

**O wordmark usa arrays.** São 13 traços e 35 pontos; escritos literalmente o arquivo ficaria ilegível. A geometria mora ao lado do componente, e no asterism saiu junto com ele na 2.4a — 43 linhas de dado que nada lia. O **grid base** que ela usa fica registrado aqui, que é o que permite redesenhá-la ou desenhar letras novas para submarcas de projetos: altura de caixa alta **54**, largura de letra **36** (o I é 8), espaço **16**.

**A assinatura é HTML, não SVG.** Diferente das outras peças, o nome ali é texto de verdade — selecionável, pesquisável por Ctrl+F, e herda os tokens de fonte do projeto. O SVG equivalente na pasta de assets existe para uso fora do React (e-mail, PDF), onde não dá para compor.

**Acessibilidade.** Cada SVG traz `role="img"` e `aria-label="maiahub"`. Como o spread de props vem depois, dá para sobrescrever quando o logo é decorativo ao lado de um título já escrito:

```tsx
<MaiahubMark aria-hidden aria-label={undefined} />
```

## Regras que continuam valendo

Área de proteção de 25% da altura em volta. Não recolorir a tinta com o azul da estrela. Não usar o wordmark abaixo de 200px. Não desenhar versão em caixa baixa da constelação — minúscula depende de curva, e curva não tem vértice onde ancorar estrela.
