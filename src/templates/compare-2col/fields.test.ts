import { describe, expect, test } from "vitest";
import { compare2colSchema, fields, options } from "@/templates/compare-2col/fields";
import { compare2colMeta } from "@/templates/compare-2col/meta";
import { kickerField } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";

const { defaults } = compare2colMeta;

describe("compare-2col", () => {
  test("os defaults da §11.8 validam contra o próprio schema", () => {
    expect(() => compare2colSchema.parse(defaults)).not.toThrow();
  });

  test("o schema rejeita uma opção do tipo errado", () => {
    expect(() =>
      compare2colSchema.parse({
        fields: defaults.fields,
        options: { ...defaults.options, showRule: "sim" },
      }),
    ).toThrow();
  });

  test("o schema rejeita metade do par", () => {
    expect(() =>
      compare2colSchema.parse({
        fields: { ...defaults.fields, after: undefined },
        options: defaults.options,
      }),
    ).toThrow();
  });

  test("descritor e defaults descrevem as mesmas chaves, na mesma ordem", () => {
    expect(fields.map((field) => field.key)).toEqual(Object.keys(defaults.fields));
    expect(options.map((option) => option.key)).toEqual(Object.keys(defaults.options));
  });

  /**
   * A ordem é a da §11.8, e ela é a de leitura: o par esquerdo inteiro antes do direito,
   * não os dois rótulos seguidos dos dois conteúdos. Quem edita escreve uma coluna de cada
   * vez.
   */
  test("os campos são os da §11.8, na ordem em que ela os lista", () => {
    expect(fields.map((field) => field.key)).toEqual([
      "kicker",
      "heading",
      "beforeLabel",
      "before",
      "afterLabel",
      "after",
    ]);
  });

  test("o kicker é o campo compartilhado, não uma cópia — decisão 14", () => {
    expect(fields.find((field) => field.key === "kicker")).toBe(kickerField);
  });

  test("as opções são exatamente as oito compartilhadas", () => {
    expect(options).toEqual(sharedOptions);
  });

  /**
   * O par é **simétrico**: mesmo tipo, mesmo limite e mesma marcação dos dois lados. Uma
   * assimetria aqui apareceria como uma coluna que aceita o que a outra recusa, no único
   * template da biblioteca cujas duas metades são lidas como uma coisa só.
   */
  test("os dois rótulos são texto literal de 20", () => {
    for (const key of ["beforeLabel", "afterLabel"]) {
      expect(fields.find((field) => field.key === key)).toMatchObject({
        type: "text",
        max: 20,
      });
      expect(fields.find((field) => field.key === key)).not.toHaveProperty("md", true);
    }
  });

  test("os dois conteúdos são textarea de 200 com marcação", () => {
    for (const key of ["before", "after"]) {
      expect(fields.find((field) => field.key === key)).toMatchObject({
        type: "textarea",
        max: 200,
        md: true,
      });
    }
  });

  test("heading é textarea sem marcação, limite 60", () => {
    expect(fields.find((field) => field.key === "heading")).toMatchObject({
      type: "textarea",
      label: "Título",
      max: 60,
    });
    expect(fields.find((field) => field.key === "heading")).not.toHaveProperty("md", true);
  });

  test("nasce sem grade e sem cabeçalho, no grupo de conteúdo", () => {
    expect(compare2colMeta.background).toBe("plain");
    expect(compare2colMeta.group).toBe("content");
    expect(defaults.options.showGrid).toBe(false);
    expect(defaults.options.showHeader).toBe(false);
  });

  /**
   * O limite de 200 são cerca de sete linhas por coluna — 336px dos 866 disponíveis —, e a
   * folga é deliberada: comparação que enche as duas colunas até o fim não se lê em três
   * segundos. Os defaults não podem nascer no teto do próprio conselho.
   */
  test("os dois conteúdos que nascem cabem no limite do descritor", () => {
    expect(defaults.fields.before.length).toBeLessThanOrEqual(200);
    expect(defaults.fields.after.length).toBeLessThanOrEqual(200);
  });

  /** §11.8: os rótulos dizem o que mudou, e cabem numa linha só. */
  test("os rótulos que nascem cabem no limite de 20", () => {
    expect(defaults.fields.beforeLabel.length).toBeLessThanOrEqual(20);
    expect(defaults.fields.afterLabel.length).toBeLessThanOrEqual(20);
  });
});
