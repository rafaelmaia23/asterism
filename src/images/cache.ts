"use client";

/**
 * O cache de object URLs — decisão 55 da §16 do documento de contexto.
 *
 * Entre o `ImageId` que o slide guarda e o `<img>` que o template desenha falta uma coisa:
 * uma URL. O `storage.ts` devolve um `Blob`, e ler o banco é assíncrono; o template é
 * síncrono. Este módulo é a ponte, e ele é um `Map` de módulo — **não** uma fatia do store.
 *
 * ## Por que fora do store
 *
 * O store persiste o deck e só o deck (§11), e um object URL não é estado a guardar: é um
 * handle do documento vivo, que morre no reload e nasce de novo. Guardá-lo no store faria o
 * `partialize` ter de excluí-lo e o `reviveDeck` ter de ignorá-lo.
 *
 * E há um segundo consumidor que um hook não serve: o palco de exportação monta uma raiz
 * React própria e precisa das URLs **antes** de renderizar — um `<img>` cujo `src` chega no
 * quadro seguinte não está no bitmap. `preloadImages` é o que ele espera, e é o mesmo cache
 * que o canvas já encheu.
 *
 * ## `blob:` aqui, `data:` na captura
 *
 * A URL do preview é `URL.createObjectURL` — same-origin e barata. A conversão para `data:`
 * é o `modern-screenshot` que faz na clonagem, e é lá que ela precisa acontecer: dentro do
 * `foreignObject` a origem é opaca, e nem `blob:` nem `http:` resolveriam. É a mesma
 * armadilha que põe as três fontes em `next/font/local`.
 *
 * As URLs não são revogadas em uso: o cache vive enquanto a aba viver, e revogar a URL de
 * uma imagem que continua no deck deixaria o slide em branco na próxima renderização.
 */

import { useEffect, useSyncExternalStore } from "react";
import type { ImageId } from "@/deck/types";
import { downscale } from "@/images/downscale";
import { getImage, putImage } from "@/images/storage";

const urls = new Map<ImageId, string>();
/** Ids que o banco não tem. Sem isto, um id órfão seria relido a cada montagem. */
const missing = new Set<ImageId>();
/** A leitura em voo, para que dois slides com a mesma imagem não peçam duas vezes. */
const pending = new Map<ImageId, Promise<void>>();
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** A URL já conhecida, sem disparar leitura. É o que o teste e o palco perguntam. */
export function peekImageUrl(id: ImageId): string | undefined {
  return urls.get(id);
}

/**
 * Traz uma imagem do banco para o cache, se ela ainda não estiver lá.
 *
 * Id vazio é o campo sem imagem, que é como o slide nasce — não é ausência a investigar.
 * Id órfão é o caso da §11.9: o blob não está mais no banco, a imagem some e o slide fica.
 */
export async function loadImage(id: ImageId): Promise<void> {
  if (id === "" || urls.has(id) || missing.has(id)) {
    return;
  }

  const inflight = pending.get(id);

  if (inflight) {
    return inflight;
  }

  const read = (async () => {
    const blob = await getImage(id);

    if (blob) {
      urls.set(id, URL.createObjectURL(blob));
      emit();
    } else {
      missing.add(id);
    }
  })().finally(() => {
    pending.delete(id);
  });

  pending.set(id, read);

  return read;
}

/** O que o palco de exportação espera antes de montar o deck. */
export async function preloadImages(ids: ImageId[]): Promise<void> {
  await Promise.all(ids.map(loadImage));
}

/**
 * Um arquivo escolhido no inspector vira `ImageId`: reduz, guarda, e **semeia o cache** com
 * o blob que já está na mão — o preview aparece sem uma ida ao banco que só devolveria o
 * que acabou de ser escrito.
 */
export async function importImage(file: Blob): Promise<ImageId> {
  const reduced = await downscale(file);
  const id = await putImage(reduced);

  urls.set(id, URL.createObjectURL(reduced));
  emit();

  return id;
}

/** Esvazia o cache. Estado de módulo precisa disso entre casos de teste — `test/images.ts`. */
export function clearImageCache(): void {
  for (const url of urls.values()) {
    URL.revokeObjectURL(url);
  }

  urls.clear();
  missing.clear();
  pending.clear();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * A URL da imagem deste id, ou `undefined` enquanto ela não existe — o que o template
 * desenha como "Sem imagem".
 *
 * `useSyncExternalStore` porque o cache é externo ao React e dois slides podem mostrar a
 * mesma imagem; o `getServerSnapshot` devolve `undefined` de propósito, e a primeira
 * renderização do cliente devolve o mesmo, porque o cache nasce vazio dos dois lados — não
 * há divergência de hidratação a criar. A leitura vai para um efeito, e não para o
 * snapshot, que precisa ser puro.
 */
export function useImageUrl(id: ImageId): string | undefined {
  useEffect(() => {
    void loadImage(id);
  }, [id]);

  return useSyncExternalStore(
    subscribe,
    () => urls.get(id),
    () => undefined,
  );
}
