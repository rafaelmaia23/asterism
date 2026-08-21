import { describe, expect, test } from "vitest";
import { createRegistry } from "@/lib/registry";

type Item = { id: string; label?: string };

const registry = () => createRegistry<Item>("Template");

/**
 * Os testes vieram de `templates/registry.test.ts` quando o registry virou genérico. O
 * comportamento é o mesmo; o que mudou é que agora ele serve a dois usuários — a
 * biblioteca de templates e os alvos de exportação — e que o rótulo do que se registra
 * passou a ser argumento.
 */
describe("createRegistry", () => {
  test("devolve o item registrado", () => {
    const { register, get } = registry();
    const item = { id: "cover-statement" };
    register(item);

    expect(get("cover-statement")).toBe(item);
  });

  test("list preserva a ordem de registro", () => {
    const { register, list } = registry();
    register({ id: "final-cta" });
    register({ id: "cover-statement" });
    register({ id: "text-bullets" });

    expect(list().map((item) => item.id)).toEqual([
      "final-cta",
      "cover-statement",
      "text-bullets",
    ]);
  });

  test("list devolve uma cópia: mexer no array não mexe no registry", () => {
    const { register, list } = registry();
    register({ id: "cover-statement" });

    list().pop();

    expect(list()).toHaveLength(1);
  });

  test("get de id desconhecido lança, com o rótulo e o id na mensagem", () => {
    const { register, get } = registry();
    register({ id: "cover-statement" });

    expect(() => get("nao-existe")).toThrow(/Template desconhecido: nao-existe/);
  });

  test("cada registry tem o próprio rótulo de erro", () => {
    const { get } = createRegistry<Item>("Alvo de exportação");

    expect(() => get("nao-existe")).toThrow(/Alvo de exportação desconhecido/);
  });

  test("registrar o mesmo id duas vezes lança", () => {
    const { register } = registry();
    register({ id: "cover-statement" });

    expect(() => register({ id: "cover-statement" })).toThrow(/cover-statement/);
  });

  /**
   * Em desenvolvimento, registrar de novo é o HMR reavaliando o módulo que registra sem
   * reavaliar este — recarga, não erro de programação. Lançar ali derrubava o `next dev`
   * a cada edição na cadeia que chega até o registry, e substituir é também o
   * comportamento útil: editar um template e ver a edição sem reiniciar o servidor.
   */
  test("em desenvolvimento, registrar de novo substitui o item", () => {
    const anterior = process.env.NODE_ENV;
    // `NODE_ENV` é somente-leitura no tipo do Node, e o teste precisa justamente trocá-lo.
    (process.env as Record<string, string>).NODE_ENV = "development";

    try {
      const { register, get, list } = registry();
      register({ id: "cover-statement", label: "velho" });
      const novo = { id: "cover-statement", label: "novo" };

      expect(() => register(novo)).not.toThrow();
      expect(get("cover-statement")).toBe(novo);
      expect(list()).toHaveLength(1);
    } finally {
      (process.env as Record<string, string>).NODE_ENV = anterior as string;
    }
  });

  test("a substituição em desenvolvimento preserva a posição na lista", () => {
    const anterior = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "development";

    try {
      const { register, list } = registry();
      register({ id: "cover-statement" });
      register({ id: "text-bullets" });
      register({ id: "cover-statement" });

      expect(list().map((item) => item.id)).toEqual(["cover-statement", "text-bullets"]);
    } finally {
      (process.env as Record<string, string>).NODE_ENV = anterior as string;
    }
  });
});
