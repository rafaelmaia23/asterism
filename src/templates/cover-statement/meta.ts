/**
 * Identidade e defaults do `cover-statement` — §11.1 dos templates.
 *
 * Separado do `index.tsx` porque quem só quer saber que o template existe, como ele se
 * chama e com que conteúdo um slide dele nasce não precisa arrastar o componente junto.
 * O `TemplateDef` completo é montado no `index.tsx`, que é quem tem o `Component`.
 */

import type { CoverFields, CoverOptions } from "@/templates/cover-statement/fields";
import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const coverStatementMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: CoverFields; options: CoverOptions };
} = {
  id: "cover-statement",
  label: "Capa — declaração",
  group: "cover",
  sections: sharedSections,
  // O grid de fundo é da capa. Quem o aplica é o SlideFrame, lendo daqui.
  background: "grid",
  defaults: {
    fields: {
      kicker: "log/ · 01",
      heading: "Um título que declara algo em vez de prometer",
    },
    // O descritor dá o padrão e o slide decide daí em diante — decisão 25, agora valendo
    // para as oito. A capa nasce **sem identidade**: a §11.1 diz que nada compete com o
    // título, e isso continua verdadeiro como recomendação, não mais como regra. Nasce
    // com o chevron porque é onde o gesto de deslizar ainda não foi executado.
    //
    // É o **único template que nasce com o cabeçalho ligado**. A §11.1 dá o kicker à capa
    // desde a 1B, e essa frase é o que virou padrão na 2F: ligado aqui, disponível nos
    // outros. O par com o `showLogo` desligado é o desenho da capa — etiqueta no topo,
    // nada no pé além do progresso.
    //
    // `showLogoPlate` nasce ligado mesmo com a logo desligada: é o tratamento escolhido no
    // experimento 5, e o padrão existe para que ligar a logo já entregue a peça certa em
    // vez de a versão solta que o experimento descartou.
    options: {
      showGrid: true,
      showHeader: true,
      showFooter: true,
      showRule: false,
      showLogo: false,
      showLogoPlate: true,
      showHandle: false,
      showChevron: true,
    },
  },
};
