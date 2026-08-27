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
 * **Duas capas e dois respiros.** Num carrossel de doze slides a narrativa pede mais de um
 * momento de frase isolada — a virada no slide 6 e o fecho do argumento no 11 —, e até a 3C
 * quem fazia esse papel era a capa: o `text-impact` não existia, e a 2E registrou isso como
 * limitação de biblioteca, não escolha de arquitetura. A tarefa 3.9 fecha a dívida, e os
 * slides 6 e 11 passaram ao template que existe para isso.
 *
 * As duas capas que sobraram cobrem de uma linha a quatro, e é assim que a âncora de base
 * da §11.1 se confere: a última linha pousa na mesma altura nas duas. Ao lado delas, os
 * dois `text-impact` mostram o **mesmo corpo tipográfico com o gesto oposto** — 96px
 * centralizado nos dois eixos contra 96px ancorado à base e à esquerda. As duas leituras
 * ficam comparáveis na lista lateral sem trocar opção nenhuma.
 *
 * **O kicker numera a posição no deck**, não a ordem entre os slides do mesmo template. É a
 * convenção da §10.5 do design system, e vale para os dois templates de `slide-display`:
 * numerar as capas entre si faria a segunda dizer "02" por coincidência, e o respiro do
 * slide 11 não teria número nenhum.
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
const IMPACT = "text-impact";
const FINAL = "final-cta";

type Spec =
  | { template: typeof COVER; heading: string }
  | { template: typeof BULLETS; heading: string; items: string[]; anchor: OptionValue }
  | { template: typeof IMPACT; heading: string }
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
 *
 * As duas frases de impacto são curtas, que é o alvo da §11.5: acima de três linhas o
 * template está sendo usado como capa, que é justamente o que elas eram até a 3C.
 */
const SLIDES: Spec[] = [
  { template: COVER, heading: "O cache [[mentiu]]" },
  {
    template: COVER,
    heading: "Todo painel dizia que estava tudo bem, e [[todo painel estava certo]]",
  },
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
  { template: IMPACT, heading: "Três semanas para uma [[linha de código]]" },
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
  { template: IMPACT, heading: "Saudável é o sistema que você [[vê]] quebrar" },
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

/** `log/ · 06` — o pilar do deck e a posição do slide, na convenção da §10.5. */
function kickerAt(position: number): string {
  return `log/ · ${String(position).padStart(2, "0")}`;
}

function build(spec: Spec, position: number): Slide {
  // Os dois templates de `slide-display` levam o kicker numerado. Nem todo slide o mostra —
  // só a capa nasce com o cabeçalho ligado —, mas o valor existe de qualquer forma, e é o
  // que faz ligar a faixa entregar o número certo em vez do default do descritor.
  if (spec.template === COVER || spec.template === IMPACT) {
    return withFields(spec.template, {
      kicker: kickerAt(position),
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
