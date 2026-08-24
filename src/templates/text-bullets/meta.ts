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
    // O descritor dá o padrão e o slide decide daí em diante — decisão 25, agora valendo
    // para as seis. Nasce assinado, que é o rodapé que a §11.0 dá ao miolo do carrossel, e
    // sem chevron: a partir do slide 2 o gesto de deslizar já foi executado.
    //
    // A régua nasce **desligada**. Ela foi a candidata 8 do experimento 5 e a escolhida
    // foi a 6, sem régua; o que a sessão pediu foi tê-la disponível, não tê-la sempre.
    options: {
      showGrid: false,
      showRule: false,
      showLogo: true,
      showLogoPlate: true,
      showHandle: true,
      showChevron: false,
      anchor: "center",
    },
  },
};
