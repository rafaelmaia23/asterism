import { describe, expect, test } from "vitest";
import { LANG_IDS } from "@/code/langs";
import { codeWindowSchema, fields, options } from "@/templates/code-window/fields";
import { codeWindowMeta } from "@/templates/code-window/meta";
import { kickerField } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";

describe("code-window", () => {
  test("os defaults da §11.6 validam contra o próprio schema", () => {
    expect(() => codeWindowSchema.parse(codeWindowMeta.defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      codeWindowSchema.parse({
        fields: codeWindowMeta.defaults.fields,
        options: { ...codeWindowMeta.defaults.options, showGrid: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita um campo faltando", () => {
    expect(() =>
      codeWindowSchema.parse({
        fields: { kicker: "api/ · 04" },
        options: codeWindowMeta.defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(Object.keys(codeWindowMeta.defaults.fields));
    expect(options.map((option) => option.key)).toEqual(
      Object.keys(codeWindowMeta.defaults.options),
    );
  });

  test("o kicker é o campo compartilhado, não uma cópia — decisão 14", () => {
    expect(fields.find((field) => field.key === "kicker")).toBe(kickerField);
  });

  test("as opções são exatamente as oito compartilhadas", () => {
    expect(options).toEqual(sharedOptions);
  });

  test("os campos são os da §11.6, na ordem em que ela os lista", () => {
    expect(fields.map((field) => field.key)).toEqual(["kicker", "heading", "file", "lang", "code"]);
  });

  /**
   * O título é literal e o rótulo é o dos dez — §11.0. Marcação num título que compete com
   * o bloco de código seria um segundo nível de ênfase no mesmo slide, contra a §3.4 do
   * design system.
   */
  test("heading é textarea sem marcação, limite 60", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      label: "Título",
      max: 60,
    });
    expect(fields.find((field) => field.key === "heading")).not.toHaveProperty("md", true);
  });

  test("file é texto de 40, e nunca marcação — é um nome de arquivo", () => {
    expect(fields.find((field) => field.key === "file")).toMatchObject({
      type: "text",
      max: 40,
    });
  });

  /**
   * O que este teste guarda é a segunda metade da regra da §6: a mesma chave tem a mesma
   * **forma** na biblioteca inteira. `code` é o tipo de campo `code`, com o `maxLines` que
   * a §10.3 do design system escreve, e o `code-annotated` da 3E vai declará-lo igual.
   */
  test("code é o tipo `code`, com o teto de 14 linhas da §10.3", () => {
    expect(fields.find((field) => field.key === "code")).toMatchObject({
      type: "code",
      maxLines: 14,
    });
  });

  test("lang oferece exatamente as linguagens que estão no bundle", () => {
    const lang = fields.find((field) => field.key === "lang");

    expect(lang).toMatchObject({ type: "select" });
    expect(lang?.type === "select" && lang.options.map((option) => option.value)).toEqual([
      ...LANG_IDS,
    ]);
  });

  /**
   * A §11.6 diz que a grade nasce desligada, e ali é mais que padrão: a linha do fundo
   * atravessa a janela e compete com o realce. §4.3 do design system.
   */
  test("nasce sem grade e sem cabeçalho", () => {
    expect(codeWindowMeta.background).toBe("plain");
    expect(codeWindowMeta.defaults.options.showGrid).toBe(false);
    expect(codeWindowMeta.defaults.options.showHeader).toBe(false);
  });

  test("o `lang` que nasce é um dos do bundle", () => {
    expect(LANG_IDS).toContain(codeWindowMeta.defaults.fields.lang);
  });

  /** O default não pode nascer reprovado pelo próprio conselho que o campo declara. */
  test("o código que nasce cabe no teto de 14 linhas", () => {
    expect(codeWindowMeta.defaults.fields.code.split("\n").length).toBeLessThanOrEqual(14);
  });
});
