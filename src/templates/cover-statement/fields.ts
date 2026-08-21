/**
 * Campos, opções e schema do `cover-statement`, conforme a §11.1 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo. São duas descrições da
 * mesma coisa de propósito — decisão 4 da §16 do documento de contexto —, e o teste é
 * quem garante que não divirjam.
 */

import { z } from "zod";
import { showGridOption } from "@/templates/shared/options";
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

/** A grade vem de `shared/options.ts`: é o mesmo campo em todo template. */
export const options: Field[] = [
  showGridOption,
  { key: "showChevron", type: "toggle", label: "Afordância de deslize" },
];

export const coverStatementSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
  }),
  options: z.object({
    showGrid: z.boolean(),
    showChevron: z.boolean(),
  }),
});

export type CoverFields = z.infer<typeof coverStatementSchema>["fields"];
export type CoverOptions = z.infer<typeof coverStatementSchema>["options"];
