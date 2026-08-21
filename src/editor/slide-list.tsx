"use client";

/**
 * A coluna da esquerda: os slides do deck, na ordem, e qual está ativo.
 *
 * Somente leitura nesta etapa — clicar troca o ativo e nada mais. Miniatura, marca de
 * transbordo, reordenação por arraste, duplicar e remover são das etapas seguintes, e a
 * §14 do documento de contexto registra o que já está de pé.
 *
 * O rótulo do template vem do registry; o trecho, da chave canônica `heading` da §6. Essa
 * chave existe justamente para que o mesmo papel tenha a mesma chave em todo template, e
 * é o que permite à lista distinguir três capas seguidas sem conhecer template nenhum.
 */

import type { StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import type { Slide } from "@/deck/types";
import type { EditorState } from "@/editor/store";
import { editorStore } from "@/editor/store";
import { get } from "@/templates/registry";

export type SlideListProps = {
  store?: StoreApi<EditorState>;
};

/** Primeira linha do título, ou nada. Campo `list` ou ausente não vira `[object Object]`. */
function excerpt(slide: Slide): string {
  const heading = slide.fields.heading;
  return typeof heading === "string" ? heading.split("\n")[0] : "";
}

export function SlideList({ store = editorStore }: SlideListProps) {
  const slides = useStore(store, (state) => state.deck.slides);
  const activeId = useStore(store, (state) => state.activeId);
  const selectSlide = useStore(store, (state) => state.selectSlide);

  return (
    <ol className="flex flex-col gap-1 p-2">
      {slides.map((slide, position) => {
        const active = slide.id === activeId;
        const trecho = excerpt(slide);

        return (
          <li key={slide.id}>
            <button
              type="button"
              // `aria-current` em vez de cor só: a seleção precisa ser legível por quem
              // não enxerga a superfície um degrau acima.
              aria-current={active ? "true" : undefined}
              onClick={() => selectSlide(slide.id)}
              // Hover sobe superfície sem mudar cor — §8 do design system.
              className={`flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left transition-colors hover:bg-ink-800 ${
                active ? "bg-ink-800" : ""
              }`}
            >
              <span className="flex items-baseline gap-2">
                <span
                  className={`font-mono text-xs font-medium tracking-[0.08em] tabular-nums ${
                    active ? "text-azure-radiance-400" : "text-ink-500"
                  }`}
                >
                  {String(position + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-xs text-ink-500">{get(slide.template).label}</span>
              </span>

              {trecho && <span className="truncate text-sm text-ink-300">{trecho}</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
