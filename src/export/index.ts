/**
 * O único módulo do projeto que importa um alvo de exportação, espelhando o
 * `src/templates/index.ts` da biblioteca de layouts.
 *
 * Quem precisa de um alvo pede ao registry pelo id; quem precisa da lista chama `list()`.
 * A ordem de registro aqui é a ordem em que a barra superior apresenta os alvos.
 *
 * A v1 tem só o PDF. `png`, `jpg` e `zip` acrescentam uma linha a este arquivo e um
 * módulo em `targets/`, e nada mais.
 */

import { register } from "@/export/registry";
import { pdf } from "@/export/targets/pdf";

register(pdf);

export { get, list } from "@/export/registry";
