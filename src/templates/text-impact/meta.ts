/**
 * Identidade e defaults do `text-impact` — §11.5 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo dos outros: quem só quer saber que o template
 * existe, como ele se chama e com que conteúdo um slide dele nasce não precisa arrastar o
 * componente junto. O `TemplateDef` completo é montado no `index.tsx`.
 */

import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";
import type { ImpactFields, ImpactOptions } from "@/templates/text-impact/fields";

export const textImpactMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: ImpactFields; options: ImpactOptions };
} = {
  id: "text-impact",
  label: "Frase de impacto",
  group: "content",
  sections: sharedSections,
  // O **único template de miolo que nasce com a grade**, e é o que o marca visualmente
  // como pausa: o leitor reconhece o respiro antes de ler a frase. Quem a aplica é o
  // SlideFrame, lendo daqui.
  background: "grid",
  defaults: {
    fields: {
      kicker: "log/ · 06",
      heading: "Três semanas para um [[bug de uma linha]]",
    },
    // O descritor dá o padrão e o slide decide daí em diante — decisão 25. Nasce assinado
    // como o resto do miolo, e sem chevron: a partir do slide 2 o gesto de deslizar já foi
    // executado. O cabeçalho nasce desligado — a capa continua sendo o único que não.
    options: {
      showGrid: true,
      showHeader: false,
      showFooter: true,
      showRule: false,
      showLogo: true,
      showLogoPlate: true,
      showHandle: true,
      showChevron: false,
    },
  },
};
