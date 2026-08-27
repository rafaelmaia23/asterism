/**
 * O que este teste guarda é a **forma do nó**, não a cor — a cor já é do
 * `highlighter.test.ts`.
 *
 * Guarda porque é a forma que atravessa a rasterização. A decisão 28 da §16 do documento
 * de contexto custou uma sessão inteira para descobrir que gradiente não sobrevive à
 * captura e que cor chapada sobrevive; a 2B mediu no bitmap que `<span>` colorido passa
 * intacto. O realce é exatamente esse caso, e o jeito de não redescobrir isso é asserir
 * aqui que a cor sai em `style` inline e que nada no bloco é gradiente.
 */

import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { CodeLines } from "@/code/code-lines";
import { PALETTE } from "@/code/theme";

function lines(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>("[data-testid='code-line']")];
}

describe("as linhas", () => {
  test("uma por quebra do código", () => {
    const { container } = render(<CodeLines code={"const a = 1\nconst b = 2"} lang="ts" />);

    expect(lines(container)).toHaveLength(2);
  });

  test("a linha vazia continua ocupando altura", () => {
    const { container } = render(<CodeLines code={"a\n\nb"} lang="text" />);

    // Uma `div` sem conteúdo tem altura zero, e o código perderia a linha em branco que o
    // autor escreveu. O espaço inquebrável é o que devolve a altura de linha.
    expect(lines(container)[1].textContent).toBe("\u00A0");
  });

  test("preservam espaço e indentação", () => {
    const { container } = render(<CodeLines code={"  indentado"} lang="text" />);

    expect(lines(container)[0].className).toContain("whitespace-pre");
    expect(lines(container)[0].textContent).toBe("  indentado");
  });
});

describe("os tokens", () => {
  test("levam a cor em `style` inline, que é o que atravessa a rasterização", () => {
    const { container } = render(<CodeLines code="const a = 1" lang="ts" />);
    const keyword = [...container.querySelectorAll("span")].find(
      (span) => span.textContent === "const",
    );

    expect(keyword?.style.color).not.toBe("");
    expect(keyword?.getAttribute("style")).toContain(PALETTE.keyword.hex);
  });

  test("o comentário sai em itálico", () => {
    const { container } = render(<CodeLines code="// nota" lang="ts" />);

    expect(container.querySelector("span")?.style.fontStyle).toBe("italic");
  });

  test("nada no bloco é gradiente — decisão 28", () => {
    const { container } = render(<CodeLines code={'const a = "x" // y'} lang="ts" />);

    for (const node of container.querySelectorAll<HTMLElement>("[style]")) {
      expect(node.getAttribute("style")).not.toMatch(/gradient/);
    }
  });
});
