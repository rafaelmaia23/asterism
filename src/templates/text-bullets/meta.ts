/**
 * Identidade e defaults do `text-bullets` — §11.2 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo da capa: quem só quer saber que o template
 * existe, como ele se chama e com que conteúdo um slide dele nasce não precisa arrastar o
 * componente junto. O `TemplateDef` completo é montado no `index.tsx`.
 */

import type { BulletsFields, BulletsOptions } from "@/templates/text-bullets/fields";
import type { TemplateBackground, TemplateGroup } from "@/templates/types";

export const textBulletsMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  defaults: { fields: BulletsFields; options: BulletsOptions };
} = {
  id: "text-bullets",
  label: "Tópicos",
  group: "content",
  // Sem grade: o miolo é texto, e a §4.3 do design system reserva o fundo aos slides em
  // que ele não compete com o conteúdo. Quem aplica é o SlideFrame, lendo daqui.
  background: "plain",
  defaults: {
    fields: {
      heading: "Três coisas que eu mudaria",
      items: ["Primeiro ponto", "Segundo ponto", "Terceiro ponto"],
    },
    // `showGrid` nasce igual ao `background` acima: o descritor dá o padrão, o slide
    // decide daí em diante.
    options: { showGrid: false, anchor: "center" },
  },
};
