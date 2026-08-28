import { afterEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import type { DeckMeta } from "@/deck/types";
import { importImage } from "@/images/cache";
import { imageCaption } from "@/templates/image-caption";
import { describeGuardedRegion } from "@/test/overflow";
import { stubImages, type StubbedImages } from "@/test/images";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = imageCaption;

let images: StubbedImages;

afterEach(() => {
  images?.restore();
});

function renderImageCaption(overrides: Partial<typeof imageCaption.defaults> = {}) {
  const { Component } = imageCaption;
  const { fields, options } = { ...defaults, ...overrides };

  return render(<Component fields={fields} options={options} deck={deck} index={8} total={12} />);
}

const comCabecalho = { ...defaults.options, showHeader: true };
const semTitulo = { ...defaults.fields, heading: "" };
const semLegenda = { ...defaults.fields, caption: "" };

function bandOf(testId: string) {
  return screen.getByTestId(testId).className;
}

describe("image-caption", () => {
  test("renderiza a imagem, o título e a legenda", () => {
    renderImageCaption();

    expect(screen.getByText("O alerta que passou a existir")).toBeDefined();
    expect(screen.getByTestId("caption-region").textContent).toContain("tenants diferentes");
    expect(screen.getByTestId("image-band")).toBeDefined();
  });

  test("o descritor declara fundo plain e grupo media", () => {
    expect(imageCaption.background).toBe("plain");
    expect(imageCaption.group).toBe("media");
  });

  /** A legenda é `ink-400` — a única região de texto da biblioteca que não é 100 nem 200. */
  test("a legenda é o texto de apoio da §2.3", () => {
    renderImageCaption();

    expect(screen.getByTestId("caption").className).toContain("text-ink-400");
    expect(screen.getByTestId("heading").className).toContain("text-ink-100");
  });

  test("a legenda passa pelo parser de marcação, e o título não", () => {
    const { container } = renderImageCaption({
      fields: { ...defaults.fields, heading: "Um ==alerta==", caption: "Duas ==respostas==." },
    });

    expect(container.querySelector("[data-testid=caption-region] mark")?.textContent).toBe(
      "respostas",
    );
    expect(container.querySelector("[data-testid=heading] mark")).toBeNull();
  });

  /**
   * As oito geometrias da §11.10, que são a tabela dela cruzada com a regra de região vazia
   * da §11.0. **A imagem é quem cede**: o cabeçalho a corta pelo topo em vez de empurrar o
   * que está embaixo, porque o que está embaixo é o que o slide promete.
   */
  describe("as oito geometrias", () => {
    test("sem cabeçalho, com título e com legenda: imagem 0–910", () => {
      renderImageCaption();

      expect(screen.queryByTestId("header-band")).toBeNull();
      expect(bandOf("image-band")).toContain("top-0");
      expect(bandOf("image-band")).toContain("h-[910px]");
      expect(bandOf("heading-region")).toContain("top-[974px]");
      expect(bandOf("caption-region")).toContain("top-[1070px]");
    });

    test("com cabeçalho, com título e com legenda: a imagem perde o topo, e só ela", () => {
      renderImageCaption({ options: comCabecalho });

      expect(screen.queryByTestId("header-band")).not.toBeNull();
      expect(bandOf("image-band")).toContain("top-[212px]");
      expect(bandOf("image-band")).toContain("h-[698px]");
      expect(bandOf("heading-region")).toContain("top-[974px]");
      expect(bandOf("caption-region")).toContain("top-[1070px]");
    });

    test("sem título: a região some e a legenda sobe para 974, sem crescer", () => {
      renderImageCaption({ fields: semTitulo });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(bandOf("caption-region")).toContain("top-[974px]");
      expect(bandOf("caption-region")).toContain("h-[90px]");
      expect(bandOf("image-band")).toContain("h-[910px]");
    });

    test("com cabeçalho e sem título: a legenda continua em 974", () => {
      renderImageCaption({ fields: semTitulo, options: comCabecalho });

      expect(bandOf("caption-region")).toContain("top-[974px]");
      expect(bandOf("image-band")).toContain("top-[212px]");
      expect(bandOf("image-band")).toContain("h-[698px]");
    });

    test("sem legenda: o título fica onde está e a imagem não desce", () => {
      renderImageCaption({ fields: semLegenda });

      expect(screen.queryByTestId("caption-region")).toBeNull();
      expect(bandOf("heading-region")).toContain("top-[974px]");
      expect(bandOf("image-band")).toContain("h-[910px]");
    });

    test("com cabeçalho e sem legenda", () => {
      renderImageCaption({ fields: semLegenda, options: comCabecalho });

      expect(bandOf("heading-region")).toContain("top-[974px]");
      expect(bandOf("image-band")).toContain("top-[212px]");
      expect(bandOf("image-band")).toContain("h-[698px]");
    });

    /** O slide mais gráfico da biblioteca: só a imagem, com o rodapé sobre o fundo. */
    test("sem título e sem legenda: a imagem desce até 1174", () => {
      renderImageCaption({ fields: { ...semTitulo, caption: "" } });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(screen.queryByTestId("caption-region")).toBeNull();
      expect(bandOf("image-band")).toContain("top-0");
      expect(bandOf("image-band")).toContain("h-[1174px]");
    });

    test("com cabeçalho, sem título e sem legenda: 212–1174", () => {
      renderImageCaption({ fields: { ...semTitulo, caption: "" }, options: comCabecalho });

      expect(bandOf("image-band")).toContain("top-[212px]");
      expect(bandOf("image-band")).toContain("h-[962px]");
    });
  });

  /**
   * A regra da §11.0, e o motivo é a constelação: um progresso ilegível sobre foto é pior
   * que imagem menor. 1174 é o teto em qualquer combinação, e nenhuma delas passa dele.
   */
  test("a imagem nunca entra na faixa do rodapé", () => {
    for (const fields of [defaults.fields, semTitulo, semLegenda, { ...semTitulo, caption: "" }]) {
      for (const options of [defaults.options, comCabecalho]) {
        const view = renderImageCaption({ fields, options });
        const band = view.getByTestId("image-band").className;
        const top = Number(/top-(?:\[(\d+)px\]|(0))/.exec(band)?.[1] ?? 0);
        const height = Number(/h-\[(\d+)px\]/.exec(band)?.[1]);

        expect(top + height).toBeLessThanOrEqual(1174);
        view.unmount();
      }
    }
  });

  test("sem imagem, a faixa é a superfície com o rótulo", () => {
    images = stubImages();
    renderImageCaption();

    expect(screen.getByTestId("image-band").textContent).toBe("Sem imagem");
  });

  test("com imagem, a faixa desenha o `img` e o ajuste da opção", async () => {
    images = stubImages();
    const id = await importImage(new Blob(["foto"], { type: "image/png" }));

    renderImageCaption({
      fields: { ...defaults.fields, image: id },
      options: { ...defaults.options, imageFit: "contain" },
    });

    expect(screen.getByTestId("image").getAttribute("src")).toMatch(/^blob:/);
    expect(screen.getByTestId("image").className).toContain("object-contain");
  });

  /** Duas regiões marcadas com ⌐ na §11.10 — como o `code-annotated`, e pelo mesmo motivo. */
  describeGuardedRegion(imageCaption, 2);
});
