import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideFrame } from "@/render/slide-frame";

const FORMAT = { w: 1080, h: 1350 };

function frame() {
  return screen.getByTestId("slide-frame");
}

function canvas() {
  return screen.getByTestId("slide-canvas");
}

/**
 * `happy-dom` não faz layout, então nada aqui mede altura de verdade. O que ele guarda
 * fielmente é classe e estilo inline, e é exatamente onde o `SlideFrame` decide: as
 * variáveis do formato, a escala e o `transform`. A aparência se confere olhando.
 */
describe("SlideFrame", () => {
  test("injeta --slide-w e --slide-h a partir do formato recebido", () => {
    render(
      <SlideFrame format={FORMAT}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(canvas().style.getPropertyValue("--slide-w")).toBe("1080px");
    expect(canvas().style.getPropertyValue("--slide-h")).toBe("1350px");
  });

  test("um formato diferente muda o quadro — não há 1080×1350 escrito à mão", () => {
    render(
      <SlideFrame format={{ w: 1080, h: 1080 }}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(canvas().style.getPropertyValue("--slide-w")).toBe("1080px");
    expect(canvas().style.getPropertyValue("--slide-h")).toBe("1080px");
  });

  test("--slide-scale acompanha a prop de escala", () => {
    render(
      <SlideFrame format={FORMAT} scale={0.28}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(canvas().style.getPropertyValue("--slide-scale")).toBe("0.28");
  });

  test("sem prop de escala o slide está em tamanho real", () => {
    render(
      <SlideFrame format={FORMAT}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(canvas().style.getPropertyValue("--slide-scale")).toBe("1");
  });

  test("a escala vai também para o transform, com origem no topo à esquerda", () => {
    render(
      <SlideFrame format={FORMAT} scale={0.5}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(canvas().style.transform).toBe("scale(0.5)");
    expect(canvas().style.transformOrigin).toBe("top left");
  });

  test("o quadro externo ocupa o tamanho já escalado", () => {
    render(
      <SlideFrame format={FORMAT} scale={0.5}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(frame().style.width).toBe("540px");
    expect(frame().style.height).toBe("675px");
  });

  test("a borda do preview mora fora do transform, não no nó que será capturado", () => {
    render(
      <SlideFrame format={FORMAT} scale={0.5}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(frame().className).toContain("border");
    expect(canvas().className).not.toContain("border");
  });

  test("renderiza o conteúdo dentro da raiz do slide", () => {
    render(
      <SlideFrame format={FORMAT}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(canvas().textContent).toBe("conteúdo");
  });

  test("fundo grid desenha a grade da §4.3, dentro da raiz do slide", () => {
    render(
      <SlideFrame format={FORMAT} background="grid">
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(canvas().contains(screen.getByTestId("slide-grid"))).toBe(true);
  });

  test("fundo plain não desenha grade nenhuma", () => {
    render(
      <SlideFrame format={FORMAT} background="plain">
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(screen.queryByTestId("slide-grid")).toBeNull();
  });

  test("sem fundo declarado o quadro fica liso", () => {
    render(
      <SlideFrame format={FORMAT}>
        <p>conteúdo</p>
      </SlideFrame>,
    );

    expect(screen.queryByTestId("slide-grid")).toBeNull();
  });
});
