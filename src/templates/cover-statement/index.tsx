/**
 * `cover-statement` — a capa, §11.1 dos templates.
 *
 * O slide que **nasce** sem identidade no rodapé: nem logo nem handle, só constelação e
 * chevron. O título é a única coisa que importa e nada compete com ele. Desde a 2B isso é
 * padrão e não regra — as três peças da faixa são opção do slide, e a capa é apenas o
 * único template que nasce com duas delas desligadas.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Kicker   80 – 148    `slide-meta`, azure-400
 *   Título   300 – 1160  `slide-display`, ancorado à BASE da região
 *   Rodapé   1238 – 1270 o `Footer` compartilhado, que se posiciona sozinho
 *
 * O título passa pelo `<Inline>`, e é o único campo do template que aceita marcação — o
 * kicker é literal. Na prática só `[[destaque]]` se usa aqui: `**forte**` não tem efeito
 * sobre Oxanium 700 e `==marca==` fica pesada demais em 96px. §11.1 dos templates.
 *
 * A âncora do título na base é a decisão estrutural do template: com uma linha ou com
 * quatro, a última linha pousa sempre na mesma altura, e a série mantém o ritmo. As
 * laterais saem de `--slide-pad`, nunca de 920px escrito à mão; a altura total do quadro
 * é do `SlideFrame`, e nada aqui conhece 1080 ou 1350. O fundo `grid` também é dele, que
 * o lê de `meta.background`.
 */

import { Inline } from "@/markup/inline";
import {
  coverStatementSchema,
  fields,
  options,
  type CoverFields,
  type CoverOptions,
} from "@/templates/cover-statement/fields";
import { coverStatementMeta } from "@/templates/cover-statement/meta";
import { Footer } from "@/templates/shared/footer";
import { Kicker } from "@/templates/shared/kicker";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

function CoverStatement({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<CoverFields, CoverOptions>) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[80px] left-[var(--slide-pad)] flex h-[68px] items-start">
        <Kicker>{content.kicker}</Kicker>
      </div>

      <div className="absolute top-[300px] right-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[860px] items-end">
        <p className="slide-display text-ink-100">
          <Inline>{content.heading}</Inline>
        </p>
      </div>

      <Footer
        handle={deck.handle}
        index={index}
        total={total}
        showRule={settings.showRule}
        showLogo={settings.showLogo}
        showLogoPlate={settings.showLogoPlate}
        showHandle={settings.showHandle}
        showChevron={settings.showChevron}
      />
    </div>
  );
}

export const coverStatement: TemplateDef<CoverFields, CoverOptions> = {
  ...coverStatementMeta,
  fields,
  options,
  schema: coverStatementSchema,
  Component: CoverStatement,
};
