/**
 * O realce, e ele é **síncrono** — decisão 51 da §16 do documento de contexto.
 *
 * A 3D esperava a armadilha oposta: o shiki realça de forma assíncrona, o palco de
 * exportação espera `document.fonts.ready` e mais nada, e o HTML realçado chegaria depois
 * da captura — PDF com o código cru. O caminho síncrono faz a armadilha não existir. Com
 * as gramáticas importadas estaticamente (`langs.ts`) e o motor de regex em JavaScript,
 * que se instancia sem esperar nada, `createHighlighterCoreSync` devolve um realçador
 * pronto: nunca há um quadro com o código sem cor, o palco não ganha espera nova, o guard
 * de transbordo não mede duas vezes e nenhum teste precisa de `await`.
 *
 * O preço está medido e é o bundle — cerca de 780KB de gramáticas, a conta do `langs.ts`.
 * Numa ferramenta de um usuário só, que roda local e cujo produto é um PDF que precisa
 * sair certo, o preço é esse.
 *
 * O realçador é criado na **primeira chamada**, não no import: um deck sem slide de código
 * não paga a compilação das gramáticas, e o módulo pode ser importado pelo servidor de
 * pré-renderização sem trabalho nenhum.
 */

import { createHighlighterCoreSync, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { LANGS, isCodeLang } from "@/code/langs";
import { PALETTE, observatorio } from "@/code/theme";

const THEME = "observatorio";

/**
 * A linguagem sem gramática do core do shiki. É o valor `text` da §11.6, e é também o
 * destino de qualquer `lang` que o dado carregue e o bundle não conheça.
 */
const PLAIN = "text";

/**
 * O bit de itálico do `fontStyle` do TextMate — `FontStyle.Italic`.
 *
 * Escrito como número porque o `FontStyle` do `@shikijs/vscode-textmate` é `const enum`:
 * ele existe na checagem de tipo e não sobrevive à compilação, então importá-lo daria um
 * valor indefinido em tempo de execução.
 */
const ITALIC = 1;

let highlighter: HighlighterCore | null = null;

function core(): HighlighterCore {
  highlighter ??= createHighlighterCoreSync({
    themes: [observatorio],
    langs: LANGS,
    engine: createJavaScriptRegexEngine(),
  });

  return highlighter;
}

/**
 * Um pedaço de código já com cor. É o que o `<CodeLines>` desenha, e o mínimo que ele
 * precisa: a cor vai para `style` inline, que é a forma que atravessa a rasterização.
 */
export type CodeToken = { text: string; color: string; italic: boolean };

/**
 * Código → linhas de tokens coloridos. Uma linha por quebra, inclusive as vazias.
 *
 * `lang` chega como string porque vem do dado, e dado sobrevive a mudanças de código: um
 * deck salvo antes de a lista da §11.6 mudar traria um valor que o bundle não tem. Cai em
 * texto puro em vez de lançar — o slide perde a cor, e não o editor.
 */
export function tokenize(code: string, lang: string): CodeToken[][] {
  const language = isCodeLang(lang) ? lang : PLAIN;

  const { tokens } = core().codeToTokens(code, { lang: language, theme: THEME });

  return tokens.map((line) =>
    line.map((token) => ({
      text: token.content,
      // Duas normalizações, e as duas para que a cor que sai daqui seja **literalmente** a
      // que a §10.4 escreve. O shiki devolve hex em caixa alta, e a paleta do projeto é
      // minúscula: sem isto, o `style` do slide diria `#60A5FA` e o token do sistema
      // `#60a5fa` — a mesma cor, mas nenhuma busca acharia as duas. E o tema publica `fg`
      // para o texto sem escopo, que o shiki só escreve no token quando o tema o define.
      color: (token.color ?? PALETTE.base.hex).toLowerCase(),
      italic: ((token.fontStyle ?? 0) & ITALIC) !== 0,
    })),
  );
}
