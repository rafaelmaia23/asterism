"use client";

/**
 * O guard de transbordo — §9 do documento de contexto, tarefa 3.4.
 *
 * Slide tem altura fixa, então texto longo transborda, e é a falha número um deste tipo
 * de ferramenta. O guard é a convenção que os dez templates declaram: cada um marca com
 * **⌐** na §11.x dos templates a região cuja altura real é comparada com a da faixa, e é
 * essa comparação que mora aqui.
 *
 * ## Mede dois nós, não um
 *
 * A faixa tem altura de spec — `h-[866px]` e afins, escrita no template — e o bloco de
 * conteúdo dentro dela cresce com o texto. O guard compara **a altura do conteúdo com a da
 * faixa**, e não o `scrollHeight` da faixa com o próprio `clientHeight`: conteúdo ancorado
 * à base estoura para **cima**, e o que sobe acima da borda superior não entra no
 * `scrollHeight` do pai. O `cover-statement` (`items-end`) e o `final-cta` (`justify-end`)
 * são exatamente esse caso, e passariam batidos.
 *
 * `scrollHeight` e `clientHeight` são medidas de **layout**: o `transform: scale()` do
 * `SlideFrame` não as afeta. Por isso a mesma leitura vale a 1:1 no palco de exportação, a
 * k ≈ 0,28 no canvas e a k = 0,2 na miniatura da lista — e por isso `getBoundingClientRect`
 * não serve, porque essa enxerga a escala.
 *
 * ## O que a medida não pode encostar
 *
 * Vale aqui a armadilha da §13 do documento de contexto, do outro lado: a faixa medida
 * **não pode ser dimensionada pelo conteúdo** — `min-h` no lugar de `h` realimenta a
 * medida. E a marca que o resultado desenha não pode mexer no layout medido, senão o guard
 * oscila: por isso ela mora na borda do quadro externo do `SlideFrame`, que já tem 1px nos
 * dois estados e vive fora do `transform`.
 *
 * ## O estado não vai para o store
 *
 * Cada `SlideView` monta um escopo e mede a si mesmo. A lista lateral desenha todos os
 * slides pelo mesmo `SlideView`, então ela sabe quais transbordam sem que o canvas precise
 * estar neles, e sem nenhuma fiação de estado global. O guard fora de um escopo — não há
 * caso hoje — simplesmente não reporta a ninguém.
 *
 * A chave de registro sai de `useId()`, nunca do id do slide: id de dado em atributo ou em
 * estado é divergência de hidratação, §13. E o escopo nasce sempre em `false` nos dois
 * lados, porque medir só acontece em efeito.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

/**
 * Faixa de altura 0 é "ainda não medida" — o primeiro quadro, ou um ambiente sem layout —
 * e não reprova nada. É o mesmo contrato do `fitScale`, que devolve 0 em vez de uma escala
 * mínima qualquer.
 */
export function overflowsRegion(contentHeight: number, regionHeight: number): boolean {
  if (regionHeight <= 0) {
    return false;
  }

  return contentHeight > regionHeight;
}

/** Como um guard avisa o escopo. `false` também é notícia: é o que apaga a marca. */
export type OverflowReport = (key: string, over: boolean) => void;

export const OverflowScope = createContext<OverflowReport | null>(null);

/**
 * O lado de quem exibe o slide: agrega o que os guards reportam e devolve um booleano só.
 *
 * `onOverflow` é lido por ref para que quem chama não precise estabilizar a função — o
 * `Item` da lista lateral é `memo`, e uma dependência a mais por quadro seria justamente o
 * que anula a memoização que ele existe para ter.
 */
export function useOverflowScope(onOverflow?: (over: boolean) => void): {
  overflow: boolean;
  report: OverflowReport;
} {
  const [overflow, setOverflow] = useState(false);
  const keys = useRef<Set<string>>(new Set());

  const report = useCallback<OverflowReport>((key, over) => {
    if (over) {
      keys.current.add(key);
    } else {
      keys.current.delete(key);
    }

    setOverflow(keys.current.size > 0);
  }, []);

  const notify = useRef(onOverflow);

  useEffect(() => {
    notify.current = onOverflow;
  }, [onOverflow]);

  useEffect(() => {
    notify.current?.(overflow);
  }, [overflow]);

  return { overflow, report };
}

export type OverflowGuard = {
  /** A faixa, com a altura que o template dá a ela. */
  region: (node: HTMLElement | null) => void;
  /** O bloco que cresce com o conteúdo. */
  content: (node: HTMLElement | null) => void;
};

/**
 * Os dois refs que o template pendura na região marcada com ⌐.
 *
 * São ref callbacks, e não objetos: um `RefObject<HTMLElement>` não é atribuível ao `ref`
 * de um `<ul>` ou de um `<p>` — `current` é mutável, então o tipo é invariante —, enquanto
 * uma função que aceita `HTMLElement` serve a qualquer um deles.
 *
 * **Desestruture no template**, em vez de escrever `guard.region` no JSX: a regra
 * `react-hooks/refs` recusa acesso a membro de valor de ref durante o render.
 */
export function useOverflowGuard(): OverflowGuard {
  const key = useId();
  const report = useContext(OverflowScope);

  const region = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLElement | null>(null);

  const setRegion = useCallback((node: HTMLElement | null) => {
    region.current = node;
  }, []);

  const setContent = useCallback((node: HTMLElement | null) => {
    content.current = node;
  }, []);

  useEffect(() => {
    const band = region.current;
    const block = content.current;

    if (!report || !band || !block) {
      return;
    }

    const measure = () => {
      report(key, overflowsRegion(block.scrollHeight, band.clientHeight));
    };

    // A primeira medida é síncrona, sem esperar o observador — o mesmo que o `useFitScale`
    // faz, e o que permite ao ambiente de teste, cujo `ResizeObserver` nunca dispara,
    // enxergar o resultado.
    measure();

    // Os dois nós: o conteúdo muda de altura com o texto, e a faixa muda quando o
    // cabeçalho liga e empurra o miolo do `text-bullets` de 866 para 734px.
    const observer = new ResizeObserver(measure);
    observer.observe(band);
    observer.observe(block);

    // Antes de Oxanium e Sora carregarem, o texto é medido com a fonte de fallback e a
    // altura é outra. É a mesma família de espera que o palco de exportação já faz.
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) {
        measure();
      }
    });

    return () => {
      live = false;
      observer.disconnect();
      // Sem isto, um slide removido ou um template trocado deixaria a marca pendurada no
      // escopo para sempre.
      report(key, false);
    };
  }, [key, report]);

  return { region: setRegion, content: setContent };
}
