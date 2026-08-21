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
 *
 * **Duas camadas, e a separação é o que impede o laço de medição.** A área é quem se
 * mede; o palco por cima dela é `absolute`, e é ele que carrega o quadro. Conteúdo fora
 * de fluxo não contribui para o tamanho do pai, então nada do que o canvas desenha pode
 * esticar o que o canvas mede. Sem isso, uma altura dirigida pelo conteúdo em qualquer
 * ponto da cadeia de flex acima realimenta a escala até o teto — foi o que aconteceu na
 * primeira versão. Ver a §13 do documento de contexto.
 *
 * O `p-8` fica na área, e não no palco: `contentRect` desconta padding, então a folga
 * entra na conta do encaixe. O palco cobre a caixa de padding e centraliza dentro dela,
 * o que deixa a folga igual nos quatro lados.
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
      className="relative min-h-0 min-w-0 flex-1 overflow-hidden p-8"
    >
      <div
        data-testid="slide-canvas-stage"
        className="absolute inset-0 flex items-center justify-center"
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
    </div>
  );
}
