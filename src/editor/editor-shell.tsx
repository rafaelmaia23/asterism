"use client";

/**
 * O shell do editor — as três colunas da §14 do documento de contexto.
 *
 * A lista de slides e o inspector chegam nas próximas tarefas da 1D e a barra superior
 * ganha o botão de exportação na 1E; até lá são espaço reservado, presentes para que as
 * proporções do editor sejam as de verdade desde já.
 *
 * Quem guarda o deck é o store. O shell não tem estado próprio: lê o que precisa e
 * distribui.
 */

import { Inspector } from "@/editor/inspector";
import { SlideCanvas } from "@/editor/slide-canvas";
import { selectActiveIndex, selectActiveSlide, useEditor } from "@/editor/store";

function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <span className="font-heading text-sm font-semibold text-ink-300">{title}</span>
      <span className="text-sm text-ink-500">{note}</span>
    </div>
  );
}

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
          <Placeholder title="Slides" note={`${deck.slides.length} slides neste deck`} />
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
