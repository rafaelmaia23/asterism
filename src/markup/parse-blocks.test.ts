import { describe, expect, test } from "vitest";
import { parseBlocks } from "@/markup/parse-blocks";

/**
 * A camada de blocos da §2 de `docs/model.md`, acima do `parseInline`.
 *
 * O que se prova aqui é a fronteira: onde um bloco acaba e outro começa. O conteúdo de
 * cada bloco sai **cru** — quem o transforma em texto desenhado é o `<Inline>` de sempre,
 * e por isso nenhum teste desta suíte fala em marcador.
 */
describe("parseBlocks", () => {
  test("uma linha vira um parágrafo", () => {
    expect(parseBlocks("uma frase")).toEqual([{ t: "p", v: "uma frase" }]);
  });

  test("linha em branco separa parágrafos", () => {
    expect(parseBlocks("primeiro\n\nsegundo")).toEqual([
      { t: "p", v: "primeiro" },
      { t: "p", v: "segundo" },
    ]);
  });

  test("quebra simples dentro de um parágrafo é espaço", () => {
    expect(parseBlocks("uma frase\nque continua")).toEqual([
      { t: "p", v: "uma frase que continua" },
    ]);
  });

  test("`- ` abre lista não ordenada, e linhas seguidas viram uma lista só", () => {
    expect(parseBlocks("- um\n- dois")).toEqual([{ t: "ul", items: ["um", "dois"] }]);
  });

  test("`1. ` abre lista ordenada, e o item guarda só o texto", () => {
    expect(parseBlocks("1. um\n2. dois")).toEqual([{ t: "ol", items: ["um", "dois"] }]);
  });

  test("a numeração escrita é ignorada: o que importa é a ordem — ADR-0076", () => {
    expect(parseBlocks("7. um\n7. dois")).toEqual([{ t: "ol", items: ["um", "dois"] }]);
  });

  test("um `- ` grudado no parágrafo quebra o parágrafo e abre a lista", () => {
    expect(parseBlocks("olha isto:\n- um")).toEqual([
      { t: "p", v: "olha isto:" },
      { t: "ul", items: ["um"] },
    ]);
  });

  test("trocar de marcador troca de bloco", () => {
    expect(parseBlocks("- um\n1. dois")).toEqual([
      { t: "ul", items: ["um"] },
      { t: "ol", items: ["dois"] },
    ]);
  });

  test("uma linha depois de um item continua um parágrafo novo, não o item", () => {
    expect(parseBlocks("- um\ntexto")).toEqual([
      { t: "ul", items: ["um"] },
      { t: "p", v: "texto" },
    ]);
  });

  describe("as bordas", () => {
    test("string vazia não tem bloco nenhum", () => {
      expect(parseBlocks("")).toEqual([]);
      expect(parseBlocks("   \n  \n")).toEqual([]);
    });

    test("item vazio é descartado, e a lista só de itens vazios não existe", () => {
      expect(parseBlocks("- um\n- \n- dois")).toEqual([{ t: "ul", items: ["um", "dois"] }]);
      expect(parseBlocks("- ")).toEqual([]);
    });

    test("a linha é aparada, e `  - sub` é item normal — não há aninhamento", () => {
      expect(parseBlocks("  - um\n    - dois")).toEqual([{ t: "ul", items: ["um", "dois"] }]);
    });

    test("um número de mais de dois dígitos é texto: `2024. ` não abre lista", () => {
      expect(parseBlocks("2024. o ano em que tudo mudou")).toEqual([
        { t: "p", v: "2024. o ano em que tudo mudou" },
      ]);
    });

    test("dois dígitos ainda abrem lista: a trava é contra o ano, não contra o item 42", () => {
      expect(parseBlocks("42. um")).toEqual([{ t: "ol", items: ["um"] }]);
    });

    test("`-item` sem espaço é texto, não marcador", () => {
      expect(parseBlocks("-item")).toEqual([{ t: "p", v: "-item" }]);
    });

    test("várias linhas em branco seguidas não inventam bloco vazio", () => {
      expect(parseBlocks("um\n\n\n\ndois")).toEqual([
        { t: "p", v: "um" },
        { t: "p", v: "dois" },
      ]);
    });

    test("parágrafo seguido de bullets é a composição que a etapa existe para permitir", () => {
      expect(parseBlocks("a razão é simples:\n\n- primeira\n- segunda\n\ne é só isso")).toEqual([
        { t: "p", v: "a razão é simples:" },
        { t: "ul", items: ["primeira", "segunda"] },
        { t: "p", v: "e é só isso" },
      ]);
    });

    test("o conteúdo do bloco sai cru, com a marcação inline intacta", () => {
      expect(parseBlocks("um **forte**\n- com `código`")).toEqual([
        { t: "p", v: "um **forte**" },
        { t: "ul", items: ["com `código`"] },
      ]);
    });
  });
});
