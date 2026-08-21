import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { z } from "zod";
import type { DeckMeta, Slide } from "@/deck/types";
import { SlideView } from "@/render/slide-view";
import { register } from "@/templates/registry";
import type { TemplateDef } from "@/templates/types";
// Importar `@/templates` é o que popula o registry — é o único módulo que conhece
// template. O `SlideView` chega nele pelo id gravado no slide, nunca por import direto.
import "@/templates";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };

/** Um template `plain` que só existe aqui: a biblioteca da Etapa 1 tem só a capa. */
const PLAIN_TEMPLATE = "plain-de-teste";

register({
  id: PLAIN_TEMPLATE,
  label: "Template plano",
  group: "content",
  background: "plain",
  fields: [],
  options: [],
  schema: z.object({ fields: z.object({}), options: z.record(z.string(), z.boolean()) }),
  defaults: { fields: {}, options: {} },
  Component: () => null,
} satisfies TemplateDef);

const slide: Slide = {
  id: "s1",
  template: "cover-statement",
  fields: { kicker: "log/ · 01", heading: "Um título que declara algo" },
  options: { showChevron: true },
};

function canvas() {
  return screen.getByTestId("slide-canvas");
}

/** A grade é elemento desde que o gradiente reprovou na exportação — ver `slide-grid`. */
function grade() {
  return screen.queryByTestId("slide-grid");
}

describe("SlideView", () => {
  test("renderiza o template que o slide declara, com os campos do slide", () => {
    render(<SlideView slide={slide} deck={deck} index={0} total={3} format={{ w: 1080, h: 1350 }} />);

    expect(screen.getByText("Um título que declara algo")).toBeDefined();
    expect(screen.getByText("log/ · 01")).toBeDefined();
  });

  /**
   * O `background` do descritor é o **padrão** do template, não a palavra final: quem
   * decide é a opção `showGrid` do slide. Ver a §4.3 do design system e a decisão 25.
   */
  test("sem a opção, o fundo cai no padrão do descritor", () => {
    const semOpcao: Slide = { ...slide, options: { showChevron: true } };

    render(<SlideView slide={semOpcao} deck={deck} index={0} total={3} format={{ w: 1080, h: 1350 }} />);

    expect(grade()).not.toBeNull();
  });

  test("a opção desligada tira a grade de um template que nasce com ela", () => {
    const semGrade: Slide = { ...slide, options: { ...slide.options, showGrid: false } };

    render(<SlideView slide={semGrade} deck={deck} index={0} total={3} format={{ w: 1080, h: 1350 }} />);

    expect(grade()).toBeNull();
  });

  test("a opção ligada põe a grade num template que nasce sem ela", () => {
    const emPlain: Slide = {
      id: "s2",
      template: PLAIN_TEMPLATE,
      fields: {},
      options: { showGrid: true },
    };

    render(<SlideView slide={emPlain} deck={deck} index={0} total={3} format={{ w: 1080, h: 1350 }} />);

    expect(grade()).not.toBeNull();
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
