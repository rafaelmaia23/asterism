/**
 * O alvo `pdf`: uma página por slide, na medida do slide.
 *
 * Estágio 2 da §10 do documento de contexto — não conhece template nenhum, e nem
 * poderia: o que chega são nós e slides, e o que sai é arquivo. Acrescentar `png` ou
 * `jpg` amanhã é um módulo ao lado deste, sem tocar aqui e sem repetir a rasterização.
 *
 * `unit: "pt"` e `format: [w, h]` — decisão 21. O bitmap é 2160×2700 de qualquer forma; a
 * unidade só muda o número que o visualizador mostra, e a `px` do jsPDF depende de uma
 * conversão de 96 dpi que não vale a pena carregar.
 *
 * As medidas saem do primeiro `Frame`, divididas pela escala: nem 1080 nem 1350 aparecem
 * neste arquivo, porque o formato é dado do deck e não constante — §12.
 */

import { jsPDF } from "jspdf";
import { rasterize } from "@/export/rasterize";
import type { ExportResult, ExportTarget, RenderSource } from "@/export/types";

/**
 * Rasterização em 2×: 2160×2700 por página. É o dobro do slide, que é o que o LinkedIn
 * precisa para não deixar o texto macio depois da recompressão dele.
 */
const SCALE = 2;

const FILE_NAME = "carrossel.pdf";

async function produce(sources: RenderSource[]): Promise<ExportResult> {
  // Deck vazio não produz PDF vazio: produz nada. Um arquivo de zero páginas nem abre.
  if (sources.length === 0) {
    return { files: [] };
  }

  // O primeiro slide é quem dá a medida da página, e as seguintes a repetem: um deck tem
  // um formato só (§12), então não há por que remedir a cada página.
  const [first, ...rest] = sources;
  const head = await rasterize(first, SCALE);
  const width = head.width / SCALE;
  const height = head.height / SCALE;

  const doc = new jsPDF({ unit: "pt", format: [width, height], compress: true });
  doc.addImage(head.data, "PNG", 0, 0, width, height);

  for (const source of rest) {
    const frame = await rasterize(source, SCALE);
    doc.addPage([width, height]);
    doc.addImage(frame.data, "PNG", 0, 0, width, height);
  }

  return { files: [{ name: FILE_NAME, blob: doc.output("blob") }] };
}

export const pdf: ExportTarget = {
  id: "pdf",
  label: "PDF",
  // Sem opção nenhuma na v1. Qualidade e escala aparecem quando houver um segundo alvo
  // para comparar — o descritor já está aqui para recebê-las.
  options: [],
  produce,
};
