/**
 * Identidade e defaults do `code-window` — §11.6 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo dos outros: quem só quer saber que o template
 * existe, como ele se chama e com que conteúdo um slide dele nasce não precisa arrastar o
 * componente junto — e aqui isso pesa mais que nos outros, porque o componente arrasta o
 * realçador e as gramáticas atrás dele.
 */

import type { CodeWindowFields, CodeWindowOptions } from "@/templates/code-window/fields";
import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const codeWindowMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: CodeWindowFields; options: CodeWindowOptions };
} = {
  id: "code-window",
  label: "Código",
  group: "code",
  sections: sharedSections,
  // Sem grade, e aqui é mais que padrão: a linha do fundo atravessa a janela e compete com
  // o realce. A §4.3 do design system recomenda desligá-la em slide de código, e é o
  // conselho mais fácil de comprovar olhando. Quem a aplica é o SlideFrame, lendo daqui.
  background: "plain",
  defaults: {
    // O kicker nasce escrito mesmo com o cabeçalho desligado, como nos outros: campo vazio
    // faria ligar a faixa entregar uma faixa em branco.
    fields: {
      kicker: "api/ · 04",
      heading: "A linha que ninguém tinha lido",
      file: "cache.ts",
      lang: "ts",
      code: "const key = `user:${id}`\n\nexport function get(id: string) {\n  return cache.get(key) ?? load(id)\n}",
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
