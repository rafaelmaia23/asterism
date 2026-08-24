import { cn } from "@/lib/utils";
import type { MaiahubLogoProps } from "./logo-shared";

/**
 * Versão simplificada para tamanho pequeno: sem o vértice central, traço mais grosso,
 * pontos proporcionalmente maiores. Mesma lógica ótica do favicon.
 *
 * É a única peça de marca que o asterism carrega — as outras quatro saíram na 2.4a, sem
 * uso. O rodapé do slide a usa a 32px, acima da faixa de 16–24px que a documentação da
 * marca lhe dá: desvio consciente da decisão 18 da §16 do documento de contexto, porque
 * sobre `ink-950` num slide que depois é reduzido, a peça de traço grosso é a que
 * sobrevive. Ver `docs/maiahub-logo.md`.
 *
 * **O traço e a estrela foram engrossados no experimento 5.** O desenho original tinha
 * traço 1.6 a 55% de opacidade, o que a 32px rendia uma linha de 1,6px em ≈`#858993` — a
 * mais fina e a mais apagada do slide inteiro, contra 3,75px do chevron ao lado e 2px da
 * linha da grade. A correção ótica que justifica a glyph existir simplesmente não ia
 * longe o bastante para o tamanho em que ela é usada aqui. Agora são 2.25 em opacidade
 * cheia, com a estrela em 4.0. Nas miniaturas de 16px isso dá 1,1px efetivo, que continua
 * dentro do que a peça foi feita para fazer.
 */
export function MaiahubGlyph({ className, mono = false, ...props }: MaiahubLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="maiahub"
      className={cn("size-5 text-foreground", className)}
      {...props}
    >
      <path
        d="M6 26 L6 6 L16 16 L26 6 L26 26"
        fill="none"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current"
      />
      <g className="fill-current">
        <circle cx={6} cy={26} r={2.1} />
        <circle cx={6} cy={6} r={2.1} />
        <circle cx={26} cy={26} r={2.1} />
      </g>
      <circle cx={26} cy={6} r={4} className={mono ? "fill-current" : "fill-azure-radiance-400"} />
    </svg>
  );
}
