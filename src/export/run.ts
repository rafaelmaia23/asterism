/**
 * A exportação inteira, de ponta a ponta: palco → alvo → arquivo.
 *
 * É o único ponto que conhece os três, e por isso é onde o título do deck vira nome de
 * arquivo — o alvo nomeia o que produziu, não sabe em que deck está.
 *
 * Quem chama passa o **id** do alvo, que veio do registry. Nenhuma tela escreve `"pdf"`.
 */

import type { Deck } from "@/deck/types";
import { download, fileName } from "@/export/download";
import { get } from "@/export/registry";
import { withExportStage } from "@/export/stage";

export async function exportDeck(deck: Deck, targetId: string): Promise<void> {
  const target = get(targetId);

  const result = await withExportStage(deck, (sources) => target.produce(sources, {}));

  for (const file of result.files) {
    download({ ...file, name: fileName(deck.title, file.name) });
  }
}
