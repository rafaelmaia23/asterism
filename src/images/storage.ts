/**
 * As imagens no IndexedDB — §11 do documento de contexto, tarefa 3.15.
 *
 * O deck guarda apenas o `ImageId`; o binário mora aqui. O `persist` do store escreve o
 * deck no `localStorage`, que tem ~5 MB, e **uma única foto em base64 estoura a cota** —
 * decisão 7. Por isso os dois armazenamentos são separados e por isso este módulo não sabe
 * o que é um deck: ele guarda blob por id, e quem liga uma coisa à outra é o campo do
 * template.
 *
 * ## Blob órfão não é coletado — decisão 57
 *
 * Trocar a imagem de um slide, ou remover o slide, deixa o blob anterior aqui sem ninguém
 * apontando para ele. A 3F não apaga nada, e é escolha: o `zundo` da Etapa 4 devolve um
 * `ImageId` que o undo ressuscita, e um blob apagado no caminho faria o desfazer trazer o
 * slide de volta sem a imagem. A varredura é do import/export da Etapa 4, que é quem terá o
 * deck inteiro à mão. O caso inverso — id no deck, blob ausente — já é estado válido e
 * desenhado: a §11.9 dos templates o descreve, e o schema o aceita porque um id órfão é uma
 * string válida.
 *
 * ## O backend entra por fora
 *
 * `happy-dom` não tem IndexedDB, e um banco de verdade atravessaria de um caso de teste
 * para o outro. O seam é o mesmo do `storage` opcional que o `createPersistentStore` já
 * aceita, na forma do `stubLayout`: troca e devolve a função que restaura. Quem o usa é
 * `src/test/images.ts`, e mais ninguém.
 */

import { createStore, get as idbGet, set as idbSet } from "idb-keyval";
import type { ImageId } from "@/deck/types";

export type ImageBackend = {
  get(id: ImageId): Promise<Blob | undefined>;
  set(id: ImageId, blob: Blob): Promise<void>;
};

/**
 * Banco próprio, e não o `keyval-store` que o `idb-keyval` cria por padrão: o dia em que
 * outra coisa precisar do IndexedDB, ela não divide a prateleira com as imagens.
 *
 * A criação é preguiçosa porque este módulo é importado na pré-renderização estática, onde
 * `indexedDB` não existe — e abrir um banco no import quebraria o build antes de qualquer
 * um pedir uma imagem.
 */
function idb(): ImageBackend {
  const store = createStore("asterism", "images");

  return {
    get: (id) => idbGet<Blob>(id, store),
    set: (id, blob) => idbSet(id, blob, store),
  };
}

let backend: ImageBackend | null = null;

function current(): ImageBackend {
  backend ??= idb();
  return backend;
}

/** Troca o backend e devolve a função que restaura o real. Só o teste chama. */
export function setImageBackend(next: ImageBackend): () => void {
  const previous = backend;
  backend = next;

  return () => {
    backend = previous;
  };
}

/**
 * Guarda o blob sob um id novo e devolve o id — o que vai para `fields.image` do slide.
 *
 * O id é `crypto.randomUUID()`, e ao contrário do id de slide ele não corre risco de
 * divergência de hidratação: nasce de um clique, no navegador, e nunca de uma renderização
 * que acontece dos dois lados. Ver a §13 do documento de contexto.
 */
export async function putImage(blob: Blob): Promise<ImageId> {
  const id = crypto.randomUUID();
  await current().set(id, blob);

  return id;
}

/** O blob, ou `undefined` quando o id é órfão — que é estado válido, não erro. */
export async function getImage(id: ImageId): Promise<Blob | undefined> {
  return current().get(id);
}
