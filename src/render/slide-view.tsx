/**
 * Um slide do deck, renderizado: o ponto onde o registry, o descritor e o quadro se
 * encontram.
 *
 * É a única peça que sabe traduzir `slide.template` em componente, e por isso é a que
 * preview e exportação compartilham — o canvas do editor cuida da escala e o palco
 * oculto da 1E cuida de montar o deck inteiro, nenhum dos dois precisa saber que
 * templates existem. Registry em vez de `switch`, §5 do documento de contexto.
 *
 * O fundo sai de `def.background` e vai ao `SlideFrame`; o template não desenha a
 * própria grade, e nem saberia em que escala está sendo exibido para compensá-la.
 */

import type { Deck, DeckMeta, Slide } from "@/deck/types";
import { SlideFrame } from "@/render/slide-frame";
import { get } from "@/templates/registry";

export type SlideViewProps = {
  slide: Slide;
  deck: DeckMeta;
  format: Deck["format"];
  index: number;
  total: number;
  scale?: number;
};

export function SlideView({ slide, deck, format, index, total, scale }: SlideViewProps) {
  // Id desconhecido lança aqui, vindo do registry. É erro de dado, não estado de
  // runtime a tratar: um deck só guarda id de template que existiu algum dia.
  const def = get(slide.template);

  return (
    <SlideFrame format={format} scale={scale} background={def.background}>
      <def.Component
        fields={slide.fields}
        options={slide.options}
        deck={deck}
        index={index}
        total={total}
      />
    </SlideFrame>
  );
}
