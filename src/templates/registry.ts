/**
 * O registry de templates. É por aqui que o resto do sistema descobre quais templates
 * existem — nunca por um `switch` sobre o id, que espalharia a lista por todo lugar e
 * obrigaria a editar cada `switch` a cada template novo.
 *
 * Quem popula é `src/templates/index.ts`, o único módulo que importa template.
 */

import type { TemplateId } from "@/deck/types";
import type { AnyTemplateDef } from "@/templates/types";

export type Registry = {
  register: (def: AnyTemplateDef) => void;
  get: (id: TemplateId) => AnyTemplateDef;
  list: () => AnyTemplateDef[];
};

export function createRegistry(): Registry {
  // `Map` porque preserva a ordem de inserção: a ordem em que `index.ts` registra é a
  // ordem em que o seletor de layout mostra os templates.
  const templates = new Map<TemplateId, AnyTemplateDef>();

  return {
    register(def) {
      // Id duplicado é erro de programação, não estado de runtime: quem registra é um
      // módulo só, que roda uma vez. Sobrescrever em silêncio faria o template perdido
      // sumir da lista longe da causa.
      //
      // Menos em desenvolvimento, onde registrar de novo é o HMR reavaliando
      // `templates/index.ts` sem reavaliar este módulo. Ali não há erro nenhum, e lançar
      // derrubava o `next dev` a cada edição na cadeia que chega até aqui. Substituir é
      // também o que se quer: editar um template e ver a edição sem reiniciar. `Map.set`
      // numa chave existente preserva a posição, então a ordem da biblioteca não muda.
      if (templates.has(def.id) && process.env.NODE_ENV !== "development") {
        throw new Error(`Template já registrado: ${def.id}`);
      }
      templates.set(def.id, def);
    },

    get(id) {
      const def = templates.get(id);
      if (!def) {
        throw new Error(`Template desconhecido: ${id}`);
      }
      return def;
    },

    list() {
      return [...templates.values()];
    },
  };
}

const registry = createRegistry();

export const { register, get, list } = registry;
