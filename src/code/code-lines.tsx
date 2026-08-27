/**
 * O código realçado virando elementos — o mesmo papel que o `<Inline>` tem para a
 * marcação: quem chama passa a string crua do campo e recebe o texto desenhado, sem nunca
 * ver token nenhum.
 *
 * **A cor sai em `style` inline, e não em classe.** Não é atalho: a paleta da §10.4 tem
 * dez cores e o realce as combina por token, então classe daria dez utilitários que o
 * Tailwind só veria se estivessem escritos por extenso em algum fonte — a armadilha de
 * tree-shaking do `CLAUDE.md` na sua forma mais difícil de perceber. E há a razão maior:
 * `<span>` com cor chapada em `style` é a única forma de cor que já foi **medida no bitmap
 * do PDF** atravessando a rasterização intacta, na 2B. Gradiente não atravessa — decisão
 * 28 —, e o tema não tem nenhum.
 *
 * Cada linha é uma `div`, e não um `<br>` dentro de um bloco só: o guard de transbordo
 * mede altura, e altura de linha é o que dá a conta das 14 linhas da §10.3. A linha vazia
 * leva um espaço inquebrável porque uma `div` sem conteúdo tem altura zero, e a linha em
 * branco que o autor escreveu sumiria do slide.
 */

import { tokenize } from "@/code/highlighter";

export type CodeLinesProps = {
  code: string;
  /** Um valor de `lang` da §11.6. Desconhecido cai em texto puro — ver `tokenize`. */
  lang: string;
};

export function CodeLines({ code, lang }: CodeLinesProps) {
  return (
    <>
      {tokenize(code, lang).map((line, at) => (
        // A chave é a posição: linha de código não tem identidade própria, e reescrever o
        // campo reescreve o bloco inteiro. É a mesma escolha do item de lista.
        <div key={at} data-testid="code-line" className="whitespace-pre">
          {/* Vazia é a linha **sem texto**, não a linha sem token: o tokenizador de
              texto puro devolve um token de conteúdo vazio onde a gramática não
              devolveria nenhum, e as duas precisam desenhar a mesma linha em branco. */}
          {line.every((token) => token.text === "")
            ? " "
            : line.map((token, index) => (
                <span
                  key={index}
                  style={{
                    color: token.color,
                    ...(token.italic ? { fontStyle: "italic" } : {}),
                  }}
                >
                  {token.text}
                </span>
              ))}
        </div>
      ))}
    </>
  );
}
