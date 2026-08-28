/**
 * Um armazenamento de imagens em memória, para os testes.
 *
 * O `happy-dom` não tem IndexedDB, então o backend real de `src/images/storage.ts` não roda
 * aqui — e mesmo que rodasse, um banco de verdade atravessaria de um caso para o outro. O
 * stub é um `Map`, com `blobs` exposto para o teste asserir contra o que ficou guardado e
 * `reads` para asserir quantas vezes o banco foi consultado, que é o que o cache existe
 * para evitar.
 *
 * Instalar também **esvazia o cache de object URLs**: ele é estado de módulo, e sem isso um
 * caso enxergaria a URL que o anterior criou.
 *
 * Devolve a função que restaura o backend real, como o `stubLayout` de `layout.ts`. Chame no
 * `afterEach`, senão um caso empresta imagens ao seguinte.
 */

import type { ImageId } from "@/deck/types";
import { clearImageCache } from "@/images/cache";
import { setImageBackend } from "@/images/storage";

export type StubbedImages = {
  blobs: Map<ImageId, Blob>;
  /** Os ids que passaram pelo `get` do banco, na ordem. */
  reads: ImageId[];
  restore: () => void;
};

export function stubImages(): StubbedImages {
  const blobs = new Map<ImageId, Blob>();
  const reads: ImageId[] = [];

  clearImageCache();

  const undo = setImageBackend({
    async get(id) {
      reads.push(id);
      return blobs.get(id);
    },
    async set(id, blob) {
      blobs.set(id, blob);
    },
  });

  return {
    blobs,
    reads,
    restore() {
      clearImageCache();
      undo();
    },
  };
}
