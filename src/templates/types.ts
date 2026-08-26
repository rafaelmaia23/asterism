/**
 * O descritor declarativo da §8 do documento de contexto.
 *
 * A seta é `templates → deck`: aqui se importa `src/deck`, nunca o contrário. Quem
 * conhece a biblioteca de templates é o registry.
 */

import type { FC } from "react";
import type { ZodType } from "zod";
import type { DeckMeta, FieldValue, OptionValue, TemplateId } from "@/deck/types";

/**
 * O descritor de um campo. **O zod valida, o descritor desenha** — decisão 4 da §16 do
 * documento de contexto. Gerar o formulário a partir do schema custa mais do que rende:
 * unions, arrays, defaults e refinements viram caso especial até o gerador ficar maior
 * que os formulários que geraria.
 *
 * A flag `md` marca quais campos aceitam marcação inline. Campo sem ela é literal.
 *
 * Os limites (`max`, `maxItems`, `maxPerItem`, `maxLines`) são conselho, não trava — ver
 * a §11.0 dos templates. Quem reprova de fato é o guard de transbordo, medindo altura.
 */
export type Field = (
  | { key: string; type: "text"; label: string; max?: number; placeholder?: string; md?: boolean }
  | { key: string; type: "textarea"; label: string; max?: number; md?: boolean; rows?: number }
  | { key: string; type: "list"; label: string; maxItems: number; maxPerItem?: number; md?: boolean }
  | { key: string; type: "image"; label: string; ratio?: string }
  | { key: string; type: "code"; label: string; maxLines: number }
  | { key: string; type: "select"; label: string; options: { value: string; label: string }[] }
  | { key: string; type: "toggle"; label: string }
) &
  Sectioned;

/**
 * A seção do inspector a que o controle pertence.
 *
 * É **metadado de desenho e nada mais**: `fields` e `options` continuam sendo a lista
 * completa e plana das chaves de cada saco, e o slide continua guardando os dois separados.
 * O que a seção diz é onde o controle aparece, não onde o valor mora — é o que deixa o
 * kicker, que é conteúdo, desenhar junto do interruptor do cabeçalho, que é apresentação,
 * sem que a §6 do documento de contexto deixe de valer.
 *
 * Ausente, o campo cai em `content` e a opção em `style` — as duas seções sem interruptor.
 * É por isso que nenhum descritor de template precisou ser editado quando as seções
 * chegaram.
 *
 * `section` não é o `group` do `TemplateDef`: aquele é a função narrativa do template
 * inteiro — capa, conteúdo, código —, este é uma faixa do formulário.
 */
export type Sectioned = { section?: string };

/**
 * Uma seção do inspector.
 *
 * `toggle` é a chave de uma opção booleana declarada em `options`: quando existe, o
 * interruptor desenha no cabeçalho da seção — e não como mais uma linha dentro dela —, e os
 * controles da seção só aparecem com ele ligado. Sem `toggle`, a seção é só um agrupamento,
 * e é sempre visível.
 *
 * O interruptor continua em `options` de propósito. Declará-lo aqui faria `options` deixar
 * de ser a lista completa das chaves de opção, e é esse invariante que o teste de paridade
 * descritor↔defaults de cada template confere.
 */
export type FieldSection = { key: string; label: string; toggle?: string };

/** Função narrativa do template, não estética — ver a tabela dos dez da §8. */
export type TemplateGroup = "cover" | "content" | "code" | "media" | "final";

/** O grid de fundo só entra onde não compete com o conteúdo. §4.3 do design system. */
export type TemplateBackground = "plain" | "grid";

export type TemplateComponentProps<F, O> = {
  fields: F;
  options: O;
  deck: DeckMeta;
  index: number;
  total: number;
};

/**
 * Os limites em `F` e `O` são o que faz `defaults` ser atribuível ao `SlideDefaults` de
 * `src/deck/types.ts` — o contrato pelo qual `createSlide` recebe os defaults de um
 * template sem que `src/deck` importe o registry.
 */
export type TemplateDef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends Record<string, FieldValue> = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  O extends Record<string, OptionValue> = any,
> = {
  id: TemplateId;
  label: string;
  group: TemplateGroup;
  background: TemplateBackground;
  fields: Field[];
  options: Field[];
  /** As seções do inspector, na ordem em que ele as desenha. Ver `shared/sections.ts`. */
  sections: FieldSection[];
  schema: ZodType<{ fields: F; options: O }>;
  defaults: { fields: F; options: O };
  Component: FC<TemplateComponentProps<F, O>>;
};

/**
 * A forma sob a qual o registry guarda templates de campos diferentes. Precisa ser
 * `any`: `Component` é propriedade de tipo função, então sob `strictFunctionTypes` um
 * `TemplateDef<CoverFields>` não é atribuível a `TemplateDef<Record<string, FieldValue>>`
 * — os parâmetros são contravariantes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTemplateDef = TemplateDef<any, any>;
