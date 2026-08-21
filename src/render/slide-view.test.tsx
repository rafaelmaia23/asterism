import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import type { DeckMeta, Slide } from "@/deck/types";
import { SlideView } from "@/render/slide-view";
// Importar `@/templates` é o que popula o registry — é o único módulo que conhece
// template. O `SlideView` chega nele pelo id gravado no slide, nunca por import direto.
import "@/templates";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };

const slide: Slide = {
  id: "s1",
  template: "cover-statement",
  fields: { kicker: "log/ · 01", heading: "Um título que declara algo" },
  options: { showChevron: true },
};

function canvas() {
  return screen.getByTestId("slide-canvas");
}

describe("SlideView", () => {
  test("renderiza o template que o slide declara, com os campos do slide", () => {
    render(<SlideView slide={slide} deck={deck} index={0} total={3} format={{ w: 1080, h: 1350 }} />);

    expect(screen.getByText("Um título que declara algo")).toBeDefined();
    expect(screen.getByText("log/ · 01")).toBeDefined();
  });

  test("o fundo vem do descritor: a capa declara grid e o quadro o desenha", () => {
    render(<SlideView slide={slide} deck={deck} index={0} total={3} format={{ w: 1080, h: 1350 }} />);

    expect(canvas().className).toContain("slide-grid");
  });

  test("a escala recebida chega ao quadro", () => {
    render(
      <SlideView
        slide={slide}
        deck={deck}
        index={0}
        total={3}
        format={{ w: 1080, h: 1350 }}
        scale={0.28}
      />,
    );

    expect(canvas().style.getPropertyValue("--slide-scale")).toBe("0.28");
  });

  test("a posição do slide chega ao template — a constelação acende até ela", () => {
    render(<SlideView slide={slide} deck={deck} index={2} total={3} format={{ w: 1080, h: 1350 }} />);

    const lit = screen
      .getAllByTestId("constellation-dot")
      .filter((dot) => dot.dataset.lit === "true");

    expect(lit).toHaveLength(3);
  });

  test("template desconhecido é erro do registry, e ele lança", () => {
    const unknown: Slide = { ...slide, template: "nao-existe" };

    expect(() =>
      render(<SlideView slide={unknown} deck={deck} index={0} total={1} format={{ w: 1080, h: 1350 }} />),
    ).toThrow(/nao-existe/);
  });
});
