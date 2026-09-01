/**
 * A AST da marcação inline — §2 de `docs/model.md`.
 *
 * Oito variantes, todas com a mesma forma `{ t, v }`: um discriminante e o texto cru que
 * o marcador delimitou. Não há filhos, e é de propósito — marcadores não aninham, então
 * um nó nunca precisa carregar outro. Ver a §7: `**texto com *itálico* dentro**` é o
 * marcador externo com asteriscos literais no `v`.
 *
 * Este módulo não importa React e nunca vai importar: o parser é o primeiro estágio e não
 * sabe que existe DOM. É a §1 de `docs/architecture.md` aplicada — nenhum estágio conhece
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

/**
 * A camada de blocos — §2 de `docs/model.md`.
 *
 * Fica **acima** do inline: cada `v` e cada item saem crus e é o `<Inline>` quem os
 * transforma em texto desenhado. Por isso um `Block` nunca carrega `Inline` dentro — as
 * duas camadas se compõem no `<Blocks>`, o único módulo que conhece as duas.
 *
 * `ol` não guarda o número escrito: a numeração é sequencial a partir de 1, e o que o
 * autor digitou em `3. ` é marcador, não conteúdo. ADR-0076.
 */
export type Block =
  | { t: "p"; v: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] };
