/**
 * `code-annotated` — código com explicação, §11.7 dos templates.
 *
 * O mesmo bloco do `code-window` com a explicação **abaixo**, nunca ao lado. Não é
 * preferência de composição: a 34px mono, uma coluna de 428px comporta 21 caracteres por
 * linha, e código nessa medida não é legível. O `compare-2col` pode dividir a largura
 * porque compara texto; o código exige os 920px.
 *
 * As quatro regiões, em faixa vertical sobre o canvas:
 *
 *   Título       80 – 230    `slide-heading`, até duas linhas
 *   Bloco ⌐     294 – 826    a janela, centralizada no que sobra
 *   Explicação ⌐ 890 – 1160  texto corrido, ancorado ao topo
 *   Rodapé     1238 – 1270   o `Footer` compartilhado, que se posiciona sozinho
 *
 * ## O único template da biblioteca com duas regiões guardadas
 *
 * Duas chamadas de `useOverflowGuard()`, uma por marca ⌐. O hook é por chamada e a chave
 * sai de `useId`, então os dois guards convivem no mesmo escopo sem nada de novo: o
 * `SlideView` agrega, e basta um dos dois reprovar para o slide ser marcado.
 *
 * ## Com o cabeçalho ligado, quem encolhe é o código
 *
 * É a única variação de cabeçalho da biblioteca que não empurra tudo por igual, e o motivo
 * é o que cada região perde ao encolher. Prosa que perde duas linhas vira pensamento
 * cortado ao meio; código que perde duas linhas é um trecho mais curto, que já era conselho
 * antes. A explicação fica em 890–1160 nas oito combinações; quem paga o cabeçalho é o
 * bloco, que cai de 532 para 400px.
 *
 * O `maxLines` do descritor continua 14 — limite é estático, e é conselho: com o cabeçalho
 * ligado o guard reprova bem antes dele, e é assim que deve ser.
 *
 * As classes são **literais** porque o Tailwind varre o fonte: uma constante em JS não
 * chega ao CSS final. Ver a armadilha no `CLAUDE.md`.
 */

import { Inline } from "@/markup/inline";
import { useOverflowGuard } from "@/render/overflow";
import {
  codeAnnotatedSchema,
  fields,
  options,
  type CodeAnnotatedFields,
  type CodeAnnotatedOptions,
} from "@/templates/code-annotated/fields";
import { codeAnnotatedMeta } from "@/templates/code-annotated/meta";
import { CodeWindow } from "@/templates/shared/code-window";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

/**
 * A faixa do bloco, nas oito combinações de cabeçalho, título e explicação.
 *
 * O **topo** é o mesmo do `code-window` e do `context` — decisão 43, a faixa do cabeçalho
 * empurrando o que está abaixo dela. O **fim** é o que este template acrescenta: 826 com a
 * explicação embaixo, 1160 sem ela. As duas coisas se compõem, e oito entradas literais
 * dizem isso melhor que três ternários numa string de classe.
 */
const BLOCK_BAND = {
  "false-false-false": "top-[80px] h-[1080px]",
  "false-false-true": "top-[80px] h-[746px]",
  "false-true-false": "top-[294px] h-[866px]",
  "false-true-true": "top-[294px] h-[532px]",
  "true-false-false": "top-[212px] h-[948px]",
  "true-false-true": "top-[212px] h-[614px]",
  "true-true-false": "top-[426px] h-[734px]",
  "true-true-true": "top-[426px] h-[400px]",
} as const;

function CodeAnnotated({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<CodeAnnotatedFields, CodeAnnotatedOptions>) {
  const heading = content.heading.trim();
  const body = content.body.trim();

  const { region: codeRegion, content: window } = useOverflowGuard();
  const { region: bodyRegion, content: paragraph } = useOverflowGuard();

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
        ref={codeRegion}
        data-testid="code-region"
        data-guarded
        className={[
          "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] flex flex-col justify-center",
          BLOCK_BAND[`${settings.showHeader}-${heading !== ""}-${body !== ""}`],
        ].join(" ")}
      >
        <CodeWindow ref={window} file={content.file} lang={content.lang} code={content.code} />
      </div>

      {/* A explicação usa o mesmo corpo e a mesma cor do `context`, porque é a mesma coisa:
          texto corrido. A largura aqui são os 920px inteiros, e não os 760 de lá — são
          quatro linhas, não oito, e a medida de linha só dói em parágrafo longo. */}
      {body !== "" && (
        <div
          ref={bodyRegion}
          data-testid="body-region"
          data-guarded
          className="absolute top-[890px] right-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[270px] flex-col justify-start"
        >
          <p ref={paragraph} className="slide-body text-ink-200">
            <Inline>{body}</Inline>
          </p>
        </div>
      )}

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

export const codeAnnotated: TemplateDef<CodeAnnotatedFields, CodeAnnotatedOptions> = {
  ...codeAnnotatedMeta,
  fields,
  options,
  schema: codeAnnotatedSchema,
  Component: CodeAnnotated,
};
