/**
 * O estado do editor: o deck e qual slide está ativo.
 *
 * Zustand cru, sem middleware — a §11 do documento de contexto promete `persist`, `zundo`
 * e IndexedDB, e nenhum dos três é desta etapa. Autosave e undo entram na Etapa 3, sobre
 * este mesmo store.
 *
 * **Uma factory e um singleton, sem provider de contexto.** A factory é o que deixa o
 * teste montar um store isolado a partir de um deck de fixture, sem React e sem reset
 * global; a aplicação usa o singleton. Um provider só se paga quando há dois decks vivos
 * ao mesmo tempo, que é assunto da tela de listagem da Etapa 4.
 *
 * O ativo é guardado por **id**, não por índice: reordenar e remover chegam na Etapa 4 e
 * um índice guardado passaria a apontar para outro slide sem que nada avisasse.
 */

import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { Deck, FieldValue, OptionValue, Slide, SlideId, TemplateId } from "@/deck/types";
import { createSeedDeck } from "@/editor/seed";
import { get } from "@/templates";
import { migrateFields } from "@/templates/migrate";

export type EditorState = {
  deck: Deck;
  activeId: SlideId;
  selectSlide: (id: SlideId) => void;
  setField: (id: SlideId, key: string, value: FieldValue) => void;
  setOption: (id: SlideId, key: string, value: OptionValue) => void;
  setTemplate: (id: SlideId, template: TemplateId) => void;
};

/**
 * A posição de um slide, ou erro. Id fora do deck lança, como o registry faz com template
 * desconhecido — nenhuma tela oferece um slide que o deck não tem, então isto é erro de
 * programação e não estado de runtime a tratar.
 */
function indexOf(slides: Slide[], id: SlideId): number {
  const at = slides.findIndex((slide) => slide.id === id);
  if (at < 0) {
    throw new Error(`Slide desconhecido: ${id}`);
  }
  return at;
}

/**
 * Aplica `change` ao slide de id `id` e devolve a lista nova. Os slides que não mudaram
 * saem por referência, não por cópia: é o que permite ao React pular a re-renderização de
 * quem não foi tocado.
 */
function replaceSlide(slides: Slide[], id: SlideId, change: (slide: Slide) => Slide): Slide[] {
  const at = indexOf(slides, id);
  const next = [...slides];
  next[at] = change(next[at]);
  return next;
}

export function createEditorStore(deck: Deck): StoreApi<EditorState> {
  return createStore<EditorState>()((set) => ({
    deck,
    activeId: deck.slides[0]?.id ?? "",

    selectSlide(id) {
      set((state) => {
        indexOf(state.deck.slides, id);
        return { activeId: id };
      });
    },

    setField(id, key, value) {
      set((state) => ({
        deck: {
          ...state.deck,
          slides: replaceSlide(state.deck.slides, id, (slide) => ({
            ...slide,
            fields: { ...slide.fields, [key]: value },
          })),
        },
      }));
    },

    setOption(id, key, value) {
      set((state) => ({
        deck: {
          ...state.deck,
          slides: replaceSlide(state.deck.slides, id, (slide) => ({
            ...slide,
            options: { ...slide.options, [key]: value },
          })),
        },
      }));
    },

    /**
     * A troca de layout — 2.11. O conteúdo migra pela interseção de chaves que o
     * vocabulário único da §6 garante, e as opções **sempre** resetam para os defaults do
     * template novo: são dois objetos separados no modelo justamente para que esta regra
     * seja possível (decisão 5).
     *
     * Escolher o template que o slide já tem não é troca: devolve o mesmo slide, com a
     * mesma referência, para não custar as opções que a pessoa ajustou.
     */
    setTemplate(id, template) {
      set((state) => ({
        deck: {
          ...state.deck,
          slides: replaceSlide(state.deck.slides, id, (slide) => {
            if (slide.template === template) {
              return slide;
            }

            const to = get(template);

            return {
              ...slide,
              template,
              fields: migrateFields(get(slide.template), to, slide.fields),
              options: structuredClone(to.defaults.options),
            };
          }),
        },
      }));
    },
  }));
}

/** A posição do slide ativo — o que a constelação do rodapé precisa saber. */
export function selectActiveIndex(state: EditorState): number {
  return state.deck.slides.findIndex((slide) => slide.id === state.activeId);
}

export function selectActiveSlide(state: EditorState): Slide {
  return state.deck.slides[selectActiveIndex(state)];
}

export const editorStore = createEditorStore(createSeedDeck());

export function useEditor<T>(selector: (state: EditorState) => T): T {
  return useStore(editorStore, selector);
}
