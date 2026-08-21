/**
 * O único módulo do projeto que importa template.
 *
 * Quem precisa de um template pede ao registry pelo id; quem precisa da lista chama
 * `list()`. A ordem de registro aqui é a ordem em que a biblioteca se apresenta.
 *
 * A Etapa 1 tem só a capa. `text-bullets` e `final-cta` entram na Etapa 2, e os outros
 * sete na Etapa 3 — cada um acrescentando uma linha a este arquivo e nada mais.
 */

import { coverStatement } from "@/templates/cover-statement";
import { register } from "@/templates/registry";

register(coverStatement);

export { get, list } from "@/templates/registry";
