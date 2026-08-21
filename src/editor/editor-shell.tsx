"use client";

/**
 * O shell do editor — as três colunas da §14 do documento de contexto.
 *
 * As três colunas estão vivas desde a 1D. Falta à barra superior o botão de exportação,
 * que é da 1E, e as ações de deck da §14, que são da Etapa 4.
 *
 * Quem guarda o deck é o store. O shell não tem estado próprio: lê o que precisa e
 * distribui.
 */

import { Inspector } from "@/editor/inspector";
import { SlideCanvas } from "@/editor/slide-canvas";
import { SlideList } from "@/editor/slide-list";
import { selectActiveIndex, selectActiveSlide, useEditor } from "@/editor/store";

export function EditorShell() {
  const deck = useEditor((state) => state.deck);
  const active = useEditor(selectActiveSlide);
  const index = useEditor(selectActiveIndex);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-800 bg-card px-6">
        <span className="font-heading text-sm font-semibold tracking-tight text-ink-100">
          asterism
        </span>
        <span className="text-ink-700">/</span>
        <span className="text-sm text-ink-400">{deck.title}</span>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-64 shrink-0 overflow-y-auto border-r border-ink-800 bg-card">
          <SlideList />
        </aside>

        <SlideCanvas
          slide={active}
          deck={deck.meta}
          format={deck.format}
          index={index}
          total={deck.slides.length}
        />

        <aside className="w-80 shrink-0 overflow-y-auto border-l border-ink-800 bg-card">
          <Inspector />
        </aside>
      </div>
    </div>
  );
}
