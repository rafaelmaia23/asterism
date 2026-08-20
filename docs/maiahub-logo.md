# maiahub — componentes de logo

Cinco componentes React para o sistema de marca, com Tailwind v4 e os tokens do shadcn.

## No asterism

Os componentes vivem em `src/components/maiahub/`. Dependência única: o helper `cn` do
shadcn, em `@/lib/utils`.

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

## Componentes

| Componente | Papel | Tamanho mínimo |
|---|---|---|
| `MaiahubWordmark` | Institucional. Home, open graph, hero. | 200px de largura |
| `MaiahubMark` | Versão curta. Ícone, marca d'água. | 24px de altura |
| `MaiahubSeal` | Avatar, contextos circulares. | 40px |
| `MaiahubGlyph` | Versão simplificada para miniaturas. | 16px |
| `MaiahubSignature` | Uso corrido em texto. Rodapé, cabeçalho. | 120px de largura |

## Uso

```tsx
import { MaiahubWordmark, MaiahubMark, MaiahubSignature } from "@/components/maiahub";

<MaiahubWordmark />                                   // herda text-foreground
<MaiahubWordmark className="h-14 text-star-600" />
<MaiahubMark className="h-8 text-muted-foreground" />
<MaiahubMark className="text-primary-foreground" />   // sobre fundo colorido
<MaiahubSignature className="text-sm" />
<MaiahubSignature bare />                             // sem a divisória
```

## Como a cor funciona

A tinta do desenho é `currentColor`. Os componentes trazem `text-foreground` como padrão e você troca passando qualquer utilitário de `text-*` no `className` — o `cn` garante que a sua classe vence a padrão.

No asterism não existe tema claro, então a tinta é sempre `foreground` `ink-100` sobre
`background` `ink-950`. Nenhuma variante `dark:` é necessária.

A estrela é a única exceção: cor fixa em `fill-azure-radiance-400`, para permanecer constante em qualquer fundo. Se precisar que ela também siga o contexto:

```tsx
<MaiahubMark mono />   // estrela vira currentColor
```

Use `mono` em impressão, PDF, gravação, ou sobre um fundo onde o azul perde contraste.

## Escala

Os componentes não têm `width` e `height` — só `viewBox`. Controle o tamanho com `h-*` e `w-auto` (ou `size-*` no selo, que é quadrado). Se você adicionar os atributos de volta, eles vão brigar com as classes.

O `MaiahubGlyph` existe porque redução linear não funciona em tamanhos pequenos: a 16px, os pontos do `MaiahubMark` ficariam com menos de 1px de raio e sumiriam. O glyph quebra a proporção de propósito — traço mais grosso, pontos maiores, vértice central removido. Prática comum em ótica de logo, e é a mesma lógica do favicon.

## Notas de implementação

**O wordmark usa arrays.** São 13 traços e 35 pontos; escritos literalmente o arquivo ficaria ilegível. A geometria vive em `logo-shared.ts`, junto com o grid base (altura de caixa alta 54, letra 36, espaço 16) caso você queira desenhar letras novas para submarcas de projetos.

**A assinatura é HTML, não SVG.** Diferente das outras peças, o nome ali é texto de verdade — selecionável, pesquisável por Ctrl+F, e herda os tokens de fonte do projeto. O SVG equivalente na pasta de assets existe para uso fora do React (e-mail, PDF), onde não dá para compor.

**Acessibilidade.** Cada SVG traz `role="img"` e `aria-label="maiahub"`. Como o spread de props vem depois, dá para sobrescrever quando o logo é decorativo ao lado de um título já escrito:

```tsx
<MaiahubMark aria-hidden aria-label={undefined} />
```

## Regras que continuam valendo

Área de proteção de 25% da altura em volta. Não recolorir a tinta com o azul da estrela. Não usar o wordmark abaixo de 200px. Não desenhar versão em caixa baixa da constelação — minúscula depende de curva, e curva não tem vértice onde ancorar estrela.
