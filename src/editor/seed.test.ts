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
   * O critério de pronto da Etapa 2 era "um carrossel de 8 a 12 slides composto com os três
   * templates". A semente **é** esse carrossel desde a 2E — deixou de ser o deck de seis
   * slides que existia só para dar o que olhar —, e este é o teste que amarra o módulo ao
   * critério da etapa em vez de a um número escrito à mão. A 3C acrescentou o quarto, e a
   * 3G fecha o deck com os dez.
   */
  test("é um carrossel de 8 a 12 slides com os quatro templates que ele usa", () => {
    const { slides } = createSeedDeck();

    expect(slides.length).toBeGreaterThanOrEqual(8);
    expect(slides.length).toBeLessThanOrEqual(12);
    expect(new Set(slides.map((slide) => slide.template))).toEqual(
      new Set(["cover-statement", "text-bullets", "text-impact", "final-cta"]),
    );
  });

  /**
   * Os slides 6 e 11 eram capa até a 3C, e não porque a narrativa pedisse capa ali: o
   * template de frase isolada não existia, e a 2E registrou isso como limitação de
   * biblioteca. A tarefa 3.9 é o que fecha a dívida.
   */
  test("a narrativa alterna capa, lista e respiro, e fecha no final-cta", () => {
    expect(createSeedDeck().slides.map((slide) => slide.template)).toEqual([
      "cover-statement",
      "cover-statement",
      "text-bullets",
      "text-bullets",
      "text-bullets",
      "text-impact",
      "text-bullets",
      "text-bullets",
      "text-bullets",
      "text-bullets",
      "text-impact",
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
   * O kicker numera a **posição no deck**, não a ordem entre os slides do mesmo template —
   * §10.5 do design system. Numerar as capas entre si faria a segunda se anunciar como a
   * segunda estando na posição 2 por coincidência, e o índice do kicker é justamente o que
   * diz onde a pessoa está.
   *
   * Vale para os slides de `slide-display` — capa e frase de impacto —, que são os que a
   * série numera. Nos dois o cabeçalho nasce desligado ou ligado conforme o template, mas o
   * valor existe de qualquer forma: ligar a faixa entrega o número certo em vez do default
   * do descritor.
   */
  test("o kicker numera a posição do slide no deck", () => {
    const numerados = new Set(["cover-statement", "text-impact"]);
    const kickers = createSeedDeck().slides.flatMap((slide, index) =>
      numerados.has(slide.template) ? [[index + 1, slide.fields.kicker]] : [],
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

  test("as frases de impacto cabem nos limites da §11.5", () => {
    for (const impacto of slidesOf("text-impact")) {
      expect(String(impacto.fields.kicker).length).toBeLessThanOrEqual(12);
      expect(rendered(impacto.fields.heading).length).toBeLessThanOrEqual(70);
    }
  });

  /**
   * "Frase curta é o alvo" — §11.5. Duas ou três linhas ainda funcionam; acima disso o
   * template está sendo usado como capa, que é justamente o que a semente fazia antes da
   * 3C. ~19 caracteres por linha em 96px sobre 920px de largura útil, então o teto de duas
   * linhas são 38 caracteres com folga.
   */
  test("as frases de impacto são curtas, não capas disfarçadas", () => {
    for (const impacto of slidesOf("text-impact")) {
      expect(rendered(impacto.fields.heading).length).toBeLessThanOrEqual(42);
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
   *
   * A 3C tirou duas capas do deck e a faixa passou a caber em duas: a do slide 1 com uma
   * linha e a do slide 2 com quatro. É de propósito que a capa longa tenha ficado na
   * semente — as duas leituras do mesmo corpo tipográfico, âncora de base na capa e
   * centralização no `text-impact`, ficam comparáveis na lista lateral sem trocar opção
   * nenhuma.
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
