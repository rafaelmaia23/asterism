/**
 * O único módulo do projeto que importa template.
 *
 * Quem precisa de um template pede ao registry pelo id; quem precisa da lista chama
 * `list()`. A ordem de registro aqui é a ordem em que a biblioteca se apresenta.
 *
 * A Etapa 1 tinha só a capa. `text-bullets` entrou na 2B e `final-cta` na 2C, o que fecha
 * a biblioteca da Fase 1; os outros sete na Etapa 3 — cada um acrescentando uma linha a
 * este arquivo e nada mais. `context` e `text-impact` chegaram na 3C.
 *
 * A ordem é a **narrativa** de um carrossel, e é a da tabela da §11 dos templates: abre na
 * capa, segura o leitor no contexto, desenvolve nos tópicos, fecha no CTA. É a ordem em que
 * o seletor de layout apresenta a biblioteca, e por isso um template novo entra onde a
 * narrativa o põe, não no fim da lista.
 */

import { context } from "@/templates/context";
import { coverStatement } from "@/templates/cover-statement";
import { finalCta } from "@/templates/final-cta";
import { register } from "@/templates/registry";
import { textBullets } from "@/templates/text-bullets";
import { textImpact } from "@/templates/text-impact";

register(coverStatement);
register(context);
register(textBullets);
register(textImpact);
register(finalCta);

export { get, list } from "@/templates/registry";
