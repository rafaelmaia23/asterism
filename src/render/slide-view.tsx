/**
 * Um slide do deck, renderizado: o ponto onde o registry, o descritor e o quadro se
 * encontram.
 *
 * É a única peça que sabe traduzir `slide.template` em componente, e por isso é a que
 * preview e exportação compartilham — o canvas do editor cuida da escala e o palco
 * oculto da 1E cuida de montar o deck inteiro, nenhum dos dois precisa saber que
 * templates existem. Registry em vez de `switch`, §5 do documento de contexto.
 *
 * O fundo é decidido aqui e vai pronto ao `SlideFrame`; o template não desenha a própria
 * grade, e nem saberia em que escala está sendo exibido para compensá-la.
 *
 * **Quem decide a grade é o slide, não o template** — decisão 25 e §4.3 do design system.
 * O `background` do descritor é o padrão com que o slide nasce, e vale para quem não tem
 * a opção: deck antigo, ou template que não a exponha.
 *
 * É também aqui que mora o escopo do guard de transbordo: o template declara qual região
 * é medida, e o `SlideView` junta o que os guards dizem e entrega ao `SlideFrame`. Como
 * canvas, lista lateral e palco de exportação passam todos por este componente, **cada
 * slide desenhado mede a si mesmo** — a lista sabe quais transbordam sem que o canvas
 * precise estar neles, e sem estado global para manter em dia. §9 do documento de contexto.
 */

import type { Ref } from "react";
import type { Deck, DeckMeta, Slide } from "@/deck/types";
import { OverflowScope, useOverflowScope } from "@/render/overflow";
import { SlideFrame } from "@/render/slide-frame";
import { get } from "@/templates/registry";

export type SlideViewProps = {
  slide: Slide;
  deck: DeckMeta;
  format: Deck["format"];
  index: number;
  total: number;
  scale?: number;
  /** Repassado ao `SlideFrame`: a raiz do slide, que é o nó que a exportação captura. */
  canvasRef?: Ref<HTMLDivElement>;
  /**
   * Avisa quem montou o slide que ele passou a transbordar, ou parou. É como a linha da
   * lista lateral ganha o ícone: o estado nasce da medida do próprio slide, e não de um
   * mapa no store que alguém teria de manter em dia.
   */
  onOverflow?: (over: boolean) => void;
};

export function SlideView({
  slide,
  deck,
  format,
  index,
  total,
  scale,
  canvasRef,
  onOverflow,
}: SlideViewProps) {
  // Id desconhecido lança aqui, vindo do registry. É erro de dado, não estado de
  // runtime a tratar: um deck só guarda id de template que existiu algum dia.
  const def = get(slide.template);

  const grid =
    typeof slide.options.showGrid === "boolean"
      ? slide.options.showGrid
      : def.background === "grid";

  const { overflow, report } = useOverflowScope(onOverflow);

  return (
    <OverflowScope value={report}>
      <SlideFrame
        format={format}
        scale={scale}
        background={grid ? "grid" : "plain"}
        canvasRef={canvasRef}
        overflow={overflow}
      >
        <def.Component
          fields={slide.fields}
          options={slide.options}
          deck={deck}
          index={index}
          total={total}
        />
      </SlideFrame>
    </OverflowScope>
  );
}
