import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { context } from "@/templates/context";
import { describeGuardedRegion } from "@/test/overflow";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = context;

function renderContext(overrides: Partial<typeof context.defaults> = {}) {
  const { Component } = context;
  const { fields, options } = { ...defaults, ...overrides };

  return render(
    <Component fields={fields} options={options} deck={deck} index={1} total={12} />,
  );
}

/**
 * Smoke test. A medida de linha de 760px, o texto ancorado ao topo e o respiro à direita
 * não são verificáveis aqui: `happy-dom` não faz layout. O que se guarda é a classe que
 * decide, e o resto se confere olhando, como manda o `CLAUDE.md`.
 */
describe("context", () => {
  test("renderiza o título e o texto corrido que recebeu", () => {
    renderContext({
      fields: {
        kicker: "log/ · 02",
        heading: "O que estava acontecendo",
        body: "Durante três semanas, uma fração das requisições devolvia dados de outra pessoa.",
      },
    });

    expect(screen.getByText("O que estava acontecendo")).toBeDefined();
    expect(
      screen.getByText(/Durante três semanas, uma fração das requisições/),
    ).toBeDefined();
  });

  test("o corpo é interpretado como marcação — o título não", () => {
    const { container } = renderContext({
      fields: {
        kicker: "log/ · 02",
        heading: "Um [[título]] literal",
        body: "Um parágrafo com [[destaque]] no meio",
      },
    });

    const accent = container.querySelector(
      "[data-testid=body-region] span.text-azure-radiance-400",
    );

    expect(accent?.textContent).toBe("destaque");
    // O título sai com os colchetes na tela: a §11.4 não lhe dá marcação.
    expect(screen.getByText("Um [[título]] literal")).toBeDefined();
  });

  test("o descritor declara fundo plain e grupo content", () => {
    expect(context.background).toBe("plain");
    expect(context.group).toBe("content");
  });

  /** O miolo do carrossel nasce assinado, como o `text-bullets` — §11.0. */
  test("nasce com o rodapé completo e sem cabeçalho", () => {
    renderContext();

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.getByText("@rafael")).toBeDefined();
    expect(screen.queryByTestId("header-band")).toBeNull();
  });

  /**
   * A mesma geometria do `text-bullets`, de propósito: os dois são o miolo do carrossel, e
   * um empurrar 132px enquanto o outro reserva a faixa seria uma diferença sem motivo entre
   * slides vizinhos — decisão 43, §11.4.
   *
   * Título vazio faz a região sumir e o corpo subir para o topo da faixa livre: 80 sem o
   * cabeçalho, 212 com ele. É o comportamento que o `lead` do `final-cta` já tinha, e nos
   * quatro estados o corpo acaba em 1160, no topo do rodapé.
   */
  describe("as quatro geometrias do corpo", () => {
    const semTitulo = { ...defaults.fields, heading: "" };

    test("sem cabeçalho e com título: 80–230 e 294–1160", () => {
      renderContext();

      expect(screen.getByTestId("heading-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("body-region").className).toContain("top-[294px]");
      expect(screen.getByTestId("body-region").className).toContain("h-[866px]");
    });

    test("com cabeçalho e com título: as duas regiões descem 132px", () => {
      renderContext({ options: { ...defaults.options, showHeader: true } });

      expect(screen.queryByTestId("header-band")).not.toBeNull();
      expect(screen.getByTestId("heading-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("body-region").className).toContain("top-[426px]");
      expect(screen.getByTestId("body-region").className).toContain("h-[734px]");
    });

    test("sem cabeçalho e sem título: o corpo sobe para 80 e toma a faixa inteira", () => {
      renderContext({ fields: semTitulo });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(screen.getByTestId("body-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("body-region").className).toContain("h-[1080px]");
    });

    test("com cabeçalho e sem título: o corpo sobe para 212, não para 80", () => {
      renderContext({
        fields: semTitulo,
        options: { ...defaults.options, showHeader: true },
      });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(screen.getByTestId("body-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("body-region").className).toContain("h-[948px]");
    });

    /** Espaço em branco não é título: o que conta é o texto, não o campo preenchido. */
    test("um título só de espaços conta como vazio", () => {
      renderContext({ fields: { ...defaults.fields, heading: "   " } });

      expect(screen.queryByTestId("heading-region")).toBeNull();
    });
  });

  /**
   * A linha se limita a 760px dos 920px úteis — §11.4. É a única região da biblioteca em
   * que a medida de linha da §3.4 do design system aperta de verdade, porque é a única com
   * parágrafo de várias linhas.
   */
  test("o corpo não ocupa os 920px: a linha para em 760", () => {
    const { container } = renderContext();

    expect(container.querySelector("[data-testid=body-region] p")?.className).toContain(
      "max-w-[760px]",
    );
  });

  test("o rodapé inteiro some com o interruptor da faixa", () => {
    renderContext({ options: { ...defaults.options, showFooter: false } });

    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
    expect(screen.queryAllByTestId("constellation-dot")).toHaveLength(0);
  });

  // A região é a do corpo — a §11.4 a marca com ⌐ —, e é a que muda de altura nos quatro
  // estados: 866, 1080, 734 ou 948, com o mesmo fim em 1160.
  describeGuardedRegion(context);
});
