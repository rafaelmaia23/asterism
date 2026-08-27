/**
 * Métricas de layout falsas para `happy-dom`.
 *
 * O ambiente de teste não faz layout: `scrollHeight` e `clientHeight` devolvem 0 em
 * qualquer elemento, sempre. Quem precisa medir altura de verdade — o guard de transbordo
 * da §9 do documento de contexto — não tem o que asserir sem isto.
 *
 * O stub é por **atributo**, e não por prototype cru: cada elemento declara quanto mede
 * com `data-h`, e as duas propriedades passam a ler dali. Assim um caso pode montar uma
 * faixa de 800px com um conteúdo de 900px, que é exatamente a comparação que o guard faz —
 * um valor global só diria "tudo transborda" ou "nada transborda".
 *
 * Devolve a função que restaura o original. Chame no `afterEach`, senão um caso empresta
 * altura ao seguinte.
 */

const KEYS = ["scrollHeight", "clientHeight", "offsetHeight"] as const;

export function stubLayout(): () => void {
  const originals = KEYS.map(
    (key) => [key, Object.getOwnPropertyDescriptor(HTMLElement.prototype, key)] as const,
  );

  for (const key of KEYS) {
    Object.defineProperty(HTMLElement.prototype, key, {
      configurable: true,
      get(this: HTMLElement) {
        return Number(this.dataset.h ?? 0);
      },
    });
  }

  return () => {
    for (const [key, descriptor] of originals) {
      if (descriptor) {
        Object.defineProperty(HTMLElement.prototype, key, descriptor);
      } else {
        delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key];
      }
    }
  };
}

/**
 * Um `ResizeObserver` que dispara quando o teste mandar.
 *
 * O do `happy-dom` existe e nunca dispara, o que basta para o guard — a primeira medida é
 * síncrona na montagem. Não basta para o caso interessante: **o conteúdo cresceu depois**,
 * que no navegador é o observador que percebe. Este stub guarda os callbacks vivos e
 * `flush()` os chama.
 *
 * Instale antes do `render`: o que já foi observado com o construtor original não volta.
 */
export function fakeResizeObserver(): { flush: () => void; restore: () => void } {
  const original = globalThis.ResizeObserver;
  const callbacks = new Set<ResizeObserverCallback>();

  class Fake implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {
      callbacks.add(callback);
    }

    observe() {}
    unobserve() {}

    disconnect() {
      callbacks.delete(this.callback);
    }
  }

  globalThis.ResizeObserver = Fake;

  return {
    flush() {
      for (const callback of [...callbacks]) {
        callback([], {} as ResizeObserver);
      }
    },
    restore() {
      globalThis.ResizeObserver = original;
    },
  };
}
