/**
 * Campos, opções e schema do `cover-statement`, conforme a §11.1 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo. São duas descrições da
 * mesma coisa de propósito — decisão 4 da §16 do documento de contexto —, e o teste é
 * quem garante que não divirjam.
 */

import { z } from "zod";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

/**
 * O kicker vem de `shared/fields.ts` desde a 2F: era declarado aqui, e a capa era o único
 * template a tê-lo. Compartilhado, ele atravessa a troca de layout — a migração da 2.10 é
 * uma interseção de chaves, e chave que só um lado declara não passa.
 *
 * Os limites são conselho, não trava: quem reprova é o guard. §11.0 dos templates.
 */
export const fields: Field[] = [
  ...sharedFields,
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
 * As oito vêm de `shared/options.ts` — a grade, as duas faixas e as cinco peças do rodapé
 * são os mesmos campos em todo template. O `showChevron` deixou de ser próprio da capa na
 * 2B e o `showHeader` chegou na 2F, com a capa sendo o único template que nasce com ele
 * ligado. As chaves antigas não mudaram, então o dado salvo continua valendo. A capa não
 * acrescenta opção nenhuma às oito.
 */
export const options: Field[] = [...sharedOptions];

export const coverStatementSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
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
  }),
});

export type CoverFields = z.infer<typeof coverStatementSchema>["fields"];
export type CoverOptions = z.infer<typeof coverStatementSchema>["options"];
