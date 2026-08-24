/**
 * A `MaiahubGlyph` com os parâmetros abertos — só para o experimento 5.
 *
 * A peça publicada em `src/components/maiahub/maiahub-glyph.tsx` **não é tocada** enquanto
 * a escolha não estiver feita: o lab compara, e só a vencedora volta para lá. Este arquivo
 * sai junto com a rota.
 *
 * O desenho é o mesmo, traço por traço. O que muda é o que a peça publicada fixa: a
 * espessura do traço, a opacidade dele, o raio da estrela e a tinta.
 */

export type GlyphSpec = {
  /** Em unidades do viewBox de 32. A peça publicada usa 1.6. */
  stroke: number;
  /**
   * 0 a 1, e vale **só para o traço**. A peça publicada escreve `stroke-current/55` no
   * `<path>` e `fill-current` cheio nos pontos: é o traço que está apagado, não a peça
   * inteira. Reproduzir isso exatamente é o que torna a variante de referência honesta.
   */
  opacity: number;
  /** Raio dos três pontos neutros. A peça publicada usa 2.1, em opacidade cheia. */
  node: number;
  /** Raio da estrela. A peça publicada usa 3.4. */
  star: number;
  /** Cor da tinta do traço e dos pontos. */
  ink: string;
  /** Cor da estrela. `null` faz a estrela herdar a tinta, como o `mono` da peça. */
  starInk: string | null;
};

export const PUBLISHED: GlyphSpec = {
  stroke: 1.6,
  opacity: 0.55,
  node: 2.1,
  star: 3.4,
  ink: "#f1f5f9",
  starInk: "#60a5fa",
};

/**
 * O traço efetivo em pixels de slide: o viewBox é 32, então exibida a `size` px cada
 * unidade vale `size / 32`. É a conta que revela o problema — a 32px com traço 1.6 a peça
 * desenha uma linha de 1,6px, contra 3,75px do chevron ao lado.
 */
export function effectiveStroke(spec: GlyphSpec, size: number) {
  return (spec.stroke * size) / 32;
}

/** A tinta que o traço realmente produz sobre `ink-950`, depois da opacidade. */
export function blended(spec: GlyphSpec) {
  const over = [2, 6, 23]; // ink-950 #020617
  const ink = [1, 3, 5].map((i) => parseInt(spec.ink.slice(i, i + 2), 16));
  const mix = ink.map((c, i) => Math.round(c * spec.opacity + over[i] * (1 - spec.opacity)));

  return `#${mix.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function LabGlyph({ spec, size }: { spec: GlyphSpec; size: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="maiahub"
      style={{ width: size, height: size, color: spec.ink }}
    >
      <path
        d="M6 26 L6 6 L16 16 L26 6 L26 26"
        fill="none"
        stroke="currentColor"
        strokeOpacity={spec.opacity}
        strokeWidth={spec.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Opacidade cheia, como na peça publicada: só o traço é que está apagado. */}
      <g fill="currentColor">
        <circle cx={6} cy={26} r={spec.node} />
        <circle cx={6} cy={6} r={spec.node} />
        <circle cx={26} cy={26} r={spec.node} />
      </g>
      <circle cx={26} cy={6} r={spec.star} fill={spec.starInk ?? "currentColor"} />
    </svg>
  );
}
