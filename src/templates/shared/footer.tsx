import { MaiahubGlyph } from "@/components/maiahub";
import { Constellation } from "@/templates/shared/constellation";

/**
 * Rodapé fixo — §10.5 do design system e §11.0 dos templates. Presente em todos os
 * slides exceto a capa: `MaiahubGlyph` a 32px, gap 20px, handle em `slide-meta` `ink-400`
 * à esquerda; constelação à direita.
 *
 * A peça é a glyph, e não a `MaiahubMark` que a faixa de tamanho apontaria — decisão 18
 * da §16 do documento de contexto. A 32px sobre `ink-950`, num slide que depois é
 * reduzido para caber num feed, a correção ótica da glyph é o que a mantém legível.
 *
 * **O rodapé se posiciona sozinho.** A faixa 1238–1270 é a mesma em todo template que o
 * tem, então `bottom: 80px` mora aqui em vez de repetido em cada um — mesmo argumento da
 * decisão 19 para a escala tipográfica: valor repetido em dez lugares diverge no
 * terceiro. A capa é a exceção que confirma, e por isso não usa este componente: a linha
 * dela não é um rodapé de identidade, é constelação mais chevron.
 *
 * Recebe o `handle` como string, e não o `DeckMeta` inteiro: não há uso para `pillar`
 * aqui, e o kicker já estabeleceu que nada no slide é derivado de `meta`.
 */
export function Footer({
  handle,
  index,
  total,
}: {
  handle: string;
  index: number;
  total: number;
}) {
  return (
    <div className="absolute right-[var(--slide-pad)] bottom-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[32px] items-center justify-between">
      <div className="flex items-center gap-[20px]">
        <MaiahubGlyph className="size-[32px] text-ink-100" />
        <span className="slide-meta text-ink-400">{handle}</span>
      </div>

      <Constellation index={index} total={total} />
    </div>
  );
}
