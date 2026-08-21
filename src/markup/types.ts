/**
 * A AST da marcação inline — §7 do documento de contexto.
 *
 * Oito variantes, todas com a mesma forma `{ t, v }`: um discriminante e o texto cru que
 * o marcador delimitou. Não há filhos, e é de propósito — marcadores não aninham, então
 * um nó nunca precisa carregar outro. Ver a §7: `**texto com *itálico* dentro**` é o
 * marcador externo com asteriscos literais no `v`.
 *
 * Este módulo não importa React e nunca vai importar: o parser é o primeiro estágio e não
 * sabe que existe DOM. É a §5 do documento de contexto aplicada — nenhum estágio conhece
 * o seguinte. Quem transforma isto em elemento é o `<Inline>`, ao lado.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; v: string }
  | { t: "em"; v: string }
  | { t: "strike"; v: string }
  | { t: "underline"; v: string }
  | { t: "mark"; v: string }
  | { t: "code"; v: string }
  | { t: "accent"; v: string };

/** O `t` de um nó que veio de marcador — tudo menos `text`. */
export type InlineMark = Exclude<Inline, { t: "text" }>["t"];
