import { afterEach, describe, expect, test } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { importImage, peekImageUrl, preloadImages, useImageUrl } from "@/images/cache";
import { getImage } from "@/images/storage";
import { stubImages, type StubbedImages } from "@/test/images";

let store: StubbedImages;

function setup(): StubbedImages {
  store = stubImages();
  return store;
}

afterEach(() => {
  store?.restore();
});

function blob(text: string): Blob {
  return new Blob([text], { type: "image/png" });
}

function Probe({ id }: { id: string }) {
  const url = useImageUrl(id);

  return <span data-testid="url">{url ?? "vazio"}</span>;
}

describe("o cache de object URLs", () => {
  test("importar reduz, guarda e já deixa a URL pronta", async () => {
    setup();

    const id = await importImage(blob("uma foto"));

    expect(await getImage(id)).toBeDefined();
    expect(peekImageUrl(id)).toMatch(/^blob:/);
  });

  test("pré-carregar traz do banco o que só tinha id", async () => {
    setup();

    const id = await importImage(blob("uma foto"));
    store.restore();
    const outra = setup();
    outra.blobs.set(id, blob("uma foto"));

    expect(peekImageUrl(id)).toBeUndefined();
    await preloadImages([id]);
    expect(peekImageUrl(id)).toMatch(/^blob:/);
  });

  test("o mesmo id não vai duas vezes ao banco", async () => {
    const fake = setup();
    const id = await importImage(blob("uma foto"));

    await preloadImages([id, id]);

    expect(fake.reads).toHaveLength(0);
  });

  /**
   * O caso da §11.9: o `ImageId` está no deck e o blob não está mais no banco. Não lança,
   * não fica tentando — e o template desenha "Sem imagem", que é o mesmo estado de um slide
   * que nunca teve imagem.
   */
  test("id órfão não vira URL, e não é relido a cada tentativa", async () => {
    const fake = setup();

    await preloadImages(["orfao"]);
    await preloadImages(["orfao"]);

    expect(peekImageUrl("orfao")).toBeUndefined();
    expect(fake.reads).toEqual(["orfao"]);
  });

  test("campo vazio não vai ao banco", async () => {
    const fake = setup();

    await preloadImages([""]);

    expect(fake.reads).toHaveLength(0);
  });
});

describe("useImageUrl", () => {
  test("nasce vazio e passa a devolver a URL quando ela chega", async () => {
    const fake = setup();
    const id = "guardado";
    fake.blobs.set(id, blob("uma foto"));

    render(<Probe id={id} />);
    expect(screen.getByTestId("url").textContent).toBe("vazio");

    await act(async () => {
      await preloadImages([id]);
    });

    expect(screen.getByTestId("url").textContent).toMatch(/^blob:/);
  });
});
