import { describe, expect, test } from "vitest";
import { parseInline } from "@/markup/parse";

/**
 * A matriz desta suíte é o alvo de cobertura séria da v1 — §7 do documento de contexto.
 * `parseInline` é função pura, sem DOM e sem dependência: é o teste mais barato do
 * projeto e o que protege o único pedaço de lógica que todo template vai atravessar.
 */
describe("parseInline", () => {
  describe("os sete marcadores da §7, isolados", () => {
    test("**forte**", () => {
      expect(parseInline("**forte**")).toEqual([{ t: "strong", v: "forte" }]);
    });

    test("*ênfase*", () => {
      expect(parseInline("*ênfase*")).toEqual([{ t: "em", v: "ênfase" }]);
    });

    test("~~riscado~~", () => {
      expect(parseInline("~~riscado~~")).toEqual([{ t: "strike", v: "riscado" }]);
    });

    test("++sublinhado++", () => {
      expect(parseInline("++sublinhado++")).toEqual([{ t: "underline", v: "sublinhado" }]);
    });

    test("==marca==", () => {
      expect(parseInline("==marca==")).toEqual([{ t: "mark", v: "marca" }]);
    });

    test("`código`", () => {
      expect(parseInline("`código`")).toEqual([{ t: "code", v: "código" }]);
    });

    test("[[destaque]]", () => {
      expect(parseInline("[[destaque]]")).toEqual([{ t: "accent", v: "destaque" }]);
    });
  });

  test("texto sem marcador vira um nó só", () => {
    expect(parseInline("um título que declara algo")).toEqual([
      { t: "text", v: "um título que declara algo" },
    ]);
  });

  test("string vazia não tem nó nenhum", () => {
    expect(parseInline("")).toEqual([]);
  });

  test("marcador no meio do texto parte a frase em três", () => {
    expect(parseInline("o cache [[mentiu]] sobre o que guardava")).toEqual([
      { t: "text", v: "o cache " },
      { t: "accent", v: "mentiu" },
      { t: "text", v: " sobre o que guardava" },
    ]);
  });

  test("marcadores adjacentes, sem texto entre eles", () => {
    expect(parseInline("**a**==b==")).toEqual([
      { t: "strong", v: "a" },
      { t: "mark", v: "b" },
    ]);
  });

  test("marcadores diferentes na mesma linha, cada um com o próprio nó", () => {
    expect(parseInline("*a* e `b` e ~~c~~")).toEqual([
      { t: "em", v: "a" },
      { t: "text", v: " e " },
      { t: "code", v: "b" },
      { t: "text", v: " e " },
      { t: "strike", v: "c" },
    ]);
  });

  /** A regra da decisão 33: o tokenizer não conhece limite de palavra. */
  test("marcador no meio de palavra vale, sem regra de limite de palavra", () => {
    expect(parseInline("micro**serviços**")).toEqual([
      { t: "text", v: "micro" },
      { t: "strong", v: "serviços" },
    ]);
    expect(parseInline("re[[start]]ar")).toEqual([
      { t: "text", v: "re" },
      { t: "accent", v: "start" },
      { t: "text", v: "ar" },
    ]);
  });

  test("`**` ganha de `*`: o mais longo é tentado primeiro", () => {
    expect(parseInline("**b**")).toEqual([{ t: "strong", v: "b" }]);
    expect(parseInline("*b*")).toEqual([{ t: "em", v: "b" }]);
  });

  describe("o que não vira marcador", () => {
    test("marcador não fechado é texto literal", () => {
      expect(parseInline("**sem fim")).toEqual([{ t: "text", v: "**sem fim" }]);
      expect(parseInline("um [[destaque aberto")).toEqual([
        { t: "text", v: "um [[destaque aberto" },
      ]);
    });

    test("fechador sozinho é texto literal", () => {
      expect(parseInline("fim**")).toEqual([{ t: "text", v: "fim**" }]);
    });

    test("conteúdo vazio sai como texto, não como marcador vazio", () => {
      expect(parseInline("****")).toEqual([{ t: "text", v: "****" }]);
      expect(parseInline("[[]]")).toEqual([{ t: "text", v: "[[]]" }]);
      expect(parseInline("``")).toEqual([{ t: "text", v: "``" }]);
    });

    test("marcador vazio no meio da frase não parte o texto em volta", () => {
      expect(parseInline("a ==== b")).toEqual([{ t: "text", v: "a ==== b" }]);
    });
  });

  /**
   * §7: marcadores não aninham. O externo vence e o interno vira caractere literal
   * dentro do `v` — o parser não olha o conteúdo de um nó duas vezes.
   */
  test("marcador dentro de marcador é literal no externo", () => {
    expect(parseInline("**a *b* c**")).toEqual([{ t: "strong", v: "a *b* c" }]);
    expect(parseInline("`um **forte** aqui`")).toEqual([
      { t: "code", v: "um **forte** aqui" },
    ]);
  });

  test("nós de texto vizinhos são colapsados em um só", () => {
    // Três rejeições seguidas — dois fechadores órfãos e um marcador vazio — e ainda
    // assim um nó de texto, não quatro.
    const nodes = parseInline("a ** b ++ c ==== d");

    expect(nodes).toEqual([{ t: "text", v: "a ** b ++ c ==== d" }]);
  });

  /**
   * O critério de pronto da 2.1: AST, **nunca** HTML. Além do tipo, a prova é que
   * nenhum `v` de nó marcado carrega o delimitador de volta.
   */
  test("nenhum nó marcado devolve o delimitador dentro do valor", () => {
    const nodes = parseInline("**a** *b* ~~c~~ ++d++ ==e== `f` [[g]]");
    const marked = nodes.filter((node) => node.t !== "text");

    expect(marked).toHaveLength(7);
    for (const node of marked) {
      expect(node.v).not.toMatch(/^[*~+=`[]|[*~+=`\]]$/);
    }
    expect(marked.map((node) => node.v)).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
  });

  test("a quebra de linha é texto como outro qualquer — não existe construção de bloco", () => {
    expect(parseInline("uma linha\ne **outra**")).toEqual([
      { t: "text", v: "uma linha\ne " },
      { t: "strong", v: "outra" },
    ]);
  });
});
