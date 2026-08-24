/**
 * `text-bullets` — o desenvolvimento, §11.2 dos templates.
 *
 * O template mais usado de um carrossel, e o primeiro com rodapé de identidade: cabeçalho
 * no topo, itens no miolo, `Footer` na última faixa.
 *
 * As três regiões, em faixa vertical sobre o canvas:
 *
 *   Cabeçalho   80 – 230    `slide-heading`, até duas linhas
 *   Itens      294 – 1160   lista, ancorada pela opção `anchor`
 *   Rodapé    1238 – 1270   glyph, handle, constelação — o `Footer` se posiciona sozinho
 *
 * O cabeçalho é literal e os itens aceitam marcação: é a §11.2, e dentro dela ainda vale
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
import { Footer } from "@/templates/shared/footer";
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
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[80px] right-[var(--slide-pad)] left-[var(--slide-pad)] h-[150px]">
        <h2 className="slide-heading text-ink-100">{content.heading}</h2>
      </div>

      <div
        data-testid="items-region"
        data-anchor={settings.anchor}
        className={[
          "absolute top-[294px] right-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[866px] flex-col",
          settings.anchor === "top" ? "justify-start" : "justify-center",
        ].join(" ")}
      >
        <ul className="flex flex-col gap-[var(--slide-gap-item)]">
          {content.items.map((item, position) => (
            // A chave é a posição: item de lista não tem id no modelo, e a reordenação da
            // 2.6 reescreve o array inteiro de qualquer forma.
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
        showLogo={settings.showLogo}
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
