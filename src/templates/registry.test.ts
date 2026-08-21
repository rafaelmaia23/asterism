import { describe, expect, test } from "vitest";
import { z } from "zod";
import { createTemplateRegistry } from "@/templates/registry";
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

/**
 * A mecânica do registry — ordem, cópia da lista, id desconhecido, HMR — é testada em
 * `src/lib/registry.test.ts`, que é onde ela mora desde que os alvos de exportação
 * passaram a usar a mesma factory. O que sobra aqui é o que é do registry de templates:
 * guardar descritor de template e dizer "Template" quando reclama.
 */
describe("registry de templates", () => {
  test("devolve o descritor registrado", () => {
    const { register, get } = createTemplateRegistry();
    const def = stub("cover-statement");
    register(def);

    expect(get("cover-statement")).toBe(def);
  });

  test("id desconhecido lança dizendo que é template", () => {
    const { get } = createTemplateRegistry();

    expect(() => get("nao-existe")).toThrow(/Template desconhecido: nao-existe/);
  });
});
