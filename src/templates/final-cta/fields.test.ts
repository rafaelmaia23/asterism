import { describe, expect, test } from "vitest";
import { finalCtaSchema, fields, options } from "@/templates/final-cta/fields";
import { finalCtaMeta } from "@/templates/final-cta/meta";
import { showGridOption } from "@/templates/shared/options";

describe("final-cta", () => {
  test("os defaults da §11.3 validam contra o próprio schema", () => {
    expect(() => finalCtaSchema.parse(finalCtaMeta.defaults)).not.toThrow();
  });

  test("o schema rejeita showArrow que não é booleano", () => {
    expect(() =>
      finalCtaSchema.parse({
        fields: finalCtaMeta.defaults.fields,
        options: { ...finalCtaMeta.defaults.options, showArrow: "sim" },
      }),
    ).toThrow();
  });

  /** O lead é opcional no uso, não no dado: vazio é string vazia, nunca ausente. */
  test("o schema aceita lead vazio e rejeita lead ausente", () => {
    expect(() =>
      finalCtaSchema.parse({
        fields: { ...finalCtaMeta.defaults.fields, lead: "" },
        options: finalCtaMeta.defaults.options,
      }),
    ).not.toThrow();

    expect(() =>
      finalCtaSchema.parse({
        fields: { heading: "Um fecho", cta: "blog.maiahub.com.br" },
        options: finalCtaMeta.defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(Object.keys(finalCtaMeta.defaults.fields));
    expect(options.map((option) => option.key)).toEqual(
      Object.keys(finalCtaMeta.defaults.options),
    );
  });

  /**
   * As três chaves são as do vocabulário canônico da §6 do documento de contexto —
   * `heading` é o título de qualquer template, e é o que fará o `migrateFields` da 2.10
   * ser uma interseção de chaves.
   */
  test("heading é o único campo com marcação", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      max: 55,
      md: true,
    });
    expect(fields.filter((field) => "md" in field && field.md)).toHaveLength(1);
  });

  test("lead é textarea de 90 e cta é text de 40, os dois literais", () => {
    expect(fields.find((field) => field.key === "lead")).toMatchObject({
      type: "textarea",
      max: 90,
    });
    expect(fields.find((field) => field.key === "cta")).toMatchObject({
      type: "text",
      max: 40,
    });
  });

  /** O que sobrou da extinta tarefa 2.5: a grade é o mesmo descritor em todo template. */
  test("showGrid vem do descritor compartilhado e aparece primeiro", () => {
    expect(options[0]).toBe(showGridOption);
  });

  test("showArrow é toggle e vem depois das seis compartilhadas", () => {
    expect(options.at(-1)).toMatchObject({ key: "showArrow", type: "toggle" });
    expect(options).toHaveLength(7);
  });

  test("nasce grid, no grupo final, e com o rodapé completo da decisão 29", () => {
    expect(finalCtaMeta.background).toBe("grid");
    expect(finalCtaMeta.group).toBe("final");
    expect(finalCtaMeta.defaults.options.showGrid).toBe(true);
    expect(finalCtaMeta.defaults.options.showLogo).toBe(true);
    expect(finalCtaMeta.defaults.options.showHandle).toBe(true);
    // O fechamento não convida para o próximo: não há próximo.
    expect(finalCtaMeta.defaults.options.showChevron).toBe(false);
  });
});
