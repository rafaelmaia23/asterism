import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { z } from "zod";
import type { Deck } from "@/deck/types";
import { Inspector } from "@/editor/inspector";
import { createEditorStore } from "@/editor/store";
import { list, register } from "@/templates/registry";
import { sharedSections } from "@/templates/shared/sections";
import type { Field, TemplateDef } from "@/templates/types";
import "@/templates";

/**
 * Um template que só existe aqui. É ele que prova o critério de pronto da 1.11: campo
 * novo no descritor aparece no formulário **sem tocar no inspector**. Se algum dia o
 * inspector passar a conhecer template, este teste é o que quebra.
 */
const fakeFields: Field[] = [
  // Na seção do cabeçalho: um `field` desenhado junto do interruptor que o liga, que é uma
  // `option`. É a decisão 44 — a seção é desenho, e os dois sacos continuam separados.
  { key: "kicker", type: "text", label: "Etiqueta", max: 12, section: "header" },
  { key: "heading", type: "textarea", label: "Título", max: 20, md: true, rows: 3 },
  { key: "items", type: "list", label: "Tópicos", maxItems: 4, maxPerItem: 10, md: true },
  // Sem limite no descritor, para provar que o contador nasce do descritor e não do tipo.
  { key: "cta", type: "text", label: "Destino" },
  // Tipo que continua sem controle depois da 2C — é ele que guarda a linha inerte.
  { key: "image", type: "image", label: "Imagem" },
];

const fakeOptions: Field[] = [
  { key: "showHeader", type: "toggle", label: "Cabeçalho" },
  { key: "showFooter", type: "toggle", label: "Rodapé" },
  { key: "showChevron", type: "toggle", label: "Chevron", section: "footer" },
  {
    key: "anchor",
    type: "select",
    label: "Âncora",
    options: [
      { value: "center", label: "Centralizado" },
      { value: "top", label: "No topo" },
    ],
  },
];

register({
  id: "fake-template",
  label: "Template de teste",
  group: "content",
  background: "plain",
  sections: sharedSections,
  fields: fakeFields,
  options: fakeOptions,
  schema: z.object({
    fields: z.record(z.string(), z.string()),
    options: z.record(z.string(), z.union([z.string(), z.boolean()])),
  }),
  defaults: { fields: {}, options: {} },
  Component: () => null,
} satisfies TemplateDef);

/** Um template que não usa nenhuma seção além da de conteúdo, que é onde o padrão cai. */
register({
  id: "template-sem-secoes",
  label: "Template sem seções",
  group: "content",
  background: "plain",
  sections: sharedSections,
  fields: [{ key: "heading", type: "textarea", label: "Título" }],
  options: [],
  schema: z.object({
    fields: z.record(z.string(), z.string()),
    options: z.record(z.string(), z.union([z.string(), z.boolean()])),
  }),
  defaults: { fields: {}, options: {} },
  Component: () => null,
} satisfies TemplateDef);

const SLIDE_ID = "id-que-nao-pode-vazar";

function makeDeck(): Deck {
  return {
    version: 1,
    id: "d1",
    title: "Deck de teste",
    format: { w: 1080, h: 1350 },
    meta: { handle: "@rafael", pillar: "log" },
    slides: [
      {
        id: SLIDE_ID,
        template: "fake-template",
        fields: {
          kicker: "log/ · 01",
          heading: "Um título",
          items: ["a", "b"],
          cta: "blog.maiahub.com.br",
          image: "",
        },
        options: { showHeader: true, showFooter: true, showChevron: true, anchor: "center" },
      },
    ],
    assets: {},
  };
}

function renderInspector() {
  const store = createEditorStore(makeDeck());
  const { container } = render(<Inspector store={store} />);
  return { store, container };
}

/** O rodapé nasce encolhido — quem precisa dos controles dele abre a seção primeiro. */
function abrirRodape() {
  fireEvent.click(screen.getByTestId("collapse-footer"));
}

describe("Inspector", () => {
  /** O seletor de layout da §14 do documento de contexto, no topo do formulário. */
  test("o topo mostra o layout do slide ativo", () => {
    renderInspector();

    expect(screen.getByTestId("layout-trigger").textContent).toContain("Template de teste");
  });

  /**
   * A 2.11: escolher outro layout troca o template do slide e preserva o que já foi
   * digitado. A confirmação é por teclado pelo mesmo motivo do select de opção — o caminho
   * de ponteiro do Base UI exige a sequência inteira de eventos e o `fireEvent` dispara um
   * por vez.
   */
  test("escolher outro layout troca o template e preserva o conteúdo", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByTestId("layout-trigger"));
    fireEvent.keyDown(screen.getByRole("option", { name: "Tópicos" }), { key: "Enter" });

    const slide = store.getState().deck.slides[0];
    expect(slide.template).toBe("text-bullets");
    expect(slide.fields.heading).toBe("Um título");
  });

  test("o formulário passa a ser o do template novo", () => {
    renderInspector();

    fireEvent.click(screen.getByTestId("layout-trigger"));
    fireEvent.keyDown(screen.getByRole("option", { name: "Tópicos" }), { key: "Enter" });

    expect(screen.getByLabelText<HTMLTextAreaElement>("Título").value).toBe("Um título");
    expect(screen.queryByLabelText("Etiqueta")).toBeNull();
  });

  test("a biblioteca inteira aparece no popup, na ordem do registry", () => {
    renderInspector();

    fireEvent.click(screen.getByTestId("layout-trigger"));

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(
      list().map((def) => def.label),
    );
  });

  test("desenha um controle por descritor, com o rótulo do descritor", () => {
    renderInspector();
    abrirRodape();

    expect(screen.getByLabelText("Etiqueta")).toHaveProperty("tagName", "INPUT");
    expect(screen.getByLabelText("Título")).toHaveProperty("tagName", "TEXTAREA");
    expect(screen.getByLabelText("Chevron")).toBeTruthy();
  });

  test("os controles abrem com o conteúdo do slide ativo", () => {
    renderInspector();

    expect(screen.getByLabelText<HTMLInputElement>("Etiqueta").value).toBe("log/ · 01");
    expect(screen.getByLabelText<HTMLTextAreaElement>("Título").value).toBe("Um título");
  });

  test("digitar num campo escreve no store e volta para o controle", () => {
    const { store } = renderInspector();

    fireEvent.change(screen.getByLabelText("Título"), { target: { value: "Outro" } });

    expect(store.getState().deck.slides[0].fields.heading).toBe("Outro");
    expect(screen.getByLabelText<HTMLTextAreaElement>("Título").value).toBe("Outro");
  });

  /**
   * O deck é criado uma vez na pré-renderização estática e outra no navegador, e os ids
   * saem de `crypto.randomUUID()` — então id de dado em atributo do DOM diverge entre os
   * dois e o React não remenda atributo. Identificador de formulário sai de `useId`.
   */
  test("nenhum id de dado chega ao DOM", () => {
    const { container } = renderInspector();

    expect(container.innerHTML).not.toContain(SLIDE_ID);
  });

  test("o toggle escreve em options, não em fields", () => {
    const { store } = renderInspector();
    abrirRodape();

    fireEvent.click(screen.getByLabelText("Chevron"));

    expect(store.getState().deck.slides[0].options.showChevron).toBe(false);
    expect(store.getState().deck.slides[0].fields.showChevron).toBeUndefined();
  });

  test("o contador mostra o comprimento contra o limite do descritor", () => {
    renderInspector();

    // "Um título" tem 9 caracteres; o limite do campo falso é 20.
    expect(screen.getByTestId("counter-heading").textContent).toBe("9/20");
  });

  /**
   * O limite é conselho, não trava — §11.0 dos templates. Quem reprova de fato é o guard
   * de transbordo, medindo altura real, e ele nem existe ainda.
   */
  test("passar do limite tinge o contador e não trava a digitação", () => {
    const { store } = renderInspector();
    const longo = "x".repeat(28);

    fireEvent.change(screen.getByLabelText("Título"), { target: { value: longo } });

    expect(store.getState().deck.slides[0].fields.heading).toBe(longo);
    expect(screen.getByTestId("counter-heading").textContent).toBe("28/20");
    expect(screen.getByTestId("counter-heading").className).toContain("text-warning");
    expect(screen.getByLabelText("Título")).not.toHaveProperty("maxLength", 20);
  });

  test("campo sem limite no descritor não ganha contador", () => {
    renderInspector();

    expect(screen.queryByTestId("counter-cta")).toBeNull();
  });

  /**
   * Tipo ainda não editável aparece assim mesmo. Pular em silêncio faria o critério
   * "campo novo aparece sozinho" passar por acidente no dia em que o campo novo for uma
   * imagem ou um bloco de código — os dois que sobraram depois da 2C.
   */
  test("tipo não suportado aparece como linha inerte, com o rótulo", () => {
    renderInspector();

    const linha = screen.getByTestId("field-image");

    expect(linha.textContent).toContain("Imagem");
    expect(linha.querySelector("input, textarea")).toBeNull();
  });
});

/**
 * As seções da 2F. O inspector continua não conhecendo template nenhum: ele lê `sections`
 * do descritor e desenha uma seção por entrada, na ordem declarada.
 */
describe("Inspector — seções", () => {
  test("uma seção por entrada declarada, na ordem do descritor", () => {
    const { container } = renderInspector();

    const ordem = [...container.querySelectorAll("[data-testid^='section-']")].map((node) =>
      node.getAttribute("data-testid"),
    );

    expect(ordem).toEqual([
      "section-header",
      "section-content",
      "section-footer",
      "section-style",
    ]);
  });

  /** Campo sem `section` cai em `content`; opção sem `section` cai em `style`. */
  test("o controle desenha na seção que declara, e o resto cai no padrão", () => {
    renderInspector();

    const dentro = (secao: string, testid: string) =>
      screen.getByTestId(secao).querySelector(`[data-testid='${testid}']`) !== null;

    abrirRodape();

    expect(dentro("section-header", "field-kicker")).toBe(true);
    expect(dentro("section-content", "field-heading")).toBe(true);
    expect(dentro("section-footer", "field-showChevron")).toBe(true);
    expect(dentro("section-style", "field-anchor")).toBe(true);
  });

  /**
   * O interruptor da seção desenha no cabeçalho dela, e **não** também como linha dentro.
   * Ele continua declarado em `options` — é o que mantém `options` sendo a lista completa
   * das chaves de opção, que os testes de paridade de cada template conferem.
   */
  test("o interruptor da seção não aparece duas vezes", () => {
    renderInspector();

    expect(screen.getByLabelText("Cabeçalho")).toBeTruthy();
    expect(screen.queryByTestId("field-showHeader")).toBeNull();
    expect(screen.queryByTestId("field-showFooter")).toBeNull();
  });

  test("o interruptor da seção escreve em options", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByLabelText("Rodapé"));

    expect(store.getState().deck.slides[0].options.showFooter).toBe(false);
  });

  /** Desligada, a seção mostra só o cabeçalho: não há o que ajustar numa faixa que sumiu. */
  test("com o interruptor desligado, os controles da seção somem", () => {
    renderInspector();

    expect(screen.getByTestId("field-kicker")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Cabeçalho"));

    expect(screen.queryByTestId("field-kicker")).toBeNull();
    // A seção continua lá — é como se liga a faixa de volta.
    expect(screen.getByTestId("section-header")).toBeTruthy();
  });

  test("ligar de volta traz os controles com o que estava escrito", () => {
    renderInspector();

    fireEvent.click(screen.getByLabelText("Cabeçalho"));
    fireEvent.click(screen.getByLabelText("Cabeçalho"));

    expect(screen.getByLabelText<HTMLInputElement>("Etiqueta").value).toBe("log/ · 01");
  });

  /**
   * Encolher é estado do painel, não do slide: o `partialize` do store salva só o deck, e
   * preferência de coluna não é modelo de dados.
   */
  test("o gatilho encolhe a seção sem mexer no interruptor", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByTestId("collapse-header"));

    expect(screen.queryByTestId("field-kicker")).toBeNull();
    expect(store.getState().deck.slides[0].options.showHeader).toBe(true);

    fireEvent.click(screen.getByTestId("collapse-header"));

    expect(screen.getByTestId("field-kicker")).toBeTruthy();
  });

  test("o gatilho anuncia se está aberto", () => {
    renderInspector();

    expect(screen.getByTestId("collapse-header").getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(screen.getByTestId("collapse-header"));

    expect(screen.getByTestId("collapse-header").getAttribute("aria-expanded")).toBe("false");
  });

  /**
   * O rodapé são cinco interruptores que se mexe uma vez e não se olha mais. Nasce
   * encolhido para que a coluna abra mostrando o que se edita, não o que se configurou.
   */
  test("o rodapé nasce encolhido; as outras seções, abertas", () => {
    renderInspector();

    expect(screen.getByTestId("collapse-footer").getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByTestId("collapse-content").getAttribute("aria-expanded")).toBe("true");
    expect(screen.queryByTestId("field-showChevron")).toBeNull();
  });

  /**
   * Um template que não declara o interruptor de uma seção nem nenhum controle nela não
   * ganha uma faixa vazia no formulário. Vale para os sete templates da Etapa 3 que ainda
   * não existem tanto quanto para este.
   */
  test("seção sem interruptor e sem controles não desenha", () => {
    const store = createEditorStore({
      ...makeDeck(),
      slides: [
        {
          id: "s-vazio",
          template: "template-sem-secoes",
          fields: { heading: "Só isto" },
          options: {},
        },
      ],
    });

    render(<Inspector store={store} />);

    expect(screen.getByTestId("section-content")).toBeTruthy();
    expect(screen.queryByTestId("section-header")).toBeNull();
    expect(screen.queryByTestId("section-footer")).toBeNull();
    expect(screen.queryByTestId("section-style")).toBeNull();
  });
});

/**
 * O controle de `list` da 2.6. A lógica de acrescentar, remover e reordenar mora em
 * `list-field.ts` e é testada lá; o que se prova aqui é a ligação — cada botão escreve o
 * array inteiro no store, e o formulário volta a desenhá-lo.
 */
describe("Inspector — campo list", () => {
  test("desenha uma textarea por item, nomeada pela posição", () => {
    renderInspector();

    expect(screen.getByLabelText<HTMLTextAreaElement>("Tópicos 1").value).toBe("a");
    expect(screen.getByLabelText<HTMLTextAreaElement>("Tópicos 2").value).toBe("b");
    expect(screen.queryByLabelText("Tópicos 3")).toBeNull();
  });

  test("digitar num item escreve só naquele item", () => {
    const { store } = renderInspector();

    fireEvent.change(screen.getByLabelText("Tópicos 2"), { target: { value: "outro" } });

    expect(store.getState().deck.slides[0].fields.items).toEqual(["a", "outro"]);
  });

  test("acrescentar põe um item vazio no fim", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByTestId("add-items"));

    expect(store.getState().deck.slides[0].fields.items).toEqual(["a", "b", ""]);
    expect(screen.getByLabelText<HTMLTextAreaElement>("Tópicos 3").value).toBe("");
  });

  /**
   * `maxItems` é conselho como todo limite do descritor — §8 do documento de contexto. O
   * contador fica âmbar no quinto item, o botão continua ativo, e quem reprova de fato é
   * o guard de transbordo, medindo altura real. Três itens curtos e cinco itens curtos
   * não são o mesmo problema, e só a altura sabe a diferença.
   */
  test("passar do teto do descritor é permitido, e o contador avisa", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByTestId("add-items"));
    fireEvent.click(screen.getByTestId("add-items"));
    fireEvent.click(screen.getByTestId("add-items"));

    expect(store.getState().deck.slides[0].fields.items).toHaveLength(5);
    expect(screen.getByTestId("add-items")).toHaveProperty("disabled", false);
    expect(screen.getByTestId("counter-items").textContent).toBe("5/4");
    expect(screen.getByTestId("counter-items").className).toContain("text-warning");
  });

  test("remover tira o item da posição", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByLabelText("Remover item 1"));

    expect(store.getState().deck.slides[0].fields.items).toEqual(["b"]);
  });

  test("esvaziar a lista é permitido, e acrescentar é o caminho de volta", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByLabelText("Remover item 1"));
    fireEvent.click(screen.getByLabelText("Remover item 1"));

    expect(store.getState().deck.slides[0].fields.items).toEqual([]);

    fireEvent.click(screen.getByTestId("add-items"));

    expect(store.getState().deck.slides[0].fields.items).toEqual([""]);
  });

  test("subir e descer trocam a ordem no store", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByLabelText("Descer item 1"));

    expect(store.getState().deck.slides[0].fields.items).toEqual(["b", "a"]);

    fireEvent.click(screen.getByLabelText("Subir item 2"));

    expect(store.getState().deck.slides[0].fields.items).toEqual(["a", "b"]);
  });

  test("nas pontas os botões de ordem ficam desabilitados", () => {
    renderInspector();

    expect(screen.getByLabelText("Subir item 1")).toHaveProperty("disabled", true);
    expect(screen.getByLabelText("Descer item 2")).toHaveProperty("disabled", true);
    expect(screen.getByLabelText("Descer item 1")).toHaveProperty("disabled", false);
  });

  test("o cabeçalho conta itens contra o teto", () => {
    renderInspector();

    expect(screen.getByTestId("counter-items").textContent).toBe("2/4");
  });

  /** Por item o limite volta a ser conselho — quem reprova é o guard, medindo altura. */
  test("cada item tem contador próprio, e só o que estoura fica âmbar", () => {
    const { store } = renderInspector();
    const longo = "x".repeat(14);

    fireEvent.change(screen.getByLabelText("Tópicos 1"), { target: { value: longo } });

    expect(store.getState().deck.slides[0].fields.items).toEqual([longo, "b"]);
    expect(screen.getByTestId("counter-items-0").textContent).toBe("14/10");
    expect(screen.getByTestId("counter-items-0").className).toContain("text-warning");
    expect(screen.getByTestId("counter-items-1").className).not.toContain("text-warning");
    expect(screen.getByLabelText("Tópicos 1")).not.toHaveProperty("maxLength", 10);
  });

  test("a lista escreve em fields, não em options", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByTestId("add-items"));

    expect(store.getState().deck.slides[0].options.items).toBeUndefined();
  });
});

/**
 * O controle de `select` da 2.7 — o que liga o `anchor` do `text-bullets`, que a 2B
 * deixou como linha inerte.
 */
describe("Inspector — campo select", () => {
  test("o gatilho mostra o rótulo do valor corrente, não o valor", () => {
    renderInspector();

    const trigger = screen.getByTestId("select-anchor");

    expect(trigger.textContent).toContain("Centralizado");
    expect(trigger).toHaveProperty("disabled", false);
  });

  /**
   * A escolha se confirma pelo teclado. O caminho de ponteiro do Base UI exige a sequência
   * inteira — `pointerdown`, `pointerup`, `mouseup` e `click` —, que existe para o popup
   * não capturar o clique que o abriu; `fireEvent` dispara um evento por vez e o teclado
   * é o mesmo caminho de confirmação, com um evento só. O que se prova é a ligação, e ela
   * é a mesma nos dois.
   */
  test("escolher a outra opção escreve em options", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByTestId("select-anchor"));
    fireEvent.keyDown(screen.getByRole("option", { name: "No topo" }), { key: "Enter" });

    expect(store.getState().deck.slides[0].options.anchor).toBe("top");
    expect(screen.getByTestId("select-anchor").textContent).toContain("No topo");
  });

  test("as opções do popup saem do descritor, na ordem declarada", () => {
    renderInspector();

    fireEvent.click(screen.getByTestId("select-anchor"));

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "Centralizado",
      "No topo",
    ]);
  });
});
