/**
 * `compare-2col` — antes/depois, §11.8 dos templates.
 *
 * Duas colunas lado a lado, com um rótulo cada. É o template mais denso da biblioteca e o
 * único com um par simétrico de campos.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Título       80 – 230    `slide-heading`, até duas linhas
 *   Colunas ⌐   294 – 1160   duas colunas, as duas ancoradas ao TOPO
 *   Rodapé     1238 – 1270   o `Footer` compartilhado, que se posiciona sozinho
 *
 * São as mesmas quatro combinações de cabeçalho e título do `context` — decisão 43 —, e
 * nas quatro as colunas acabam em 1160, no topo do rodapé.
 *
 * ## 428 + 64 + 428
 *
 * Os 64px são o `--slide-gap-block` da §4.2, o degrau sancionado para separar duas coisas
 * de igual peso, e o que sobra dos 920px úteis divide em dois. As duas colunas ancoram ao
 * topo para que os dois rótulos fiquem na mesma linha: é o que faz a comparação ser lida
 * como par e não como duas listas soltas. **Elas não se equalizam** — forçar altura igual
 * encheria a menor de espaço em branco com o rótulo pendurado longe do conteúdo.
 *
 * ## O conteúdo desce um degrau da escala
 *
 * `slide-caption` 32px, e não `slide-body` 40px: numa coluna de 428px, 40px daria 21
 * caracteres por linha contra os 28 a 42 que a §3.4 do design system pede. É o preço
 * honesto de duas colunas num canvas de 1080, e o `split-vertical` fará a mesma escolha
 * pelo mesmo motivo.
 *
 * ## As duas colunas são iguais em cor
 *
 * Nada de verde no "depois" e vermelho no "antes": a §2.5 do design system reserva verde e
 * vermelho a estado de sistema e proíbe usá-los como juízo de conteúdo. O que distingue os
 * lados são os rótulos, e o que o leitor conclui é assunto dele — por isso a coluna é um
 * componente só, chamado duas vezes.
 *
 * ## Uma região guardada, e não duas
 *
 * A §11.8 marca "Colunas ⌐" como uma linha só, e o nó que cresce é a **linha flex**: num
 * flex-row a altura é a da coluna mais alta, que é exatamente o que precisa ser comparado
 * com os 866px da faixa. Dois guards mediriam a mesma coisa por dois caminhos.
 *
 * As classes são **literais** porque o Tailwind varre o fonte: uma constante em JS não
 * chega ao CSS final. Ver a armadilha no `CLAUDE.md`.
 */

import { Inline } from "@/markup/inline";
import { useOverflowGuard } from "@/render/overflow";
import {
  compare2colSchema,
  fields,
  options,
  type Compare2colFields,
  type Compare2colOptions,
} from "@/templates/compare-2col/fields";
import { compare2colMeta } from "@/templates/compare-2col/meta";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

/** A faixa das colunas, nas quatro combinações — a mesma tabela do `context`. */
const COLUMNS_BAND = {
  "false-false": "top-[80px] h-[1080px]",
  "false-true": "top-[294px] h-[866px]",
  "true-false": "top-[212px] h-[948px]",
  "true-true": "top-[426px] h-[734px]",
} as const;

/**
 * Um lado da comparação. Os 24px entre as três peças são da §11.8, e não dos gaps da §4.2:
 * dentro da coluna o ritmo é o da coluna, como dentro da janela de código o ritmo é o do
 * `--slide-pad-code`. A régua é `slide-hairline` e não `h-px` — decisão 38, senão a linha
 * some no preview reduzido e aparece só no PDF.
 */
function Column({ side, label, children }: { side: string; label: string; children: string }) {
  return (
    <div data-testid={`column-${side}`} className="flex w-[428px] flex-col gap-[24px]">
      <span className="slide-meta text-ink-400">{label}</span>
      <div data-testid="column-rule" className="slide-hairline w-full bg-ink-700" />
      <p className="slide-caption text-ink-100">
        <Inline>{children}</Inline>
      </p>
    </div>
  );
}

function Compare2col({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<Compare2colFields, Compare2colOptions>) {
  const heading = content.heading.trim();
  const { region, content: columns } = useOverflowGuard();

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
        data-testid="columns-region"
        data-guarded
        className={[
          "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] flex flex-col justify-start",
          COLUMNS_BAND[`${settings.showHeader}-${heading !== ""}`],
        ].join(" ")}
      >
        <div
          ref={columns}
          data-testid="columns"
          className="flex items-start gap-[var(--slide-gap-block)]"
        >
          <Column side="before" label={content.beforeLabel}>
            {content.before}
          </Column>
          <Column side="after" label={content.afterLabel}>
            {content.after}
          </Column>
        </div>
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

export const compare2col: TemplateDef<Compare2colFields, Compare2colOptions> = {
  ...compare2colMeta,
  fields,
  options,
  schema: compare2colSchema,
  Component: Compare2col,
};
