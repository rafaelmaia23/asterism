import { afterEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { z } from "zod";
import type { Deck } from "@/deck/types";
import { Inspector } from "@/editor/inspector";
import { createEditorStore } from "@/editor/store";
import { stubImages, type StubbedImages } from "@/test/images";
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
  // O bloco de código da 3.11: o limite é em **linhas**, e não em caracteres.
  { key: "code", type: "code", label: "Código", maxLines: 3 },
  // O campo de imagem da 3.16, com o `ratio` que a moldura do preview usa.
  { key: "image", type: "image", label: "Imagem", ratio: "5:16" },
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

/**
 * Um template com um tipo de campo que o formulário não desenha. **Não existe um assim na
 * biblioteca** — a 3.16 deu controle aos sete tipos do `Field` —, e é justamente por isso
 * que ele é forjado com um `as`: a condição no inspector é a negação dos tipos desenhados,
 * e o que se guarda aqui é que o tipo da Etapa 4 vai aparecer com aviso em vez de sumir.
 */
register({
  id: "template-de-tipo-futuro",
  label: "Template de tipo futuro",
  group: "content",
  background: "plain",
  sections: sharedSections,
  fields: [{ key: "futuro", type: "carousel", label: "Futuro" } as unknown as Field],
  options: [],
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

/** Os templates que só existem neste arquivo — a varredura da biblioteca os pula. */
const FIXTURES = new Set(["fake-template", "template-sem-secoes", "template-de-tipo-futuro"]);

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
          code: "const a = 1\nconst b = 2",
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
   * imagem — o único que sobrou depois da 3D.
   */
  test("tipo não suportado aparece como linha inerte, com o rótulo", () => {
    // Nenhum tipo do `Field` cai mais aqui — a 3.16 deu controle ao sétimo e último. O
    // descritor é forjado de propósito: a condição no componente é a **negação** dos tipos
    // desenhados, e é isso que faz o tipo que a Etapa 4 acrescentar aparecer com aviso em
    // vez de sumir do formulário em silêncio.
    const store = createEditorStore(makeDeck());
    store.getState().setTemplate(SLIDE_ID, "template-de-tipo-futuro");
    render(<Inspector store={store} />);

    const linha = screen.getByTestId("field-futuro");

    expect(linha.textContent).toContain("Futuro");
    expect(linha.textContent).toContain("Ainda não editável aqui");
    expect(linha.querySelector("input, textarea")).toBeNull();
  });

  /**
   * O critério de pronto da 3.16 dito por inteiro: **nenhum** template da biblioteca tem
   * campo sem controle. Varre o registry em vez de listar os dez, para que o template que a
   * Etapa 4 acrescentar entre nesta asserção sozinho.
   */
  test("nenhum template da biblioteca desenha o aviso", () => {
    const store = createEditorStore(makeDeck());

    for (const def of list().filter((template) => !FIXTURES.has(template.id))) {
      store.getState().setTemplate(SLIDE_ID, def.id);
      const { unmount } = render(<Inspector store={store} />);

      expect(screen.queryByText("Ainda não editável aqui")).toBeNull();
      unmount();
    }
  });

  /**
   * O campo `code` da 3.11 — §11.6 dos templates.
   *
   * O que ele tem de próprio é o contador: onde os outros contam caracteres contra `max`,
   * este conta **linhas** contra `maxLines`. É o limite que a §10.3 do design system dá ao
   * bloco de código, e é o que quem escreve precisa ver enquanto cola.
   */
  describe("o campo de código", () => {
    test("o contador conta linhas contra o `maxLines` do descritor", () => {
      renderInspector();

      expect(screen.getByTestId("counter-code").textContent).toBe("2/3");
    });

    test("passar do limite tinge o contador e não trava a digitação", () => {
      const { store } = renderInspector();
      const longo = ["um", "dois", "três", "quatro"].join("\n");

      fireEvent.change(screen.getByLabelText("Código"), { target: { value: longo } });

      expect(store.getState().deck.slides[0].fields.code).toBe(longo);
      expect(screen.getByTestId("counter-code").textContent).toBe("4/3");
      expect(screen.getByTestId("counter-code").className).toContain("text-warning");
      expect(screen.getByLabelText("Código")).not.toHaveProperty("maxLength", 3);
    });

    test("é monoespaçado, como o código que ele guarda", () => {
      renderInspector();

      expect(screen.getByLabelText("Código").className).toContain("font-mono");
    });

    test("campo vazio conta zero linha, e não uma", () => {
      renderInspector();

      fireEvent.change(screen.getByLabelText("Código"), { target: { value: "" } });

      expect(screen.getByTestId("counter-code").textContent).toBe("0/3");
    });
  });
});

/**
 * O campo de imagem da 3.16 — o sétimo e último tipo de `Field` a ganhar controle.
 *
 * O escopo é o da §11 do documento de contexto e da decisão 8: **upload local e nada mais**.
 * Não há campo de texto onde colar uma URL, e não é por falta de tempo — URL externa
 * contamina o canvas e faz a exportação falhar em silêncio.
 */
describe("Inspector — campo image", () => {
  let images: StubbedImages;

  function renderComImagens() {
    images = stubImages();
    return renderInspector();
  }

  afterEach(() => {
    images?.restore();
  });

  function escolher(nome = "foto.png") {
    const input = screen.getByTestId("file-image") as HTMLInputElement;
    const file = new File(["conteudo"], nome, { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });
  }

  test("sem imagem, a moldura diz que não há e o botão convida a escolher", () => {
    renderComImagens();

    expect(screen.getByTestId("preview-image").textContent).toBe("Sem imagem");
    expect(screen.getByTestId("preview-image").querySelector("img")).toBeNull();
    expect(screen.getByText("Escolher imagem")).toBeDefined();
    expect(screen.queryByText("Remover imagem")).toBeNull();
  });

  test("a moldura segue o `ratio` do descritor", () => {
    renderComImagens();

    expect(screen.getByTestId("preview-image").getAttribute("style")).toContain("5 / 16");
  });

  test("escolher um arquivo guarda a imagem e escreve o id em fields", async () => {
    const { store } = renderComImagens();

    escolher();

    await waitFor(() => {
      expect(store.getState().deck.slides[0].fields.image).not.toBe("");
    });

    const id = store.getState().deck.slides[0].fields.image as string;

    expect(images.blobs.has(id)).toBe(true);
    // O que vai para o slide é o **id**, nunca o binário: é a decisão 7, e é o que mantém
    // o `localStorage` do `persist` longe da cota.
    expect(id).not.toContain("data:");
  });

  test("com imagem, a moldura mostra a URL do cache e o botão passa a trocar", async () => {
    renderComImagens();

    escolher();

    const img = await screen.findByTestId("image-image");

    expect(img.getAttribute("src")).toMatch(/^blob:/);
    expect(screen.getByText("Trocar imagem")).toBeDefined();
  });

  test("remover devolve o campo ao vazio", async () => {
    const { store } = renderComImagens();

    escolher();
    await screen.findByTestId("image-image");

    fireEvent.click(screen.getByText("Remover imagem"));

    expect(store.getState().deck.slides[0].fields.image).toBe("");
    expect(screen.getByTestId("preview-image").textContent).toBe("Sem imagem");
  });

  test("escreve em fields, e não em options", async () => {
    const { store } = renderComImagens();

    escolher();
    await waitFor(() => {
      expect(store.getState().deck.slides[0].fields.image).not.toBe("");
    });

    expect(store.getState().deck.slides[0].options.image).toBeUndefined();
  });

  /** Decisão 8: só arquivo local. Não há onde digitar um endereço. */
  test("aceita arquivo de imagem, e não há campo de URL", () => {
    renderComImagens();

    const input = screen.getByTestId("file-image") as HTMLInputElement;

    expect(input.type).toBe("file");
    expect(input.accept).toBe("image/*");
    expect(screen.getByTestId("field-image").querySelector("input[type=text]")).toBeNull();
  });

  /**
   * O caso da §11.9: o id está no deck e o blob não está mais no banco. O campo continua
   * preenchido — derruba-se o que não passa, e um id órfão passa —, e a moldura mostra o
   * mesmo estado de quem nunca teve imagem.
   */
  test("id órfão mostra a moldura vazia sem apagar o campo", async () => {
    images = stubImages();
    const store = createEditorStore(makeDeck());
    store.getState().setField(SLIDE_ID, "image", "id-que-nao-esta-no-banco");
    render(<Inspector store={store} />);

    await waitFor(() => {
      expect(images.reads).toContain("id-que-nao-esta-no-banco");
    });

    expect(screen.getByTestId("preview-image").textContent).toBe("Sem imagem");
    expect(store.getState().deck.slides[0].fields.image).toBe("id-que-nao-esta-no-banco");
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
