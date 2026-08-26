/**
 * Campos, opções e schema do `text-bullets`, conforme a §11.2 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é
 * quem garante que não divirjam.
 *
 * As chaves são as do vocabulário canônico da §6: `heading` é o título de qualquer
 * template, `items` é a lista de tópicos. É o que fará o `migrateFields` da 2.10 ser uma
 * interseção de chaves em vez de uma tabela de equivalência.
 */

import { z } from "zod";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

/**
 * O kicker vem de `shared/fields.ts`, como em todo template desde a 2F. Aqui ele **nasce
 * desligado**: o cabeçalho do slide já ocupa o topo, e ligar os dois é escolha de quem
 * edita, não o desenho padrão do template.
 *
 * Os limites são conselho, não trava: quem reprova é o guard. §11.0 dos templates.
 */
export const fields: Field[] = [
  ...sharedFields,
  // "Título", e não "Cabeçalho" como até a 2E: o cabeçalho passou a ser a faixa do topo,
  // e o inspector mostraria dois controles com o mesmo nome na mesma coluna. É também o
  // nome do papel no vocabulário canônico da §6 — `heading` é o título em todo template.
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 60,
    rows: 2,
  },
  // Sem `md` no título e com `md` nos itens: a §11.2 dá marcação só à lista, e a regra
  // de um nível de ênfase por bloco da §3.4 do design system já é apertada dentro dela.
  {
    key: "items",
    type: "list",
    label: "Tópicos",
    maxItems: 4,
    maxPerItem: 80,
    md: true,
  },
];

/** As oito primeiras vêm de `shared/options.ts`: são as mesmas em todo template. */
export const options: Field[] = [
  ...sharedOptions,
  {
    key: "anchor",
    type: "select",
    label: "Âncora dos itens",
    options: [
      { value: "center", label: "Centralizado" },
      { value: "top", label: "No topo" },
    ],
  },
];

export const textBulletsSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
    items: z.array(z.string()),
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
    anchor: z.enum(["center", "top"]),
  }),
});

export type BulletsFields = z.infer<typeof textBulletsSchema>["fields"];
export type BulletsOptions = z.infer<typeof textBulletsSchema>["options"];
