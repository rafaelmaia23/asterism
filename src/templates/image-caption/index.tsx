/**
 * `image-caption` — imagem dominante, §11.10 dos templates.
 *
 * A imagem manda. Sangra pelo topo, pela esquerda e pela direita, e o que sobra embaixo é
 * título, legenda e rodapé sobre o fundo do slide. É o segundo dos dois templates de mídia
 * e o oposto do `split-vertical`: lá a imagem acompanha o texto, aqui o texto explica a
 * imagem.
 *
 * As quatro regiões, em faixa vertical sobre o canvas:
 *
 *   Imagem      x 0–1080     0–910, e o resto da tabela abaixo
 *   Título ⌐    x 80–1000    974–1038, `slide-heading`, **uma** linha
 *   Legenda ⌐   x 80–1000    1070–1160, `slide-caption`, até duas linhas
 *   Rodapé      x 80–1000    o `Footer` compartilhado, que se posiciona sozinho
 *
 * ## As oito geometrias, e só a imagem se mexe
 *
 * São três interruptores — o cabeçalho, o título vazio e a legenda vazia — e o que eles
 * movem é sempre a **imagem**:
 *
 *   cabeçalho  título  legenda   imagem
 *   ---------  ------  -------   ------------
 *   off        sim     sim       0 – 910
 *   off        sim     não       0 – 910
 *   off        não     sim       0 – 910
 *   off        não     não       0 – 1174
 *   on         sim     sim       212 – 910
 *   on         sim     não       212 – 910
 *   on         não     sim       212 – 910
 *   on         não     não       212 – 1174
 *
 * **O cabeçalho corta a imagem em vez de empurrar o que está abaixo.** O 212 é o mesmo
 * número de todos os outros templates — 148 do fim da faixa mais o `--slide-gap-block` —, e
 * o que muda é a direção: o que está abaixo é o que o slide promete, e a imagem é quem tem
 * folga para ceder.
 *
 * **A legenda sobe sem crescer.** Com o título vazio a região dele some e a legenda vai para
 * 974, mantendo os 90px: eles são as duas linhas que a §11.10 promete, e é essa promessa que
 * o guard cobra. Uma faixa que crescesse até 1160 aceitaria três linhas onde o desenho quer
 * duas.
 *
 * **A imagem só desce até 1174 com os dois campos vazios.** É o teto que a §11.0 dá a
 * qualquer imagem, e o motivo é a constelação: um progresso ilegível sobre foto é pior que
 * imagem menor. Nem com `contain`, nem em nenhuma das oito, a imagem entra na faixa do
 * rodapé.
 *
 * ## A legenda é `ink-400`
 *
 * O papel de texto de apoio da §2.3 do design system, e a única região de texto da
 * biblioteca que não é `ink-100` nem `ink-200`. Ela não disputa com a imagem; explica.
 *
 * As classes são **literais** porque o Tailwind varre o fonte: uma constante em JS não
 * chega ao CSS final. Ver a armadilha no `CLAUDE.md`.
 */

import {
  fields,
  imageCaptionSchema,
  options,
  type ImageCaptionFields,
  type ImageCaptionOptions,
} from "@/templates/image-caption/fields";
import { imageCaptionMeta } from "@/templates/image-caption/meta";
import { Inline } from "@/markup/inline";
import { useOverflowGuard } from "@/render/overflow";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import { ImageBand } from "@/templates/shared/image-band";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

/**
 * A faixa da imagem, indexada por cabeçalho e por "sobrou alguma coisa embaixo".
 *
 * Título e legenda não têm entrada própria porque não movem a imagem separadamente: o que a
 * deixa descer é os **dois** estarem vazios.
 */
const IMAGE_BAND = {
  "false-true": "top-0 h-[910px]",
  "false-false": "top-0 h-[1174px]",
  "true-true": "top-[212px] h-[698px]",
  "true-false": "top-[212px] h-[962px]",
} as const;

function ImageCaption({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<ImageCaptionFields, ImageCaptionOptions>) {
  const heading = content.heading.trim();
  const caption = content.caption.trim();

  // Duas chamadas, uma por marca ⌐. O hook é por chamada e a chave sai do `useId`, então os
  // dois guards convivem no mesmo escopo e basta um reprovar — é o mesmo arranjo do
  // `code-annotated`, o primeiro template a marcar duas regiões.
  const { region: headingRegion, content: title } = useOverflowGuard();
  const { region: captionRegion, content: paragraph } = useOverflowGuard();

  /** O que a imagem cede: o cabeçalho pelo topo, e sobrar texto embaixo pela base. */
  const band = IMAGE_BAND[`${settings.showHeader}-${heading !== "" || caption !== ""}`];

  return (
    <div className="relative h-full w-full">
      <ImageBand
        image={content.image}
        fit={settings.imageFit}
        className={`right-0 left-0 ${band}`}
      />

      {/* O cabeçalho vem depois da imagem na árvore para desenhar **sobre** o fundo do
          slide, e não sob a faixa que a imagem corta. */}
      <Header kicker={content.kicker} show={settings.showHeader} />

      {heading !== "" && (
        <div
          ref={headingRegion}
          data-testid="heading-region"
          data-guarded
          className="absolute top-[974px] right-[var(--slide-pad)] left-[var(--slide-pad)] h-[64px]"
        >
          <h2 ref={title} data-testid="heading" className="slide-heading text-ink-100">
            {heading}
          </h2>
        </div>
      )}

      {caption !== "" && (
        <div
          ref={captionRegion}
          data-testid="caption-region"
          data-guarded
          className={[
            "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] h-[90px]",
            heading === "" ? "top-[974px]" : "top-[1070px]",
          ].join(" ")}
        >
          <p ref={paragraph} data-testid="caption" className="slide-caption text-ink-400">
            <Inline>{caption}</Inline>
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

export const imageCaption: TemplateDef<ImageCaptionFields, ImageCaptionOptions> = {
  ...imageCaptionMeta,
  fields,
  options,
  schema: imageCaptionSchema,
  Component: ImageCaption,
};
