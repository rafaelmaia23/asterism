import { afterEach, describe, expect, test } from "vitest";
import { getImage, putImage } from "@/images/storage";
import { stubImages } from "@/test/images";

let restore: (() => void) | undefined;

afterEach(() => {
  restore?.();
  restore = undefined;
});

function blob(text: string): Blob {
  return new Blob([text], { type: "image/png" });
}

describe("o armazenamento de imagens", () => {
  test("guardar devolve um id, e ler pelo id devolve o mesmo blob", async () => {
    const store = stubImages();
    restore = store.restore;

    const id = await putImage(blob("um"));

    expect(id).not.toBe("");
    expect(await getImage(id)).toBe(store.blobs.get(id));
  });

  test("cada blob ganha um id próprio", async () => {
    const store = stubImages();
    restore = store.restore;

    const primeiro = await putImage(blob("um"));
    const segundo = await putImage(blob("dois"));

    expect(primeiro).not.toBe(segundo);
    expect(store.blobs.size).toBe(2);
  });

  /**
   * O caso da §11.9 dos templates: um deck reidratado cujo `ImageId` não está mais no
   * banco. Não é erro — a imagem some e o slide fica, que é a decisão 31 intacta.
   */
  test("id que não está no banco devolve undefined, e não lança", async () => {
    const store = stubImages();
    restore = store.restore;

    await expect(getImage("nunca-guardado")).resolves.toBeUndefined();
  });
});
