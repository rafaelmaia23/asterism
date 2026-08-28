import { describe, expect, test } from "vitest";
import { createSlide } from "@/deck/factories";
import { get, list } from "@/templates";

describe("biblioteca de templates", () => {
  test("a capa está registrada e sai por id", () => {
    expect(get("cover-statement").label).toBe("Capa — declaração");
  });

  test("o text-bullets está registrado e sai por id", () => {
    expect(get("text-bullets").label).toBe("Tópicos");
  });

  test("o final-cta está registrado e sai por id", () => {
    expect(get("final-cta").label).toBe("Fechamento");
  });

  test("o context está registrado e sai por id", () => {
    expect(get("context").label).toBe("Contexto");
  });

  test("o text-impact está registrado e sai por id", () => {
    expect(get("text-impact").label).toBe("Frase de impacto");
  });

  test("o code-window está registrado e sai por id", () => {
    expect(get("code-window").label).toBe("Código");
  });

  test("o code-annotated está registrado e sai por id", () => {
    expect(get("code-annotated").label).toBe("Código anotado");
  });

  test("o compare-2col está registrado e sai por id", () => {
    expect(get("compare-2col").label).toBe("Comparação");
  });

  test("o split-vertical está registrado e sai por id", () => {
    expect(get("split-vertical").label).toBe("Texto e imagem");
  });

  /**
   * A ordem de registro é a ordem em que a biblioteca se apresenta — no seletor de
   * layout, e em qualquer lista futura. É a narrativa de um carrossel, e é a da tabela da
   * §11 dos templates: a capa abre, o contexto segura, os tópicos desenvolvem, a frase de
   * impacto dá o respiro, o CTA fecha. Um template novo entra onde a narrativa o põe, não
   * no fim da lista.
   */
  test("os templates de mídia entram antes do fechamento", () => {
    expect(list().map((def) => def.id)).toEqual([
      "cover-statement",
      "context",
      "text-bullets",
      "text-impact",
      "code-window",
      "code-annotated",
      "compare-2col",
      "split-vertical",
      "final-cta",
    ]);
  });

  /**
   * O encaixe que a 1A deixou preparado: `createSlide` recebe os `defaults` por
   * argumento porque `src/deck` não conhece o registry. Aqui os dois lados se tocam
   * pela primeira vez.
   */
  test("os defaults de um template alimentam createSlide", () => {
    const template = get("cover-statement");
    const slide = createSlide(template.id, template.defaults);

    expect(slide.template).toBe("cover-statement");
    expect(slide.fields).toEqual(template.defaults.fields);
    expect(slide.options).toEqual(template.defaults.options);

    slide.fields.heading = "Outro título";
    expect(template.defaults.fields.heading).toBe(
      "Um título que declara algo em vez de prometer",
    );
  });
});
