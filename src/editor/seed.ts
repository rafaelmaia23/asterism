/**
 * O carrossel de referência — o deck com que o editor abre na primeira execução, antes de
 * haver qualquer coisa salva no `localStorage`.
 *
 * Até a 2D isto era um deck de seis slides que existia só para dar o que olhar: sem
 * `addSlide` e sem troca de layout, a semente era o único lugar que decidia quais slides
 * existiam. A 2E o trocou pelo **carrossel de verdade** que o critério de pronto da Etapa
 * 2 pede, e a 3G o recompôs com os **dez templates**, que é o critério da Etapa 3. São
 * doze slides, o teto da faixa de 8 a 12: se a ferramenta se comporta no deck mais longo
 * que ela promete, os mais curtos vêm de graça.
 *
 * Os defaults vêm do registry, e não copiados à mão: o dia em que um template ganhar um
 * campo, o deck semente o ganha junto. Por isso este módulo mora em `src/editor` e não em
 * `src/deck`, que não conhece a biblioteca de templates — a seta é `templates → deck`.
 *
 * **Dez templates em doze slides deixam duas repetições**, e elas são a lista e o respiro:
 * os dois papéis que um carrossel de verdade exerce mais de uma vez. As duas listas ficam
 * adjacentes de propósito — é assim que as duas âncoras da §11.2 ficam lado a lado na
 * coluna, comparáveis sem trocar opção nenhuma. Os dois `text-impact` ficam nas duas
 * dobras da narrativa: a virada, depois da correção, e o fecho do argumento antes do CTA.
 *
 * O que a composição perdeu foi a **segunda capa**. Até a 3G a semente tinha duas, de
 * comprimentos opostos, e era assim que a âncora de base da §11.1 se conferia — a última
 * linha pousando na mesma altura nas duas. Com dez templates não sobra slide para isso, e
 * o contraste que fica é o de gesto oposto: 96px ancorado à base e à esquerda na capa
 * contra 96px centralizado nos dois eixos no `text-impact`, um ao lado do outro na coluna.
 *
 * **O kicker é escrito nos doze**, e numera a posição no deck — §10.5 do design system.
 * Desde a 3A os dez templates declaram `kicker`, e um slide sem valor escrito herdaria o
 * do *default do template*: `api/ · 04` na quinta posição. Nove nascem com o cabeçalho
 * desligado, então isso ficaria invisível até alguém ligar a faixa — que é justamente o
 * momento em que ela precisa entregar o número certo.
 *
 * **A marcação aparece uma vez por bloco**, nunca duas. É a regra de um nível de ênfase
 * por bloco da §3.4 do design system, e ela vale dentro da lista também: um item marcado
 * por slide, não um por item. O `code-window` é o único slide sem marcação nenhuma, e não
 * por escolha da semente: é o único dos dez em que nenhum campo a aceita.
 */

import { createDeck, createSlide } from "@/deck/factories";
import type { Deck, FieldValue, OptionValue, Slide } from "@/deck/types";
import { get } from "@/templates";
import type { CodeAnnotatedFields } from "@/templates/code-annotated/fields";
import type { CodeWindowFields } from "@/templates/code-window/fields";
import type { Compare2colFields } from "@/templates/compare-2col/fields";
import type { ContextFields } from "@/templates/context/fields";
import type { CoverFields } from "@/templates/cover-statement/fields";
import type { FinalCtaFields } from "@/templates/final-cta/fields";
import type { ImageCaptionFields } from "@/templates/image-caption/fields";
import type { SplitVerticalFields } from "@/templates/split-vertical/fields";
import type { BulletsFields } from "@/templates/text-bullets/fields";
import type { ImpactFields } from "@/templates/text-impact/fields";

/**
 * O que a semente escreve num slide: os campos do template menos o `kicker`, que não é
 * conteúdo a redigir e sim a posição no deck — quem o preenche é o `build`.
 *
 * Tipar cada variante contra o campo do próprio template é o que faz um campo novo na
 * biblioteca **quebrar a compilação aqui** em vez de aparecer como slide meio vazio na
 * primeira execução. É o mesmo argumento pelo qual os defaults vêm do registry.
 */
type Written<F> = Omit<F, "kicker">;

type Spec =
  | { template: "cover-statement"; fields: Written<CoverFields> }
  | { template: "context"; fields: Written<ContextFields> }
  | { template: "text-bullets"; fields: Written<BulletsFields>; anchor: OptionValue }
  | { template: "code-window"; fields: Written<CodeWindowFields> }
  | { template: "code-annotated"; fields: Written<CodeAnnotatedFields> }
  | { template: "text-impact"; fields: Written<ImpactFields> }
  | { template: "split-vertical"; fields: Written<SplitVerticalFields> }
  | { template: "image-caption"; fields: Written<ImageCaptionFields> }
  | { template: "compare-2col"; fields: Written<Compare2colFields> }
  | { template: "final-cta"; fields: Written<FinalCtaFields> };

/**
 * A história é a mesma desde a primeira semente — um `ttl` em segundos passado para uma
 * API em milissegundos —, e a 3G finalmente a conta com o código à vista: gancho, premissa,
 * sintomas, investigação, o achado, a correção, o respiro, o painel que não via, o alarme
 * que passou a existir, o antes e depois, a lição e o fecho.
 *
 * Os defaults do `code-window` e do `code-annotated` contam **outra** história, a do tenant
 * fora da chave, e continuam contando: default é com o que um slide nasce, não o que a
 * semente mostra. O prefixo de pilar já os separa — `api/` lá, `log/` aqui.
 *
 * Os dois slides de mídia nascem **sem imagem**, no estado que a §11.9 desenha de propósito:
 * um default não carrega binário, e a semente não é exceção. A imagem entra pelo inspector,
 * que é o caminho que a 3F entregou.
 */
const SLIDES: Spec[] = [
  {
    template: "cover-statement",
    fields: { heading: "O cache [[mentiu]]" },
  },
  {
    template: "context",
    fields: {
      heading: "O que estava acontecendo",
      body: "Durante três semanas, uma fração das requisições devolvia uma resposta de horas antes. Nenhum alerta disparou, e nenhum estava errado: do ponto de vista da infraestrutura estava [[tudo saudável]].",
    },
  },
  {
    template: "text-bullets",
    fields: {
      heading: "O que os usuários viam",
      items: [
        "Uma resposta velha, mas só para alguns usuários",
        "Nunca reproduzia em homologação",
        "E [[sumia sozinho]] depois de um deploy qualquer",
      ],
    },
    anchor: "center",
  },
  {
    template: "text-bullets",
    fields: {
      heading: "O que não era",
      items: [
        "Não era o banco: a query saía em 4ms, medida",
        "Não era a rede: o traço inteiro cabia em 40ms",
        "Não era concorrência: acontecia com [[um processo só]]",
        "Não era o deploy: acontecia antes dele também",
      ],
    },
    anchor: "top",
  },
  {
    template: "code-window",
    fields: {
      heading: "A linha que ninguém tinha lido",
      file: "cache.ts",
      lang: "ts",
      code: "const ttl = 60 * 60 // uma hora\n\nexport function put(id: string, v: Data) {\n  return cache.set(`user:${id}`, v, ttl)\n}",
    },
  },
  {
    template: "code-annotated",
    fields: {
      heading: "A correção",
      file: "cache.ts",
      lang: "ts",
      code: "const ttl = 60 * 60 * 1000 // milissegundos",
      body: "A API espera milissegundos, e mil vezes uma hora são [[onze dias]] de validade. Escrita em 2023, revisada por duas pessoas.",
    },
  },
  {
    template: "text-impact",
    fields: { heading: "Três semanas para uma [[linha de código]]" },
  },
  {
    template: "split-vertical",
    fields: {
      heading: "O painel que não mostrava nada",
      body: "Latência estável, erro em zero, memória plana. Tudo verde enquanto uma parte das respostas [[saía de um cache vencido]].",
      image: "",
    },
  },
  {
    template: "image-caption",
    fields: {
      heading: "O alarme que faltava",
      caption: "A idade da resposta virou métrica, e a métrica virou [[alarme]] — não mais um gráfico.",
      image: "",
    },
  },
  {
    template: "compare-2col",
    fields: {
      heading: "O que mudou no monitoramento",
      beforeLabel: "Antes",
      before:
        "CPU, memória e latência. Três semanas de verde, e nenhum deles olhava para o dado que voltava.",
      afterLabel: "Depois",
      after:
        "Toda unidade de tempo no nome da variável, e um alarme quando a resposta é [[mais velha que o ttl]].",
    },
  },
  {
    template: "text-impact",
    fields: { heading: "Saudável é o sistema que você [[vê]] quebrar" },
  },
  {
    template: "final-cta",
    fields: {
      heading: "Escrevo sobre o que [[quebra]] antes do que funciona",
      lead: "Backend, infra e os três dias que cada bug de uma linha custa.",
      cta: "blog.maiahub.com.br",
    },
  },
];

function withFields(
  template: string,
  fields: Record<string, FieldValue>,
  options: Record<string, OptionValue> = {},
): Slide {
  const slide = createSlide(template, get(template).defaults);

  return {
    ...slide,
    fields: { ...slide.fields, ...fields },
    options: { ...slide.options, ...options },
  };
}

/** `log/ · 06` — o pilar do deck e a posição do slide, na convenção da §10.5. */
function kickerAt(position: number): string {
  return `log/ · ${String(position).padStart(2, "0")}`;
}

/**
 * Um `build` para os dez, e nenhum ramo por template: o que varia entre eles é o conteúdo,
 * que a `Spec` já carrega tipado, e a única opção que a semente desvia do default é a
 * âncora das listas.
 */
function build(spec: Spec, position: number): Slide {
  return withFields(
    spec.template,
    { kicker: kickerAt(position), ...spec.fields },
    "anchor" in spec ? { anchor: spec.anchor } : {},
  );
}

export function createSeedDeck(): Deck {
  return {
    ...createDeck({ title: "O cache mentiu" }),
    slides: SLIDES.map((spec, index) => build(spec, index + 1)),
  };
}
