/**
 * O carrossel de referência — o deck com que o editor abre na primeira execução, antes de
 * haver qualquer coisa salva no `localStorage`.
 *
 * Até a 2D isto era um deck de seis slides que existia só para dar o que olhar: sem
 * `addSlide` e sem troca de layout, a semente era o único lugar que decidia quais slides
 * existiam. A 2E o trocou pelo **carrossel de verdade** que o critério de pronto da Etapa
 * 2 pede — 8 a 12 slides compostos com os três templates, usando marcação. São doze, que
 * é o teto da etapa: se a ferramenta se comporta no deck mais longo que ela promete, os
 * mais curtos vêm de graça.
 *
 * Os defaults vêm do registry, e não copiados à mão: o dia em que um template ganhar um
 * campo, o deck semente o ganha junto. Por isso este módulo mora em `src/editor` e não em
 * `src/deck`, que não conhece a biblioteca de templates — a seta é `templates → deck`.
 *
 * **Quatro capas, e uma delas no miolo.** A §11.1 dá ao `cover-statement` a função de
 * gancho, e num carrossel de doze slides a narrativa pede mais de um momento de frase
 * isolada — a virada no slide 6 e o fecho do argumento no 11. O template que existe para
 * isso é o `text-impact`, que é da Etapa 3; enquanto ele não existe, a capa faz o papel.
 * É limitação de biblioteca, não escolha de arquitetura, e some quando a biblioteca
 * fechar.
 *
 * **O kicker numera a posição no deck**, não a ordem entre as capas. É a convenção da
 * §10.5 do design system, e com capa no miolo ela deixou de ser trivial: numerar as capas
 * entre si faria o slide 6 se anunciar como o terceiro.
 *
 * **A marcação aparece uma vez por bloco**, nunca duas. É a regra de um nível de ênfase
 * por bloco da §3.4 do design system, e ela vale dentro da lista também: um item marcado
 * por slide, não um por item.
 */

import { createDeck, createSlide } from "@/deck/factories";
import type { Deck, FieldValue, OptionValue, Slide } from "@/deck/types";
import { get } from "@/templates";

const COVER = "cover-statement";
const BULLETS = "text-bullets";
const FINAL = "final-cta";

type Spec =
  | { template: typeof COVER; heading: string }
  | { template: typeof BULLETS; heading: string; items: string[]; anchor: OptionValue }
  | { template: typeof FINAL; heading: string; lead: string; cta: string };

/**
 * A história é a mesma desde a primeira semente — um `ttl` em segundos passado para uma
 * API em milissegundos —, agora contada inteira: gancho, premissa, sintomas, investigação,
 * achado, correção, o que mudou depois e a lição.
 *
 * Os títulos de capa têm comprimentos deliberadamente diferentes, de uma linha a quatro:
 * é assim que a âncora de base da §11.1 se confere, vendo a última linha pousar sempre na
 * mesma altura. As âncoras das listas alternam entre `center` e `top` pelo mesmo motivo —
 * as duas leituras da §11.2 ficam comparáveis sem trocar opção nenhuma.
 */
const SLIDES: Spec[] = [
  { template: COVER, heading: "O cache [[mentiu]]" },
  { template: COVER, heading: "Todo painel dizia que estava [[tudo bem]]" },
  {
    template: BULLETS,
    heading: "O que os usuários viam",
    items: [
      "Uma resposta velha, mas só para alguns usuários",
      "Nunca reproduzia em homologação",
      "E [[sumia sozinho]] depois de um deploy qualquer",
    ],
    anchor: "center",
  },
  {
    template: BULLETS,
    heading: "O que o log dizia",
    items: [
      "A leitura vinha do cache, e o cache [[nunca expirava]]",
      "O teste passava porque subia com o cache vazio",
      "Ninguém tinha olhado a métrica de acerto desde a estreia",
    ],
    anchor: "top",
  },
  {
    template: BULLETS,
    heading: "O que não era",
    items: [
      "Não era o banco: a query saía em 4ms, medida",
      "Não era a rede: o traço inteiro cabia em 40ms",
      "Não era concorrência: acontecia com [[um processo só]]",
      "Não era o deploy: acontecia antes dele também",
    ],
    anchor: "center",
  },
  {
    template: COVER,
    heading: "Três semanas de investigação para encontrar um [[bug de uma linha]]",
  },
  {
    template: BULLETS,
    heading: "A linha que ninguém tinha lido",
    items: [
      "Um `ttl` em segundos, passado para uma API em milissegundos",
      "Mil vezes maior: onze dias de validade",
      "Escrita em 2023, revisada por duas pessoas",
    ],
    anchor: "top",
  },
  {
    template: BULLETS,
    heading: "A correção, e o que ela custou",
    items: [
      "Uma linha: a conversão passou a acontecer na borda",
      "Duas horas para escrever e testar",
      "[[Três semanas]] para chegar até ela",
    ],
    anchor: "center",
  },
  {
    template: BULLETS,
    heading: "O que mudou no monitoramento",
    items: [
      "A taxa de acerto do cache virou alarme, não gráfico",
      "Toda unidade de tempo passou a ir no nome da variável",
      "`ttlSeconds` e `ttlMs` não se confundem numa revisão",
      "E o teste sobe com o cache [[quente]], não vazio",
    ],
    anchor: "top",
  },
  {
    template: BULLETS,
    heading: "O que eu levei disso",
    items: [
      "Métrica que ninguém olha não é monitoramento, é enfeite",
      "Bug que não reproduz espera um [[dado]], não um deploy",
      "O tempo de procurar é o custo real, não o de corrigir",
    ],
    anchor: "center",
  },
  { template: COVER, heading: "Sistema saudável é o que você [[consegue ver]] quebrar" },
  {
    template: FINAL,
    heading: "Escrevo sobre o que [[quebra]] antes do que funciona",
    lead: "Backend, infra e os três dias que cada bug de uma linha custa.",
    cta: "blog.maiahub.com.br",
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

function build(spec: Spec, position: number): Slide {
  if (spec.template === COVER) {
    return withFields(COVER, {
      kicker: `log/ · ${String(position).padStart(2, "0")}`,
      heading: spec.heading,
    });
  }

  if (spec.template === BULLETS) {
    return withFields(
      BULLETS,
      { heading: spec.heading, items: spec.items },
      { anchor: spec.anchor },
    );
  }

  return withFields(FINAL, {
    heading: spec.heading,
    lead: spec.lead,
    cta: spec.cta,
  });
}

export function createSeedDeck(): Deck {
  return {
    ...createDeck({ title: "O cache mentiu" }),
    slides: SLIDES.map((spec, index) => build(spec, index + 1)),
  };
}
