import { describe, expect, test } from "vitest";
import {
  sharedOptions,
  showChevronOption,
  showFooterOption,
  showGridOption,
  showHandleOption,
  showHeaderOption,
  showLogoOption,
  showLogoPlateOption,
  showRuleOption,
} from "@/templates/shared/options";
import { options as coverOptions } from "@/templates/cover-statement/fields";
import { options as bulletsOptions } from "@/templates/text-bullets/fields";

/**
 * As opções compartilhadas existem para não serem redeclaradas em dez templates —
 * declarada à mão em cada um, a chave ou o rótulo divergem no terceiro. O teste guarda
 * isso comparando **identidade de objeto**, não formato: se um template escrever o próprio
 * descritor com as mesmas propriedades, este teste reprova, que é o ponto.
 */
describe("opções compartilhadas do slide", () => {
  /**
   * A ordem é a de leitura vertical do slide: o fundo, o cabeçalho, e o rodapé de fora
   * para dentro — a faixa inteira, a régua que a separa do conteúdo, a identidade, e por
   * fim a seta. Ela é observável: é a ordem em que o inspector desenha os controles.
   */
  test("as oito têm chave própria e são toggles", () => {
    expect(sharedOptions.map((option) => option.key)).toEqual([
      "showGrid",
      "showHeader",
      "showFooter",
      "showRule",
      "showLogo",
      "showLogoPlate",
      "showHandle",
      "showChevron",
    ]);
    expect(sharedOptions.every((option) => option.type === "toggle")).toBe(true);
  });

  test("todo template expõe as oito, e o mesmo objeto — §11.0", () => {
    for (const options of [coverOptions, bulletsOptions]) {
      for (const option of sharedOptions) {
        expect(options).toContain(option);
      }
    }
  });

  /** A §11.0 diz que a grade aparece primeiro na lista de opções. */
  test("a grade vem primeiro em todo template", () => {
    expect(coverOptions[0]).toBe(showGridOption);
    expect(bulletsOptions[0]).toBe(showGridOption);
  });

  /**
   * As cinco peças do rodapé são sub-opções da faixa: o inspector as desenha dentro da
   * seção "Rodapé", e elas só aparecem com o `showFooter` ligado. Os três interruptores
   * de fora — grade, cabeçalho e rodapé — não pertencem a seção nenhuma: dois são
   * interruptores **de** seção, e a grade não é peça de faixa.
   */
  test("as peças do rodapé pertencem à seção do rodapé", () => {
    const footer = [
      showRuleOption,
      showLogoOption,
      showLogoPlateOption,
      showHandleOption,
      showChevronOption,
    ];

    expect(footer.every((option) => option.section === "footer")).toBe(true);
  });

  test("grade, cabeçalho e rodapé não pertencem a seção nenhuma", () => {
    for (const option of [showGridOption, showHeaderOption, showFooterOption]) {
      expect(option.section).toBeUndefined();
    }
  });
});
