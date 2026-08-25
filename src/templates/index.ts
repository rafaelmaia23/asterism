/**
 * O único módulo do projeto que importa template.
 *
 * Quem precisa de um template pede ao registry pelo id; quem precisa da lista chama
 * `list()`. A ordem de registro aqui é a ordem em que a biblioteca se apresenta.
 *
 * A Etapa 1 tinha só a capa. `text-bullets` entrou na 2B e `final-cta` na 2C, o que fecha
 * a biblioteca da Fase 1; os outros sete na Etapa 3 — cada um acrescentando uma linha a
 * este arquivo e nada mais.
 *
 * A ordem é a narrativa de um carrossel: abre na capa, desenvolve nos tópicos, fecha no
 * CTA. É a ordem em que o seletor de layout apresenta a biblioteca.
 */

import { coverStatement } from "@/templates/cover-statement";
import { finalCta } from "@/templates/final-cta";
import { register } from "@/templates/registry";
import { textBullets } from "@/templates/text-bullets";

register(coverStatement);
register(textBullets);
register(finalCta);

export { get, list } from "@/templates/registry";
