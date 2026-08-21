import { describe, expect, test } from "vitest";
import { coverStatementSchema, fields, options } from "@/templates/cover-statement/fields";
import { coverStatementMeta } from "@/templates/cover-statement/meta";

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

  test("kicker é texto digitado e literal — decisão 14", () => {
    expect(fields.find((field) => field.key === "kicker")).toEqual({
      key: "kicker",
      type: "text",
      label: "Kicker",
      max: 12,
      placeholder: "api/ · 04",
    });
  });

  test("heading é textarea com marcação, limite 70", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      max: 70,
      md: true,
    });
  });
});
