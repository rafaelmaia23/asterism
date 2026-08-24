/**
 * O único módulo do projeto que importa template.
 *
 * Quem precisa de um template pede ao registry pelo id; quem precisa da lista chama
 * `list()`. A ordem de registro aqui é a ordem em que a biblioteca se apresenta.
 *
 * A Etapa 1 tinha só a capa. `text-bullets` entrou na 2B e `final-cta` entra na 2C; os
 * outros sete na Etapa 3 — cada um acrescentando uma linha a este arquivo e nada mais.
 */

import { coverStatement } from "@/templates/cover-statement";
import { register } from "@/templates/registry";
import { textBullets } from "@/templates/text-bullets";

register(coverStatement);
register(textBullets);

export { get, list } from "@/templates/registry";
