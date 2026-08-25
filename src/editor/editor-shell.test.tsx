import { beforeEach, describe, expect, test } from "vitest";
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
  // O shell reidrata o deck salvo ao montar, desde a 2.12. Sem limpar o storage, o que um
  // caso digita voltaria no caso seguinte.
  beforeEach(() => localStorage.clear());

  test("a lista troca o slide que o inspector edita", () => {
    render(<EditorShell />);

    const segundo = editorStore.getState().deck.slides[1];

    // Pelo número do slide, e não pela posição entre os botões da tela: a barra superior
    // também tem botões desde a 1E, e uma posição fixa aqui quebraria de novo no próximo
    // controle que ela ganhar.
    fireEvent.click(screen.getByRole("button", { name: /02/ }));

    expect(editorStore.getState().activeId).toBe(segundo.id);
    expect(screen.getByLabelText<HTMLTextAreaElement>("Título").value).toBe(
      segundo.fields.heading,
    );
  });

  test("a barra superior tem a exportação, com o rótulo que o alvo declarou", () => {
    render(<EditorShell />);

    expect(screen.getByRole("button", { name: /PDF/ })).toBeTruthy();
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
