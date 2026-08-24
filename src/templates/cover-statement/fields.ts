/**
 * Campos, opções e schema do `cover-statement`, conforme a §11.1 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo. São duas descrições da
 * mesma coisa de propósito — decisão 4 da §16 do documento de contexto —, e o teste é
 * quem garante que não divirjam.
 */

import { z } from "zod";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

/** Os limites são conselho, não trava: quem reprova é o guard. §11.0 dos templates. */
export const fields: Field[] = [
  {
    key: "kicker",
    type: "text",
    label: "Kicker",
    max: 12,
    placeholder: "api/ · 04",
  },
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 70,
    md: true,
    rows: 3,
  },
];

/**
 * As quatro vêm de `shared/options.ts` — a grade e as três peças do rodapé são os mesmos
 * campos em todo template, e o `showChevron` deixou de ser próprio da capa na 2B: virou
 * compartilhado, com a capa apenas nascendo com ele ligado. A chave é a mesma de antes,
 * então nada no dado muda. A capa não acrescenta opção nenhuma às quatro.
 */
export const options: Field[] = [...sharedOptions];

export const coverStatementSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
  }),
  options: z.object({
    showGrid: z.boolean(),
    showRule: z.boolean(),
    showLogo: z.boolean(),
    showLogoPlate: z.boolean(),
    showHandle: z.boolean(),
    showChevron: z.boolean(),
  }),
});

export type CoverFields = z.infer<typeof coverStatementSchema>["fields"];
export type CoverOptions = z.infer<typeof coverStatementSchema>["options"];
