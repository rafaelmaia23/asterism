import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ExportButtons } from "@/editor/export-button";
import { editorStore } from "@/editor/store";
import "@/templates";

const exportDeck = vi.hoisted(() => vi.fn(async () => {}));

vi.mock("@/export/run", () => ({ exportDeck }));

describe("ExportButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("um botão por alvo registrado, com o rótulo do alvo", () => {
    render(<ExportButtons />);

    expect(screen.getByRole("button", { name: /PDF/ })).toBeTruthy();
  });

  test("clicar exporta o deck do store no alvo daquele botão", async () => {
    render(<ExportButtons />);

    fireEvent.click(screen.getByRole("button", { name: /PDF/ }));

    await waitFor(() =>
      expect(exportDeck).toHaveBeenCalledWith(editorStore.getState().deck, "pdf"),
    );
  });

  test("o botão fica desabilitado enquanto a exportação acontece", async () => {
    let libera = () => {};
    exportDeck.mockImplementation(() => new Promise<void>((resolve) => (libera = resolve)));

    render(<ExportButtons />);
    const botao = screen.getByRole("button", { name: /PDF/ });

    fireEvent.click(botao);
    await waitFor(() => expect(botao.hasAttribute("disabled")).toBe(true));

    libera();
    await waitFor(() => expect(botao.hasAttribute("disabled")).toBe(false));
  });

  test("exportação que falha devolve o botão ao normal", async () => {
    exportDeck.mockRejectedValue(new Error("captura falhou"));

    render(<ExportButtons />);
    const botao = screen.getByRole("button", { name: /PDF/ });

    fireEvent.click(botao);

    await waitFor(() => expect(botao.hasAttribute("disabled")).toBe(false));
  });

  test("o botão anuncia que está trabalhando e troca o ícone pelo spinner", async () => {
    let libera = () => {};
    exportDeck.mockImplementation(() => new Promise<void>((resolve) => (libera = resolve)));

    render(<ExportButtons />);
    const botao = screen.getByRole("button", { name: /PDF/ });

    expect(botao.getAttribute("aria-busy")).toBe("false");
    expect(botao.querySelector("[data-testid='export-spinner']")).toBeNull();

    fireEvent.click(botao);
    await waitFor(() => expect(botao.getAttribute("aria-busy")).toBe("true"));
    expect(botao.querySelector("[data-testid='export-spinner']")).toBeTruthy();

    // O rótulo não muda: a §8 do design system pede largura preservada.
    expect(botao.textContent).toBe("PDF");

    libera();
    await waitFor(() => expect(botao.getAttribute("aria-busy")).toBe("false"));
    expect(botao.querySelector("[data-testid='export-spinner']")).toBeNull();
  });

  test("exportação que falha também devolve o `aria-busy` ao normal", async () => {
    exportDeck.mockRejectedValue(new Error("captura falhou"));

    render(<ExportButtons />);
    const botao = screen.getByRole("button", { name: /PDF/ });

    fireEvent.click(botao);

    await waitFor(() => expect(botao.getAttribute("aria-busy")).toBe("false"));
  });
});
