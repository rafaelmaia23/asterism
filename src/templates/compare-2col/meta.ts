/**
 * Identidade e defaults do `compare-2col` — §11.8 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo dos outros: quem só quer saber que o template
 * existe, como ele se chama e com que conteúdo um slide dele nasce não precisa arrastar o
 * componente junto.
 */

import type { Compare2colFields, Compare2colOptions } from "@/templates/compare-2col/fields";
import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const compare2colMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: Compare2colFields; options: Compare2colOptions };
} = {
  id: "compare-2col",
  label: "Comparação",
  group: "content",
  sections: sharedSections,
  // Sem grade: é o template mais denso da biblioteca, e a linha do fundo atravessaria as
  // duas colunas e as duas réguas. §4.3 do design system, aplicada pelo SlideFrame daqui.
  background: "plain",
  defaults: {
    // Os rótulos que nascem são "Antes" e "Depois" porque um default tem de ser legível sem
    // contexto; a §11.8 recomenda trocá-los por algo que diga **o que** mudou assim que o
    // slide tiver assunto.
    fields: {
      kicker: "api/ · 07",
      heading: "O que mudou no monitoramento",
      beforeLabel: "Antes",
      before:
        "Alertas de infraestrutura: CPU, memória, latência. Todos verdes durante as três semanas.",
      afterLabel: "Depois",
      after:
        "Um alerta por invariante de negócio: duas respostas com tenants diferentes para a mesma chave.",
    },
    // O descritor dá o padrão e o slide decide daí em diante — decisão 25. Nasce assinado,
    // que é o rodapé que a §11.0 dá ao miolo do carrossel, e sem chevron: a partir do
    // slide 2 o gesto de deslizar já foi executado.
    options: {
      showGrid: false,
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
