"use client";

/**
 * Mede a área central e devolve a escala que faz o slide caber nela.
 *
 * A conta é do `fitScale`, que é puro e testado; aqui só mora a fiação de browser — um
 * `ResizeObserver` sobre o elemento, sem `window.resize` e sem media query. Redimensionar
 * a janela, abrir uma coluna lateral ou mudar o formato do deck passam todos pelo mesmo
 * caminho, que é o ponto: nenhuma matemática responsiva dentro do template.
 *
 * Enquanto não houver medida, devolve 0 — ver `fit-scale.ts`.
 */

import { useEffect, useState, type RefObject } from "react";
import { fitScale, type Size } from "@/editor/fit-scale";

export function useFitScale(ref: RefObject<HTMLElement | null>, format: Size): number {
  const [scale, setScale] = useState(0);
  const { w, h } = format;

  useEffect(() => {
    const area = ref.current;
    if (!area) return;

    const observer = new ResizeObserver(([entry]) => {
      // `contentRect` já desconta o padding da área, que é a folga em volta do quadro.
      const { width, height } = entry.contentRect;
      setScale(fitScale({ w: width, h: height }, { w, h }));
    });

    observer.observe(area);
    return () => observer.disconnect();
  }, [ref, w, h]);

  return scale;
}
