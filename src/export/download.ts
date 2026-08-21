/**
 * O último passo: blob → arquivo no disco.
 *
 * Sem back-end não há URL para onde apontar, então o caminho é o do navegador —
 * `createObjectURL`, um âncora sintético com `download`, e a revogação logo depois. Sem
 * revogar, o blob fica vivo enquanto a aba estiver aberta, e um PDF de dez slides não é
 * pequeno.
 */

import type { ExportResult } from "@/export/types";

type File = ExportResult["files"][number];

/**
 * O nome do arquivo entregue a quem exporta: o título do deck, com a extensão que o alvo
 * escolheu. O alvo não conhece o deck — nomeia o arquivo pelo que ele é — e quem sabe o
 * título é quem chama.
 *
 * Título sem nenhum caractere aproveitável mantém o nome do alvo: melhor `carrossel.pdf`
 * que um arquivo começando com ponto, que alguns sistemas escondem.
 */
export function fileName(title: string, target: string): string {
  const dot = target.lastIndexOf(".");
  const extension = dot > 0 ? target.slice(dot) : "";

  const slug = title
    .normalize("NFD")
    // Tira os diacríticos que o NFD separou: "investigação" vira "investigacao".
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `${slug}${extension}` : target;
}

export function download(file: File): void {
  const url = URL.createObjectURL(file.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;

  // No documento porque o Firefox ignora clique em âncora solto; e fora dele em seguida,
  // porque nada disto é interface.
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
