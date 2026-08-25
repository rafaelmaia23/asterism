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

  /**
   * A ordem de registro é a ordem em que a biblioteca se apresenta — no seletor de
   * layout, e em qualquer lista futura. É a narrativa de um carrossel: a capa abre, os
   * tópicos desenvolvem, o CTA fecha.
   */
  test("a 2C fecha a Fase 1 com três templates, na ordem de registro", () => {
    expect(list().map((def) => def.id)).toEqual([
      "cover-statement",
      "text-bullets",
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
