/**
 * Campos que qualquer template expõe — hoje, o kicker.
 *
 * O simétrico de `shared/options.ts`, e pelo mesmo argumento: é o mesmo campo nos dez
 * templates, e declarado à mão em cada um o rótulo divergiria no terceiro.
 *
 * O kicker morava no `cover-statement`, que era o único template a declará-lo. Isso tinha
 * duas consequências que só apareceram com o deck de doze slides da 2E: nenhum slide de
 * miolo podia ter etiqueta superior, e sair da capa **descartava** o kicker digitado — a
 * migração da 2.10 é uma interseção de chaves, e uma chave que só um lado declara não
 * atravessa. Compartilhado, ele migra de graça, que é exatamente o que a decisão 13 comprou.
 *
 * É a mesma forma da decisão 25 aplicada ao topo do slide: o descritor do template diz com
 * o que o slide **nasce** — e só a capa nasce com o cabeçalho ligado —, e a opção manda daí
 * em diante. O que era regra ("kicker é coisa de capa") virou padrão.
 *
 * O `section` é metadado de desenho: põe o campo na seção "Cabeçalho" do inspector, junto
 * do interruptor que o liga. O valor continua morando em `fields`, que é conteúdo — ver a
 * §6 do documento de contexto e o `Grouped` de `types.ts`.
 */

import type { Field } from "@/templates/types";

/** Decisão 14: texto digitado e literal, nunca derivado de `meta.pillar` com a posição. */
export const kickerField: Field = {
  key: "kicker",
  type: "text",
  label: "Kicker",
  max: 12,
  placeholder: "api/ · 04",
  section: "header",
};

/** Um template os espalha com `...sharedFields` e acrescenta os próprios depois. */
export const sharedFields: Field[] = [kickerField];
