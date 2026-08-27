/**
 * Identidade e defaults do `context` — §11.4 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo dos outros: quem só quer saber que o template
 * existe, como ele se chama e com que conteúdo um slide dele nasce não precisa arrastar o
 * componente junto. O `TemplateDef` completo é montado no `index.tsx`.
 */

import type { ContextFields, ContextOptions } from "@/templates/context/fields";
import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const contextMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: ContextFields; options: ContextOptions };
} = {
  id: "context",
  label: "Contexto",
  group: "content",
  sections: sharedSections,
  // Sem grade: o slide é texto corrido, que é onde o fundo mais competiria com a leitura.
  // Quem a aplica é o SlideFrame, lendo daqui. §4.3 do design system.
  background: "plain",
  defaults: {
    // O kicker nasce escrito mesmo com o cabeçalho desligado, como no `text-bullets`:
    // campo vazio faria ligar a faixa entregar uma faixa em branco.
    fields: {
      kicker: "log/ · 02",
      heading: "O que estava acontecendo",
      body: "Durante três semanas, uma fração pequena das requisições devolvia dados de outra pessoa. Nenhum alerta disparou, porque do ponto de vista da infraestrutura estava tudo saudável.",
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
