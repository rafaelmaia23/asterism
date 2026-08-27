import { describe, expect, test } from "vitest";
import { kickerField } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import { textImpactSchema, fields, options } from "@/templates/text-impact/fields";
import { textImpactMeta } from "@/templates/text-impact/meta";

describe("text-impact", () => {
  test("os defaults da §11.5 validam contra o próprio schema", () => {
    expect(() => textImpactSchema.parse(textImpactMeta.defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      textImpactSchema.parse({
        fields: textImpactMeta.defaults.fields,
        options: { ...textImpactMeta.defaults.options, showGrid: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita um campo faltando", () => {
    expect(() =>
      textImpactSchema.parse({
        fields: { kicker: "log/ · 06" },
        options: textImpactMeta.defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(
      Object.keys(textImpactMeta.defaults.fields),
    );
    expect(options.map((option) => option.key)).toEqual(
      Object.keys(textImpactMeta.defaults.options),
    );
  });

  test("o kicker é o campo compartilhado, não uma cópia — decisão 14", () => {
    expect(fields.find((field) => field.key === "kicker")).toBe(kickerField);
  });

  test("as opções são exatamente as oito compartilhadas", () => {
    expect(options).toEqual(sharedOptions);
  });

  /**
   * Um campo próprio e mais nada — nem lead, nem atribuição, nem legenda. Cada campo a
   * mais é um convite a preencher o slide que existe para ficar vazio. §11.5.
   */
  test("só o kicker compartilhado e a frase", () => {
    expect(fields.map((field) => field.key)).toEqual(["kicker", "heading"]);
  });

  /**
   * O limite é o mesmo 70 da capa, porque a região e o corpo tipográfico são os mesmos. É
   * o que faz a troca `cover-statement` ↔ `text-impact` ser exata nos dois sentidos:
   * mesma chave, mesma forma, mesmo conselho de limite.
   */
  test("heading é textarea com marcação, limite 70 — o mesmo da capa", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      label: "Título",
      max: 70,
      md: true,
    });
  });
});
