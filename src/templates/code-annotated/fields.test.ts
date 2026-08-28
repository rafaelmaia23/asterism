import { describe, expect, test } from "vitest";
import { LANG_IDS } from "@/code/langs";
import { codeAnnotatedSchema, fields, options } from "@/templates/code-annotated/fields";
import { codeAnnotatedMeta } from "@/templates/code-annotated/meta";
import { fields as codeWindowFields } from "@/templates/code-window/fields";
import { fields as contextFields } from "@/templates/context/fields";
import { codeFields, kickerField } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";

describe("code-annotated", () => {
  test("os defaults da §11.7 validam contra o próprio schema", () => {
    expect(() => codeAnnotatedSchema.parse(codeAnnotatedMeta.defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      codeAnnotatedSchema.parse({
        fields: codeAnnotatedMeta.defaults.fields,
        options: { ...codeAnnotatedMeta.defaults.options, showFooter: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita um campo faltando", () => {
    expect(() =>
      codeAnnotatedSchema.parse({
        fields: { ...codeAnnotatedMeta.defaults.fields, body: undefined },
        options: codeAnnotatedMeta.defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(
      Object.keys(codeAnnotatedMeta.defaults.fields),
    );
    expect(options.map((option) => option.key)).toEqual(
      Object.keys(codeAnnotatedMeta.defaults.options),
    );
  });

  test("os campos são os da §11.7, na ordem em que ela os lista", () => {
    expect(fields.map((field) => field.key)).toEqual([
      "kicker",
      "heading",
      "file",
      "lang",
      "code",
      "body",
    ]);
  });

  test("o kicker é o campo compartilhado, não uma cópia — decisão 14", () => {
    expect(fields.find((field) => field.key === "kicker")).toBe(kickerField);
  });

  test("as opções são exatamente as oito compartilhadas", () => {
    expect(options).toEqual(sharedOptions);
  });

  /**
   * O critério de pronto da 3.13, do lado do dado: **reusa o bloco de código da 3D**. Não
   * é só a janela que se reusa, são os três descritores — e por identidade de objeto, que
   * é o que a §6 pede quando diz que a mesma chave tem o mesmo tipo de campo na biblioteca
   * inteira. Trocar entre os dois templates de código é a troca mais provável da biblioteca,
   * e é ela que este teste protege.
   */
  test("os três do bloco de código são os mesmos objetos do `code-window` — §6", () => {
    for (const field of codeFields) {
      expect(fields).toContain(field);
      expect(codeWindowFields).toContain(field);
    }
  });

  /**
   * `body` é a chave canônica, e não uma `note` própria — decisão 45. O papel é o mesmo
   * texto corrido do `context`, e a chave compartilhada faz a troca entre os dois preservar
   * o que foi escrito. O descritor **não** é o mesmo objeto: o limite acompanha a região, e
   * 180 aqui contra 320 lá é a diferença entre quatro linhas e oito.
   */
  test("body é a chave do `context` com o limite desta região", () => {
    expect(fields.find((field) => field.key === "body")).toMatchObject({
      type: "textarea",
      label: "A explicação",
      max: 180,
      md: true,
    });
    expect(contextFields.find((field) => field.key === "body")).toMatchObject({
      type: "textarea",
    });
  });

  /** O título é literal e o rótulo é o dos dez — §11.0. */
  test("heading é textarea sem marcação, limite 60", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      label: "Título",
      max: 60,
    });
    expect(fields.find((field) => field.key === "heading")).not.toHaveProperty("md", true);
  });

  test("nasce sem grade e sem cabeçalho, e assinado", () => {
    expect(codeAnnotatedMeta.background).toBe("plain");
    expect(codeAnnotatedMeta.group).toBe("code");
    expect(codeAnnotatedMeta.defaults.options.showGrid).toBe(false);
    expect(codeAnnotatedMeta.defaults.options.showHeader).toBe(false);
    expect(codeAnnotatedMeta.defaults.options.showFooter).toBe(true);
  });

  test("o `lang` que nasce é um dos do bundle", () => {
    expect(LANG_IDS).toContain(codeAnnotatedMeta.defaults.fields.lang);
  });

  /**
   * O default não pode nascer reprovado pelo próprio conselho que a região dá. Com a
   * explicação presente e o cabeçalho desligado, o bloco tem 532px — oito linhas pela conta
   * da §11.6 —, e o `maxLines` de 14 do descritor continua sendo o limite estático.
   */
  test("o código que nasce cabe nas oito linhas da região com explicação", () => {
    expect(codeAnnotatedMeta.defaults.fields.code.split("\n").length).toBeLessThanOrEqual(8);
  });
});
