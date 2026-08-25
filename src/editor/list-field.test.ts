import { describe, expect, test } from "vitest";
import { addItem, moveItem, removeItem, setItem } from "@/editor/list-field";

const items = ["um", "dois", "três"];

describe("setItem", () => {
  test("troca o item da posição e preserva o resto", () => {
    expect(setItem(items, 1, "DOIS")).toEqual(["um", "DOIS", "três"]);
  });
});

describe("addItem", () => {
  test("acrescenta um item vazio no fim", () => {
    expect(addItem(items)).toEqual(["um", "dois", "três", ""]);
  });

  /**
   * Sem teto: `maxItems` é conselho como todo limite do descritor — §8 do documento de
   * contexto e §11.0 dos templates. O contador avisa, o guard de transbordo reprova
   * medindo altura, e a função não tem opinião sobre quantos itens são demais.
   */
  test("acrescenta mesmo acima do que o descritor aconselha", () => {
    expect(addItem(["a", "b", "c", "d"])).toHaveLength(5);
  });
});

describe("removeItem", () => {
  test("tira o item da posição", () => {
    expect(removeItem(items, 0)).toEqual(["dois", "três"]);
  });

  /** Remover até esvaziar é permitido: o botão de acrescentar é o caminho de volta, e uma
      lista vazia é estado legítimo enquanto se recompõe o slide. */
  test("remover o último deixa a lista vazia", () => {
    expect(removeItem(["só este"], 0)).toEqual([]);
  });

  test("posição fora da lista não muda nada", () => {
    expect(removeItem(items, 7)).toEqual(items);
  });
});

describe("moveItem", () => {
  test("sobe e desce um item", () => {
    expect(moveItem(items, 1, -1)).toEqual(["dois", "um", "três"]);
    expect(moveItem(items, 1, 1)).toEqual(["um", "três", "dois"]);
  });

  test("nas pontas não faz nada", () => {
    expect(moveItem(items, 0, -1)).toEqual(items);
    expect(moveItem(items, 2, 1)).toEqual(items);
  });
});

/**
 * Nenhuma delas muta a entrada. O store troca o array inteiro por `setField`, e é a
 * identidade preservada dos slides vizinhos que faz o `memo` da lista lateral valer —
 * uma função que mutasse aqui faria o React não ver mudança nenhuma.
 */
describe("nenhuma função muta a entrada", () => {
  test("a lista original sai intacta de todas", () => {
    const original = [...items];

    setItem(items, 1, "outro");
    addItem(items);
    removeItem(items, 0);
    moveItem(items, 1, -1);

    expect(items).toEqual(original);
  });

  test("cada uma devolve um array novo", () => {
    expect(setItem(items, 0, "um")).not.toBe(items);
    expect(addItem(items)).not.toBe(items);
    expect(removeItem(items, 0)).not.toBe(items);
    expect(moveItem(items, 1, -1)).not.toBe(items);
  });
});
