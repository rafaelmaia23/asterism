/**
 * Os tipos da §10 do documento de contexto — a exportação em dois estágios.
 *
 * PDF, PNG e JPG não são três exportadores: compartilham o caminho DOM → bitmap e
 * divergem só na codificação e no empacotamento. O estágio 1 é único (`rasterize`); o
 * estágio 2 é plugável, descoberto por registry como os templates.
 *
 * Este módulo importa apenas `src/deck` e o descritor de campo — nenhum alvo, nenhum
 * template, nada de DOM além do tipo do nó.
 */

import type { Slide } from "@/deck/types";
import type { Field } from "@/templates/types";

/**
 * O que o palco de exportação entrega por slide: o **nó e o slide**, nunca o bitmap
 * pronto. É o que mantém aberta a porta para um alvo futuro ler os dados direto, em vez
 * de rasterizar — saída vetorial sem reescrever o estágio 1.
 *
 * O `node` é a raiz do slide em pixels reais, a que carrega `.slide-canvas`. Nunca o
 * quadro externo do `SlideFrame`, que tem a borda do editor, e nunca um nó vindo do
 * preview, que traz a compensação de `--slide-scale` junto — ver a decisão 20.
 */
export type RenderSource = { slide: Slide; node: HTMLElement };

/**
 * Um slide rasterizado. `data` é PNG em data URL: é o que o jsPDF consome direto em
 * `addImage`, o que um teste consegue inspecionar sem canvas, e o que não prende o alvo
 * a um objeto de DOM vivo. `width` e `height` já vêm multiplicados pela escala — 2160×2700
 * na escala 2 do alvo PDF.
 */
export type Frame = { slide: Slide; width: number; height: number; data: string };

/**
 * Sempre uma lista, mesmo quando é um arquivo só: o alvo PDF produz um, um alvo PNG
 * produziria N, um alvo ZIP voltaria a um. Quem chama trata a lista e não precisa saber
 * qual caso é.
 */
export type ExportResult = { files: { name: string; blob: Blob }[] };

/**
 * Um alvo de exportação. `options` é o mesmo descritor de campo dos templates — o dia em
 * que o alvo JPG expuser qualidade, o formulário sai de graça pelo inspector.
 */
export interface ExportTarget<O = Record<string, never>> {
  id: string;
  label: string;
  options: Field[];
  produce(sources: RenderSource[], opts: O): Promise<ExportResult>;
}

/**
 * A forma sob a qual o registry guarda alvos de opções diferentes — mesmo motivo do
 * `AnyTemplateDef`: `produce` é propriedade de tipo função e os parâmetros são
 * contravariantes sob `strictFunctionTypes`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyExportTarget = ExportTarget<any>;
