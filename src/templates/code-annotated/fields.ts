/**
 * Campos, opções e schema do `code-annotated`, conforme a §11.7 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é quem
 * garante que não divirjam.
 *
 * **Nenhuma chave é nova.** As três do bloco de código são os mesmos objetos do
 * `code-window`, vindos de `shared/fields.ts`, e `body` é a chave canônica da §6 — a mesma
 * do `context` e do `split-vertical`, e não uma `note` própria: o papel é o mesmo texto
 * corrido, e chave própria daria ao par a incompatibilidade de graça. Decisão 45.
 *
 * O que **não** é compartilhado é o descritor de `body`, e a diferença é o limite: 180 aqui
 * contra 320 no `context`. O limite acompanha a região — quatro linhas de 270px contra oito
 * de 866 —, e a §6 é explícita em que o comum é o papel e o rótulo, não a medida.
 */

import { z } from "zod";
import { codeFields, sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

export const fields: Field[] = [
  ...sharedFields,
  // Sem `md` no título, como no `code-window`: um título marcado ao lado de um bloco de
  // código realçado é o segundo nível de ênfase que a §3.4 do design system proíbe.
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 60,
    rows: 2,
  },
  ...codeFields,
  // Com `md`, e aqui o marcador natural é o `código` inline: citar um identificador do
  // bloco acima é exatamente o que a anotação faz. O limite de 180 são as quatro linhas
  // dos 270px da região — conselho, como todos: quem reprova é o guard.
  {
    key: "body",
    type: "textarea",
    label: "A explicação",
    max: 180,
    md: true,
    rows: 4,
  },
];

/** As oito de `shared/options.ts`, e nada mais: o `code-annotated` não tem opção própria. */
export const options: Field[] = [...sharedOptions];

/**
 * `lang` é `string`, e não um enum das nove — o mesmo motivo do `code-window`: a validação
 * derruba dado torto, não dado velho, e uma linguagem que saiu do bundle faria o slide
 * perder a cor, não o conteúdo. Decisão 41.
 */
export const codeAnnotatedSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
    file: z.string(),
    lang: z.string(),
    code: z.string(),
    body: z.string(),
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

export type CodeAnnotatedFields = z.infer<typeof codeAnnotatedSchema>["fields"];
export type CodeAnnotatedOptions = z.infer<typeof codeAnnotatedSchema>["options"];
