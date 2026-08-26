import { describe, expect, test } from "vitest";
import { createSeedDeck } from "@/editor/seed";
import { parseInline } from "@/markup/parse";
import { get } from "@/templates";

/** O texto que chega ao canvas: os colchetes de `[[destaque]]` não ocupam linha. */
function rendered(source: unknown): string {
  return parseInline(String(source))
    .map((node) => node.v)
    .join("");
}

function slidesOf(template: string) {
  return createSeedDeck().slides.filter((slide) => slide.template === template);
}

describe("createSeedDeck", () => {
  /**
   * O critério de pronto da Etapa 2 é "um carrossel de 8 a 12 slides composto com os três
   * templates". A semente **é** esse carrossel desde a 2E — deixou de ser o deck de seis
   * slides que existia só para dar o que olhar —, e este é o teste que amarra o módulo ao
   * critério da etapa em vez de a um número escrito à mão.
   */
  test("é um carrossel de 8 a 12 slides com os três templates", () => {
    const { slides } = createSeedDeck();

    expect(slides.length).toBeGreaterThanOrEqual(8);
    expect(slides.length).toBeLessThanOrEqual(12);
    expect(new Set(slides.map((slide) => slide.template))).toEqual(
      new Set(["cover-statement", "text-bullets", "final-cta"]),
    );
  });

  test("a narrativa alterna capa e lista, e fecha no final-cta", () => {
    expect(createSeedDeck().slides.map((slide) => slide.template)).toEqual([
      "cover-statement",
      "cover-statement",
      "text-bullets",
      "text-bullets",
      "text-bullets",
      "cover-statement",
      "text-bullets",
      "text-bullets",
      "text-bullets",
      "text-bullets",
      "cover-statement",
      "final-cta",
    ]);
  });

  /**
   * O fechamento é o último por definição, e é a posição que faz a constelação sair
   * inteira acesa e o chevron ser suprimido — decisão 36. Sem ele no fim, os dois
   * comportamentos da 2.9 não teriam onde ser conferidos olhando.
   */
  test("o fechamento é o último slide do deck", () => {
    expect(createSeedDeck().slides.at(-1)?.template).toBe("final-cta");
  });

  /**
   * O kicker numera a **posição no deck**, não a ordem entre as capas — §10.5 do design
   * system. Com capa no miolo, numerar as capas entre si faria o slide 06 se anunciar
   * como o terceiro, e o índice do kicker é justamente o que diz onde a pessoa está.
   */
  test("o kicker numera a posição do slide no deck", () => {
    const { slides } = createSeedDeck();
    const kickers = slides.flatMap((slide, index) =>
      slide.template === "cover-statement" ? [[index + 1, slide.fields.kicker]] : [],
    );

    expect(kickers).toEqual([
      [1, "log/ · 01"],
      [2, "log/ · 02"],
      [6, "log/ · 06"],
      [11, "log/ · 11"],
    ]);
  });

  test("cada slide tem título próprio — é o que torna a lista da 1D verificável", () => {
    const headings = createSeedDeck().slides.map((slide) => slide.fields.heading);

    expect(new Set(headings).size).toBe(12);
  });

  /**
   * Os limites da §11.x são conselho, mas a semente não tem por que estourá-los: ela é o
   * que abre na primeira execução, e o contador âmbar na primeira tela seria um defeito
   * anunciando outro.
   */
  test("as capas cabem nos limites da §11.1", () => {
    for (const cover of slidesOf("cover-statement")) {
      expect(String(cover.fields.kicker).length).toBeLessThanOrEqual(12);
      expect(rendered(cover.fields.heading).length).toBeLessThanOrEqual(70);
    }
  });

  test("as listas cabem nos limites da §11.2", () => {
    for (const bullets of slidesOf("text-bullets")) {
      const items = bullets.fields.items as string[];

      expect(rendered(bullets.fields.heading).length).toBeLessThanOrEqual(60);
      expect(items.length).toBeGreaterThanOrEqual(3);
      expect(items.length).toBeLessThanOrEqual(4);
      for (const item of items) {
        expect(rendered(item).length).toBeLessThanOrEqual(80);
      }
    }
  });

  test("o fechamento cabe nos limites da §11.3", () => {
    const final = createSeedDeck().slides.at(-1)!;

    expect(rendered(final.fields.heading).length).toBeLessThanOrEqual(55);
    expect(String(final.fields.lead).length).toBeLessThanOrEqual(90);
    expect(String(final.fields.cta).length).toBeLessThanOrEqual(40);
  });

  /**
   * A âncora dos itens é a única opção que a semente desvia do default, e ela alterna
   * entre as sete listas: as duas leituras da §11.2 ficam lado a lado na lista lateral, e
   * o critério de pronto da 2.8 se confere sem trocar opção nenhuma.
   */
  test("as âncoras alternam entre as listas", () => {
    const anchors = slidesOf("text-bullets").map((slide) => slide.options.anchor);

    expect(anchors).toEqual(["center", "top", "center", "top", "center", "top", "center"]);
  });

  test("as opções vêm dos defaults do registry, não de cópia à mão", () => {
    for (const slide of createSeedDeck().slides) {
      const { defaults } = get(slide.template);

      // O `anchor` é o único desvio, e é deliberado — ver o teste acima. Tudo o mais tem
      // de bater com o que o template diz, chave por chave: o dia em que um template
      // ganhar opção, a semente a ganha junto.
      expect(Object.keys(slide.options)).toEqual(Object.keys(defaults.options));

      for (const [key, value] of Object.entries(defaults.options)) {
        if (key !== "anchor") {
          expect(slide.options[key]).toEqual(value);
        }
      }
    }
  });

  /**
   * A marcação da §7 chega pronta na primeira tela: abrir a ferramenta já mostra o que ela
   * faz, sem ninguém precisar digitar nada.
   *
   * O teto é **um nível de ênfase por bloco** — §3.4 do design system —, e nível não é
   * ocorrência: dois `` `código` `` na mesma linha são o mesmo nível, e nomear duas
   * variáveis não é enfatizar duas vezes. O que a regra proíbe é misturar marcadores num
   * bloco só, e é isso que este teste conta.
   */
  test("cada slide traz marcação, e um nível de ênfase por bloco", () => {
    for (const slide of createSeedDeck().slides) {
      const blocks = [
        String(slide.fields.heading),
        ...((slide.fields.items as string[] | undefined) ?? []),
      ];

      expect(blocks.filter((block) => rendered(block) !== block).length).toBeGreaterThanOrEqual(1);

      for (const block of blocks) {
        const levels = new Set(
          parseInline(block)
            .filter((node) => node.t !== "text")
            .map((node) => node.t),
        );

        expect(levels.size).toBeLessThanOrEqual(1);
      }
    }
  });

  /**
   * Os títulos de capa vão de uma linha a quatro: é assim que a âncora de base da §11.1
   * se confere, vendo a última linha pousar sempre na mesma altura. ~19 caracteres por
   * linha em 96px sobre 920px de largura útil.
   */
  test("os títulos de capa cobrem de uma linha a quatro", () => {
    const lengths = slidesOf("cover-statement").map((cover) =>
      rendered(cover.fields.heading).length,
    );

    expect(Math.min(...lengths)).toBeLessThanOrEqual(19);
    expect(Math.max(...lengths)).toBeGreaterThan(57);
  });

  test("dois decks semente não compartilham id nem objeto de campos", () => {
    const a = createSeedDeck();
    const b = createSeedDeck();

    expect(a.id).not.toBe(b.id);
    expect(a.slides[0].id).not.toBe(b.slides[0].id);
    expect(a.slides[0].fields).not.toBe(b.slides[0].fields);
  });

  test("o formato é o 4:5 do deck, e vem do factory", () => {
    expect(createSeedDeck().format).toEqual({ w: 1080, h: 1350 });
  });
});
