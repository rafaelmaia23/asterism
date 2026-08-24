/**
 * As variantes do experimento 5 — só para o lab, saem com a rota.
 *
 * Duas famílias, e a distinção importa para não confundir o que se está julgando:
 *
 *   GLYPHS   o desenho da peça: traço, opacidade, estrela. O que está *dentro* dela.
 *   FOOTERS  o tratamento da faixa: tamanho, cor, superfície, divisória, régua, handle.
 *
 * Tudo cabe no que a §1 do design system permite — superfície e borda, nunca sombra,
 * glow, blur ou neon. A régua e o chip são as duas únicas variantes que introduzem
 * elemento novo na faixa, e por isso são as que precisam passar pelo PDF antes de vencer.
 */

import { Chevron } from "@/templates/shared/chevron";
import { Constellation } from "@/templates/shared/constellation";
import { LabGlyph, PUBLISHED, type GlyphSpec } from "@/app/lab/footer/lab-glyph";

/** Espessura em unidades de viewBox que dá `px` pixels de slide num render de `size`. */
function strokeFor(px: number, size: number) {
  return (px * 32) / size;
}

export const GLYPHS: { id: string; note: string; spec: GlyphSpec }[] = [
  { id: "a", note: "atual — referência", spec: PUBLISHED },
  { id: "b", note: "só a opacidade cheia", spec: { ...PUBLISHED, opacity: 1 } },
  { id: "c", note: "traço 2.0", spec: { ...PUBLISHED, opacity: 1, stroke: 2 } },
  { id: "d", note: "traço 2.25 — o do chevron", spec: { ...PUBLISHED, opacity: 1, stroke: 2.25 } },
  {
    id: "e",
    note: "traço 3.0 — paridade ótica com o chevron",
    spec: { ...PUBLISHED, opacity: 1, stroke: 3 },
  },
  {
    id: "f",
    note: "traço 2.25, tinta ink-200, estrela 4.0",
    spec: { ...PUBLISHED, opacity: 1, stroke: 2.25, ink: "#e2e8f0", star: 4 },
  },
  {
    id: "g",
    note: "azure-400 inteira, traço 2.25",
    spec: { ...PUBLISHED, opacity: 1, stroke: 2.25, ink: "#60a5fa", starInk: null, star: 4 },
  },
  { id: "h", note: "traço 2.25 a 75%", spec: { ...PUBLISHED, opacity: 0.75, stroke: 2.25 } },
  {
    id: "i",
    note: "traço 3.0, pontos e estrela maiores",
    spec: { ...PUBLISHED, opacity: 1, stroke: 3, node: 2.5, star: 4.2 },
  },
];

/** A escada de tamanho, com o traço normalizado para manter 2,25px efetivos em todas. */
export const SIZES = [32, 36, 40, 44, 48].map((size) => ({
  size,
  spec: { ...PUBLISHED, opacity: 1, stroke: strokeFor(2.25, size) },
}));

/** A peça corrigida que a maioria das candidatas de rodapé usa como base. */
const FIXED: GlyphSpec = { ...PUBLISHED, opacity: 1, stroke: 2.25 };

/**
 * A escolhida na seção 2 — a variante **f**: traço 2.25 em opacidade cheia, tinta
 * `ink-200` e estrela 4.0. É ela que a seção 6 usa dentro da placa da candidata 6.
 */
export const CHOSEN: GlyphSpec = {
  ...FIXED,
  ink: "#e2e8f0",
  star: 4,
};

/**
 * O rodapé com **todas** as partes independentes, que é o modelo que a seção 6 põe à
 * prova: régua, logo, fundo da logo, handle e chevron, cada um com a própria chave.
 *
 * A propriedade que faz isso ser "bem controlável" e não só "muitas opções": **ligar ou
 * desligar qualquer peça não move as outras**. A placa é um quadrado de 56px com margem
 * vertical negativa, de modo que ela cresce para fora de uma faixa que continua tendo
 * 32px — a constelação e o handle ficam na mesma linha nos dois estados. A régua tem
 * posição própria no slide, medida da base, e não do topo da faixa.
 */
export function FullFooter({
  handle,
  index,
  total,
  showRule = true,
  showLogo = true,
  showLogoPlate = true,
  showHandle = true,
  showChevron = true,
}: {
  handle: string;
  index: number;
  total: number;
  showRule?: boolean;
  showLogo?: boolean;
  showLogoPlate?: boolean;
  showHandle?: boolean;
  showChevron?: boolean;
}) {
  const glyph = <LabGlyph spec={CHOSEN} size={32} />;

  return (
    <>
      {showRule && (
        <div
          className="absolute right-[var(--slide-pad)] bottom-[calc(var(--slide-pad)*2)] left-[var(--slide-pad)] h-px bg-ink-800"
          aria-hidden
        />
      )}

      <div className="absolute right-[var(--slide-pad)] bottom-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[32px] items-center justify-between">
        <div className="flex items-center gap-[20px]">
          {showLogo &&
            (showLogoPlate ? (
              // `-my-[12px]` tira a placa do cálculo de altura da faixa: ela cresce 12px
              // para cima e 12px para baixo sem empurrar nada.
              <span className="-my-[12px] flex size-[56px] items-center justify-center rounded-[var(--slide-radius)] border border-ink-700 bg-slide-raised">
                {glyph}
              </span>
            ) : (
              glyph
            ))}
          {showHandle && <Handle>{handle}</Handle>}
        </div>

        <div className="flex items-center gap-[20px]">
          <Constellation index={index} total={total} />
          {showChevron && index < total - 1 && <Chevron />}
        </div>
      </div>
    </>
  );
}

type FooterBand = {
  id: string;
  title: string;
  note: string;
  render: (props: { handle: string; index: number; total: number }) => React.ReactNode;
};

/** O esqueleto comum: a faixa de 32px entre os paddings, identidade à esquerda. */
function Band({
  children,
  index,
  total,
  rule = false,
  height = 32,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  rule?: boolean;
  height?: number;
}) {
  return (
    <div
      className="absolute right-[var(--slide-pad)] bottom-[var(--slide-pad)] left-[var(--slide-pad)] flex items-center justify-between"
      style={{ height }}
    >
      {rule && (
        <div className="absolute -top-[24px] right-0 left-0 h-px bg-ink-800" aria-hidden />
      )}
      {children}
      <div className="flex items-center gap-[20px]">
        <Constellation index={index} total={total} />
        {index < total - 1 && <Chevron />}
      </div>
    </div>
  );
}

function Handle({
  className = "text-ink-400",
  children = "@rafael",
}: {
  className?: string;
  children?: string;
}) {
  return <span className={`slide-meta ${className}`}>{children}</span>;
}

export const FOOTERS: FooterBand[] = [
  {
    id: "1",
    title: "Atual",
    note: "glyph 32px, traço 1.6 a 55%, gap 20px, handle ink-400. A referência.",
    render: ({ index, total }) => (
      <Band index={index} total={total}>
        <div className="flex items-center gap-[20px]">
          <LabGlyph spec={PUBLISHED} size={32} />
          <Handle />
        </div>
      </Band>
    ),
  },
  {
    id: "2",
    title: "Só a peça corrigida",
    note: "traço 2.25 em opacidade cheia. Nada mais muda — isola o efeito do desenho.",
    render: ({ index, total }) => (
      <Band index={index} total={total}>
        <div className="flex items-center gap-[20px]">
          <LabGlyph spec={FIXED} size={32} />
          <Handle />
        </div>
      </Band>
    ),
  },
  {
    id: "3",
    title: "Peça corrigida a 40px",
    note: "traço normalizado para os mesmos 2,25px efetivos. Faixa cresce para 40px.",
    render: ({ index, total }) => (
      <Band index={index} total={total} height={40}>
        <div className="flex items-center gap-[20px]">
          <LabGlyph spec={{ ...FIXED, stroke: strokeFor(2.25, 40) }} size={40} />
          <Handle />
        </div>
      </Band>
    ),
  },
  {
    id: "4",
    title: "Handle recuado",
    note: "peça corrigida e handle em ink-500: a logo ganha por contraste, não por peso.",
    render: ({ index, total }) => (
      <Band index={index} total={total}>
        <div className="flex items-center gap-[20px]">
          <LabGlyph spec={FIXED} size={32} />
          <Handle className="text-ink-500" />
        </div>
      </Band>
    ),
  },
  {
    id: "5",
    title: "Divisória",
    note: "1px ink-700 entre glyph e handle, gap 16px de cada lado. Separa os dois papéis.",
    render: ({ index, total }) => (
      <Band index={index} total={total}>
        <div className="flex items-center gap-[16px]">
          <LabGlyph spec={FIXED} size={32} />
          <span className="h-[24px] w-px bg-ink-700" aria-hidden />
          <Handle />
        </div>
      </Band>
    ),
  },
  {
    id: "6",
    title: "Chip",
    note: "glyph sobre slide-raised com borda 1px e raio 12px. A elevação sancionada da §2.2.",
    render: ({ index, total }) => (
      <Band index={index} total={total} height={56}>
        <div className="flex items-center gap-[20px]">
          <span className="flex size-[56px] items-center justify-center rounded-[var(--slide-radius)] border border-ink-700 bg-slide-raised">
            <LabGlyph spec={FIXED} size={32} />
          </span>
          <Handle />
        </div>
      </Band>
    ),
  },
  {
    id: "7",
    title: "Azure inteira",
    note: "a glyph na cor da constelação do outro lado. A faixa fecha numa cor só.",
    render: ({ index, total }) => (
      <Band index={index} total={total}>
        <div className="flex items-center gap-[20px]">
          <LabGlyph spec={{ ...FIXED, ink: "#60a5fa", starInk: null, star: 4 }} size={32} />
          <Handle />
        </div>
      </Band>
    ),
  },
  {
    id: "8",
    title: "Régua",
    note: "1px ink-800 acima da faixa, na largura útil. Dá chão ao rodapé inteiro.",
    render: ({ index, total }) => (
      <Band index={index} total={total} rule>
        <div className="flex items-center gap-[20px]">
          <LabGlyph spec={FIXED} size={32} />
          <Handle />
        </div>
      </Band>
    ),
  },
  {
    id: "9",
    title: "Handle em caixa baixa",
    note: "quebra o uppercase da slide-meta: `@rafael` em vez de `@RAFAEL`.",
    render: ({ index, total }) => (
      <Band index={index} total={total}>
        <div className="flex items-center gap-[20px]">
          <LabGlyph spec={FIXED} size={32} />
          <Handle className="text-ink-400 normal-case" />
        </div>
      </Band>
    ),
  },
  {
    id: "10",
    title: "Tudo junto",
    note: "peça a 40px em azure, divisória, handle em caixa baixa ink-300 e régua.",
    render: ({ index, total }) => (
      <Band index={index} total={total} rule height={40}>
        <div className="flex items-center gap-[16px]">
          <LabGlyph
            spec={{ ...FIXED, stroke: strokeFor(2.25, 40), ink: "#60a5fa", starInk: null, star: 4 }}
            size={40}
          />
          <span className="h-[28px] w-px bg-ink-700" aria-hidden />
          <Handle className="text-ink-300 normal-case" />
        </div>
      </Band>
    ),
  },
];
