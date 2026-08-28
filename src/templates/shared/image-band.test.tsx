import { afterEach, describe, expect, test } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { importImage, preloadImages } from "@/images/cache";
import { ImageBand } from "@/templates/shared/image-band";
import { stubImages, type StubbedImages } from "@/test/images";

let images: StubbedImages;

afterEach(() => {
  images?.restore();
});

async function comImagem(): Promise<string> {
  images = stubImages();
  return importImage(new Blob(["foto"], { type: "image/png" }));
}

describe("ImageBand", () => {
  test("sem imagem, desenha a superfície com o rótulo da §11.9", () => {
    images = stubImages();
    render(<ImageBand image="" fit="cover" className="top-0 h-[1174px]" />);

    const band = screen.getByTestId("image-band");

    expect(band.textContent).toBe("Sem imagem");
    expect(band.querySelector("img")).toBeNull();
    expect(band.className).toContain("bg-slide-surface");
  });

  /**
   * A §11.9: id órfão é o **mesmo estado** de campo vazio. O schema passa, porque o id é
   * uma string válida; a imagem some e o slide fica — decisão 31 intacta.
   */
  test("id órfão desenha o mesmo estado de campo vazio", async () => {
    images = stubImages();
    render(<ImageBand image="id-sem-blob" fit="cover" className="top-0" />);

    await act(async () => {
      await preloadImages(["id-sem-blob"]);
    });

    expect(screen.getByTestId("image-band").textContent).toBe("Sem imagem");
  });

  test("com imagem, desenha o `img` com a URL do cache", async () => {
    const id = await comImagem();
    render(<ImageBand image={id} fit="cover" className="top-0" />);

    expect(screen.getByTestId("image").getAttribute("src")).toMatch(/^blob:/);
    expect(screen.queryByText("Sem imagem")).toBeNull();
  });

  test("`cover` recorta e `contain` cabe inteira", async () => {
    const id = await comImagem();
    const { rerender } = render(<ImageBand image={id} fit="cover" className="top-0" />);

    expect(screen.getByTestId("image").className).toContain("object-cover");

    rerender(<ImageBand image={id} fit="contain" className="top-0" />);
    expect(screen.getByTestId("image").className).toContain("object-contain");
  });

  /** A faixa é posicionada por quem a usa: a §11.9 e a §11.10 dão geometrias diferentes. */
  test("a posição vem de quem a desenha", () => {
    images = stubImages();
    render(<ImageBand image="" fit="cover" className="right-0 w-[440px] top-0 h-[1174px]" />);

    const band = screen.getByTestId("image-band");

    expect(band.className).toContain("absolute");
    expect(band.className).toContain("w-[440px]");
    expect(band.className).toContain("h-[1174px]");
  });

  /**
   * A §11.0: a faixa medida pelo guard é sempre a de conteúdo variável, **nunca uma
   * imagem**, que se ajusta em vez de crescer.
   */
  test("nunca é região guardada", () => {
    images = stubImages();
    const { container } = render(<ImageBand image="" fit="cover" className="top-0" />);

    expect(container.querySelector("[data-guarded]")).toBeNull();
  });
});
