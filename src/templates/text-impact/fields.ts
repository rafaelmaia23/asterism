/**
 * Campos, opções e schema do `text-impact`, conforme a §11.5 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é
 * quem garante que não divirjam.
 *
 * O template mais magro da biblioteca: o kicker compartilhado e a frase, e nada mais.
 */

import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";
import { z } from "zod";

/**
 * **Um campo próprio e mais nada** — nem lead, nem atribuição, nem legenda. Cada campo a
 * mais é um convite a preencher o slide que existe para ficar vazio, e a série já tem onde
 * pôr o desdobramento: o slide seguinte. §11.5.
 *
 * O limite é o mesmo 70 da capa, porque a região e o corpo tipográfico são os mesmos. É o
 * que faz a troca `cover-statement` ↔ `text-impact` ser exata nos dois sentidos: mesma
 * chave, mesma forma, mesmo conselho de limite. Os limites são conselho, não trava — quem
 * reprova é o guard. §11.0 dos templates.
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

/** As oito de `shared/options.ts`, e nada mais: o `text-impact` não tem opção própria. */
export const options: Field[] = [...sharedOptions];

export const textImpactSchema = z.object({
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

export type ImpactFields = z.infer<typeof textImpactSchema>["fields"];
export type ImpactOptions = z.infer<typeof textImpactSchema>["options"];
