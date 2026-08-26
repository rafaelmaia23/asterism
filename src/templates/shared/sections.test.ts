import { describe, expect, test } from "vitest";
import { sharedFields } from "@/templates/shared/fields";
import { sharedOptions } from "@/templates/shared/options";
import { sharedSections } from "@/templates/shared/sections";
import { coverStatement } from "@/templates/cover-statement";
import { finalCta } from "@/templates/final-cta";
import { textBullets } from "@/templates/text-bullets";

const all = [coverStatement, textBullets, finalCta];

/**
 * As seções são **metadado de desenho**: dizem em que faixa do formulário cada controle
 * aparece e sob que interruptor, e não tocam no dado. `fields` e `options` continuam sendo
 * a lista completa e plana das chaves de cada saco.
 */
describe("seções compartilhadas do inspector", () => {
  /**
   * A ordem é a vertical do slide — cabeçalho, conteúdo, rodapé —, e o que sobra depois.
   * Ela é observável: é a ordem em que o inspector desenha as seções.
   */
  test("as quatro estão na ordem de leitura do slide", () => {
    expect(sharedSections.map((section) => section.key)).toEqual([
      "header",
      "content",
      "footer",
      "style",
    ]);
  });

  test("cabeçalho e rodapé têm interruptor; conteúdo e apresentação não", () => {
    const toggles = Object.fromEntries(
      sharedSections.map((section) => [section.key, section.toggle]),
    );

    expect(toggles).toEqual({
      header: "showHeader",
      content: undefined,
      footer: "showFooter",
      style: undefined,
    });
  });

  /**
   * O interruptor de uma seção é uma chave de `options`, não um descritor à parte. É o que
   * preserva o invariante que os testes de paridade de cada template conferem: `options`
   * lista toda chave de opção, sem exceção.
   */
  test("todo interruptor de seção é uma opção declarada", () => {
    const keys = sharedOptions.map((option) => option.key);

    for (const section of sharedSections) {
      if (section.toggle !== undefined) {
        expect(keys).toContain(section.toggle);
      }
    }
  });

  test("todo template expõe as quatro, e o mesmo objeto", () => {
    for (const def of all) {
      expect(def.sections).toEqual(sharedSections);
    }
  });

  /**
   * A seção a que um controle pertence tem que existir. Um `section` escrito errado faria
   * o controle sumir do formulário em silêncio — a mesma falha que o tipo sem controle
   * evita aparecendo como linha inerte.
   */
  test("nenhum controle aponta para uma seção que não existe", () => {
    const keys = sharedSections.map((section) => section.key);

    for (const def of all) {
      for (const control of [...def.fields, ...def.options, ...sharedFields]) {
        if (control.section !== undefined) {
          expect(keys).toContain(control.section);
        }
      }
    }
  });
});
