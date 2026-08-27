import { describe, expect, test } from "vitest";
import { contextSchema, fields, options } from "@/templates/context/fields";
import { contextMeta } from "@/templates/context/meta";
import { kickerField } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";

describe("context", () => {
  test("os defaults da §11.4 validam contra o próprio schema", () => {
    expect(() => contextSchema.parse(contextMeta.defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      contextSchema.parse({
        fields: contextMeta.defaults.fields,
        options: { ...contextMeta.defaults.options, showRule: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita um campo faltando", () => {
    expect(() =>
      contextSchema.parse({
        fields: { kicker: "log/ · 02", heading: "O que estava acontecendo" },
        options: contextMeta.defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(
      Object.keys(contextMeta.defaults.fields),
    );
    expect(options.map((option) => option.key)).toEqual(
      Object.keys(contextMeta.defaults.options),
    );
  });

  test("o kicker é o campo compartilhado, não uma cópia — decisão 14", () => {
    expect(fields.find((field) => field.key === "kicker")).toBe(kickerField);
  });

  /** Nenhuma opção própria: o `context` expõe só as oito da §11.0. */
  test("as opções são exatamente as oito compartilhadas", () => {
    expect(options).toEqual(sharedOptions);
  });

  /**
   * O título é literal e o corpo aceita marcação — §11.4. É a mesma divisão do
   * `text-bullets`, e pelo mesmo motivo: a ênfase vale onde há muitas linhas seguidas.
   */
  test("heading é textarea sem marcação, limite 60", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      label: "Título",
      max: 60,
    });
    expect(fields.find((field) => field.key === "heading")).not.toHaveProperty("md", true);
  });

  test("body é textarea com marcação, limite 320", () => {
    expect(fields.find((field) => field.key === "body")).toMatchObject({
      type: "textarea",
      max: 320,
      md: true,
    });
  });
});
