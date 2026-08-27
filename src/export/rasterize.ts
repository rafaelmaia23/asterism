/**
 * Estágio 1 da §10 do documento de contexto: nó do DOM → bitmap. Único e compartilhado —
 * todo alvo de exportação passa por aqui, e é o que impede PDF, PNG e JPG de triplicarem
 * a rasterização.
 *
 * O nó que chega é a raiz do slide em pixels reais, montada pelo palco a `k = 1`. Duas
 * coisas que ele **não** é: o quadro externo do `SlideFrame`, que carrega a borda do
 * editor; e qualquer nó vindo do preview, que traz a compensação de `--slide-scale`
 * dentro. A §9 é explícita em que essa compensação nunca chega ao arquivo.
 *
 * `width` e `height` saem do próprio nó, não de constante: o formato é dado (§12), e o
 * dia em que um deck 1:1 existir, isto continua valendo sem edição.
 *
 * Se o texto sair em Arial no arquivo, o problema é inlining de fonte e não o alvo — as
 * três famílias precisam ser same-origin, e é o que `next/font/local` garante. Ver a §13.
 */

import { domToPng } from "modern-screenshot";
import type { Frame, RenderSource } from "@/export/types";

/**
 * O fundo do slide, em hex sRGB — o mesmo `--color-slide-bg` do tema. Explícito porque a
 * captura serializa a subárvore fora do documento e um fundo herdado não viajaria junto:
 * o PNG sairia com transparência onde deveria ter o azul-noite.
 */
const BACKGROUND = "#020617";

/**
 * O reset que o `preflight` do Tailwind faz na página e que **não atravessa a captura**.
 *
 * A clonagem copia estilo computado para dentro de um `foreignObject`, e ali dentro vale a
 * folha do agente de usuário outra vez. Onde o preflight zerava por folha — `margin` de
 * `<p>`, `<h2>`, `<ul>`, o `padding-inline-start` da lista — o clone não carrega nada, e o
 * navegador aplica os defaults dele: `1em` de margem em cada parágrafo, medido no corpo
 * tipográfico do slide, que a 72px são 72px de espaço que ninguém pediu.
 *
 * O sintoma foi o `final-cta` no PDF, com o bloco de fecho 96px abaixo do lugar, por cima
 * do rodapé — mas o defeito nunca foi dele: era de todo template que desenha `<p>` ou
 * `<ul>`, e nos outros ele só não colidia com nada. Ver a §13 do documento de contexto.
 *
 * A folha entra com **especificidade de seletor universal**, abaixo de qualquer estilo em
 * linha: o que o clone declarou de verdade — o `padding` do bloco de código, por exemplo —
 * continua vencendo. Ela zera só o que ninguém declarou.
 */
const RESET = "*,::before,::after{margin:0;padding:0}ul,ol{list-style:none}";

function applyReset(cloned: Node): void {
  if (!(cloned instanceof Element)) {
    return;
  }

  const style = cloned.ownerDocument.createElement("style");
  style.textContent = RESET;
  cloned.prepend(style);
}

export async function rasterize(source: RenderSource, scale: number): Promise<Frame> {
  const { node } = source;
  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const data = await domToPng(node, {
    scale,
    width,
    height,
    backgroundColor: BACKGROUND,
    onCloneNode: applyReset,
  });

  return { slide: source.slide, width: width * scale, height: height * scale, data };
}
