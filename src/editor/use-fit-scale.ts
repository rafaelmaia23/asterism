"use client";

/**
 * Mede a área central e devolve a escala que faz o slide caber nela.
 *
 * A conta é do `fitScale`, que é puro e testado; aqui só mora a fiação de browser — um
 * `ResizeObserver` sobre o elemento, sem `window.resize` e sem media query. Redimensionar
 * a janela, abrir uma coluna lateral ou mudar o formato do deck passam todos pelo mesmo
 * caminho, que é o ponto: nenhuma matemática responsiva dentro do template.
 *
 * A medição roda em layout effect, antes da pintura, e a primeira leitura é síncrona, sem
 * esperar o observador: o quadro nasce no tamanho final em vez de aparecer e se ajustar.
 *
 * Quem chama tem de garantir que o elemento observado não seja dimensionado pelo que o
 * resultado desta medida desenha — senão cada medida realimenta a próxima. Ver a §13 do
 * documento de contexto e o `SlideCanvas`, que separa a área medida do palco.
 *
 * Enquanto não houver medida, devolve 0 — ver `fit-scale.ts`.
 */

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { fitScale, type Size } from "@/editor/fit-scale";

/**
 * `useLayoutEffect` avisa no console quando roda na pré-renderização, que não tem layout
 * para ler. O editor é cliente; a pré-renderização só produz o esqueleto.
 */
const useIsomorphicLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;

export function useFitScale(ref: RefObject<HTMLElement | null>, format: Size): number {
  const [scale, setScale] = useState(0);
  const { w, h } = format;

  useIsomorphicLayoutEffect(() => {
    const area = ref.current;
    if (!area) return;

    // `clientWidth`/`clientHeight` são a caixa de conteúdo mais o padding; o padding é a
    // folga em volta do quadro, então ela sai da conta — como no `contentRect` abaixo.
    const measure = (width: number, height: number) => {
      setScale(fitScale({ w: width, h: height }, { w, h }));
    };

    const style = getComputedStyle(area);
    const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    measure(area.clientWidth - padX, area.clientHeight - padY);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      measure(width, height);
    });

    observer.observe(area);
    return () => observer.disconnect();
  }, [ref, w, h]);

  return scale;
}
