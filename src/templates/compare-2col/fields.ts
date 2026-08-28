/**
 * Campos, opções e schema do `compare-2col`, conforme a §11.8 dos templates.
 *
 * O descritor desenha o formulário, o zod valida o conteúdo — decisão 4 da §16 do
 * documento de contexto. São duas descrições da mesma coisa de propósito, e o teste é quem
 * garante que não divirjam.
 *
 * ## As quatro chaves do par são **próprias**, e é decisão, não esquecimento
 *
 * `beforeLabel`, `before`, `afterLabel` e `after` não entram no vocabulário canônico da §6:
 * nenhum segundo template tem o papel antes/depois, e vocabulário com um usuário só reserva
 * à biblioteca inteira o que um layout usa. Foi o único caso em dez templates, e a §6
 * registra as quatro numa tabela à parte, de chave própria. Decisão 45.
 *
 * A consequência é conhecida e aceita: sair deste template descarta o par, porque a
 * migração é uma interseção de chaves. `kicker` e `heading` atravessam, que são as duas que
 * os dez declaram. Se um segundo template de comparação aparecer, é aí que as quatro sobem.
 *
 * O par é **simétrico** por construção — mesmo tipo, mesmo limite, mesma marcação dos dois
 * lados. É o único template da biblioteca cujas duas metades são lidas como uma coisa só, e
 * uma assimetria apareceria como uma coluna que aceita o que a outra recusa.
 */

import { z } from "zod";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import type { Field } from "@/templates/types";

export const fields: Field[] = [
  ...sharedFields,
  {
    key: "heading",
    type: "textarea",
    label: "Título",
    max: 60,
    rows: 2,
  },
  // A ordem é a de leitura: o par esquerdo inteiro antes do direito, e não os dois rótulos
  // seguidos dos dois conteúdos. Quem edita escreve uma coluna de cada vez.
  //
  // Os 20 caracteres do rótulo são conselho para mantê-lo numa linha só. "Antes" e "Depois"
  // funcionam; `sem cache` e `com cache` funcionam melhor, porque dizem o que mudou em vez
  // de dizer que mudou — §11.8.
  {
    key: "beforeLabel",
    type: "text",
    label: "Rótulo da esquerda",
    max: 20,
    placeholder: "Antes",
  },
  // O limite de 200 são cerca de sete linhas por coluna, 336px dos 866 disponíveis. A folga
  // é deliberada: comparação que enche as duas colunas até o fim não se lê em três
  // segundos, que é o tempo que um slide de carrossel tem.
  {
    key: "before",
    type: "textarea",
    label: "Coluna da esquerda",
    max: 200,
    md: true,
    rows: 5,
  },
  {
    key: "afterLabel",
    type: "text",
    label: "Rótulo da direita",
    max: 20,
    placeholder: "Depois",
  },
  {
    key: "after",
    type: "textarea",
    label: "Coluna da direita",
    max: 200,
    md: true,
    rows: 5,
  },
];

/** As oito de `shared/options.ts`, e nada mais: o `compare-2col` não tem opção própria. */
export const options: Field[] = [...sharedOptions];

export const compare2colSchema = z.object({
  fields: z.object({
    kicker: z.string(),
    heading: z.string(),
    beforeLabel: z.string(),
    before: z.string(),
    afterLabel: z.string(),
    after: z.string(),
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

export type Compare2colFields = z.infer<typeof compare2colSchema>["fields"];
export type Compare2colOptions = z.infer<typeof compare2colSchema>["options"];
