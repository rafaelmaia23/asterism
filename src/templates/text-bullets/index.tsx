/**
 * `text-bullets` — o desenvolvimento, §11.2 dos templates.
 *
 * O template mais usado de um carrossel, e o primeiro com rodapé de identidade: título no
 * topo, itens no miolo, `Footer` na última faixa.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Título      80 – 230    `slide-heading`, até duas linhas
 *   Itens      294 – 1160   lista, ancorada pela opção `anchor`
 *   Rodapé    1238 – 1270   glyph, handle, constelação — o `Footer` se posiciona sozinho
 *
 * ## Com o kicker ligado, tudo desce uma faixa
 *
 * É o único dos três templates em que o cabeçalho compartilhado disputa espaço: a região
 * 80–230 já é do título do slide. Ligado o `showHeader`, o kicker toma 80–148 e as duas
 * regiões de baixo descem um `--slide-gap-block`:
 *
 *   Kicker      80 – 148    o `Header` compartilhado, que se posiciona sozinho
 *   Título     212 – 362    a mesma altura de 150px, 132px abaixo
 *   Itens      426 – 1160   o mesmo fim, 734px em vez de 866
 *
 * **Empurrar só quando ligado**, em vez de reservar a faixa sempre, é a decisão 43. As duas
 * variantes custam um ternário; reservar sempre custaria 132px do topo do template mais
 * usado do sistema, permanentemente, para uma faixa que nasce desligada aqui. É a única
 * quebra da regra "ligar uma peça não move as outras" que o rodapé estabeleceu na 2B, e ela
 * vale porque o rodapé nunca disputou espaço com nada: mover o que está embaixo dele seria
 * mover o nada.
 *
 * Os números saem do ritmo que o template já tinha — `--slide-pad` 80, faixa do kicker 68,
 * `--slide-gap-block` 64 — e são classes **literais** porque o Tailwind varre o fonte: uma
 * constante em JS não chega ao CSS final. Ver a armadilha no `CLAUDE.md`.
 *
 * Quatro itens de duas linhas ocupam 624px, então continuam cabendo nos 734.
 *
 * A região dos itens é a que o guard de transbordo mede — o **⌐** da §11.2 —, e é o
 * template em que ela muda de tamanho: o mesmo conteúdo pode caber nos 866 e estourar nos
 * 734 quando o cabeçalho liga. A faixa é quem tem altura; a `<ul>` é quem cresce.
 *
 * O título é literal e os itens aceitam marcação: é a §11.2, e dentro dela ainda vale
 * a regra de um nível de ênfase por bloco da §3.4 do design system — negrito, código e
 * marca-texto no mesmo slide se anulam.
 *
 * **`anchor: "center"` centraliza o bloco, não distribui os itens.** O gap de 48px da
 * tabela de elementos é valor, não mínimo: com dois itens ou com quatro, a distância
 * entre eles é a mesma, e o que muda é onde o bloco pousa dentro da faixa.
 *
 * O marcador é travessão, não bolinha — bolinha lê como apresentação corporativa. Ele
 * troca só a família tipográfica: o tamanho e a altura descem por herança do `<li>`, que
 * é quem carrega o `slide-body`, e nada aqui recompõe a escala da §3.3.
 */

import { Inline } from "@/markup/inline";
import { useOverflowGuard } from "@/render/overflow";
import { Footer } from "@/templates/shared/footer";
import { Header } from "@/templates/shared/header";
import {
  textBulletsSchema,
  fields,
  options,
  type BulletsFields,
  type BulletsOptions,
} from "@/templates/text-bullets/fields";
import { textBulletsMeta } from "@/templates/text-bullets/meta";
import type { TemplateComponentProps, TemplateDef } from "@/templates/types";

function TextBullets({
  fields: content,
  options: settings,
  deck,
  index,
  total,
}: TemplateComponentProps<BulletsFields, BulletsOptions>) {
  const { region, content: block } = useOverflowGuard();

  return (
    <div className="relative h-full w-full">
      <Header kicker={content.kicker} show={settings.showHeader} />

      <div
        data-testid="heading-region"
        className={[
          "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] h-[150px]",
          settings.showHeader ? "top-[212px]" : "top-[80px]",
        ].join(" ")}
      >
        <h2 className="slide-heading text-ink-100">{content.heading}</h2>
      </div>

      <div
        ref={region}
        data-testid="items-region"
        data-guarded
        data-anchor={settings.anchor}
        className={[
          "absolute right-[var(--slide-pad)] left-[var(--slide-pad)] flex flex-col",
          settings.showHeader ? "top-[426px] h-[734px]" : "top-[294px] h-[866px]",
          settings.anchor === "top" ? "justify-start" : "justify-center",
        ].join(" ")}
      >
        <ul ref={block} className="flex flex-col gap-[var(--slide-gap-item)]">
          {content.items.map((item, position) => (
            // A chave é a posição: item de lista não tem id no modelo, e reordenar no
            // inspector reescreve o array inteiro de qualquer forma.
            <li key={position} className="slide-body flex gap-[32px] text-ink-100">
              <span className="font-mono text-azure-radiance-400" aria-hidden>
                —
              </span>
              <span>
                <Inline>{item}</Inline>
              </span>
            </li>
          ))}
        </ul>
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

export const textBullets: TemplateDef<BulletsFields, BulletsOptions> = {
  ...textBulletsMeta,
  fields,
  options,
  schema: textBulletsSchema,
  Component: TextBullets,
};
