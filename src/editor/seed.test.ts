import { describe, expect, test } from "vitest";
import { createSeedDeck } from "@/editor/seed";
import { parseInline } from "@/markup/parse";
import { get, list } from "@/templates";
import type { Field } from "@/templates/types";

/** O texto que chega ao canvas: os colchetes de `[[destaque]]` não ocupam linha. */
function rendered(source: unknown): string {
  return parseInline(String(source))
    .map((node) => node.v)
    .join("");
}

function slidesOf(template: string) {
  return createSeedDeck().slides.filter((slide) => slide.template === template);
}

/** Os campos que aceitam marcação a declaram; o resto é literal. §11.0 dos templates. */
function acceptsMarkup(field: Field): boolean {
  return "md" in field && field.md === true;
}

/**
 * Os blocos de texto de um campo — um por campo, exceto na lista, que tem um por item.
 *
 * Campo que não é texto não tem bloco: imagem é um id, `select` é um valor de enum. E
 * **o código não é bloco de texto**, apesar de ser string: quem o desenha é o shiki, não
 * o parser da §7, e uma crase dentro de um template literal é sintaxe da linguagem, não
 * marcação a conferir.
 */
function blocksOf(field: Field, value: unknown): string[] {
  if (field.type === "text" || field.type === "textarea") {
    return [String(value)];
  }

  return field.type === "list" ? (value as string[]) : [];
}

/**
 * Todo campo de todo slide da semente, com o descritor que o governa ao lado.
 *
 * É daqui que saem as três varreduras abaixo, e é por isso que nenhuma delas cita uma
 * §11.x: os limites e a flag de marcação já estão no descritor, e o registry os entrega
 * por template. Um limite que mudar na biblioteca passa a valer aqui no mesmo commit.
 */
function fieldsOfDeck() {
  return createSeedDeck().slides.flatMap((slide, index) =>
    get(slide.template).fields.map((field) => ({
      at: `${String(index + 1).padStart(2, "0")} ${slide.template}.${field.key}`,
      field,
      value: slide.fields[field.key],
    })),
  );
}

describe("createSeedDeck", () => {
  /**
   * O critério de pronto da Etapa 3 é "um carrossel de 8 a 12 slides usa os **dez**
   * templates". A semente é esse carrossel desde a 2E, quando ela deixou de ser o deck de
   * seis slides que existia só para dar o que olhar; a 3G é onde ela passa a usar a
   * biblioteca inteira.
   *
   * O conjunto esperado sai do `list()`, e não de dez ids escritos à mão: o dia em que um
   * template entrar na biblioteca, este teste reprova até ele entrar no carrossel também.
   */
  test("é um carrossel de 8 a 12 slides que usa todos os templates registrados", () => {
    const { slides } = createSeedDeck();

    expect(slides.length).toBeGreaterThanOrEqual(8);
    expect(slides.length).toBeLessThanOrEqual(12);
    expect(new Set(slides.map((slide) => slide.template))).toEqual(
      new Set(list().map((template) => template.id)),
    );
  });

  /**
   * A ordem é a da história: gancho, premissa, sintomas, investigação, o achado no código,
   * a correção, o respiro, o painel que não via, o alerta que passou a existir, o antes e
   * depois, a lição e o fecho.
   *
   * Dez templates em doze slides deixam duas repetições, e elas são a lista e o respiro —
   * os dois papéis que um carrossel de verdade exerce mais de uma vez. As duas listas
   * ficam adjacentes de propósito: é assim que as duas âncoras da §11.2 ficam lado a lado
   * na coluna, comparáveis sem trocar opção nenhuma.
   */
  test("a narrativa vai do gancho ao fecho, com a lista e o respiro repetidos", () => {
    expect(createSeedDeck().slides.map((slide) => slide.template)).toEqual([
      "cover-statement",
      "context",
      "text-bullets",
      "text-bullets",
      "code-window",
      "code-annotated",
      "text-impact",
      "split-vertical",
      "image-caption",
      "compare-2col",
      "text-impact",
      "final-cta",
    ]);
  });

  /**
   * O fechamento é o último por definição, e é a posição que faz a constelação sair
   * inteira acesa e o chevron ser suprimido — decisão 36. Sem ele no fim, os dois
   * comportamentos da 2.9 não teriam onde ser conferidos olhando.
   */
  test("o fechamento é o último slide do deck", () => {
    expect(createSeedDeck().slides.at(-1)?.template).toBe("final-cta");
  });

  /**
   * O kicker numera a **posição no deck** — §10.5 do design system —, e desde a 3G ele é
   * escrito nos doze, não só nos slides que a série numerava.
   *
   * O motivo é o mesmo de sempre, e agora vale para dez templates: os dez declaram
   * `kicker` desde a 3A, e um slide sem valor escrito herdaria o do **default do
   * template** — `api/ · 04` na quinta posição. Nove nascem com o cabeçalho desligado,
   * então isso ficaria invisível até alguém ligar a faixa, que é justamente o momento em
   * que ela precisa entregar o número certo.
   */
  test("o kicker numera a posição do slide no deck, nos doze", () => {
    expect(createSeedDeck().slides.map((slide) => slide.fields.kicker)).toEqual([
      "log/ · 01",
      "log/ · 02",
      "log/ · 03",
      "log/ · 04",
      "log/ · 05",
      "log/ · 06",
      "log/ · 07",
      "log/ · 08",
      "log/ · 09",
      "log/ · 10",
      "log/ · 11",
      "log/ · 12",
    ]);
  });

  test("cada slide tem título próprio — é o que torna a lista da 1D verificável", () => {
    const headings = createSeedDeck().slides.map((slide) => slide.fields.heading);

    expect(new Set(headings).size).toBe(12);
  });

  /**
   * Os limites da §11.x são conselho, mas a semente não tem por que estourá-los: ela é o
   * que abre na primeira execução, e o contador âmbar na primeira tela seria um defeito
   * anunciando outro.
   *
   * A conferência é uma varredura só sobre os dez templates, e não um bloco por §11.x com
   * os números copiados: o descritor já carrega `max`, `maxItems`, `maxPerItem` e
   * `maxLines`, e copiá-los para cá seria manter duas listas em dia. O que se mede num
   * campo com marcação é o texto **renderizado** — os colchetes de `[[destaque]]` não
   * ocupam linha no canvas e não têm por que ocupar limite.
   */
  test("todo valor cabe no limite do próprio descritor", () => {
    const over = fieldsOfDeck().flatMap(({ at, field, value }) => {
      if (field.type === "text" || field.type === "textarea") {
        const length = acceptsMarkup(field) ? rendered(value).length : String(value).length;

        return field.max !== undefined && length > field.max
          ? [`${at}: ${length} caracteres, limite ${field.max}`]
          : [];
      }

      if (field.type === "list") {
        const items = value as string[];
        const tooLong = items.filter(
          (item) =>
            field.maxPerItem !== undefined && rendered(item).length > field.maxPerItem,
        );

        return [
          ...(items.length > field.maxItems
            ? [`${at}: ${items.length} itens, limite ${field.maxItems}`]
            : []),
          ...tooLong.map((item) => `${at}: item com ${rendered(item).length} caracteres`),
        ];
      }

      if (field.type === "code") {
        const lines = String(value).split("\n").length;

        return lines > field.maxLines ? [`${at}: ${lines} linhas, limite ${field.maxLines}`] : [];
      }

      return [];
    });

    expect(over).toEqual([]);
  });

  /**
   * A marcação da §7 chega pronta na primeira tela: abrir a ferramenta já mostra o que ela
   * faz, sem ninguém precisar digitar nada.
   *
   * Onde ela **não** pode chegar é num campo literal. Um `**` no nome do arquivo da janela
   * de código, ou num rótulo do `compare-2col`, sai como dois asteriscos no slide — e a
   * semente é o exemplo que a ferramenta dá de si mesma.
   */
  test("campo sem `md` no descritor sai literal", () => {
    const marcados = fieldsOfDeck().flatMap(({ at, field, value }) =>
      acceptsMarkup(field)
        ? []
        : blocksOf(field, value)
            .filter((block) => rendered(block) !== block)
            .map(() => at),
    );

    expect(marcados).toEqual([]);
  });

  /**
   * O teto é **um nível de ênfase por bloco** — §3.4 do design system —, e nível não é
   * ocorrência: dois `` `código` `` na mesma linha são o mesmo nível, e nomear duas
   * variáveis não é enfatizar duas vezes. O que a regra proíbe é misturar marcadores num
   * bloco só, e é isso que este teste conta. Vale dentro da lista também: um item marcado
   * por slide, não um por item.
   */
  test("cada bloco tem no máximo um nível de ênfase", () => {
    const misturados = fieldsOfDeck().flatMap(({ at, field, value }) =>
      acceptsMarkup(field)
        ? blocksOf(field, value)
            .filter(
              (block) =>
                new Set(
                  parseInline(block)
                    .filter((node) => node.t !== "text")
                    .map((node) => node.t),
                ).size > 1,
            )
            .map(() => at)
        : [],
    );

    expect(misturados).toEqual([]);
  });

  /**
   * Todo slide traz marcação — e a exceção não é escolha da semente, é da biblioteca: o
   * `code-window` é o único dos dez em que **nenhum campo aceita marcação**. Título, nome
   * do arquivo e linguagem são literais, e o código é código.
   *
   * A exceção fica escrita aqui, com a posição e tudo, em vez de virar um `if` mudo: se um
   * segundo slide passar a não ter marcação, a lista muda e o teste conta o que aconteceu.
   */
  test("todo slide traz marcação, exceto o único sem campo que a aceite", () => {
    const semMarcacao = createSeedDeck().slides.flatMap((slide, index) => {
      const blocks = get(slide.template)
        .fields.filter(acceptsMarkup)
        .flatMap((field) => blocksOf(field, slide.fields[field.key]));
      const at = `${String(index + 1).padStart(2, "0")} ${slide.template}`;

      return blocks.some((block) => rendered(block) !== block) ? [] : [at];
    });

    expect(semMarcacao).toEqual(["05 code-window"]);
  });

  /**
   * A âncora dos itens é a única opção que a semente desvia do default, e ela alterna
   * entre as duas listas: as duas leituras da §11.2 ficam lado a lado na coluna, e o
   * critério de pronto da 2.8 se confere sem trocar opção nenhuma.
   */
  test("as âncoras alternam entre as listas", () => {
    const anchors = slidesOf("text-bullets").map((slide) => slide.options.anchor);

    expect(anchors).toEqual(["center", "top"]);
  });

  test("as opções vêm dos defaults do registry, não de cópia à mão", () => {
    for (const slide of createSeedDeck().slides) {
      const { defaults } = get(slide.template);

      // O `anchor` é o único desvio, e é deliberado — ver o teste acima. Tudo o mais tem
      // de bater com o que o template diz, chave por chave: o dia em que um template
      // ganhar opção, a semente a ganha junto.
      expect(Object.keys(slide.options)).toEqual(Object.keys(defaults.options));

      for (const [key, value] of Object.entries(defaults.options)) {
        if (key !== "anchor") {
          expect(slide.options[key]).toEqual(value);
        }
      }
    }
  });

  /**
   * A janela de código comporta **41 caracteres** por linha, e esse número não está em
   * descritor nenhum: `maxLines` conta linhas, e o guard de transbordo mede altura. Linha
   * larga demais não reprova em lugar nenhum — vaza pela direita, por cima do padding de
   * 32px da §4.2 do design system, e só aparece olhando o slide.
   *
   * A conta é medida e não estimada: 920px de janela menos 32 de cada lado são 856, e o
   * avanço da JetBrains Mono a 34px é 20,4px — 41,9 caracteres. A §11.6 dizia 45, que é o
   * que dá dividindo os 920 sem descontar o padding, e a 3G corrigiu a seção.
   */
  test("as linhas de código cabem na largura da janela", () => {
    const largas = createSeedDeck().slides.flatMap((slide, index) => {
      const code = slide.fields.code;

      return typeof code === "string"
        ? code
            .split("\n")
            .filter((line) => line.length > 41)
            .map((line) => `${String(index + 1).padStart(2, "0")}: ${line.length} — ${line}`)
        : [];
    });

    expect(largas).toEqual([]);
  });

  /**
   * "Frase curta é o alvo" — §11.5. Duas ou três linhas ainda funcionam; acima disso o
   * template está sendo usado como capa, que é justamente o que a semente fazia antes da
   * 3C. ~19 caracteres por linha em 96px sobre 920px de largura útil, então o teto de duas
   * linhas são 38 caracteres com folga.
   *
   * É o único limite que continua escrito à mão: o descritor promete 70, que é o teto da
   * região, e o conselho da §11.5 é mais apertado que ele.
   */
  test("as frases de impacto são curtas, não capas disfarçadas", () => {
    for (const impacto of slidesOf("text-impact")) {
      expect(rendered(impacto.fields.heading).length).toBeLessThanOrEqual(42);
    }
  });

  /**
   * A capa e o `text-impact` mostram o **mesmo corpo tipográfico com o gesto oposto** —
   * 96px ancorado à base e à esquerda contra 96px centralizado nos dois eixos. Com dez
   * templates em doze slides não sobra espaço para uma segunda capa, e o contraste que a
   * semente conferia entre duas capas de comprimento diferente passa a ser este, entre
   * dois templates.
   */
  test("a capa é uma só, e o respiro é o contraste dela", () => {
    expect(slidesOf("cover-statement")).toHaveLength(1);
    expect(slidesOf("text-impact")).toHaveLength(2);
  });

  test("dois decks semente não compartilham id nem objeto de campos", () => {
    const a = createSeedDeck();
    const b = createSeedDeck();

    expect(a.id).not.toBe(b.id);
    expect(a.slides[0].id).not.toBe(b.slides[0].id);
    expect(a.slides[0].fields).not.toBe(b.slides[0].fields);
  });

  test("o formato é o 4:5 do deck, e vem do factory", () => {
    expect(createSeedDeck().format).toEqual({ w: 1080, h: 1350 });
  });
});
