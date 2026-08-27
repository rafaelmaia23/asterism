/**
 * As linguagens que entram no bundle — a lista da §11.6 dos templates, fechada contra o
 * que o carrossel usa de verdade.
 *
 * **Os imports são estáticos, e isso é a escolha, não um descuido.** Importadas assim, as
 * gramáticas são objetos comuns no momento em que o realce acontece, e o realce inteiro
 * pode ser síncrono — ver `highlighter.ts`. Import dinâmico devolveria o bundle inicial em
 * troca de um realce que chega depois da captura, que é justamente o defeito que a 3D
 * previa no PDF.
 *
 * `text` não aparece aqui porque não tem gramática: é linguagem especial do core do shiki,
 * que devolve o código inteiro num token só, na cor de primeiro plano do tema. É o que
 * serve para log, stack trace e saída de terminal — metade do que um carrossel de backend
 * mostra.
 *
 * A conta do bundle, medida em `@shikijs/langs@4.4.3`: `ts` 190KB, `tsx` 186, `js` 185,
 * `python` 77, `bash` 78, `css` 52, `sql` 25 e `json` 3. Cada arquivo traz a gramática
 * inteira, então acrescentar uma linguagem custa o tamanho dela — é por isso que a lista é
 * fina de propósito e que a §11.6 a escreve por extenso em vez de dizer "as usuais".
 */

import bash from "@shikijs/langs/bash";
import css from "@shikijs/langs/css";
import javascript from "@shikijs/langs/javascript";
import json from "@shikijs/langs/json";
import python from "@shikijs/langs/python";
import sql from "@shikijs/langs/sql";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";

/**
 * Os valores do campo `lang` da §11.6, na ordem em que o select os apresenta.
 *
 * São os **apelidos** das gramáticas — `ts` é `source.ts`, `bash` é `shellscript`,
 * `python` responde por si —, e o shiki os registra junto com o nome canônico.
 */
export const LANG_IDS = [
  "ts",
  "tsx",
  "js",
  "json",
  "bash",
  "sql",
  "css",
  "python",
  "text",
] as const;

export type CodeLang = (typeof LANG_IDS)[number];

export function isCodeLang(value: string): value is CodeLang {
  return (LANG_IDS as readonly string[]).includes(value);
}

/** As oito gramáticas. `text` não entra: quem a resolve é o core. */
export const LANGS = [typescript, tsx, javascript, json, bash, sql, css, python].flat();
