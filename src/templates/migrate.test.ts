import { describe, expect, test } from "vitest";
import { z } from "zod";
import type { FieldValue } from "@/deck/types";
import { migrateFields } from "@/templates/migrate";
import { get } from "@/templates";
import type { Field, TemplateDef } from "@/templates/types";

/**
 * Templates que só existem aqui. A migração não pode depender de quais templates a
 * biblioteca tem hoje: ela conhece dois descritores e um mapa de valores, e o teste é o
 * que garante isso — se algum dia ela passar a consultar o registry, este arquivo quebra.
 */
function fakeTemplate(
  id: string,
  fields: Field[],
  defaults: Record<string, FieldValue>,
): TemplateDef {
  return {
    id,
    label: id,
    group: "content",
    background: "plain",
    fields,
    options: [],
    schema: z.object({
      fields: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
      options: z.record(z.string(), z.union([z.string(), z.boolean()])),
    }),
    defaults: { fields: defaults, options: {} },
    Component: () => null,
  } satisfies TemplateDef;
}

const from = fakeTemplate(
  "de",
  [
    { key: "kicker", type: "text", label: "Etiqueta" },
    { key: "heading", type: "textarea", label: "Título" },
    { key: "lead", type: "textarea", label: "Linha fina" },
    { key: "items", type: "list", label: "Tópicos", maxItems: 4 },
  ],
  { kicker: "log/ · 01", heading: "Padrão de origem", lead: "", items: [] },
);

const to = fakeTemplate(
  "para",
  [
    { key: "heading", type: "textarea", label: "Título" },
    // Mesma chave dos dois lados, formas de valor diferentes: lá é lista, aqui é texto.
    { key: "items", type: "text", label: "Tópicos" },
    { key: "cta", type: "text", label: "Destino" },
  ],
  { heading: "Padrão de destino", items: "", cta: "blog.maiahub.com.br" },
);

describe("migrateFields", () => {
  test("chave declarada nos dois migra o valor digitado", () => {
    const migrado = migrateFields(from, to, { heading: "O que eu escrevi", items: [] });

    expect(migrado.heading).toBe("O que eu escrevi");
  });

  test("string vazia migra como vazia — o que se apagou continua apagado", () => {
    const migrado = migrateFields(from, to, { heading: "", items: [] });

    expect(migrado.heading).toBe("");
  });

  test("chave que só o template de origem declara é descartada", () => {
    const migrado = migrateFields(from, to, { kicker: "log/ · 01", heading: "x", items: [] });

    expect("kicker" in migrado).toBe(false);
  });

  test("chave que só o destino declara nasce com o default do descritor", () => {
    const migrado = migrateFields(from, to, { heading: "x", items: [] });

    expect(migrado.cta).toBe("blog.maiahub.com.br");
  });

  /**
   * O vocabulário canônico da §6 promete a mesma chave para o mesmo papel, não a mesma
   * forma de valor: `list` guarda array e todo o resto guarda string. Migrar por cima
   * dessa diferença entregaria ao componente um dado que ele não sabe desenhar.
   */
  test("mesma chave com forma incompatível não migra — fica o default do destino", () => {
    const migrado = migrateFields(from, to, { heading: "x", items: ["a", "b"] });

    expect(migrado.items).toBe("");
  });

  test("chave que o dado tem mas nenhum descritor declara não passa", () => {
    const migrado = migrateFields(from, to, { heading: "x", items: [], sobra: "lixo" });

    expect("sobra" in migrado).toBe(false);
  });

  /**
   * A mesma armadilha que `createSlide` evita: dois slides compartilhando o array de um
   * campo `list` é bug silencioso e caro de achar.
   */
  test("o resultado não compartilha referência com os defaults do destino", () => {
    const lista = fakeTemplate(
      "lista",
      [{ key: "items", type: "list", label: "Tópicos", maxItems: 4 }],
      { items: ["um", "dois"] },
    );

    const migrado = migrateFields(from, lista, { heading: "x" });

    expect(migrado.items).toEqual(["um", "dois"]);
    expect(migrado.items).not.toBe(lista.defaults.fields.items);
  });

  test("não muta o mapa de campos que entrou", () => {
    const fields = { kicker: "log/ · 01", heading: "x", items: [] };

    migrateFields(from, to, fields);

    expect(fields).toEqual({ kicker: "log/ · 01", heading: "x", items: [] });
  });

  /**
   * O caso que a 2.11 aciona de verdade. É a decisão 13 sendo cobrada: `heading` é o
   * título em qualquer template, e é só por isso que a troca não apaga trabalho.
   */
  test("da capa para os tópicos, com os templates de verdade", () => {
    const migrado = migrateFields(get("cover-statement"), get("text-bullets"), {
      kicker: "log/ · 01",
      heading: "Ninguém [[lê docs]]",
    });

    expect(migrado.heading).toBe("Ninguém [[lê docs]]");
    expect("kicker" in migrado).toBe(false);
    expect(migrado.items).toEqual(get("text-bullets").defaults.fields.items);
  });
});
