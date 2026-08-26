/**
 * As candidatas do experimento 2 — só para o lab, saem com a rota.
 *
 * A §10.5 do design system manda, acima de 10 slides, desenhar "5 pontos mais um contador
 * `03 / 12`" e não diz **quais cinco**. O `TODO.md` lista três leituras; a quarta entrada
 * aqui é o controle, o comportamento de hoje, porque sem ele não há como saber se o
 * recorte melhora a faixa ou só a encolhe.
 *
 * Cada candidata é uma função pura `(index, total) => Reading`. É de propósito: a que
 * vencer é copiada para `constellation.tsx` como está, sem tradução no meio, e a tabela da
 * seção 1 da página se monta chamando as quatro sobre as doze posições.
 */

import { MaiahubGlyph } from "@/components/maiahub";
import { Chevron } from "@/templates/shared/chevron";

/** Acima disto o recorte entra. A §10.5 diz "acima de 10 slides", então 11 é o primeiro. */
export const CROP_ABOVE = 10;

/** Quantos pontos o recorte deixa. Também da §10.5. */
export const DOTS = 5;

export type Dot = { position: number; lit: boolean };
export type Reading = { dots: Dot[]; counter: string | null };

/**
 * `03 / 12` — a contagem é sempre a real, quantos pontos quer que sejam desenhados. Dois
 * dígitos é o piso; um deck de mais de 99 slides não existe, mas o `padStart` não custa.
 */
function counterFor(index: number, total: number): string {
  const width = Math.max(2, String(total).length);

  return `${String(index + 1).padStart(width, "0")} / ${String(total).padStart(width, "0")}`;
}

function dotsFrom(positions: number[], index: number): Dot[] {
  return positions.map((position) => ({ position, lit: position <= index }));
}

function range(from: number, count: number): number[] {
  return Array.from({ length: count }, (_, offset) => from + offset);
}

/** A — os cinco primeiros pontos do deck, sempre os mesmos. */
function firstFive(index: number, total: number): Reading {
  return {
    dots: dotsFrom(range(0, DOTS), index),
    counter: counterFor(index, total),
  };
}

/** B — cinco em torno do atual, presos nas duas pontas. */
function slidingWindow(index: number, total: number): Reading {
  const start = Math.min(Math.max(index - 2, 0), total - DOTS);

  return {
    dots: dotsFrom(range(start, DOTS), index),
    counter: counterFor(index, total),
  };
}

/**
 * C — cinco posições espalhadas pelo deck, a primeira e a última sempre incluídas. Num
 * deck de 12 dá 1, 4, 7, 10, 12 — o exemplo que o `TODO.md` escreve.
 */
function spread(index: number, total: number): Reading {
  const positions = Array.from({ length: DOTS }, (_, slot) =>
    Math.round((slot * (total - 1)) / (DOTS - 1)),
  );

  return { dots: dotsFrom(positions, index), counter: counterFor(index, total) };
}

/** D — o controle: um ponto por slide, sem contador. É o `Constellation` de hoje. */
function everyDot(index: number, total: number): Reading {
  return { dots: dotsFrom(range(0, total), index), counter: null };
}

/** Abaixo do limiar as quatro coincidem — o recorte não existe ali, e é o que as amarra. */
function withThreshold(read: (index: number, total: number) => Reading) {
  return (index: number, total: number): Reading =>
    total > CROP_ABOVE ? read(index, total) : everyDot(index, total);
}

export const CANDIDATES: {
  id: string;
  title: string;
  note: string;
  read: (index: number, total: number) => Reading;
}[] = [
  {
    id: "a",
    title: "Cinco primeiros",
    note: "Para de comunicar progresso a partir do sexto slide",
    read: withThreshold(firstFive),
  },
  {
    id: "b",
    title: "Janela deslizante",
    note: "O último aceso é quase sempre o mesmo ponto — a constelação vira decoração",
    read: withThreshold(slidingWindow),
  },
  {
    id: "c",
    title: "Amostragem espalhada",
    note: "Mantém o progresso, perde a contagem — que o contador ao lado já cobre",
    read: withThreshold(spread),
  },
  {
    id: "d",
    title: "Controle — um ponto por slide",
    note: "O comportamento de hoje, sem recorte e sem contador",
    read: everyDot,
  },
];

/** As candidatas de tinta do contador, que a §10.5 também não decide. */
export const COUNTER_INKS = [
  { id: "ink-400", note: "a mesma tinta do handle", className: "text-ink-400" },
  { id: "ink-500", note: "um degrau abaixo — o contador recua", className: "text-ink-500" },
  {
    id: "azure-400",
    note: "a tinta dos pontos acesos — o contador se junta à constelação",
    className: "text-azure-radiance-400",
  },
];

/**
 * A constelação de uma candidata. Os 12px de diâmetro, o gap de 12px e as duas tintas são
 * os da §10.5 e do componente publicado; o que varia aqui é só quais pontos aparecem.
 */
export function LabConstellation({
  reading,
  counterInk = "text-ink-400",
  counterGap = 20,
}: {
  reading: Reading;
  counterInk?: string;
  counterGap?: number;
}) {
  return (
    <div className="flex items-center" style={{ gap: counterGap }}>
      <div className="flex items-center gap-[12px]">
        {reading.dots.map(({ position, lit }) => (
          <span
            key={position}
            className={[
              "size-[12px] rounded-full",
              lit ? "bg-azure-radiance-400" : "bg-ink-700",
            ].join(" ")}
          />
        ))}
      </div>
      {reading.counter && (
        <span className={`slide-meta tabular-nums ${counterInk}`}>{reading.counter}</span>
      )}
    </div>
  );
}

/**
 * O rodapé do lab. É o `footer.tsx` publicado, linha por linha, com um só ponto de troca:
 * a constelação chega por prop. Copiar vinte linhas numa rota descartável é mais barato
 * que abrir um buraco de injeção no componente de verdade para um experimento.
 */
export function LabFooter({
  handle,
  index,
  total,
  constellation,
}: {
  handle: string;
  index: number;
  total: number;
  constellation: React.ReactNode;
}) {
  return (
    <>
      <div className="slide-hairline absolute right-[var(--slide-pad)] bottom-[calc(var(--slide-pad)+32px+var(--slide-gap-block))] left-[var(--slide-pad)] bg-ink-600" />

      <div className="absolute right-[var(--slide-pad)] bottom-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[32px] items-center justify-between">
        <div className="flex items-center gap-[20px]">
          <span className="-my-[12px] flex size-[56px] items-center justify-center rounded-[var(--slide-radius)] border border-ink-700 bg-slide-raised">
            <MaiahubGlyph className="size-[32px] text-ink-200" />
          </span>
          <span className="slide-meta text-ink-400">{handle}</span>
        </div>

        <div className="flex items-center gap-[20px]">
          {constellation}
          {index < total - 1 && <Chevron />}
        </div>
      </div>
    </>
  );
}
