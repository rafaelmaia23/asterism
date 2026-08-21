/**
 * O registry de alvos de exportação. Idêntico ao dos templates porque é o mesmo — a
 * factory de `src/lib/registry.ts`, instanciada com outro rótulo.
 *
 * Quem popula é `src/export/index.ts`, o único módulo do projeto que importa alvo. A tela
 * pergunta ao registry quais existem e nunca escreve `"pdf"` em lugar nenhum: é o que faz
 * um formato novo custar um módulo e uma linha de registro, e nada mais — §3.
 */

import { createRegistry, type Registry } from "@/lib/registry";
import type { AnyExportTarget } from "@/export/types";

export type ExportRegistry = Registry<AnyExportTarget>;

export function createExportRegistry(): ExportRegistry {
  return createRegistry<AnyExportTarget>("Alvo de exportação");
}

const registry = createExportRegistry();

export const { register, get, list } = registry;
