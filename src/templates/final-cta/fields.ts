/**
 * Campos, opções e schema do `final-cta`, conforme a §11.3 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é
 * quem garante que não divirjam.
 *
 * As três chaves são as do vocabulário canônico da §6: `heading` é o título de qualquer
 * template, `lead` é o complemento um degrau abaixo e `cta` é o destino do fechamento.
 * É o que fará o `migrateFields` da 2.10 ser uma interseção de chaves.
 *
 * **O lead é opcional no uso, não no dado.** Vazio é string vazia, e o template é quem
 * decide não desenhar o bloco; um campo ausente sumiria do formulário e não haveria como
 * escrevê-lo de volta.
 */

import { z } from "zod";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

/**
 * O kicker vem de `shared/fields.ts`, como em todo template desde a 2F, e **nasce
 * desligado**: a região 80–400 do fechamento é respiro deliberado, e ligá-lo é escolha de
 * quem edita. Ver a §11.3.
 *
 * Os limites são conselho, não trava: quem reprova é o guard. §11.0 dos templates.
 */
export const fields: Field[] = [
  ...sharedFields,
  {
    key: "heading",
    type: "textarea",
    label: "Fecho",
    max: 55,
    md: true,
    rows: 2,
  },
  // Marcação só no título: a §11.3 dá `md` ao fecho e deixa lead e CTA literais. O CTA
  // ainda tem outro motivo — é um endereço, e `blog.maiahub.com.br/**api**` marcaria.
  {
    key: "lead",
    type: "textarea",
    label: "Complemento",
    max: 90,
    rows: 2,
  },
  {
    key: "cta",
    type: "text",
    label: "Destino",
    max: 40,
    placeholder: "blog.maiahub.com.br",
  },
];

/** As oito primeiras vêm de `shared/options.ts`: são as mesmas em todo template. */
export const options: Field[] = [
  ...sharedOptions,
  {
    key: "showArrow",
    type: "toggle",
    label: "Seta no CTA",
  },
];

export const finalCtaSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
    lead: z.string(),
    cta: z.string(),
  }),
  options: z.object({
    showGrid: z.boolean(),
    showHeader: z.boolean(),
    showFooter: z.boolean(),
    showRule: z.boolean(),
    showLogo: z.boolean(),
    showLogoPlate: z.boolean(),
    showHandle: z.boolean(),
    showChevron: z.boolean(),
    showArrow: z.boolean(),
  }),
});

export type FinalCtaFields = z.infer<typeof finalCtaSchema>["fields"];
export type FinalCtaOptions = z.infer<typeof finalCtaSchema>["options"];
