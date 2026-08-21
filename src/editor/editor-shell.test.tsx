import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EditorShell } from "@/editor/editor-shell";
import { editorStore } from "@/editor/store";
import "@/templates";

/**
 * O que os testes de `SlideList` e `Inspector` não pegam: as duas colunas e o canvas
 * falarem com o **mesmo** store. Cada uma delas recebe o store por prop nos próprios
 * testes, justamente para ficarem isoladas; aqui o shell monta as três sem prop nenhuma,
 * que é como a aplicação as usa.
 *
 * O canvas não entra na asserção porque `happy-dom` não faz layout: o `ResizeObserver`
 * nunca dispara, a escala fica em 0 e nenhum quadro é desenhado. Ver `slide-canvas.test`.
 */
describe("EditorShell", () => {
  test("a lista troca o slide que o inspector edita", () => {
    render(<EditorShell />);

    const segundo = editorStore.getState().deck.slides[1];

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(editorStore.getState().activeId).toBe(segundo.id);
    expect(screen.getByLabelText<HTMLTextAreaElement>("Título").value).toBe(
      segundo.fields.heading,
    );
  });

  test("digitar no inspector escreve no slide ativo do deck", () => {
    render(<EditorShell />);

    fireEvent.change(screen.getByLabelText("Título"), { target: { value: "Título novo" } });

    const ativo = editorStore
      .getState()
      .deck.slides.find((slide) => slide.id === editorStore.getState().activeId);

    expect(ativo?.fields.heading).toBe("Título novo");
  });
});
