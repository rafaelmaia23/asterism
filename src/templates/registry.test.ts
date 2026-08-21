import { describe, expect, test } from "vitest";
import { z } from "zod";
import { createRegistry } from "@/templates/registry";
import type { AnyTemplateDef } from "@/templates/types";

function stub(id: string): AnyTemplateDef {
  return {
    id,
    label: id,
    group: "content",
    background: "plain",
    fields: [],
    options: [],
    schema: z.object({ fields: z.object({}), options: z.object({}) }),
    defaults: { fields: {}, options: {} },
    Component: () => null,
  };
}

describe("registry", () => {
  test("devolve o template registrado", () => {
    const { register, get } = createRegistry();
    const def = stub("cover-statement");
    register(def);

    expect(get("cover-statement")).toBe(def);
  });

  test("list preserva a ordem de registro", () => {
    const { register, list } = createRegistry();
    register(stub("final-cta"));
    register(stub("cover-statement"));
    register(stub("text-bullets"));

    expect(list().map((def) => def.id)).toEqual([
      "final-cta",
      "cover-statement",
      "text-bullets",
    ]);
  });

  test("list devolve uma cópia: mexer no array não mexe no registry", () => {
    const { register, list } = createRegistry();
    register(stub("cover-statement"));

    list().pop();

    expect(list()).toHaveLength(1);
  });

  test("get de id desconhecido lança, com o id na mensagem", () => {
    const { register, get } = createRegistry();
    register(stub("cover-statement"));

    expect(() => get("nao-existe")).toThrow(/nao-existe/);
  });

  test("registrar o mesmo id duas vezes lança", () => {
    const { register } = createRegistry();
    register(stub("cover-statement"));

    expect(() => register(stub("cover-statement"))).toThrow(/cover-statement/);
  });

  /**
   * Em desenvolvimento, registrar de novo é o HMR reavaliando `templates/index.ts` sem
   * reavaliar este módulo — recarga, não erro de programação. Lançar ali derrubava o
   * `next dev` a cada edição na cadeia que chega até o registry, e substituir é também o
   * comportamento útil: editar um template e ver a edição sem reiniciar o servidor.
   */
  test("em desenvolvimento, registrar de novo substitui o descritor", () => {
    const anterior = process.env.NODE_ENV;
    // `NODE_ENV` é somente-leitura no tipo do Node, e o teste precisa justamente trocá-lo.
    (process.env as Record<string, string>).NODE_ENV = "development";

    try {
      const { register, get, list } = createRegistry();
      register(stub("cover-statement"));
      const novo = stub("cover-statement");

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
      const { register, list } = createRegistry();
      register(stub("cover-statement"));
      register(stub("text-bullets"));
      register(stub("cover-statement"));

      expect(list().map((def) => def.id)).toEqual(["cover-statement", "text-bullets"]);
    } finally {
      (process.env as Record<string, string>).NODE_ENV = anterior as string;
    }
  });
});
