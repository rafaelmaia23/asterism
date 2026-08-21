"use client";

/**
 * A coluna do meio: a área que mede a si mesma e exibe o slide ativo na escala que
 * couber.
 *
 * O canvas sabe de escala e de mais nada. Qual template o slide usa é assunto do
 * `SlideView`; em que tamanho o slide está sendo exibido é assunto do `SlideFrame`, que
 * recebe daqui o `k` e o repassa ao `transform` e a `--slide-scale` no mesmo lugar.
 *
 * Enquanto a escala for 0 — o primeiro quadro, antes de o `ResizeObserver` medir — nada
 * é desenhado. Um quadro com `--slide-scale: 0` faria a compensação do grid dividir por
 * zero.
 */

import { useRef } from "react";
import type { Deck, DeckMeta, Slide } from "@/deck/types";
import { useFitScale } from "@/editor/use-fit-scale";
import { SlideView } from "@/render/slide-view";

export type SlideCanvasProps = {
  slide: Slide;
  deck: DeckMeta;
  format: Deck["format"];
  index: number;
  total: number;
};

export function SlideCanvas({ slide, deck, format, index, total }: SlideCanvasProps) {
  const area = useRef<HTMLDivElement>(null);
  const scale = useFitScale(area, format);

  return (
    <div
      ref={area}
      data-testid="slide-canvas-area"
      className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden p-8"
    >
      {scale > 0 && (
        <SlideView
          slide={slide}
          deck={deck}
          format={format}
          index={index}
          total={total}
          scale={scale}
        />
      )}
    </div>
  );
}
