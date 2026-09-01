import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { Blocks } from "@/markup/blocks";

function markup(src: string) {
  return render(<Blocks>{src}</Blocks>).container;
}

/**
 * O que se testa aqui é a estrutura que a camada de blocos desenha — quantos nós, de que
 * tag, com que marcador. Espaçamento não: `happy-dom` não computa estilo, e os 48px entre
 * blocos se conferem medindo o bitmap do PDF, que é o critério de pronto da C-B e o
 * experimento 6 do `TODO.md`.
 */
describe("Blocks", () => {
  test("string vazia não desenha nada", () => {
    expect(markup("").childNodes).toHaveLength(0);
  });

  test("cada parágrafo é um <p>", () => {
    const container = markup("primeiro\n\nsegundo\n\nterceiro");

    expect(container.querySelectorAll("p")).toHaveLength(3);
    expect(container.querySelectorAll("p")[1]?.textContent).toBe("segundo");
  });

  test("a lista não ordenada é <ul> com um <li> por item", () => {
    const container = markup("- um\n- dois");

    expect(container.querySelectorAll("ul > li")).toHaveLength(2);
    expect(container.querySelector("ol")).toBeNull();
  });

  test("o marcador é um travessão, e não é lido em voz alta", () => {
    const marker = markup("- um").querySelector("li > span");

    expect(marker?.textContent).toBe("—");
    expect(marker?.getAttribute("aria-hidden")).toBe("true");
  });

  test("a ordenada numera de 1, ignorando o número escrito — ADR-0076", () => {
    const markers = markup("7. um\n7. dois").querySelectorAll("ol > li > span:first-child");

    expect([...markers].map((node) => node.textContent)).toEqual(["1.", "2."]);
  });

  test("um parágrafo seguido de bullets desenha os dois, na ordem", () => {
    const container = markup("a razão:\n\n- primeira\n- segunda");

    expect([...container.querySelectorAll("p, ul")].map((node) => node.tagName)).toEqual([
      "P",
      "UL",
    ]);
  });

  test("a marcação inline chega desenhada dentro do bloco", () => {
    const container = markup("um **forte**\n\n- com `código`");

    expect(container.querySelector("p > strong")?.textContent).toBe("forte");
    expect(container.querySelector("li code")?.textContent).toBe("código");
  });
});
