/**
 * Campos, opções e schema do `image-caption`, conforme a §11.10 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto.
 *
 * ## `caption` é chave canônica, e é o único template que a declara
 *
 * Ela está na tabela da §6 desde a v1, então continua lá: a diferença entre uma chave de
 * vocabulário e uma chave própria não é quantos templates a usam hoje, é se o papel pertence
 * à biblioteca ou a um layout — e "legenda de imagem" pertence à biblioteca. É o argumento
 * inverso do par antes/depois do `compare-2col`, que é papel de um layout só.
 *
 * ## `image` e `imageFit` são declarados aqui, como no `split-vertical`
 *
 * A §6 exige que a mesma chave tenha o mesmo **tipo de campo** na biblioteca inteira, e tem
 * — é isso que faz trocar entre os dois templates de mídia preservar a imagem escolhida. O
 * que difere é o `ratio`, que acompanha a região, e a região é do template: 108:91 aqui,
 * 5:16 lá. Decisão 58. O `imageFit` idem, pelo que a §11.9 escreve: compartilhada é o que os
 * **dez** expõem, e dois de dez é opção própria declarada duas vezes.
 */

import { z } from "zod";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

export const fields: Field[] = [
  ...sharedFields,
  // O limite de 40 é o que cabe em **uma** linha de 56px nos 920px úteis. A região tem
  // 64px de altura, e a segunda linha não teria onde pousar — quem reprova é o guard.
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 40,
    rows: 2,
  },
  // 90 caracteres são as duas linhas de 44,8px que a faixa de 90px comporta.
  {
    key: "caption",
    type: "textarea",
    label: "Legenda",
    max: 90,
    md: true,
    rows: 3,
  },
  {
    key: "image",
    type: "image",
    label: "Imagem",
    ratio: "108:91",
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

export const imageCaptionSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
    caption: z.string(),
    // Qualquer string, inclusive um id órfão — o mesmo argumento do `split-vertical`.
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

export type ImageCaptionFields = z.infer<typeof imageCaptionSchema>["fields"];
export type ImageCaptionOptions = z.infer<typeof imageCaptionSchema>["options"];
