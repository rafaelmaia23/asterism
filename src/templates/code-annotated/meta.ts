/**
 * Identidade e defaults do `code-annotated` — §11.7 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo do `code-window`, e aqui pelo mesmo peso: quem
 * só quer saber que o template existe e com que conteúdo um slide dele nasce não precisa
 * arrastar o realçador e as gramáticas atrás do componente.
 */

import type {
  CodeAnnotatedFields,
  CodeAnnotatedOptions,
} from "@/templates/code-annotated/fields";
import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const codeAnnotatedMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: CodeAnnotatedFields; options: CodeAnnotatedOptions };
} = {
  id: "code-annotated",
  label: "Código anotado",
  group: "code",
  sections: sharedSections,
  // Sem grade, pela mesma razão do `code-window`: a linha do fundo atravessa a janela e
  // compete com o realce. §4.3 do design system, aplicada pelo SlideFrame a partir daqui.
  background: "plain",
  defaults: {
    // O par de defaults conta a continuação da história do `code-window`: lá está a linha
    // que ninguém tinha lido, aqui está a correção dela e o que ela custou. A explicação
    // **não repete o código** — diz o que não está escrito ali, que é a regra da §11.7.
    fields: {
      kicker: "api/ · 05",
      heading: "A correção",
      file: "cache.ts",
      lang: "ts",
      code: "const key = `user:${id}:${tenant}`",
      body: "A chave não incluía o tenant. Dois clientes com o mesmo id de usuário liam a mesma entrada — e o cache respondia antes do banco, então nenhum log registrava a troca.",
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
