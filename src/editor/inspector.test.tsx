import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { z } from "zod";
import type { Deck } from "@/deck/types";
import { Inspector } from "@/editor/inspector";
import { createEditorStore } from "@/editor/store";
import { register } from "@/templates/registry";
import type { Field, TemplateDef } from "@/templates/types";
import "@/templates";

/**
 * Um template que só existe aqui. É ele que prova o critério de pronto da 1.11: campo
 * novo no descritor aparece no formulário **sem tocar no inspector**. Se algum dia o
 * inspector passar a conhecer template, este teste é o que quebra.
 */
const fakeFields: Field[] = [
  { key: "kicker", type: "text", label: "Etiqueta", max: 12 },
  { key: "heading", type: "textarea", label: "Título", max: 20, md: true, rows: 3 },
  { key: "items", type: "list", label: "Tópicos", maxItems: 4, maxPerItem: 10, md: true },
  // Sem limite no descritor, para provar que o contador nasce do descritor e não do tipo.
  { key: "cta", type: "text", label: "Destino" },
  // Tipo que continua sem controle depois da 2C — é ele que guarda a linha inerte.
  { key: "image", type: "image", label: "Imagem" },
];

const fakeOptions: Field[] = [
  { key: "showChevron", type: "toggle", label: "Chevron" },
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
  fields: fakeFields,
  options: fakeOptions,
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
        options: { showChevron: true, anchor: "center" },
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

describe("Inspector", () => {
  /**
   * O seletor de layout da §14 do documento de contexto. A troca de verdade é a 2.11 e
   * depende do `migrateFields` da 2.10 — até lá o controle mostra o layout do slide e não
   * oferece troca. Desabilitado de propósito: a 2.8 e a 2.9 registram mais dois templates
   * **antes** da 2.11, e um select ativo que não trocasse nada mentiria por semanas.
   */
  test("o topo mostra o layout do slide ativo, e ainda não troca", () => {
    renderInspector();

    const trigger = screen.getByTestId("layout-trigger");

    expect(trigger.textContent).toContain("Template de teste");
    expect(trigger).toHaveProperty("disabled", true);
  });

  test("desenha um controle por descritor, com o rótulo do descritor", () => {
    renderInspector();

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

  /** O teto de `maxItems` é trava, não conselho: quatro itens é o que o template desenha. */
  test("no teto do descritor o botão de acrescentar desabilita", () => {
    const { store } = renderInspector();

    fireEvent.click(screen.getByTestId("add-items"));
    fireEvent.click(screen.getByTestId("add-items"));

    expect(store.getState().deck.slides[0].fields.items).toHaveLength(4);
    expect(screen.getByTestId("add-items")).toHaveProperty("disabled", true);
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
