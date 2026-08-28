/**
 * O único módulo do projeto que importa template.
 *
 * Quem precisa de um template pede ao registry pelo id; quem precisa da lista chama
 * `list()`. A ordem de registro aqui é a ordem em que a biblioteca se apresenta.
 *
 * A Etapa 1 tinha só a capa. `text-bullets` entrou na 2B e `final-cta` na 2C, o que fecha
 * a biblioteca da Fase 1; os outros sete na Etapa 3 — cada um acrescentando uma linha a
 * este arquivo e nada mais. `context` e `text-impact` chegaram na 3C, `code-window` na 3D,
 * `code-annotated` e `compare-2col` na 3E, e os dois de mídia na 3F — que fecham os dez.
 *
 * A ordem é a **narrativa** de um carrossel, e é a da tabela da §11 dos templates: abre na
 * capa, segura o leitor no contexto, desenvolve nos tópicos, dá o respiro na frase de
 * impacto, mostra o código puro e o anotado, compara antes e depois, abre para a imagem ao
 * lado do texto e para a imagem sozinha, fecha no CTA. É a ordem em que o
 * seletor de layout apresenta a biblioteca, e por isso um template novo entra onde a
 * narrativa o põe, não no fim da lista.
 */

import { codeAnnotated } from "@/templates/code-annotated";
import { codeWindow } from "@/templates/code-window";
import { compare2col } from "@/templates/compare-2col";
import { context } from "@/templates/context";
import { coverStatement } from "@/templates/cover-statement";
import { finalCta } from "@/templates/final-cta";
import { imageCaption } from "@/templates/image-caption";
import { register } from "@/templates/registry";
import { splitVertical } from "@/templates/split-vertical";
import { textBullets } from "@/templates/text-bullets";
import { textImpact } from "@/templates/text-impact";

register(coverStatement);
register(context);
register(textBullets);
register(textImpact);
register(codeWindow);
register(codeAnnotated);
register(compare2col);
register(splitVertical);
register(imageCaption);
register(finalCta);

export { get, list } from "@/templates/registry";
