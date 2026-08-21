import type { Deck, DeckMeta, Slide, SlideDefaults, TemplateId } from "@/deck/types";

const DEFAULT_TITLE = "Novo carrossel";
const DEFAULT_META: DeckMeta = { handle: "@rafael", pillar: "api" };
const DEFAULT_FORMAT = { w: 1080, h: 1350 };

function newId(): string {
  return crypto.randomUUID();
}

export function createDeck(init: Partial<{ title: string } & DeckMeta> = {}): Deck {
  return {
    version: 1,
    id: newId(),
    title: init.title ?? DEFAULT_TITLE,
    format: { ...DEFAULT_FORMAT },
    meta: {
      handle: init.handle ?? DEFAULT_META.handle,
      pillar: init.pillar ?? DEFAULT_META.pillar,
    },
    slides: [],
    assets: {},
  };
}

/**
 * Os `defaults` chegam por argumento, e não do registry: `src/deck` não conhece
 * template nenhum. A cópia é profunda de propósito — dois slides do mesmo template
 * compartilhando o array de um campo `list` é bug silencioso e caro de achar.
 */
export function createSlide(template: TemplateId, defaults: SlideDefaults): Slide {
  return {
    id: newId(),
    template,
    fields: structuredClone(defaults.fields),
    options: structuredClone(defaults.options),
  };
}
