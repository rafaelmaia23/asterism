/**
 * Campos, opções e schema do `context`, conforme a §11.4 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é
 * quem garante que não divirjam.
 *
 * As chaves são as do vocabulário canônico da §6: `heading` é o título de qualquer
 * template, `body` é o texto corrido. `body` é a chave que o `code-annotated` e o
 * `split-vertical` vão reusar, e é o que torna a troca entre os três uma migração exata —
 * mesma chave, mesma forma de valor.
 */

import { z } from "zod";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

/**
 * O kicker vem de `shared/fields.ts`, como em todo template. Aqui ele **nasce desligado**:
 * o título do slide já ocupa o topo, e ligar os dois é escolha de quem edita.
 *
 * Os limites são conselho, não trava: quem reprova é o guard. §11.0 dos templates.
 */
export const fields: Field[] = [
  ...sharedFields,
  // Sem `md` no título e com `md` no corpo: a §11.4 dá marcação só ao parágrafo, e é a
  // mesma divisão do `text-bullets`. Num parágrafo longo, `[[destaque]]` numa frase é o
  // que faz o slide ser lido em três segundos por quem só desliza.
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 60,
    rows: 2,
  },
  // O limite de 320 sai da região: 38 caracteres por linha dão cerca de oito linhas, e
  // oito linhas de 60px ocupam 480px dos 866 disponíveis. A folga é de propósito — texto
  // que preenche a região inteira é o slide que pedia dois.
  {
    key: "body",
    type: "textarea",
    label: "Texto",
    max: 320,
    md: true,
    rows: 6,
  },
];

/** As oito de `shared/options.ts`, e nada mais: o `context` não tem opção própria. */
export const options: Field[] = [...sharedOptions];

export const contextSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
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

export type ContextFields = z.infer<typeof contextSchema>["fields"];
export type ContextOptions = z.infer<typeof contextSchema>["options"];
