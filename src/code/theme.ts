/**
 * O tema do shiki, gerado a partir dos tokens do Observatório — §10.4 do design system.
 *
 * **Não é um tema importado pronto**, e a regra não é de gosto: um tema de terceiro traz a
 * própria paleta, e o bloco de código passa a ser a única coisa do carrossel que não parece
 * do sistema. A §10.4 dá dez papéis e um degrau de rampa para cada um; este módulo os
 * transcreve e os mapeia para escopo TextMate, que é a única linguagem que o shiki entende.
 *
 * A cor mora aqui em **hex sRGB literal**, e não em `var(--color-…)`, por duas razões que
 * já custaram caro no projeto. O tokenizador do shiki devolve cor como string e a põe em
 * `style` inline: uma `var()` resolveria contra o documento, e no palco de exportação —
 * fora da tela, dentro de um `foreignObject` — não há garantia nenhuma disso. E `oklch()`
 * não atravessa a rasterização, que é a primeira armadilha da §13 do documento de contexto.
 *
 * O que impede o literal de divergir da fonte é o `theme.test.ts`: ele lê o `globals.css`
 * e exige que cada `token` daqui declare exatamente este `hex`. O tema é gerado dos tokens
 * porque o teste não deixa ser outra coisa.
 *
 * Dois nomes da §10.4 são apelido da rampa inteira: `azure-400` é `azure-radiance-400` e
 * `crown-400` é `crown-of-thorns-400`. O campo `token` guarda o nome real da variável, o
 * que faz este módulo ser também o lugar onde os dois apelidos se resolvem.
 */

import type { ThemeRegistrationRaw } from "shiki/core";

/** Os dez papéis da tabela da §10.4, na ordem em que ela os lista. */
export type CodeRole =
  | "base"
  | "comment"
  | "keyword"
  | "string"
  | "number"
  | "function"
  | "type"
  | "variable"
  | "operator"
  | "invalid";

export const PALETTE: Record<CodeRole, { token: string; hex: string }> = {
  base: { token: "--color-ink-200", hex: "#e2e8f0" },
  comment: { token: "--color-ink-500", hex: "#64748b" },
  keyword: { token: "--color-azure-radiance-400", hex: "#60a5fa" },
  string: { token: "--color-pacifika-300", hex: "#d4e373" },
  number: { token: "--color-sun-300", hex: "#f8c251" },
  function: { token: "--color-azure-radiance-200", hex: "#bfdbfe" },
  type: { token: "--color-sun-200", hex: "#fada8d" },
  variable: { token: "--color-ink-200", hex: "#e2e8f0" },
  operator: { token: "--color-ink-400", hex: "#94a3b8" },
  invalid: { token: "--color-crown-of-thorns-400", hex: "#f77272" },
};

/**
 * Escopo TextMate → papel da §10.4.
 *
 * A resolução do TextMate é por **especificidade de prefixo**: o escopo mais longo que
 * casa vence, não o declarado por último. É o que deixa `keyword.operator` sair em
 * `ink-400` sob a regra de operador enquanto `keyword.control` sai em `azure-400` sob a de
 * palavra-chave, e o que põe as aspas de uma string na cor da string em vez da cor da
 * pontuação. Cada escopo aparece **uma vez só** na tabela — o teste confere.
 */
const SCOPES: Record<Exclude<CodeRole, "base">, string[]> = {
  comment: ["comment", "punctuation.definition.comment"],
  keyword: [
    "keyword",
    "keyword.control",
    "storage",
    "storage.type",
    "storage.modifier",
    "keyword.operator.new",
    "keyword.operator.expression",
    "variable.language",
  ],
  string: [
    "string",
    "string.quoted",
    "string.template",
    "punctuation.definition.string",
    "constant.character.escape",
  ],
  number: ["constant.numeric", "constant.language", "constant.other", "support.constant"],
  function: [
    "entity.name.function",
    "support.function",
    "meta.function-call",
    "variable.function",
  ],
  type: [
    "entity.name.type",
    "entity.name.class",
    "entity.name.tag",
    "entity.other.inherited-class",
    "entity.other.attribute-name",
    "support.type",
    "support.class",
  ],
  variable: [
    "variable",
    "variable.other",
    "support.variable",
    "meta.object-literal.key",
    "entity.name.label",
  ],
  operator: [
    "keyword.operator",
    "punctuation",
    "punctuation.separator",
    "punctuation.terminator",
    "punctuation.accessor",
    "meta.brace",
  ],
  invalid: ["invalid", "invalid.illegal"],
};

/**
 * O fundo da janela da §10.3 — `--color-slide-raised`. O tema publica um `bg` porque o
 * shiki exige um, mas quem pinta a janela é o template: aqui ele existe para que a cor de
 * primeiro plano tenha sido escolhida contra a superfície certa.
 */
const BACKGROUND = "#1e293b";

export const observatorio: ThemeRegistrationRaw = {
  name: "observatorio",
  type: "dark",
  bg: BACKGROUND,
  fg: PALETTE.base.hex,
  settings: (Object.keys(SCOPES) as Exclude<CodeRole, "base">[]).map((role) => ({
    scope: SCOPES[role],
    settings: {
      foreground: PALETTE[role].hex,
      // O único itálico da §10.4, e o único estilo de fonte do tema inteiro: peso e
      // sublinhado ficam de fora, que é a §1 do design system aplicada ao código.
      ...(role === "comment" ? { fontStyle: "italic" } : {}),
    },
  })),
};
