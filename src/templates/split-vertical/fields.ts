/**
 * Campos, opções e schema do `split-vertical`, conforme a §11.9 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto.
 *
 * ## `image` é declarado aqui, e não em `shared/fields.ts`
 *
 * A §6 exige que a mesma chave tenha o mesmo **tipo de campo** na biblioteca inteira, e tem:
 * este e o `image-caption` declaram `type: "image"`, então a migração entre os dois preserva
 * a imagem escolhida. O que difere é o `ratio` — 5:16 aqui, 108:91 lá —, e por isso não são
 * o mesmo objeto e a decisão 54 não se aplica. É o precedente do `heading`: o que varia
 * acompanha a **região**, e a região é do template. Decisão 58.
 *
 * ## `imageFit` também não é compartilhada
 *
 * A §11.9 é explícita: compartilhada, na §11.0, é o que os **dez** expõem. Dois de dez é uma
 * opção própria declarada duas vezes com o mesmo nome e os mesmos valores. Se um terceiro
 * template de mídia aparecer, ela sobe para `shared/options.ts` — e não antes.
 */

import { z } from "zod";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

export const fields: Field[] = [
  ...sharedFields,
  // Os 50 caracteres são o que a coluna de 480px comporta em 56px: o título aceita as três
  // linhas que a coluna estreita impõe, e reduzi-lo faria o slide perder a hierarquia que
  // todos os outros têm — §11.9.
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 50,
    rows: 2,
  },
  // 240 caracteres são cerca de nove linhas de 45px na coluna. Passando disso o bloco
  // encosta no rodapé e o guard reprova; e quatro linhas já é o ponto em que o slide teria
  // mais força como `context` com a imagem num slide próprio.
  {
    key: "body",
    type: "textarea",
    label: "Texto",
    max: 240,
    md: true,
    rows: 6,
  },
  {
    key: "image",
    type: "image",
    label: "Imagem",
    ratio: "5:16",
  },
];

export const options: Field[] = [
  ...sharedOptions,
  {
    key: "imageFit",
    type: "select",
    label: "Ajuste da imagem",
    options: [
      { value: "cover", label: "Preencher e recortar" },
      { value: "contain", label: "Caber inteira" },
    ],
  },
];

export const splitVerticalSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
    body: z.string(),
    // Qualquer string, inclusive um id órfão: o blob pode não estar mais no IndexedDB, e a
    // §11.9 quer o slide de pé com a imagem faltando. Decisão 31 — derruba-se o que não
    // passa, e um id órfão passa.
    image: z.string(),
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
    imageFit: z.enum(["cover", "contain"]),
  }),
});

export type SplitVerticalFields = z.infer<typeof splitVerticalSchema>["fields"];
export type SplitVerticalOptions = z.infer<typeof splitVerticalSchema>["options"];
