/**
 * `context` — segurar o leitor, §11.4 dos templates.
 *
 * O segundo slide do carrossel, e o único de texto corrido da biblioteca. A capa fez uma
 * declaração; este parágrafo é onde ela ganha o chão que a torna verdadeira. É também a
 * linha de base do miolo: o `code-annotated` e o `split-vertical` reusam a mesma chave
 * `body`, e trocar entre os três preserva o que foi escrito.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Título      80 – 230    `slide-heading`, até duas linhas
 *   Corpo      294 – 1160   texto corrido, ancorado ao TOPO da região
 *   Rodapé    1238 – 1270   o `Footer` compartilhado, que se posiciona sozinho
 *
 * ## Com o cabeçalho ligado, tudo desce uma faixa
 *
 * A mesma geometria do `text-bullets`, e de propósito: os dois são o miolo do carrossel, e
 * um deles empurrar 132px enquanto o outro reserva a faixa seria uma diferença sem motivo
 * entre slides vizinhos. É a decisão 43 valendo para o segundo template com conteúdo colado
 * no topo.
 *
 *   Kicker      80 – 148    o `Header` compartilhado
 *   Título     212 – 362    a mesma altura de 150px, 132px abaixo
 *   Corpo      426 – 1160   o mesmo fim, 734px em vez de 866
 *
 * ## Título vazio: a região some e o corpo sobe
 *
 * O comportamento que o `lead` do `final-cta` já tinha desde a 2C, e que a 3A generalizou
 * para os dez na §11.0 — `heading` é declarado por todos, inclusive onde o valor pode não
 * existir. Sobe para **80** com o cabeçalho desligado e para **212** com ele ligado: a
 * faixa do topo continua ocupada, e o corpo toma o que sobra. São quatro combinações, e
 * nas quatro o corpo acaba em 1160, no topo do rodapé.
 *
 * As classes são **literais** porque o Tailwind varre o fonte: uma constante em JS não
 * chega ao CSS final. Ver a armadilha no `CLAUDE.md`.
 *
 * **A linha para em 760px**, não nos 920px úteis. A §3.4 do design system pede entre 28 e
 * 42 caracteres por linha: em `slide-body` 40px, 920px dão cerca de 46 e 760px dão cerca de
 * 38. É a única região da biblioteca em que a medida de linha aperta de verdade, porque é a
 * única com parágrafo de várias linhas — num item de lista de duas linhas a conta não dói.
 * O que sobra à direita é respiro, não sobra.
 *
 * O corpo é `ink-200` e não `ink-100`: são muitas linhas seguidas, e o degrau abaixo do
 * título separa os dois sem precisar de peso nem de cor.
 *
 * A região do corpo é a que o guard de transbordo mede — o **⌐** da §11.4. A faixa é quem
 * tem altura; o `<p>` é quem cresce.
 */

import { Inline } from "@/markup/inline";
import { useOverflowGuard } from "@/render/overflow";
import {
  contextSchema,
  fields,
  options,
  type ContextFields,
  type ContextOptions,
} from "@/templates/context/fields";
import { contextMeta } from "@/templates/context/meta";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

/**
 * A faixa do corpo, nas quatro combinações de cabeçalho e título. Escrita como tabela
 * porque é isso que ela é — e porque quatro ternários aninhados numa string de classe
 * seriam ilegíveis no lugar exato em que a geometria do template mora.
 */
const BODY_BAND = {
  "false-false": "top-[80px] h-[1080px]",
  "false-true": "top-[294px] h-[866px]",
  "true-false": "top-[212px] h-[948px]",
  "true-true": "top-[426px] h-[734px]",
} as const;

function Context({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<ContextFields, ContextOptions>) {
  const heading = content.heading.trim();
  const { region, content: block } = useOverflowGuard();

  return (
    <div className="relative h-full w-full">
      <Header kicker={content.kicker} show={settings.showHeader} />

      {/* O título é literal: a §11.4 dá marcação só ao parágrafo. */}
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
        data-testid="body-region"
        data-guarded
        className={[
          "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] flex flex-col justify-start",
          BODY_BAND[`${settings.showHeader}-${heading !== ""}`],
        ].join(" ")}
      >
        <p ref={block} className="slide-body max-w-[760px] text-ink-200">
          <Inline>{content.body}</Inline>
        </p>
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

export const context: TemplateDef<ContextFields, ContextOptions> = {
  ...contextMeta,
  fields,
  options,
  schema: contextSchema,
  Component: Context,
};
