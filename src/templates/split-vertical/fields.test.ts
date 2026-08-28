import { describe, expect, test } from "vitest";
import { kickerField } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import { fields, options, splitVerticalSchema } from "@/templates/split-vertical/fields";
import { splitVerticalMeta } from "@/templates/split-vertical/meta";

const { defaults } = splitVerticalMeta;

describe("split-vertical", () => {
  test("os defaults da §11.9 validam contra o próprio schema", () => {
    expect(() => splitVerticalSchema.parse(defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      splitVerticalSchema.parse({
        fields: defaults.fields,
        options: { ...defaults.options, showRule: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita um `imageFit` fora do par da §11.9", () => {
    expect(() =>
      splitVerticalSchema.parse({
        fields: defaults.fields,
        options: { ...defaults.options, imageFit: "fill" },
      }),
    ).toThrow();
  });

  /**
   * O id órfão é uma string como outra qualquer, e é por isso que ele **passa**: a §11.9
   * quer o slide de pé com a imagem faltando, não o slide derrubado.
   */
  test("o schema aceita qualquer string em `image`, inclusive um id órfão", () => {
    expect(() =>
      splitVerticalSchema.parse({
        fields: { ...defaults.fields, image: "id-que-ninguem-tem" },
        options: defaults.options,
      }),
    ).not.toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(Object.keys(defaults.fields));
    expect(options.map((option) => option.key)).toEqual(Object.keys(defaults.options));
  });

  test("os campos são os da §11.9, na ordem em que ela os lista", () => {
    expect(fields.map((field) => field.key)).toEqual(["kicker", "heading", "body", "image"]);
  });

  test("o kicker é o descritor compartilhado, não uma cópia", () => {
    expect(fields[0]).toBe(kickerField);
  });

  test("as oito compartilhadas abrem a lista de opções, e o `imageFit` vem depois", () => {
    expect(options.slice(0, sharedOptions.length)).toEqual(sharedOptions);
    expect(options.map((option) => option.key).at(-1)).toBe("imageFit");
  });

  test("os limites da §11.9", () => {
    const heading = fields.find((field) => field.key === "heading");
    const body = fields.find((field) => field.key === "body");

    expect(heading).toMatchObject({ type: "textarea", label: "Título", max: 50 });
    expect(body).toMatchObject({ type: "textarea", max: 240, md: true });
  });

  /**
   * A §6 exige que a mesma chave tenha o mesmo **tipo de campo** na biblioteca inteira,
   * porque a migração compara chave e forma. O `ratio` é o que difere entre os dois
   * templates de mídia, e é por isso que o descritor não sobe para `shared/fields.ts` como
   * os três do bloco de código: 5:16 é a faixa deste template.
   */
  test("`image` é do tipo `image`, com o `ratio` da faixa deste template", () => {
    expect(fields.find((field) => field.key === "image")).toEqual({
      key: "image",
      type: "image",
      label: "Imagem",
      ratio: "5:16",
    });
  });

  test("o corpo aceita marcação e o título não", () => {
    expect(fields.find((field) => field.key === "heading")).not.toHaveProperty("md", true);
    expect(fields.find((field) => field.key === "body")).toHaveProperty("md", true);
  });

  test("nasce com a grade desligada — a §11.9 é enfática", () => {
    expect(defaults.options.showGrid).toBe(false);
    expect(splitVerticalMeta.background).toBe("plain");
  });

  test("nasce em `cover`", () => {
    expect(defaults.options.imageFit).toBe("cover");
  });

  test("nasce sem imagem", () => {
    expect(defaults.fields.image).toBe("");
  });
});
