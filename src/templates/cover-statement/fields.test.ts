import { describe, expect, test } from "vitest";
import { coverStatementSchema, fields, options } from "@/templates/cover-statement/fields";
import { coverStatementMeta } from "@/templates/cover-statement/meta";
import { kickerField } from "@/templates/shared/fields";

describe("cover-statement", () => {
  test("os defaults da §11.1 validam contra o próprio schema", () => {
    expect(() => coverStatementSchema.parse(coverStatementMeta.defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      coverStatementSchema.parse({
        fields: coverStatementMeta.defaults.fields,
        options: { showChevron: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita um campo faltando", () => {
    expect(() =>
      coverStatementSchema.parse({
        fields: { kicker: "log/ · 01" },
        options: coverStatementMeta.defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(
      Object.keys(coverStatementMeta.defaults.fields),
    );
    expect(options.map((option) => option.key)).toEqual(
      Object.keys(coverStatementMeta.defaults.options),
    );
  });

  /**
   * O descritor do kicker mudou de casa na 2F: era declarado aqui e virou compartilhado.
   * O que a capa promete agora é expor **o mesmo objeto** — a forma dele é conferida em
   * `shared/fields.test.ts`, e comparar por identidade é o que impede a capa de reescrevê-lo
   * com as mesmas propriedades e voltar a divergir.
   */
  test("o kicker é o campo compartilhado, não uma cópia — decisão 14", () => {
    expect(fields.find((field) => field.key === "kicker")).toBe(kickerField);
  });

  test("heading é textarea com marcação, limite 70", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      max: 70,
      md: true,
    });
  });
});
