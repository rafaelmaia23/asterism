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

  /**
   * A ordem de registro é a ordem em que a biblioteca se apresenta — no seletor de
   * layout, e em qualquer lista futura. A capa vem primeiro porque é por onde um
   * carrossel começa.
   */
  test("a 2B leva a biblioteca a dois templates, na ordem de registro", () => {
    expect(list().map((def) => def.id)).toEqual(["cover-statement", "text-bullets"]);
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
