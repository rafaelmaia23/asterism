import { describe, expect, test } from "vitest";
import { fields, imageCaptionSchema, options } from "@/templates/image-caption/fields";
import { imageCaptionMeta } from "@/templates/image-caption/meta";
import { kickerField } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import { fields as splitFields } from "@/templates/split-vertical/fields";

const { defaults } = imageCaptionMeta;

describe("image-caption", () => {
  test("os defaults da §11.10 validam contra o próprio schema", () => {
    expect(() => imageCaptionSchema.parse(defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      imageCaptionSchema.parse({
        fields: defaults.fields,
        options: { ...defaults.options, showLogo: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita um `imageFit` fora do par da §11.9", () => {
    expect(() =>
      imageCaptionSchema.parse({
        fields: defaults.fields,
        options: { ...defaults.options, imageFit: "none" },
      }),
    ).toThrow();
  });

  test("o schema aceita qualquer string em `image`, inclusive um id órfão", () => {
    expect(() =>
      imageCaptionSchema.parse({
        fields: { ...defaults.fields, image: "id-que-ninguem-tem" },
        options: defaults.options,
      }),
    ).not.toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(Object.keys(defaults.fields));
    expect(options.map((option) => option.key)).toEqual(Object.keys(defaults.options));
  });

  test("os campos são os da §11.10, na ordem em que ela os lista", () => {
    expect(fields.map((field) => field.key)).toEqual(["kicker", "heading", "caption", "image"]);
  });

  test("o kicker é o descritor compartilhado, não uma cópia", () => {
    expect(fields[0]).toBe(kickerField);
  });

  test("as oito compartilhadas abrem a lista de opções, e o `imageFit` vem depois", () => {
    expect(options.slice(0, sharedOptions.length)).toEqual(sharedOptions);
    expect(options.map((option) => option.key).at(-1)).toBe("imageFit");
  });

  test("os limites da §11.10", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      label: "Título",
      max: 40,
    });
    expect(fields.find((field) => field.key === "caption")).toMatchObject({
      type: "textarea",
      label: "Legenda",
      max: 90,
      md: true,
    });
  });

  /**
   * A regra da §6: a mesma chave tem o mesmo **tipo de campo** na biblioteca inteira, porque
   * `migrateFields` compara chave e forma de valor. É isso que faz trocar entre os dois
   * templates de mídia preservar a imagem escolhida.
   */
  test("`image` tem o mesmo tipo do `split-vertical`, e o `ratio` da própria faixa", () => {
    const aqui = fields.find((field) => field.key === "image");
    const la = splitFields.find((field) => field.key === "image");

    expect(aqui).toEqual({ key: "image", type: "image", label: "Imagem", ratio: "108:91" });
    expect(aqui).not.toBe(la);
    expect(aqui?.type).toBe(la?.type);
  });

  test("`imageFit` é o mesmo par de valores dos dois, declarado em cada um", () => {
    const aqui = options.find((option) => option.key === "imageFit");

    expect(aqui).toMatchObject({
      type: "select",
      options: [
        { value: "cover", label: "Preencher e recortar" },
        { value: "contain", label: "Caber inteira" },
      ],
    });
  });

  test("a legenda aceita marcação e o título não", () => {
    expect(fields.find((field) => field.key === "heading")).not.toHaveProperty("md", true);
    expect(fields.find((field) => field.key === "caption")).toHaveProperty("md", true);
  });

  test("nasce com a grade desligada e sem imagem, em `cover`", () => {
    expect(defaults.options.showGrid).toBe(false);
    expect(imageCaptionMeta.background).toBe("plain");
    expect(defaults.fields.image).toBe("");
    expect(defaults.options.imageFit).toBe("cover");
  });
});
