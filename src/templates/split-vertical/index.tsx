/**
 * `split-vertical` — texto + imagem, §11.9 dos templates.
 *
 * O corte é **vertical**: texto à esquerda, imagem à direita, sangrando pelo topo e pela
 * borda. É o primeiro dos dois templates de mídia e o mais contido dos dois — aqui a imagem
 * acompanha o texto; no `image-caption` ela manda.
 *
 * As três regiões, em faixa sobre o canvas:
 *
 *   Texto ⌐   x 80–560     80–1160, ou 212–1160 com o cabeçalho
 *   Imagem    x 640–1080   0–1174, e não se mexe com o cabeçalho
 *   Rodapé    x 80–1000    o `Footer` compartilhado, que se posiciona sozinho
 *
 * ## 480 + 80 + 440
 *
 * Os 80px entre as duas colunas são o `--slide-pad`, o mesmo degrau que separa o conteúdo
 * da borda — é o que faz a coluna de texto ter margem igual dos dois lados. A imagem toma
 * os 440 que sobram e vai até a borda direita.
 *
 * ## A imagem para em y 1174
 *
 * Não é escolha estética: **o rodapé precisa dos 920px**. Descendo até a base, a imagem
 * deixaria à faixa apenas os 480px da coluna de texto, e a placa da logo mais o handle mais
 * doze pontos de constelação passam de 500px — não cabe, e num deck maior a constelação
 * cresce. A linha de corte é a mesma da régua da §10.5 do design system, então quando as
 * duas aparecem juntas elas se alinham. Decisão 46.
 *
 * ## Duas faixas, e não quatro
 *
 * Título e corpo moram no **mesmo bloco** centralizado, então título vazio não muda a faixa
 * — ele some junto com o gap e o corpo se recentraliza sozinho. O que move a faixa é só o
 * cabeçalho, e ele move só a coluna de texto: o kicker fica nela, e por isso a imagem não
 * se mexe.
 *
 * ## O bloco se centraliza verticalmente
 *
 * Ao lado de uma imagem de altura quase cheia, texto ancorado ao topo deixa um buraco entre
 * a última linha e o rodapé que a imagem não deixa — e a assimetria salta. É a única região
 * de texto da biblioteca centralizada **por padrão** em vez de por opção.
 *
 * ## O corpo desce um degrau da escala
 *
 * `slide-caption` 32px, e não `slide-body` 40px, pelo mesmo motivo do `compare-2col`: numa
 * coluna de 480px, 40px daria 24 caracteres por linha contra os 28 a 42 que a §3.4 do design
 * system pede. O título fica em 56px e aceita as três linhas que a coluna estreita impõe.
 *
 * As classes são **literais** porque o Tailwind varre o fonte: uma constante em JS não
 * chega ao CSS final. Ver a armadilha no `CLAUDE.md`.
 */

import { Inline } from "@/markup/inline";
import { useOverflowGuard } from "@/render/overflow";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import { ImageBand } from "@/templates/shared/image-band";
import {
  fields,
  options,
  splitVerticalSchema,
  type SplitVerticalFields,
  type SplitVerticalOptions,
} from "@/templates/split-vertical/fields";
import { splitVerticalMeta } from "@/templates/split-vertical/meta";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

/** A faixa de texto, nas duas combinações — só o cabeçalho a move. */
const TEXT_BAND = {
  false: "top-[80px] h-[1080px]",
  true: "top-[212px] h-[948px]",
} as const;

function SplitVertical({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<SplitVerticalFields, SplitVerticalOptions>) {
  const heading = content.heading.trim();
  const { region, content: block } = useOverflowGuard();

  return (
    <div className="relative h-full w-full">
      <Header kicker={content.kicker} show={settings.showHeader} />

      {/* A imagem vem antes do texto na árvore por ser o fundo da metade direita; as duas
          são absolutas e não disputam espaço, então a ordem é só de leitura. */}
      <ImageBand
        image={content.image}
        fit={settings.imageFit}
        className="top-0 right-0 h-[1174px] w-[440px]"
      />

      <div
        ref={region}
        data-testid="text-region"
        data-guarded
        className={[
          "absolute left-[var(--slide-pad)] flex w-[480px] flex-col justify-center",
          TEXT_BAND[`${settings.showHeader}`],
        ].join(" ")}
      >
        <div ref={block} data-testid="text-block" className="flex flex-col gap-[32px]">
          {heading !== "" && (
            <h2 data-testid="heading" className="slide-heading text-ink-100">
              {heading}
            </h2>
          )}

          <p className="slide-caption text-ink-200">
            <Inline>{content.body}</Inline>
          </p>
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

export const splitVertical: TemplateDef<SplitVerticalFields, SplitVerticalOptions> = {
  ...splitVerticalMeta,
  fields,
  options,
  schema: splitVerticalSchema,
  Component: SplitVertical,
};
