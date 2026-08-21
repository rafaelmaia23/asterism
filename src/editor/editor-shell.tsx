"use client";

/**
 * O shell do editor — as três colunas da §14 do documento de contexto.
 *
 * Só o centro está vivo nesta etapa. A lista de slides e o inspector chegam na 1D e a
 * barra superior ganha o botão de exportação na 1E; até lá as três são espaço reservado,
 * presentes para que as proporções do editor sejam as de verdade desde já.
 *
 * O deck semente é criado uma vez, dentro do componente: `crypto.randomUUID()` avaliado
 * em módulo daria ids diferentes na pré-renderização estática e no cliente. Na 1D quem
 * guarda o deck passa a ser o store, e é esta linha que muda.
 */

import { useState } from "react";
import { createSeedDeck } from "@/editor/seed";
import { SlideCanvas } from "@/editor/slide-canvas";

function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <span className="font-heading text-sm font-semibold text-ink-300">{title}</span>
      <span className="text-sm text-ink-500">{note}</span>
    </div>
  );
}

export function EditorShell() {
  const [deck] = useState(createSeedDeck);
  const active = deck.slides[0];

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
          index={0}
          total={deck.slides.length}
        />

        <aside className="w-80 shrink-0 overflow-y-auto border-l border-ink-800 bg-card">
          <Placeholder title="Inspector" note="Campos do slide ativo" />
        </aside>
      </div>
    </div>
  );
}
