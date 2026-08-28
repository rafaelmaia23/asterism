/**
 * Identidade e defaults do `image-caption` — §11.10 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo dos outros: quem só quer saber que o template
 * existe, como ele se chama e com que conteúdo um slide dele nasce não precisa arrastar o
 * componente junto.
 */

import type { ImageCaptionFields, ImageCaptionOptions } from "@/templates/image-caption/fields";
import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const imageCaptionMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: ImageCaptionFields; options: ImageCaptionOptions };
} = {
  id: "image-caption",
  // O rótulo diz as duas peças e a ordem em que elas aparecem, que é a diferença para o
  // "Texto e imagem" ao lado — o mesmo padrão de "Código" e "Código anotado".
  label: "Imagem e legenda",
  group: "media",
  sections: sharedSections,
  // Sem grade: ela desenharia por baixo de uma imagem que toma três quartos do slide.
  background: "plain",
  defaults: {
    fields: {
      kicker: "log/ · 09",
      heading: "O alerta que passou a existir",
      caption:
        "Duas respostas com tenants diferentes para a mesma chave, na mesma janela de 30 segundos.",
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
