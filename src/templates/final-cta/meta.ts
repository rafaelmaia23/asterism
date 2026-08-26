/**
 * Identidade e defaults do `final-cta` — §11.3 dos templates.
 *
 * Separado do `index.tsx` pelo mesmo motivo dos outros dois: quem só quer saber que o
 * template existe, como ele se chama e com que conteúdo um slide dele nasce não precisa
 * arrastar o componente junto. O `TemplateDef` completo é montado no `index.tsx`.
 */

import type { FinalCtaFields, FinalCtaOptions } from "@/templates/final-cta/fields";
import { sharedSections } from "@/templates/shared/sections";
import type { FieldSection, TemplateBackground, TemplateGroup } from "@/templates/types";

export const finalCtaMeta: {
  id: string;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  sections: FieldSection[];
  defaults: { fields: FinalCtaFields; options: FinalCtaOptions };
} = {
  id: "final-cta",
  label: "Fechamento",
  group: "final",
  sections: sharedSections,
  // Com grade, como a capa: a série abre e fecha com o mesmo gesto, e o miolo do slide é
  // curto o bastante para o fundo não competir com ele. Quem aplica é o SlideFrame.
  background: "grid",
  defaults: {
    // O kicker nasce escrito mesmo com o cabeçalho desligado: o valor tem de existir de
    // qualquer forma, e ligar a faixa não pode entregar uma faixa em branco.
    fields: {
      kicker: "log/ · 01",
      heading: "Escrevo sobre os erros antes dos acertos.",
      lead: "Backend, infra e o que aprendo quebrando os dois.",
      cta: "blog.maiahub.com.br",
    },
    // O rodapé completo é a decisão 29: o último slide é onde o handle mais importa,
    // porque quem chegou até o fim é quem vai seguir. O CTA no miolo não compete com ele
    // — 34px mono `azure-400` no conteúdo contra 28px `ink-400` no rodapé são
    // hierarquias distintas, não duas vozes no mesmo canto.
    //
    // Sem chevron: aqui não há para onde deslizar. O `Footer` suprimiria a seta de
    // qualquer forma por posição — decisão 36 —, e nascer desligada é o padrão honesto.
    //
    // E sem cabeçalho: a região 80–400 é respiro, e a §11.3 diz que ela não é elemento, é
    // a ausência de um. O kicker cabe ali sem empurrar nada — é o que faz o cabeçalho ser
    // opção aqui e não exceção —, mas o fechamento nasce com o respiro inteiro.
    options: {
      showGrid: true,
      showHeader: false,
      showFooter: true,
      showRule: false,
      showLogo: true,
      showLogoPlate: true,
      showHandle: true,
      showChevron: false,
      showArrow: true,
    },
  },
};
