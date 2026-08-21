/**
 * O registry, genérico. É por aqui que o sistema descobre o que existe — templates hoje,
 * alvos de exportação também — nunca por um `switch` sobre o id, que espalharia a lista
 * por todo lugar e obrigaria a editar cada condicional a cada item novo. §5 do documento
 * de contexto.
 *
 * A §10 diz que o registry de alvos é idêntico ao dos templates. Ele é literalmente o
 * mesmo: os dois instanciam esta factory e ganham de graça a ordem de inserção, a
 * mensagem de erro com o id e a regra de HMR.
 *
 * `kind` é só o que nomeia o que se registra na mensagem de erro — "Template
 * desconhecido: x", "Alvo de exportação desconhecido: x".
 */

export type Registry<T> = {
  register: (item: T) => void;
  get: (id: string) => T;
  list: () => T[];
};

export function createRegistry<T extends { id: string }>(kind: string): Registry<T> {
  // `Map` porque preserva a ordem de inserção: a ordem em que o módulo de registro
  // popula é a ordem em que a interface apresenta.
  const items = new Map<string, T>();

  return {
    register(item) {
      // Id duplicado é erro de programação, não estado de runtime: quem registra é um
      // módulo só, que roda uma vez. Sobrescrever em silêncio faria o item perdido sumir
      // da lista longe da causa.
      //
      // Menos em desenvolvimento, onde registrar de novo é o HMR reavaliando o módulo de
      // registro sem reavaliar este. Ali não há erro nenhum, e lançar derrubava o
      // `next dev` a cada edição na cadeia que chega até aqui. Substituir é também o que
      // se quer: editar um template e ver a edição sem reiniciar. `Map.set` numa chave
      // existente preserva a posição, então a ordem não muda.
      if (items.has(item.id) && process.env.NODE_ENV !== "development") {
        throw new Error(`${kind} já registrado: ${item.id}`);
      }
      items.set(item.id, item);
    },

    get(id) {
      const item = items.get(id);
      if (!item) {
        throw new Error(`${kind} desconhecido: ${id}`);
      }
      return item;
    },

    list() {
      return [...items.values()];
    },
  };
}
