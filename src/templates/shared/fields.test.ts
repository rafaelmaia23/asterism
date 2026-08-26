import { describe, expect, test } from "vitest";
import { kickerField, sharedFields } from "@/templates/shared/fields";
import { fields as coverFields } from "@/templates/cover-statement/fields";
import { fields as bulletsFields } from "@/templates/text-bullets/fields";
import { fields as finalFields } from "@/templates/final-cta/fields";

/**
 * O simétrico de `shared/options.ts`, e pelo mesmo argumento: é o mesmo campo nos dez
 * templates, e declarado à mão em cada um o rótulo divergiria no terceiro. O teste guarda
 * isso por **identidade de objeto** — um template que reescrever o próprio descritor com as
 * mesmas propriedades reprova, que é o ponto.
 */
describe("campos compartilhados do slide", () => {
  test("o kicker é texto literal, com o limite e o exemplo da §11.1", () => {
    expect(kickerField).toMatchObject({
      key: "kicker",
      type: "text",
      label: "Kicker",
      max: 12,
      placeholder: "api/ · 04",
      section: "header",
    });
  });

  /** Decisão 14: o kicker é digitado, não derivado de `meta.pillar` com a posição. */
  test("o kicker não aceita marcação", () => {
    expect(kickerField).not.toHaveProperty("md", true);
  });

  test("todo template expõe o kicker, e o mesmo objeto", () => {
    for (const fields of [coverFields, bulletsFields, finalFields]) {
      expect(fields).toContain(kickerField);
    }
  });

  /** O cabeçalho é a primeira faixa do slide, e abre a lista de campos. */
  test("o kicker vem primeiro em todo template", () => {
    for (const fields of [coverFields, bulletsFields, finalFields]) {
      expect(fields[0]).toBe(kickerField);
    }
  });

  test("`sharedFields` é a lista dos compartilhados", () => {
    expect(sharedFields).toEqual([kickerField]);
  });
});
