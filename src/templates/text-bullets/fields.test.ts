import { describe, expect, test } from "vitest";
import { showGridOption } from "@/templates/shared/options";
import { textBulletsSchema, fields, options } from "@/templates/text-bullets/fields";
import { textBulletsMeta } from "@/templates/text-bullets/meta";

describe("text-bullets", () => {
  test("os defaults da §11.2 validam contra o próprio schema", () => {
    expect(() => textBulletsSchema.parse(textBulletsMeta.defaults)).not.toThrow();
  });

  test("o schema rejeita um anchor que não existe", () => {
    expect(() =>
      textBulletsSchema.parse({
        fields: textBulletsMeta.defaults.fields,
        options: { showGrid: false, anchor: "bottom" },
      }),
    ).toThrow();
  });

  test("o schema rejeita items que não é lista de string", () => {
    expect(() =>
      textBulletsSchema.parse({
        fields: { heading: "Três coisas", items: "Primeiro ponto" },
        options: textBulletsMeta.defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(
      Object.keys(textBulletsMeta.defaults.fields),
    );
    expect(options.map((option) => option.key)).toEqual(
      Object.keys(textBulletsMeta.defaults.options),
    );
  });

  test("heading é textarea literal, limite 60 — a marcação é dos itens", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      max: 60,
    });
    expect(fields.find((field) => field.key === "heading")).not.toHaveProperty("md", true);
  });

  test("items é list com marcação, teto de 4 itens e 80 caracteres cada", () => {
    expect(fields.find((field) => field.key === "items")).toMatchObject({
      type: "list",
      maxItems: 4,
      maxPerItem: 80,
      md: true,
    });
  });

  /** O que sobrou da extinta tarefa 2.5: a grade é o mesmo descritor em todo template. */
  test("showGrid vem do descritor compartilhado e aparece primeiro", () => {
    expect(options[0]).toBe(showGridOption);
  });

  test("anchor é select com center e top, nessa ordem", () => {
    expect(options.find((option) => option.key === "anchor")).toMatchObject({
      type: "select",
      options: [
        { value: "center", label: "Centralizado" },
        { value: "top", label: "No topo" },
      ],
    });
  });

  test("nasce plain, no grupo de conteúdo, e o default do slide segue o background", () => {
    expect(textBulletsMeta.background).toBe("plain");
    expect(textBulletsMeta.group).toBe("content");
    expect(textBulletsMeta.defaults.options.showGrid).toBe(false);
  });
});
