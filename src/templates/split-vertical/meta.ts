/**
 * Identidade e defaults do `split-vertical` — §11.9 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo dos outros: quem só quer saber que o template
 * existe, como ele se chama e com que conteúdo um slide dele nasce não precisa arrastar o
 * componente junto.
 */

import { sharedSections } from "@/templates/shared/sections";
import type {
  SplitVerticalFields,
  SplitVerticalOptions,
} from "@/templates/split-vertical/fields";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const splitVerticalMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: SplitVerticalFields; options: SplitVerticalOptions };
} = {
  id: "split-vertical",
  label: "Texto e imagem",
  group: "media",
  sections: sharedSections,
  // Sem grade, e o conselho é forte: a §4.3 do design system diz que grade compete com
  // imagem, e aqui ela desenharia por baixo de uma metade e não da outra.
  background: "plain",
  defaults: {
    // O slide nasce **sem imagem**: não há binário que um default possa carregar, e o
    // estado vazio é desenhado de propósito — a mesma superfície que um id órfão mostra.
    fields: {
      kicker: "log/ · 08",
      heading: "O gráfico que não mostrava nada",
      body: "Latência estável, erro em zero, memória plana. O painel inteiro em verde enquanto a fração de respostas trocadas subia.",
      image: "",
    },
    options: {
      showGrid: false,
      showHeader: false,
      showFooter: true,
      showRule: false,
      showLogo: true,
      showLogoPlate: true,
      showHandle: true,
      showChevron: false,
      imageFit: "cover",
    },
  },
};
