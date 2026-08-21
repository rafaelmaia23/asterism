/**
 * `cover-statement` — a capa, §11.1 dos templates.
 *
 * Único slide sem rodapé de identidade: nem logo nem handle, só constelação e chevron.
 * O título é a única coisa que importa e nada compete com ele.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Kicker   80 – 148    `slide-meta`, azure-400
 *   Título   300 – 1160  `slide-display`, ancorado à BASE da região
 *   Rodapé   1240 – 1270 constelação + chevron, à direita
 *
 * A âncora do título na base é a decisão estrutural do template: com uma linha ou com
 * quatro, a última linha pousa sempre na mesma altura, e a série mantém o ritmo. As
 * laterais saem de `--slide-pad`, nunca de 920px escrito à mão; a altura total do quadro
 * é do `SlideFrame`, e nada aqui conhece 1080 ou 1350. O fundo `grid` também é dele, que
 * o lê de `meta.background`.
 */

import {
  coverStatementSchema,
  fields,
  options,
  type CoverFields,
  type CoverOptions,
} from "@/templates/cover-statement/fields";
import { coverStatementMeta } from "@/templates/cover-statement/meta";
import { Chevron } from "@/templates/shared/chevron";
import { Constellation } from "@/templates/shared/constellation";
import { Kicker } from "@/templates/shared/kicker";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

function CoverStatement({
  fields: content,
  options: settings,
  index,
  total,
}: TemplateComponentProps<CoverFields, CoverOptions>) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[80px] left-[var(--slide-pad)] flex h-[68px] items-start">
        <Kicker>{content.kicker}</Kicker>
      </div>

      <div className="absolute top-[300px] right-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[860px] items-end">
        {/* Texto literal: o `<Inline>` que interpreta `[[destaque]]` é da tarefa 2.3. */}
        <p className="slide-display text-ink-100">{content.heading}</p>
      </div>

      <div className="absolute top-[1240px] right-[var(--slide-pad)] flex h-[30px] items-center gap-[20px]">
        <Constellation index={index} total={total} />
        {settings.showChevron && <Chevron />}
      </div>
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
