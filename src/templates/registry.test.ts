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
});
