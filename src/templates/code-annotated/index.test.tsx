import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { codeAnnotated } from "@/templates/code-annotated";
import { describeGuardedRegion } from "@/test/overflow";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = codeAnnotated;

function renderCodeAnnotated(overrides: Partial<typeof codeAnnotated.defaults> = {}) {
  const { Component } = codeAnnotated;
  const { fields, options } = { ...defaults, ...overrides };

  return render(<Component fields={fields} options={options} deck={deck} index={4} total={12} />);
}

const semTitulo = { ...defaults.fields, heading: "" };
const semExplicacao = { ...defaults.fields, body: "" };

/**
 * Smoke test. A centralização da janela na faixa encolhida e os 64px entre o bloco e a
 * explicação não são verificáveis aqui: `happy-dom` não faz layout. O que se guarda é a
 * classe que decide a faixa — que é lógica, uma tabela de oito entradas indexada por três
 * booleanos — e o que chega ao DOM.
 */
describe("code-annotated", () => {
  test("renderiza o título, a janela e a explicação", () => {
    const { container } = renderCodeAnnotated();

    expect(screen.getByText("A correção")).toBeDefined();
    expect(screen.getByText("cache.ts")).toBeDefined();
    expect(container.querySelectorAll("[data-testid=code-line]").length).toBeGreaterThan(0);
    expect(screen.getByTestId("body-region").textContent).toContain("A chave não incluía");
  });

  test("o descritor declara fundo plain e grupo code", () => {
    expect(codeAnnotated.background).toBe("plain");
    expect(codeAnnotated.group).toBe("code");
  });

  /**
   * O critério de pronto da 3.13: **reusa o bloco de código da 3D**. A janela é a peça de
   * `shared/code-window.tsx`, escrita em `shared/` na 3D justamente porque a §11.7 a reusa
   * — o `data-testid` dela é a prova de que não há uma segunda cópia aqui.
   */
  test("a janela é a peça compartilhada da §10.3", () => {
    const { container } = renderCodeAnnotated();
    const window = container.querySelector("[data-testid=code-window]");

    expect(window).not.toBeNull();
    expect(container.querySelectorAll("[data-testid=code-window] .rounded-full")).toHaveLength(3);
    expect(screen.getByText("cache.ts").className).toContain("normal-case");
  });

  test("a janela cresce com o código, e não com a região", () => {
    const { container } = renderCodeAnnotated();

    expect(container.querySelector("[data-testid=code-window]")?.className).not.toMatch(
      /(^|\s)h-\[/,
    );
  });

  /**
   * A marcação vale na explicação — a §11.7 diz que o `código` inline é o marcador natural
   * aqui, porque citar um identificador do bloco acima é exatamente o que a anotação faz.
   */
  test("a explicação passa pelo parser de marcação", () => {
    const { container } = renderCodeAnnotated({
      fields: { ...defaults.fields, body: "A chave agora inclui o `tenant`." },
    });

    expect(container.querySelector("[data-testid=body-region] code")?.textContent).toBe("tenant");
  });

  /** O código é literal: `**` num trecho de código é exponenciação, não ênfase. */
  test("o código não passa pelo parser de marcação", () => {
    const { container } = renderCodeAnnotated({
      fields: { ...defaults.fields, lang: "text", code: "a ** b" },
    });

    expect(container.querySelector("[data-testid=code-window] strong")).toBeNull();
    expect(container.querySelector("[data-testid=code-window]")?.textContent).toContain("a ** b");
  });

  /**
   * As oito faixas do bloco, que são a §11.7 cruzada com a regra de título vazio da §11.0.
   * O topo é o mesmo do `code-window`; o que muda é o fim — 826 com explicação, 1160 sem.
   *
   * A explicação **não se move em nenhuma das oito**: fica em 890–1160 sempre que existe. É
   * a única variação de cabeçalho da biblioteca que não empurra tudo por igual, e o motivo
   * é o que cada região perde ao encolher — prosa que perde duas linhas vira pensamento
   * cortado ao meio; código que perde duas linhas é um trecho mais curto.
   */
  describe("as oito geometrias do bloco", () => {
    const comCabecalho = { ...defaults.options, showHeader: true };

    test("sem cabeçalho, com título e com explicação: 294–826", () => {
      renderCodeAnnotated();

      expect(screen.getByTestId("heading-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("code-region").className).toContain("top-[294px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[532px]");
    });

    test("sem cabeçalho, com título e sem explicação: o bloco desce até 1160", () => {
      renderCodeAnnotated({ fields: semExplicacao });

      expect(screen.getByTestId("code-region").className).toContain("top-[294px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[866px]");
    });

    test("sem cabeçalho, sem título e com explicação: o bloco sobe para 80", () => {
      renderCodeAnnotated({ fields: semTitulo });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(screen.getByTestId("code-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[746px]");
    });

    test("sem cabeçalho, sem título e sem explicação: o bloco toma o slide", () => {
      renderCodeAnnotated({ fields: { ...semTitulo, body: "" } });

      expect(screen.getByTestId("code-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[1080px]");
    });

    test("com cabeçalho, com título e com explicação: 426–826, os 400px da §11.7", () => {
      renderCodeAnnotated({ options: comCabecalho });

      expect(screen.queryByTestId("header-band")).not.toBeNull();
      expect(screen.getByTestId("heading-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("code-region").className).toContain("top-[426px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[400px]");
    });

    test("com cabeçalho, com título e sem explicação: 426–1160", () => {
      renderCodeAnnotated({ fields: semExplicacao, options: comCabecalho });

      expect(screen.getByTestId("code-region").className).toContain("top-[426px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[734px]");
    });

    test("com cabeçalho, sem título e com explicação: 212–826", () => {
      renderCodeAnnotated({ fields: semTitulo, options: comCabecalho });

      expect(screen.getByTestId("code-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[614px]");
    });

    test("com cabeçalho, sem título e sem explicação: 212–1160", () => {
      renderCodeAnnotated({ fields: { ...semTitulo, body: "" }, options: comCabecalho });

      expect(screen.getByTestId("code-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[948px]");
    });
  });

  /** A faixa da explicação é a única do template que não se move: 890–1160, sempre. */
  test("a explicação fica em 890–1160 com o cabeçalho ligado ou desligado", () => {
    for (const showHeader of [false, true]) {
      const { container, unmount } = renderCodeAnnotated({
        options: { ...defaults.options, showHeader },
      });
      const region = container.querySelector("[data-testid=body-region]");

      expect(region?.className).toContain("top-[890px]");
      expect(region?.className).toContain("h-[270px]");
      unmount();
    }
  });

  /**
   * Explicação vazia: a região some, como a §11.0 manda para toda região de valor vazio, e
   * o slide vira um `code-window` com mais uma chave guardada. Funciona, mas trocar o
   * layout é mais honesto — e a chave sobrevive à troca, que é o ponto da §6.
   */
  test("explicação vazia tira a região, e com ela o segundo guard", () => {
    const { container } = renderCodeAnnotated({ fields: semExplicacao });

    expect(screen.queryByTestId("body-region")).toBeNull();
    expect(container.querySelectorAll("[data-guarded]")).toHaveLength(1);
  });

  test("o rodapé inteiro some com o interruptor da faixa", () => {
    renderCodeAnnotated({ options: { ...defaults.options, showFooter: false } });

    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
    expect(screen.queryAllByTestId("constellation-dot")).toHaveLength(0);
  });

  // As duas regiões marcadas com ⌐ na §11.7 — o único template da biblioteca com duas.
  describeGuardedRegion(codeAnnotated, 2);
});
