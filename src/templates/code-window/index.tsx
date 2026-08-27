/**
 * `code-window` — código puro, §11.6 dos templates.
 *
 * Um bloco de código e o título que diz o que olhar nele. O primeiro template da
 * biblioteca cujo conteúdo não é texto do autor: o que ele desenha vem de um realçador, e
 * a cor de cada pedaço sai do tema da §10.4 do design system — **gerado** dos tokens do
 * Observatório, nunca importado pronto.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Título      80 – 230    `slide-heading`, até duas linhas
 *   Bloco      294 – 1160   a janela, centralizada nos 866px
 *   Rodapé    1238 – 1270   o `Footer` compartilhado, que se posiciona sozinho
 *
 * ## Com o cabeçalho ligado, tudo desce uma faixa
 *
 * A mesma geometria do `context` e do `text-bullets` — decisão 43. São as mesmas quatro
 * combinações de cabeçalho e título, e nas quatro o bloco acaba em 1160, no topo do
 * rodapé. Título vazio: a região some e a janela ocupa a faixa inteira, com o teto de 14
 * linhas continuando de pé. A janela ganha ar em volta, não mais linhas.
 *
 * As classes são **literais** porque o Tailwind varre o fonte: uma constante em JS não
 * chega ao CSS final. Ver a armadilha no `CLAUDE.md`.
 *
 * ## A faixa é que tem altura; a janela é que cresce
 *
 * É a marca **⌐** da §11.6, e é a armadilha da §13 do documento de contexto na sua forma
 * mais fácil de errar: a tentação é dar `h-[866px]` à janela e deixá-la ocupar a região.
 * Isso desenharia um painel vazio de 866px para quatro linhas de código, e — pior — faria
 * o que o guard mede ser dimensionado pelo que ele contém. A faixa tem altura de spec, a
 * janela tem a altura do código, e o guard compara as duas.
 */

import { useOverflowGuard } from "@/render/overflow";
import {
  codeWindowSchema,
  fields,
  options,
  type CodeWindowFields,
  type CodeWindowOptions,
} from "@/templates/code-window/fields";
import { codeWindowMeta } from "@/templates/code-window/meta";
import { CodeWindow } from "@/templates/shared/code-window";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

/**
 * A faixa do bloco, nas quatro combinações de cabeçalho e título. É a mesma tabela do
 * `context`, e por um motivo que não é coincidência: os dois têm título em cima e um só
 * bloco embaixo, e a §11.6 escreve "como no `context`" justamente para que sejam iguais.
 */
const BLOCK_BAND = {
  "false-false": "top-[80px] h-[1080px]",
  "false-true": "top-[294px] h-[866px]",
  "true-false": "top-[212px] h-[948px]",
  "true-true": "top-[426px] h-[734px]",
} as const;

function CodeWindowSlide({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<CodeWindowFields, CodeWindowOptions>) {
  const heading = content.heading.trim();
  const { region, content: block } = useOverflowGuard();

  return (
    <div className="relative h-full w-full">
      <Header kicker={content.kicker} show={settings.showHeader} />

      {heading !== "" && (
        <div
          data-testid="heading-region"
          className={[
            "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] h-[150px]",
            settings.showHeader ? "top-[212px]" : "top-[80px]",
          ].join(" ")}
        >
          <h2 className="slide-heading text-ink-100">{heading}</h2>
        </div>
      )}

      <div
        ref={region}
        data-testid="code-region"
        data-guarded
        className={[
          "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] flex flex-col justify-center",
          BLOCK_BAND[`${settings.showHeader}-${heading !== ""}`],
        ].join(" ")}
      >
        <CodeWindow ref={block} file={content.file} lang={content.lang} code={content.code} />
      </div>

      <Footer
        handle={deck.handle}
        index={index}
        total={total}
        showFooter={settings.showFooter}
        showRule={settings.showRule}
        showLogo={settings.showLogo}
        showLogoPlate={settings.showLogoPlate}
        showHandle={settings.showHandle}
        showChevron={settings.showChevron}
      />
    </div>
  );
}

export const codeWindow: TemplateDef<CodeWindowFields, CodeWindowOptions> = {
  ...codeWindowMeta,
  fields,
  options,
  schema: codeWindowSchema,
  Component: CodeWindowSlide,
};
