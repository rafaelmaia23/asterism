import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { Inline } from "@/markup/inline";

function markup(src: string) {
  return render(<Inline>{src}</Inline>).container;
}

/**
 * O que se testa aqui é o mapeamento marcador → elemento e classe, que é lógica. Cor,
 * peso e raio não: `happy-dom` não computa estilo, então uma asserção sobre eles mediria
 * a string da classe de novo com outro nome. A conferência é olhando o canvas e, depois,
 * medindo o bitmap do PDF — o padrão que a 1E estabeleceu.
 */
describe("Inline", () => {
  test("texto sem marcação não ganha wrapper nenhum", () => {
    const container = markup("um título que declara algo");

    expect(container.textContent).toBe("um título que declara algo");
    expect(container.querySelector("span, strong, em, s, u, mark, code")).toBeNull();
  });

  test("string vazia não desenha nada", () => {
    expect(markup("").childNodes).toHaveLength(0);
  });

  test("o texto em volta do marcador é preservado, na ordem", () => {
    const container = markup("o cache [[mentiu]] sobre o que guardava");

    expect(container.textContent).toBe("o cache mentiu sobre o que guardava");
    expect(container.querySelector("span")?.textContent).toBe("mentiu");
  });

  describe("os sete marcadores da §10.2, cada um no seu elemento", () => {
    test("**forte** é <strong>, e o peso nunca fica abaixo do herdado", () => {
      const strong = markup("**forte**").querySelector("strong");

      expect(strong?.textContent).toBe("forte");
      // `slide-strong`, e não `font-semibold`: em Oxanium 700 um 600 fixo deixaria o
      // título mais leve. Decisão 34 da §16 do documento de contexto.
      expect(strong?.className).toContain("slide-strong");
    });

    test("*ênfase* é <em> itálico", () => {
      const em = markup("*ênfase*").querySelector("em");

      expect(em?.textContent).toBe("ênfase");
      expect(em?.className).toContain("italic");
    });

    test("~~riscado~~ é <s>, riscado e em ink-500", () => {
      const strike = markup("~~riscado~~").querySelector("s");

      expect(strike?.textContent).toBe("riscado");
      expect(strike?.className).toContain("line-through");
      expect(strike?.className).toContain("text-ink-500");
    });

    test("++sublinhado++ é <u>, com offset e espessura da tabela", () => {
      const underline = markup("++sublinhado++").querySelector("u");

      expect(underline?.textContent).toBe("sublinhado");
      expect(underline?.className).toContain("underline-offset-[0.15em]");
      expect(underline?.className).toContain("decoration-2");
    });

    test("==marca== é <mark>, fundo sun-950 sobre texto sun-300 e canto reto", () => {
      const mark = markup("==marca==").querySelector("mark");

      expect(mark?.textContent).toBe("marca");
      expect(mark?.className).toContain("bg-sun-950");
      expect(mark?.className).toContain("text-sun-300");
      expect(mark?.className).toContain("rounded-none");
    });

    test("`código` é <code>, mono sobre fundo elevado com raio 6px", () => {
      const code = markup("`código`").querySelector("code");

      expect(code?.textContent).toBe("código");
      expect(code?.className).toContain("font-mono");
      expect(code?.className).toContain("bg-ink-800");
      expect(code?.className).toContain("text-azure-radiance-200");
      expect(code?.className).toContain("rounded-[6px]");
    });

    test("[[destaque]] é só cor — um <span> em azure-400, sem outro efeito", () => {
      const accent = markup("[[destaque]]").querySelector("span");

      expect(accent?.textContent).toBe("destaque");
      expect(accent?.className).toBe("text-azure-radiance-400");
    });
  });

  test("marcadores diferentes na mesma frase, cada um no próprio elemento", () => {
    const container = markup("um [[destaque]], um `código` e uma ==marca==");

    expect(container.querySelector("span")?.textContent).toBe("destaque");
    expect(container.querySelector("code")?.textContent).toBe("código");
    expect(container.querySelector("mark")?.textContent).toBe("marca");
    expect(container.textContent).toBe("um destaque, um código e uma marca");
  });

  test("marcador não fechado chega como texto, sem elemento", () => {
    const container = markup("**sem fim");

    expect(container.textContent).toBe("**sem fim");
    expect(container.querySelector("strong")).toBeNull();
  });
});
