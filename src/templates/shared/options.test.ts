import { describe, expect, test } from "vitest";
import {
  showChevronOption,
  showGridOption,
  showHandleOption,
  showLogoOption,
} from "@/templates/shared/options";
import { options as coverOptions } from "@/templates/cover-statement/fields";
import { options as bulletsOptions } from "@/templates/text-bullets/fields";

/**
 * As quatro opções compartilhadas existem para não serem redeclaradas em dez templates —
 * declarada à mão em cada um, a chave ou o rótulo divergem no terceiro. O teste guarda
 * isso comparando **identidade de objeto**, não formato: se um template escrever o próprio
 * descritor com as mesmas propriedades, este teste reprova, que é o ponto.
 */
describe("opções compartilhadas do slide", () => {
  const shared = [showGridOption, showLogoOption, showHandleOption, showChevronOption];

  test("as quatro têm chave própria e são toggles", () => {
    expect(shared.map((option) => option.key)).toEqual([
      "showGrid",
      "showLogo",
      "showHandle",
      "showChevron",
    ]);
    expect(shared.every((option) => option.type === "toggle")).toBe(true);
  });

  test("todo template expõe as quatro, e o mesmo objeto — §11.0", () => {
    for (const options of [coverOptions, bulletsOptions]) {
      for (const option of shared) {
        expect(options).toContain(option);
      }
    }
  });

  /** A §11.0 diz que a grade aparece primeiro na lista de opções. */
  test("a grade vem primeiro em todo template", () => {
    expect(coverOptions[0]).toBe(showGridOption);
    expect(bulletsOptions[0]).toBe(showGridOption);
  });
});
