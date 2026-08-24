import type { SVGProps } from "react";

/**
 * O que sobrou do sistema de marca depois da 2.4a: das cinco peças, o asterism carrega a
 * `MaiahubGlyph`, e este é o contrato que ela compartilharia com as outras se estivessem
 * aqui. A geometria do wordmark saiu junto com o wordmark — ver `docs/maiahub-logo.md`.
 */
export interface MaiahubLogoProps extends SVGProps<SVGSVGElement> {
  /**
   * Deixa a estrela herdar `currentColor` junto com o resto do desenho.
   * Use em impressão, gravação a laser, ou sobre fundos onde o azul não tem contraste.
   */
  mono?: boolean;
}
