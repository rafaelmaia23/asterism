/**
 * `final-cta` — o fechamento, §11.3 dos templates.
 *
 * O bloco de conteúdo é ancorado à base, espelhando a capa: a série abre e fecha com o
 * mesmo gesto tipográfico. A diferença é que aqui o rodapé vem completo — glyph, handle e
 * constelação —, que é a decisão 29: o último slide é onde o handle mais importa.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Vazio      80 – 400    respiro; não é elemento, é a ausência de um
 *   Conteúdo  400 – 1160   título, lead e CTA, ancorados à BASE da região
 *   Rodapé   1238 – 1270   o `Footer` compartilhado, que se posiciona sozinho
 *
 * **O respiro é o que a região é com o cabeçalho desligado**, que é como o template nasce.
 * O `Header` da 2F cabe em 80–148 sem empurrar nada, porque os 320px acima do conteúdo já
 * estavam vazios: é o único template em que a faixa entra de graça. Ligá-la troca respiro
 * por etiqueta, e é escolha de quem edita — a §11.3 recomenda o vazio, não o obriga.
 *
 * **Lead vazio faz o bloco desaparecer junto com o gap.** O gap mora no elemento — é
 * `margin-top` do lead, não um `gap` do contêiner —, então some com ele e o CTA fica a
 * 64px do título, que é a versão mais limpa do template e uma escolha válida. Um `gap` no
 * flex não daria isso: os dois espaços são diferentes, 48px do título ao lead e 64px do
 * lead ao CTA, e um contêiner só publica um valor.
 *
 * **O CTA reusa a forma do callout, não a de um botão** — §11.3. Num PDF nada é clicável,
 * e desenhar algo com aparência de botão prometeria uma interação que não existe. Daí a
 * largura útil cheia, o raio 0 e a barra de 4px à esquerda: é um bloco de destaque, e a
 * régua vertical é o que o marca sem fingir affordance.
 *
 * O texto do CTA é `slide-code`, e não os 36px que a §11.3 escrevia — decisão 39. A escala
 * da §3.3 do design system não tem esse degrau, e a decisão 19 diz que o template escreve
 * o token em vez de recompor a escala.
 *
 * A constelação sai inteira acesa **por posição**, sem exceção aqui: como este é o último
 * slide, `index === total - 1` já acende tudo. Forçá-la no template faria o rodapé
 * discordar da lista lateral no dia em que um fechamento parasse no meio do deck — é a
 * decisão 36 aplicada à peça vizinha.
 */

import { Inline } from "@/markup/inline";
import {
  finalCtaSchema,
  fields,
  options,
  type FinalCtaFields,
  type FinalCtaOptions,
} from "@/templates/final-cta/fields";
import { finalCtaMeta } from "@/templates/final-cta/meta";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

function FinalCta({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<FinalCtaFields, FinalCtaOptions>) {
  const lead = content.lead.trim();

  return (
    <div className="relative h-full w-full">
      <Header kicker={content.kicker} show={settings.showHeader} />

      <div className="absolute top-[400px] right-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[760px] flex-col justify-end">
        <p className="slide-title text-ink-100">
          <Inline>{content.heading}</Inline>
        </p>

        {/* O lead é literal: a §11.3 dá marcação só ao fecho. */}
        {lead !== "" && (
          <p className="slide-lead mt-[var(--slide-gap-item)] text-ink-400">{lead}</p>
        )}

        <div
          data-testid="cta-block"
          className="mt-[var(--slide-gap-block)] rounded-none border-l-[4px] border-azure-radiance-400 bg-slide-surface px-[40px] py-[32px]"
        >
          <p className="slide-code text-azure-radiance-400">
            {settings.showArrow && (
              <span data-testid="cta-arrow" aria-hidden>
                {"→ "}
              </span>
            )}
            {content.cta}
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

export const finalCta: TemplateDef<FinalCtaFields, FinalCtaOptions> = {
  ...finalCtaMeta,
  fields,
  options,
  schema: finalCtaSchema,
  Component: FinalCta,
};
