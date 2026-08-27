/**
 * O que este teste protege é o contrato do realce, não o shiki.
 *
 * Três coisas que só se descobrem no PDF se não estiverem aqui: a cor sair da paleta da
 * §10.4 e não de um tema qualquer; as nove linguagens da §11.6 estarem de fato no bundle;
 * e um `lang` que o dado carrega mas o bundle não conhece — o que uma troca de layout ou
 * um deck salvo antes de a lista encolher deixam para trás — não derrubar o editor.
 */

import { describe, expect, test } from "vitest";
import { LANG_IDS } from "@/code/langs";
import { tokenize } from "@/code/highlighter";
import { PALETTE } from "@/code/theme";

/** O texto de um token, achado pela primeira ocorrência em todas as linhas. */
function find(lines: ReturnType<typeof tokenize>, text: string) {
  return lines.flat().find((token) => token.text.trim() === text);
}

describe("o realce sai com as cores da §10.4", () => {
  const lines = tokenize(
    ['// um comentário', 'const nome = "asterism"', "const n = 42"].join("\n"),
    "ts",
  );

  test("palavra-chave em azure-400", () => {
    expect(find(lines, "const")?.color).toBe(PALETTE.keyword.hex);
  });

  test("string em pacifika-300", () => {
    expect(find(lines, '"asterism"')?.color).toBe(PALETTE.string.hex);
  });

  test("número em sun-300", () => {
    expect(find(lines, "42")?.color).toBe(PALETTE.number.hex);
  });

  test("comentário em ink-500, e itálico", () => {
    const comment = find(lines, "// um comentário");

    expect(comment?.color).toBe(PALETTE.comment.hex);
    expect(comment?.italic).toBe(true);
  });

  test("nada mais é itálico", () => {
    expect(lines.flat().filter((token) => token.italic)).toHaveLength(1);
  });

  test("todo token tem cor, e toda cor é da paleta", () => {
    const allowed = new Set(Object.values(PALETTE).map((entry) => entry.hex));

    for (const token of lines.flat()) {
      expect(allowed).toContain(token.color);
    }
  });
});

describe("o bundle tem as nove linguagens da §11.6", () => {
  test.each(LANG_IDS)("%s tokeniza", (lang) => {
    expect(tokenize("a", lang).flat().length).toBeGreaterThan(0);
  });

  test("`text` sai sem realce, na cor base", () => {
    const lines = tokenize("const x = 1", "text");

    expect(lines.flat().every((token) => token.color === PALETTE.base.hex)).toBe(true);
  });
});

describe("as linhas", () => {
  test("uma por quebra, inclusive as vazias", () => {
    expect(tokenize("a\n\nb", "text")).toHaveLength(3);
  });

  test("linguagem desconhecida cai em texto puro, sem lançar", () => {
    expect(() => tokenize("SELECT 1", "cobol")).not.toThrow();
    expect(tokenize("SELECT 1", "cobol").flat()[0].color).toBe(PALETTE.base.hex);
  });
});
