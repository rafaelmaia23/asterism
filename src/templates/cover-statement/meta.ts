/**
 * Identidade e defaults do `cover-statement` — §11.1 dos templates.
 *
 * Separado do `index.tsx` porque quem só quer saber que o template existe, como ele se
 * chama e com que conteúdo um slide dele nasce não precisa arrastar o componente junto.
 * O `TemplateDef` completo é montado no `index.tsx`, que é quem tem o `Component`.
 */

import type { CoverFields, CoverOptions } from "@/templates/cover-statement/fields";
import type { TemplateBackground, TemplateGroup } from "@/templates/types";

export const coverStatementMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  defaults: { fields: CoverFields; options: CoverOptions };
} = {
  id: "cover-statement",
  label: "Capa — declaração",
  group: "cover",
  // O grid de fundo é da capa. Quem o aplica é o SlideFrame, lendo daqui.
  background: "grid",
  defaults: {
    fields: {
      kicker: "log/ · 01",
      heading: "Um título que declara algo em vez de prometer",
    },
    options: { showChevron: true },
  },
};
