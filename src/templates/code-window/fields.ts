/**
 * Campos, opções e schema do `code-window`, conforme a §11.6 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é quem
 * garante que não divirjam.
 *
 * As chaves são as do vocabulário canônico da §6: `heading` é o título de qualquer
 * template, e `code`, `file` e `lang` são as três do bloco de código. As três estão na §6
 * desde a v1, e o `code-annotated` as declara **idênticas** — não por disciplina, mas
 * porque os três descritores são o **mesmo objeto**, vindo de `shared/fields.ts`. É o que
 * faz a troca entre os dois templates de código preservar o que foi escrito, e é a regra da
 * §6 valendo para a biblioteca inteira: a mesma chave tem o mesmo tipo de campo em todo
 * lugar.
 */

import { z } from "zod";
import { codeFields, sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

export const fields: Field[] = [
  ...sharedFields,
  // Sem `md` em nenhum: o título compete com o bloco de código, e dois níveis de ênfase no
  // mesmo slide é o que a §3.4 do design system proíbe. O nome do arquivo e o código são
  // literais por natureza.
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 60,
    rows: 2,
  },
  // Os três do bloco de código, o mesmo objeto que o `code-annotated` espalha — a §6 pede
  // a mesma chave com a mesma forma na biblioteca inteira, e descritor compartilhado é o
  // que faz a promessa ser verdadeira em vez de disciplina.
  ...codeFields,
];

/** As oito de `shared/options.ts`, e nada mais: o `code-window` não tem opção própria. */
export const options: Field[] = [...sharedOptions];

/**
 * `lang` é `string`, e não um enum das nove.
 *
 * A validação existe para derrubar dado **torto**, não dado **velho** — decisão 41. Um
 * deck salvo antes de a lista da §11.6 mudar traria uma linguagem que o bundle não tem
 * mais, e um enum descartaria o slide inteiro, código e título junto, por causa de um
 * campo que o realçador já sabe resolver: `tokenize` cai em texto puro e o slide perde a
 * cor, não o conteúdo.
 */
export const codeWindowSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
    file: z.string(),
    lang: z.string(),
    code: z.string(),
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

export type CodeWindowFields = z.infer<typeof codeWindowSchema>["fields"];
export type CodeWindowOptions = z.infer<typeof codeWindowSchema>["options"];
