/**
 * A migração de conteúdo na troca de layout — tarefa 2.10.
 *
 * É aqui que a **decisão 13** da §16 do documento de contexto se paga. Porque o
 * vocabulário de campos é único e em inglês — `heading` é o título em qualquer template,
 * `items` é a lista de tópicos em qualquer um —, migrar é uma **interseção de chaves**, e
 * não uma tabela de equivalência que precisaria de uma linha nova a cada par de templates.
 *
 * Mora em `src/templates` e não em `src/editor` porque a regra é propriedade do
 * vocabulário, não do formulário: ela conhece dois descritores e um mapa de valores, e
 * nada mais. Nem o registry — quem resolve id em descritor é quem chama. `src/deck` está
 * fora de questão pela seta de dependência: ele não importa template nenhum.
 *
 * **O que a troca preserva é `fields`, nunca `options`** — §6 e decisão 5. As opções
 * resetam para os defaults do template novo, e é o chamador quem faz isso: são dois
 * objetos separados no modelo justamente para que esta regra seja possível.
 */

import type { FieldValue } from "@/deck/types";
import type { AnyTemplateDef, Field } from "@/templates/types";

/**
 * A forma de valor que um tipo de campo guarda. `list` guarda array; todo o resto guarda
 * string — §6 do documento de contexto.
 *
 * O vocabulário canônico promete a mesma chave para o mesmo **papel**, não para a mesma
 * forma: nada impede que um template declare `items` como lista e outro como texto. Migrar
 * por cima dessa diferença entregaria ao componente um dado que ele não sabe desenhar.
 */
function shapeOf(field: Field): "list" | "text" {
  return field.type === "list" ? "list" : "text";
}

/** O descritor de uma chave, ou `undefined` se o template não a declara. */
function fieldOf(def: AnyTemplateDef, key: string): Field | undefined {
  return def.fields.find((field) => field.key === key);
}

/** O valor tem a forma que o descritor promete? Dado torto não migra. */
function matches(field: Field, value: FieldValue | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  return shapeOf(field) === "list" ? Array.isArray(value) : typeof value === "string";
}

/**
 * O conteúdo de um slide, relido pelo descritor do template `to`.
 *
 * Parte dos defaults do destino e sobrescreve toda chave que os dois templates declaram e
 * cuja forma de valor bate. Ou seja: chave compartilhada migra o que foi digitado, chave
 * que só a origem tinha é descartada, e chave que só o destino tem nasce com o default do
 * descritor — a mesma coisa que um slide recém-criado recebe.
 *
 * A cópia é profunda pelo motivo de `createSlide`: dois slides compartilhando o array de
 * um campo `list` é bug silencioso e caro de achar.
 */
export function migrateFields(
  from: AnyTemplateDef,
  to: AnyTemplateDef,
  fields: Record<string, FieldValue>,
): Record<string, FieldValue> {
  const migrated: Record<string, FieldValue> = structuredClone(to.defaults.fields);

  for (const target of to.fields) {
    const source = fieldOf(from, target.key);
    const value = fields[target.key];

    if (source && shapeOf(source) === shapeOf(target) && matches(target, value)) {
      migrated[target.key] = structuredClone(value);
    }
  }

  return migrated;
}
