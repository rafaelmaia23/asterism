"use client";

/**
 * A coluna da esquerda: os slides do deck, na ordem, e qual está ativo.
 *
 * Cada item é o número e o nome do slide numa linha, e a miniatura em largura cheia
 * abaixo. A miniatura é o mesmo `SlideView` do canvas — a §9 do documento de contexto diz
 * que preview e exportação são o mesmo DOM, e a lista lateral entra de carona nisso: o
 * `SlideFrame` já sabe desenhar em qualquer escala, e a compensação de `--slide-scale`
 * mantém o grid visível mesmo aqui, a um quinto do tamanho.
 *
 * **A escala é constante, não medida.** A §13 proíbe medir um elemento dimensionado pelo
 * próprio conteúdo, e o item de uma lista é exatamente isso: pôr um `ResizeObserver` aqui
 * traria de volta o laço da 1C. A largura é constante do módulo, e a escala sai dela com
 * `deck.format` — nunca com 1080 escrito à mão, §12.
 *
 * Somente leitura nesta etapa: clicar troca o ativo e nada mais. Marca de transbordo,
 * reordenação por arraste, duplicar e remover são das etapas seguintes.
 */

import { memo } from "react";
import type { StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import type { Deck, DeckMeta, Slide, SlideId } from "@/deck/types";
import type { EditorState } from "@/editor/store";
import { editorStore } from "@/editor/store";
import { SlideView } from "@/render/slide-view";
import { get } from "@/templates/registry";

/** Largura da miniatura em px. A altura sai da proporção do formato do deck. */
export const THUMBNAIL_WIDTH = 216;

export type SlideListProps = {
  store?: StoreApi<EditorState>;
};

type ItemProps = {
  slide: Slide;
  position: number;
  total: number;
  deck: DeckMeta;
  format: Deck["format"];
  active: boolean;
  /** Recebe o id em vez de uma closure por item: closure nova a cada quadro anularia o
      `memo`, que é justamente o que impede o deck inteiro de re-renderizar por tecla. */
  onSelect: (id: SlideId) => void;
};

/**
 * Memoizado por referência de slide: sem isso, cada tecla digitada no inspector
 * re-renderizaria a árvore completa de todos os slides do deck. O store preserva a
 * identidade de quem não mudou, e é o que faz o `memo` valer.
 */
const Item = memo(function Item({
  slide,
  position,
  total,
  deck,
  format,
  active,
  onSelect,
}: ItemProps) {
  return (
    <button
      type="button"
      // `aria-current` em vez de cor só: a seleção precisa ser legível por quem não
      // enxerga a superfície um degrau acima.
      aria-current={active ? "true" : undefined}
      onClick={() => onSelect(slide.id)}
      // Hover sobe superfície sem mudar cor — §8 do design system.
      className={`flex w-full flex-col gap-2 rounded-md p-2 text-left transition-colors hover:bg-ink-800 ${
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

      <SlideView
        slide={slide}
        deck={deck}
        format={format}
        index={position}
        total={total}
        scale={THUMBNAIL_WIDTH / format.w}
      />
    </button>
  );
});

export function SlideList({ store = editorStore }: SlideListProps) {
  const deck = useStore(store, (state) => state.deck);
  const activeId = useStore(store, (state) => state.activeId);
  const selectSlide = useStore(store, (state) => state.selectSlide);

  return (
    <ol className="flex flex-col gap-1 p-2">
      {deck.slides.map((slide, position) => (
        <li key={slide.id}>
          <Item
            slide={slide}
            position={position}
            total={deck.slides.length}
            deck={deck.meta}
            format={deck.format}
            active={slide.id === activeId}
            onSelect={selectSlide}
          />
        </li>
      ))}
    </ol>
  );
}
