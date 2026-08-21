import { describe, expect, test } from "vitest";
import { get, list } from "@/export";

/**
 * O espelho de `src/templates/index.test.ts`: prova que o módulo de registro rodou e que
 * o alvo da v1 está lá. É o teste que quebra no dia em que alguém acrescentar um alvo e
 * esquecer a linha de `register`.
 */
describe("registro de alvos", () => {
  test("o alvo pdf está registrado", () => {
    expect(get("pdf").id).toBe("pdf");
  });

  test("a v1 tem um alvo só", () => {
    expect(list().map((target) => target.id)).toEqual(["pdf"]);
  });

  test("todo alvo tem rótulo e descritor de opções", () => {
    for (const target of list()) {
      expect(target.label).toBeTruthy();
      expect(Array.isArray(target.options)).toBe(true);
    }
  });
});
