/**
 * `text-impact` — o respiro, §11.5 dos templates.
 *
 * Uma frase, centralizada, e mais nada. É o payoff no meio da série — o slide que existe
 * para ficar vazio, e que dá ao leitor um lugar para respirar entre dois blocos densos.
 *
 * As duas regiões, em faixa vertical sobre o canvas:
 *
 *   Frase      80 – 1160   `slide-display`, centralizada nos DOIS eixos
 *   Rodapé   1238 – 1270   o `Footer` compartilhado, que se posiciona sozinho
 *
 * **A única exceção de alinhamento do sistema.** A §3.4 do design system manda alinhar tudo
 * à esquerda e abre exceção para este template, nominalmente. A exceção vale para a frase e
 * para mais nada: o kicker continua no canto superior esquerdo, e o rodapé continua sendo o
 * rodapé — os dois são peças compartilhadas e se alinham por conta própria.
 *
 * ## O cabeçalho não empurra: recentraliza
 *
 * Ligado, a região começa em 212 e a frase desce **66px**, metade do que ela desceria se a
 * faixa a empurrasse. Não é uma regra à parte e não é código: é o que centralizar dentro de
 * uma faixa menor faz sozinho. As duas alturas são classes **literais** porque o Tailwind
 * varre o fonte — ver a armadilha no `CLAUDE.md`.
 *
 * ## 96px, o mesmo da capa
 *
 * E não um degrau abaixo. O `text-impact` é onde a série entrega o que prometeu, e
 * entregá-lo menor do que se prometeu inverteria a hierarquia. O que separa os dois
 * templates não é o tamanho: a capa ancora à base e alinha à esquerda, este centraliza nos
 * dois eixos. Mesmo tipo, gestos opostos — e é por isso que a troca entre eles é exata, com
 * a mesma chave, a mesma forma e o mesmo limite de 70.
 *
 * A frase passa pelo `<Inline>`, e na prática só `[[destaque]]` se usa: `**forte**` não tem
 * efeito visível em Oxanium 700 e `==marca==` fica pesado demais a 96px.
 *
 * A região da frase é a que o guard de transbordo mede — o **⌐** da §11.5. Como a capa, é
 * conteúdo que não está ancorado ao topo: centralizado, o que não cabe estoura para os dois
 * lados, e só a medida de dois nós da decisão 47 o pega. A faixa é quem tem altura; o `<p>`
 * é quem cresce.
 */

import { Inline } from "@/markup/inline";
import { useOverflowGuard } from "@/render/overflow";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import {
  textImpactSchema,
  fields,
  options,
  type ImpactFields,
  type ImpactOptions,
} from "@/templates/text-impact/fields";
import { textImpactMeta } from "@/templates/text-impact/meta";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

function TextImpact({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<ImpactFields, ImpactOptions>) {
  const { region, content: block } = useOverflowGuard();

  return (
    <div className="relative h-full w-full">
      <Header kicker={content.kicker} show={settings.showHeader} />

      <div
        ref={region}
        data-testid="phrase-region"
        data-guarded
        className={[
          "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] flex items-center justify-center",
          settings.showHeader ? "top-[212px] h-[948px]" : "top-[80px] h-[1080px]",
        ].join(" ")}
      >
        <p ref={block} className="slide-display text-center text-ink-100">
          <Inline>{content.heading}</Inline>
        </p>
      </div>

      <Footer
        handle={deck.handle}
        index={index}
        total={total}
        showFooter={settings.showFooter}
        showRule={settings.showRule}
        showLogo={settings.showLogo}
        showLogoPlate={settings.showLogoPlate}
        showHandle={settings.showHandle}
        showChevron={settings.showChevron}
      />
    </div>
  );
}

export const textImpact: TemplateDef<ImpactFields, ImpactOptions> = {
  ...textImpactMeta,
  fields,
  options,
  schema: textImpactSchema,
  Component: TextImpact,
};
