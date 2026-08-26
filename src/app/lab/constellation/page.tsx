/**
 * Experimento 2 — o recorte da constelação acima de 10 slides. Rota **descartável**.
 *
 * Mesma forma dos experimentos 4 e 5, que resolveram a grade na 1E e o rodapé na 2B: as
 * candidatas montadas lado a lado, olhadas na escala em que vão ser vistas, e a escolha
 * feita comparando em vez de argumentando. A pasta inteira sai quando a decisão estiver
 * registrada na §10.5 do design system.
 *
 * Cinco seções, da regra ao contexto:
 *
 *   1  a regra em tabela — quais pontos acendem em cada uma das 12 posições
 *   2  a faixa isolada, 1:1, nas posições 1, 3, 7 e 12
 *   3  o rodapé inteiro, 1:1, na largura real de 1080px
 *   4  o mesmo rodapé dentro de um slide de verdade, a k = 0,28 e k = 0,5
 *   5  o contador — tinta e gap, que a §10.5 também não decide
 *
 * A seção 1 existe para separar o que é dado do que é impressão: "a janela deslizante vira
 * decoração" se lê na tabela, antes de qualquer julgamento visual. A seção 4 é a que
 * decide, pelo mesmo motivo do experimento 5 — cinco pontos contra doze é diferença de
 * densidade, e densidade se julga reduzida.
 */

import { SlideFrame } from "@/render/slide-frame";
import {
  CANDIDATES,
  COUNTER_INKS,
  LabConstellation,
  LabFooter,
  type Reading,
} from "@/app/lab/constellation/variants";

const FORMAT = { w: 1080, h: 1350 };

/** O deck fabricado que o `TODO.md` pede: doze slides, que é o teto da Etapa 2. */
const TOTAL = 12;

/** As posições que a seção 2 mostra: começo, primeiro terço, meio e fim. */
const SAMPLES = [0, 2, 6, 11];

/** A posição em que as seções 3, 4 e 5 congelam o deck — a do exemplo `03 / 12` da §10.5. */
const AT = 2;

const HANDLE = "@rafael";

/** Os pontos de uma leitura em texto, para a tabela da seção 1 não depender do olho. */
function sketch(reading: Reading, total: number): string {
  const drawn = new Map(reading.dots.map((dot) => [dot.position, dot.lit]));

  return Array.from({ length: total }, (_, position) => {
    if (!drawn.has(position)) return "·";

    return drawn.get(position) ? "●" : "○";
  }).join("");
}

/** Uma amostra de conteúdo real atrás do rodapé, para a seção 4 não julgar no vazio. */
function SlideBody() {
  return (
    <>
      <div className="absolute top-[80px] right-[var(--slide-pad)] left-[var(--slide-pad)] h-[150px]">
        <h2 className="slide-heading text-ink-100">O que o log dizia</h2>
      </div>
      <div className="absolute top-[294px] right-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[866px] flex-col justify-center">
        <ul className="flex flex-col gap-[var(--slide-gap-item)]">
          {[
            "A leitura vinha do cache, e o cache nunca expirava",
            "O teste passava porque subia com o cache vazio",
            "Ninguém tinha olhado a métrica de acerto desde a estreia",
          ].map((item) => (
            <li key={item} className="slide-body flex gap-[32px] text-ink-100">
              <span className="font-mono text-azure-radiance-400" aria-hidden>
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Section({
  n,
  title,
  lead,
  children,
}: {
  n: number;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-ink-800 pt-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-xs font-medium tracking-[0.08em] text-ink-500 uppercase">
          {n} · {title}
        </h2>
        <p className="max-w-[70ch] text-sm text-ink-400">{lead}</p>
      </div>
      {children}
    </section>
  );
}

/** O cabeçalho de uma candidata, repetido nas seções 2 a 4. */
function Tag({ id, title, note }: { id: string; title: string; note?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-azure-radiance-400">{id}</span>
      <span className="text-sm text-ink-200">{title}</span>
      {note && <span className="text-xs text-ink-500">{note}</span>}
    </div>
  );
}

/** Uma faixa isolada sobre a superfície do slide, na largura útil da §4.2. */
function Band({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="slide-canvas flex h-[64px] w-[920px] items-center justify-end bg-slide-bg"
      style={{ "--slide-scale": 1 } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default function ConstellationLab() {
  return (
    /*
     * `h-full overflow-y-auto` porque o `body` do `layout.tsx` é `h-full overflow-hidden`
     * de propósito: o editor é shell de aplicação, não documento que rola. Esta rota **é**
     * um documento, então rola por dentro. Sem isto, tudo abaixo da primeira dobra some
     * sem aviso.
     */
    <main className="mx-auto flex h-full min-h-0 max-w-[1400px] flex-col gap-12 overflow-y-auto p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-ink-100">
          Experimento 2 — o recorte da constelação
        </h1>
        <p className="max-w-[70ch] text-sm text-ink-400">
          Rota descartável. A §10.5 do design system manda, acima de 10 slides, desenhar
          cinco pontos mais um contador, e não diz quais cinco. Escolha uma candidata
          decidindo pela seção 4, e a tinta do contador pela seção 5.
        </p>
      </header>

      <Section
        n={1}
        title="A regra, em tabela"
        lead="As quatro candidatas nas doze posições do deck. Ponto cheio é aceso, vazio é
        apagado, e o ponto médio é a posição que a candidata não desenha. É aqui que se lê,
        antes de olhar: na janela deslizante o último aceso é quase sempre o mesmo ponto."
      >
        <div className="overflow-x-auto">
          <table className="w-fit border-collapse text-sm">
            <thead>
              <tr className="text-left text-ink-500">
                <th className="border-b border-ink-800 py-2 pr-8 font-medium">Slide</th>
                {CANDIDATES.map(({ id, title }) => (
                  <th key={id} className="border-b border-ink-800 py-2 pr-8 font-medium">
                    <span className="text-azure-radiance-400">{id}</span> · {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-ink-300">
              {Array.from({ length: TOTAL }, (_, index) => (
                <tr key={index}>
                  <td className="border-b border-ink-900 py-2 pr-8 font-mono tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  {CANDIDATES.map(({ id, read }) => {
                    const reading = read(index, TOTAL);

                    return (
                      <td
                        key={id}
                        className="border-b border-ink-900 py-2 pr-8 font-mono tracking-[0.15em] whitespace-nowrap"
                      >
                        {sketch(reading, TOTAL)}
                        <span className="pl-4 tracking-normal text-ink-600 tabular-nums">
                          {reading.counter ?? "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        n={2}
        title="A faixa isolada, 1:1"
        lead="Sobre o mesmo ink-950 do slide, na largura útil de 920px, nas posições 1, 3, 7
        e 12. Sem rodapé em volta: o que se julga aqui é só o desenho da constelação
        avançando pelo deck."
      >
        <div className="flex flex-col gap-8 overflow-x-auto">
          {CANDIDATES.map(({ id, title, note, read }) => (
            <div key={id} className="flex w-[920px] shrink-0 flex-col gap-3">
              <Tag id={id} title={title} note={note} />
              <div className="flex flex-col">
                {SAMPLES.map((index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-[64px] font-mono text-xs text-ink-600 tabular-nums">
                      {String(index + 1).padStart(2, "0")} / {TOTAL}
                    </span>
                    <Band>
                      <LabConstellation reading={read(index, TOTAL)} />
                    </Band>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n={3}
        title="O rodapé inteiro, 1:1"
        lead="Largura real de 1080px, com rolagem horizontal. Cada faixa é o rodapé completo
        — placa, glyph, handle, régua e chevron no lugar de verdade —, no slide 3 de 12. É
        onde se vê se o contador briga com o handle do outro lado."
      >
        <div className="flex flex-col gap-6 overflow-x-auto">
          {CANDIDATES.map(({ id, title, read }) => (
            <div key={id} className="flex w-[1080px] shrink-0 flex-col gap-2">
              <Tag id={id} title={title} />
              <div
                className="slide-canvas relative h-[280px] w-[1080px] overflow-hidden bg-slide-bg"
                style={{ "--slide-scale": 1 } as React.CSSProperties}
              >
                <LabFooter
                  handle={HANDLE}
                  index={AT}
                  total={TOTAL}
                  constellation={<LabConstellation reading={read(AT, TOTAL)} />}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n={4}
        title="Em contexto — a seção que decide"
        lead="O slide inteiro, com cada candidata no rodapé, na escala do editor (0,28) e a
        0,5. Doze pontos a k = 0,28 medem 3,4px cada, com 3,4px de gap; cinco pontos mais o
        contador ocupam outra coisa. A diferença é de densidade, e densidade se julga
        reduzida."
      >
        <div className="flex flex-wrap gap-8">
          {CANDIDATES.map(({ id, title, read }) => (
            <div key={id} className="flex flex-col gap-3">
              <Tag id={id} title={title} />
              <div className="flex items-start gap-4">
                {[0.28, 0.5].map((scale) => (
                  <div key={scale} className="flex flex-col gap-2">
                    <SlideFrame format={FORMAT} scale={scale} background="grid">
                      <SlideBody />
                      <LabFooter
                        handle={HANDLE}
                        index={AT}
                        total={TOTAL}
                        constellation={<LabConstellation reading={read(AT, TOTAL)} />}
                      />
                    </SlideFrame>
                    <span className="font-mono text-xs text-ink-600 tabular-nums">
                      k = {scale}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n={5}
        title="O contador — tinta e gap"
        lead="A §10.5 diz “um contador 03 / 12 em mono” e para por aí. O token é slide-meta,
        que é o mono da escala carrossel — 28px, versal, o mesmo do handle. Faltam a tinta e
        a distância até os pontos: três tintas × dois gaps, sobre a amostragem espalhada."
      >
        <div className="flex flex-col gap-8 overflow-x-auto">
          {COUNTER_INKS.map(({ id, note, className }) => (
            <div key={id} className="flex w-[920px] shrink-0 flex-col gap-3">
              <Tag id={id} title={note} />
              {[12, 20].map((gap) => (
                <div key={gap} className="flex items-center gap-4">
                  <span className="w-[64px] font-mono text-xs text-ink-600 tabular-nums">
                    gap {gap}
                  </span>
                  <Band>
                    <LabConstellation
                      reading={CANDIDATES[2].read(AT, TOTAL)}
                      counterInk={className}
                      counterGap={gap}
                    />
                  </Band>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
