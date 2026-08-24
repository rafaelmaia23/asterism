import { MaiahubGlyph } from "@/components/maiahub";
import { Chevron } from "@/templates/shared/chevron";
import { Constellation } from "@/templates/shared/constellation";

/**
 * A faixa do rodapé — §10.5 do design system e §11.0 dos templates. **Todo template a
 * tem**, e o que varia é quais peças estão acesas:
 *
 *   esquerda   `MaiahubGlyph` a 32px, gap 20px, handle em `slide-meta` `ink-400`
 *   direita    constelação de progresso, e o chevron depois dela com gap de 20px
 *
 * Três das quatro peças são opção do slide, com o descritor do template dando o padrão —
 * a forma da decisão 25, a mesma da grade. A §10.5 prendia a identidade a "todos os
 * slides exceto a capa" e o chevron a "somente a capa"; as duas frases viraram o valor
 * com que cada template nasce, e quem edita decide daí em diante.
 *
 * A **constelação não tem opção**: progresso é o que a faixa é.
 *
 * A peça de marca é a glyph, e não a `MaiahubMark` do sistema de marca, que a faixa de
 * tamanho apontaria — decisão 18 da §16 do documento de contexto. A 32px sobre `ink-950`,
 * num slide que depois é reduzido para caber num feed, a correção ótica da glyph é o que a
 * mantém legível; a `Mark` some ali, e é por isso que ela não está no projeto.
 *
 * **O rodapé se posiciona sozinho.** A faixa 1238–1270 é a mesma em todo template, então
 * `bottom: var(--slide-pad)` mora aqui em vez de repetido em cada um — mesmo argumento da
 * decisão 19 para a escala tipográfica: valor repetido em dez lugares diverge no terceiro.
 *
 * Recebe o `handle` como string, e não o `DeckMeta` inteiro: não há uso para `pillar`
 * aqui, e o kicker já estabeleceu que nada no slide é derivado de `meta`.
 */
export function Footer({
  handle,
  index,
  total,
  showLogo,
  showHandle,
  showChevron,
}: {
  handle: string;
  index: number;
  total: number;
  showLogo: boolean;
  showHandle: boolean;
  showChevron: boolean;
}) {
  // No último slide não há para onde deslizar, e a seta que convida ao próximo mentiria.
  // A regra mora aqui porque o `Footer` já recebe a posição para desenhar a constelação:
  // escrita uma vez, ela não pode divergir entre dez templates.
  const chevron = showChevron && index < total - 1;

  return (
    <div className="absolute right-[var(--slide-pad)] bottom-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[32px] items-center justify-between">
      {/* Sempre renderizado, mesmo vazio: sem filhos ele tem largura zero, o
          `justify-between` mantém a constelação na borda direita, e o `gap` só existe
          entre filhos presentes — desligar uma das duas peças não deixa buraco. */}
      <div className="flex items-center gap-[20px]">
        {showLogo && <MaiahubGlyph className="size-[32px] text-ink-100" />}
        {showHandle && <span className="slide-meta text-ink-400">{handle}</span>}
      </div>

      <div className="flex items-center gap-[20px]">
        <Constellation index={index} total={total} />
        {chevron && <Chevron />}
      </div>
    </div>
  );
}
