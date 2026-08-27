/**
 * Campos, opções e schema do `code-window`, conforme a §11.6 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é quem
 * garante que não divirjam.
 *
 * As chaves são as do vocabulário canônico da §6: `heading` é o título de qualquer
 * template, e `code`, `file` e `lang` são as três do bloco de código. As três estão na §6
 * desde a v1, e o `code-annotated` da 3E as declara **idênticas** — mesma chave e mesma
 * forma de valor —, que é o que faz a troca entre os dois templates de código preservar o
 * que foi escrito. A regra é da §6 e vale para a biblioteca inteira: a mesma chave tem o
 * mesmo tipo de campo em todo lugar.
 */

import { z } from "zod";
import { LANG_IDS } from "@/code/langs";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

/**
 * As opções do select saem do **bundle**, não de uma lista escrita à mão aqui.
 *
 * É o que impede o formulário de oferecer uma linguagem que o realçador não tem: a §11.6
 * escreve a lista, o `langs.ts` a materializa em gramática, e este `map` garante que o
 * controle mostre exatamente o que foi carregado. Uma lista paralela divergiria no dia em
 * que uma linguagem entrasse ou saísse do bundle, e o sintoma seria um slide sem cor.
 */
const LANG_LABELS: Record<(typeof LANG_IDS)[number], string> = {
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  json: "JSON",
  bash: "Shell",
  sql: "SQL",
  css: "CSS",
  python: "Python",
  text: "Texto puro",
};

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
  {
    key: "file",
    type: "text",
    label: "Arquivo",
    max: 40,
    placeholder: "cache.ts",
  },
  {
    key: "lang",
    type: "select",
    label: "Linguagem",
    options: LANG_IDS.map((id) => ({ value: id, label: LANG_LABELS[id] })),
  },
  // O teto de 14 linhas é o da §10.3 do design system, e ele não foi escolhido duas vezes:
  // a região de 866px menos os 92 da barra e os 32 do padding de baixo deixa 742px, que a
  // 51px por linha dão exatamente 14. O contador fica âmbar acima disso e não trava —
  // quem reprova é o guard, medindo altura.
  {
    key: "code",
    type: "code",
    label: "Código",
    maxLines: 14,
  },
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
