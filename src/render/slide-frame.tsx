/**
 * O quadro do slide — §9 do documento de contexto.
 *
 * Duas camadas, e a divisão entre elas é o ponto do componente:
 *
 *   quadro externo   tamanho já escalado, borda de 1px, ocupa espaço no editor
 *   raiz do slide    1080×1350 reais, `transform: scale(k)`, é o nó que se captura
 *
 * A borda mora fora do `transform` de propósito. Dentro, ela encolheria junto com a
 * escala e — pior — entraria no nó que a exportação captura, contrariando a §9: o
 * preview e o arquivo têm de ser o mesmo DOM, e a única divergência permitida é a
 * compensação de espessura do grid.
 *
 * `--slide-w` e `--slide-h` saem de `deck.format`, nunca de constante: é o que a §12
 * compra por meia hora hoje. Nenhum template conhece 1080 ou 1350.
 *
 * O `SlideFrame` é o único dono de `--slide-scale`, porque é o único que sabe em que
 * tamanho o slide está sendo exibido. A variável fica na raiz do slide, e não no quadro
 * externo, porque quem desenha o grid está lá dentro: a §4.3 do design system exige que
 * `--slide-grid-line-render` resolva num elemento que já enxergue a escala.
 */

import type { CSSProperties, ReactNode } from "react";
import type { Deck } from "@/deck/types";
import type { TemplateBackground } from "@/templates/types";

export type SlideFrameProps = {
  format: Deck["format"];
  /** O mesmo `k` que vai ao `transform`. 1 é o tamanho real, o caso da exportação. */
  scale?: number;
  /**
   * Vem de `meta.background` do template, e o quadro não decide nada além de aplicar:
   * quais templates têm grade é assunto da §4.3 do design system, declarado no
   * descritor de cada um.
   */
  background?: TemplateBackground;
  children: ReactNode;
};

export function SlideFrame({
  format,
  scale = 1,
  background = "plain",
  children,
}: SlideFrameProps) {
  return (
    <div
      data-testid="slide-frame"
      // `box-content` para que a borda cresça para fora: o miolo mede exatamente o
      // slide escalado, e a linha não come 2px do conteúdo.
      className="box-content border border-ink-800"
      style={{ width: format.w * scale, height: format.h * scale }}
    >
      <div
        data-testid="slide-canvas"
        // `slide-canvas` é o nome que a §13 do documento de contexto dá à subárvore
        // que precisa de cor em hex sRGB — a que a rasterização vai serializar.
        className={[
          "slide-canvas relative overflow-hidden bg-slide-bg",
          background === "grid" ? "slide-grid" : "",
        ]
          .join(" ")
          .trim()}
        style={
          {
            "--slide-w": `${format.w}px`,
            "--slide-h": `${format.h}px`,
            "--slide-scale": scale,
            width: "var(--slide-w)",
            height: "var(--slide-h)",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
