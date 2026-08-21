/**
 * Opções que qualquer template pode expor.
 *
 * A grade de fundo deixou de ser propriedade fixa do template e virou escolha de quem
 * edita — decisão 25 da §16 do documento de contexto e §4.3 do design system. O
 * `background` do descritor continua existindo: é o padrão com que um slide daquele
 * template nasce.
 *
 * O descritor mora aqui, e não copiado em cada `fields.ts`, porque é o mesmo campo nos dez
 * templates: declarado à mão em cada um, o rótulo divergiria no terceiro.
 */

import type { Field } from "@/templates/types";

export const showGridOption: Field = {
  key: "showGrid",
  type: "toggle",
  label: "Grade de fundo",
};
