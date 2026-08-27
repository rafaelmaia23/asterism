/**
 * A janela de código — §10.3 do design system.
 *
 * Mora em `shared/` porque dois templates a desenham: o `code-window` da §11.6, onde ela é
 * o slide inteiro, e o `code-annotated` da §11.7, onde ela divide a altura com a
 * explicação abaixo. Escrevê-la dentro do primeiro e copiá-la no segundo é o que a peça de
 * rodapé já provou não valer a pena na 2B.
 *
 * ## A geometria, e por que ela fecha em 14 linhas
 *
 *   superfície   `slide-raised`, raio 12px, **sem borda**
 *   padding      32px em volta — o `--slide-pad-code` da §4.2
 *   barra        92px contando o padding: 32 de cima + 28 do nome + 32 até o código
 *   pontos       três círculos de 10px em `ink-700`, gap 16px
 *   código       `slide-code`, 34px a 1.5 de altura, 51px por linha
 *
 * Numa região de 866px isso deixa 742px para o código, e a 51px por linha dão **14
 * linhas**, que é exatamente o teto que a §10.3 escreve. O número não foi escolhido duas
 * vezes: a régua confirma a regra.
 *
 * ## A janela tem a altura do código
 *
 * Ela **não** ocupa a região: quatro linhas desenham um painel de quatro linhas, não um
 * painel vazio de 866px. Quem tem altura fixa é a faixa, e é a faixa que o guard mede —
 * a armadilha da §13 do documento de contexto, que proíbe dimensionar pelo conteúdo
 * justamente o que se mede. Aqui as duas coisas convivem porque são dois nós: a faixa é o
 * `region` do guard, esta janela é o `content`.
 *
 * ## O nome do arquivo é o único `slide-meta` em caixa baixa
 *
 * A utility versaliza, e a §10.5 explica por quê: no kicker e no handle a caixa alta é da
 * escala, não do conteúdo — `api/ · 04` é digitado assim e sai versal sem que o dado mude.
 * Nome de arquivo é a exceção, e é a única peça `slide-meta` que é um **identificador
 * literal**: `CACHE.TS` desmente o nome que está no repositório, e o slide passa a mostrar
 * um arquivo que não existe. A exceção está escrita na §10.3 e na §11.6 — decisão 53.
 */

import { CodeLines } from "@/code/code-lines";

/** Os três pontos da barra, em `ink-700` — §10.3. */
function Dots() {
  return (
    <div className="flex items-center gap-[16px]">
      {[0, 1, 2].map((at) => (
        <span key={at} className="block size-[10px] rounded-full bg-ink-700" />
      ))}
    </div>
  );
}

export type CodeWindowProps = {
  file: string;
  lang: string;
  code: string;
  /** O `content` do guard: é esta janela que cresce com o código. */
  ref?: (node: HTMLElement | null) => void;
};

export function CodeWindow({ file, lang, code, ref }: CodeWindowProps) {
  return (
    <div
      ref={ref}
      data-testid="code-window"
      className="rounded-[var(--slide-radius)] bg-slide-raised p-[var(--slide-pad-code)]"
    >
      {/* A barra: os pontos e o nome, com 32px entre eles e 32px até o código. O nome sai
          em caixa baixa — a exceção da §10.3. */}
      <div className="mb-[var(--slide-pad-code)] flex h-[28px] items-center gap-[var(--slide-pad-code)]">
        <Dots />
        <span className="slide-meta normal-case text-ink-400">{file}</span>
      </div>

      <div className="slide-code text-ink-200">
        <CodeLines code={code} lang={lang} />
      </div>
    </div>
  );
}
