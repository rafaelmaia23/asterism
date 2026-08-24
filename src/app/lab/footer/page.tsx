/**
 * Experimento 5 — o rodapé e a peça de logo. Rota **descartável**.
 *
 * Mesma forma do experimento 4, que resolveu a grade na 1E: as candidatas montadas lado a
 * lado, olhadas na escala em que vão ser vistas, e a escolha feita comparando em vez de
 * argumentando. A pasta inteira sai quando a decisão estiver registrada.
 *
 * Cinco seções, da medida ao contexto:
 *
 *   1  a medida — por que a peça parece morta, em número e não em adjetivo
 *   2  a peça sozinha, 1:1 a 32px sobre o fundo do slide
 *   3  a escada de tamanho, com o traço normalizado
 *   4  o rodapé inteiro, 1:1, na largura real de 1080px
 *   5  o mesmo rodapé dentro de um slide de verdade, nas escalas em que ele é visto
 *   6  os dois slides completos, com as cinco peças acesas
 *   7  a cor da régua, depois de a medição do PDF explicar por que ela sumia
 *
 * A seção 5 é a que decidiu a peça. "Some no feed" é uma percepção da imagem **reduzida**,
 * e é por isso que ela reusa o `SlideFrame` de verdade em vez de desenhar um retângulo: a
 * escala do editor é 0,28, e nenhuma comparação a 1:1 responde por ela.
 */

import { SlideFrame } from "@/render/slide-frame";
import { LabGlyph, PUBLISHED, blended, effectiveStroke } from "@/app/lab/footer/lab-glyph";
import {
  FOOTERS,
  FullFooter,
  GLYPHS,
  RULE_COLORS,
  SIZES,
} from "@/app/lab/footer/variants";

const FORMAT = { w: 1080, h: 1350 };

/**
 * O recorte 1:1 da seção 7: a faixa y 1140–1290 do slide, na resolução em que o PDF sai.
 *
 * É um `SlideFrame` a k = 1 dentro de uma janela de 150px de altura, com o slide deslocado
 * para cima. Assim o que se vê é o pixel de verdade — a régua em 1174 e, 15px abaixo, a
 * linha da grade em 1189 —, e não uma reconstrução aproximada da faixa.
 */
function RuleCrop({ color, grid }: { color: string; grid: boolean }) {
  return (
    <div className="relative h-[150px] w-[1080px] overflow-hidden">
      {/* -1141 e não -1140: o `SlideFrame` põe uma borda de 1px por fora do canvas, então
          a coordenada 0 do slide começa 1px adiante do topo do quadro externo. */}
      <div className="absolute top-[-1141px] left-0">
        <SlideFrame format={FORMAT} scale={1} background={grid ? "grid" : "plain"}>
          <SlideBody />
          <FullFooter handle="@rafael" index={3} total={5} ruleColor={color} />
        </SlideFrame>
      </div>
    </div>
  );
}

/** Uma amostra de conteúdo real atrás do rodapé, para a seção 5 não julgar no vazio. */
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

/** A capa, para a seção 6: é o slide que nunca teve identidade, e agora pode ter. */
function CoverBody() {
  return (
    <>
      <div className="absolute top-[80px] left-[var(--slide-pad)] flex h-[68px] items-start">
        <span className="slide-meta text-azure-radiance-400">log/ · 01</span>
      </div>
      <div className="absolute top-[300px] right-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[860px] items-end">
        <p className="slide-display text-ink-100">
          O cache <span className="text-azure-radiance-400">mentiu</span> sobre o que ele
          guardava
        </p>
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

export default function FooterLab() {
  return (
    /*
     * `h-full overflow-y-auto` porque o `body` do `layout.tsx` é `h-full overflow-hidden`
     * de propósito: o editor é shell de aplicação, não documento que rola, e é isso que
     * impede o canvas de empurrar a área que o mede — §13 do documento de contexto. Esta
     * rota **é** um documento, então ela rola por dentro, que é o que aquele mesmo
     * comentário manda fazer. Sem isto, tudo abaixo da primeira dobra some sem aviso.
     */
    <main className="mx-auto flex h-full min-h-0 max-w-[1400px] flex-col gap-12 overflow-y-auto p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-ink-100">
          Experimento 5 — o rodapé do slide
        </h1>
        <p className="max-w-[70ch] text-sm text-ink-400">
          Rota descartável. Escolha uma candidata da seção 4 decidindo pela seção 5, que é
          onde a escala do editor mostra o que 1:1 esconde.
        </p>
      </header>

      <Section
        n={1}
        title="A medida"
        lead="A glyph desenha a linha mais fina e mais apagada do slide inteiro. O traço dela é
        dado em unidades de um viewBox de 32, então exibida a 32px cada unidade vale 1px —
        e o chevron ao lado, num viewBox de 24 exibido a 40px, multiplica o dele por 1,67."
      >
        <table className="w-fit border-collapse text-sm">
          <thead>
            <tr className="text-left text-ink-500">
              <th className="border-b border-ink-800 py-2 pr-8 font-medium">Elemento</th>
              <th className="border-b border-ink-800 py-2 pr-8 font-medium">Traço no slide</th>
              <th className="border-b border-ink-800 py-2 font-medium">Tinta resultante</th>
            </tr>
          </thead>
          <tbody className="text-ink-300">
            <tr>
              <td className="border-b border-ink-900 py-2 pr-8">Glyph, a 32px</td>
              <td className="border-b border-ink-900 py-2 pr-8 font-mono tabular-nums">
                {effectiveStroke(PUBLISHED, 32).toFixed(2)}px
              </td>
              <td className="border-b border-ink-900 py-2 font-mono">
                {blended(PUBLISHED)} — entre ink-500 e ink-400
              </td>
            </tr>
            <tr>
              <td className="border-b border-ink-900 py-2 pr-8">Chevron, a 40px</td>
              <td className="border-b border-ink-900 py-2 pr-8 font-mono tabular-nums">
                {((2.25 * 40) / 24).toFixed(2)}px
              </td>
              <td className="border-b border-ink-900 py-2 font-mono">#60a5fa</td>
            </tr>
            <tr>
              <td className="border-b border-ink-900 py-2 pr-8">Linha da grade</td>
              <td className="border-b border-ink-900 py-2 pr-8 font-mono tabular-nums">2.00px</td>
              <td className="border-b border-ink-900 py-2 font-mono">#1e293b</td>
            </tr>
            <tr>
              <td className="py-2 pr-8">Handle, `slide-meta`</td>
              <td className="py-2 pr-8 font-mono tabular-nums">— chapado</td>
              <td className="py-2 font-mono">#94a3b8 — ink-400</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section
        n={2}
        title="A peça, 1:1 a 32px"
        lead="Sobre o mesmo ink-950 do slide. A variante (a) é idêntica à peça publicada,
        traço por traço — inclusive a opacidade valendo só para o traço, e não para os
        pontos, que saem cheios."
      >
        <div className="flex flex-wrap gap-8 rounded-[8px] bg-slide-bg p-8">
          {GLYPHS.map(({ id, note, spec }) => (
            <div key={id} className="flex w-[180px] flex-col gap-3">
              <div className="flex h-[48px] items-center">
                <LabGlyph spec={spec} size={32} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-azure-radiance-400">{id}</span>
                <span className="text-xs text-ink-400">{note}</span>
                <span className="font-mono text-xs text-ink-600 tabular-nums">
                  {effectiveStroke(spec, 32).toFixed(2)}px · {blended(spec)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n={3}
        title="Escada de tamanho"
        lead="Traço normalizado para 2,25px efetivos em todas: o que varia é só o tamanho.
        É o que separa “está pequena” de “está fina”."
      >
        <div className="flex flex-wrap items-end gap-10 rounded-[8px] bg-slide-bg p-8">
          {SIZES.map(({ size, spec }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <LabGlyph spec={spec} size={size} />
              <span className="font-mono text-xs text-ink-500 tabular-nums">{size}px</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n={4}
        title="O rodapé inteiro, 1:1"
        lead="Largura real de 1080px, com rolagem horizontal. Cada faixa é o rodapé completo,
        com constelação e chevron no lugar de verdade — o quarto slide de cinco, para a seta
        aparecer."
      >
        <div className="flex flex-col gap-6 overflow-x-auto">
          {FOOTERS.map(({ id, title, note, render }) => (
            <div key={id} className="flex w-[1080px] shrink-0 flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-azure-radiance-400">{id}</span>
                <span className="text-sm text-ink-200">{title}</span>
                <span className="text-xs text-ink-500">{note}</span>
              </div>
              <div
                className="slide-canvas relative h-[240px] w-[1080px] overflow-hidden bg-slide-bg"
                style={{ "--slide-scale": 1 } as React.CSSProperties}
              >
                {render({ handle: "@rafael", index: 3, total: 5 })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n={5}
        title="Em contexto — a seção que decide"
        lead="O mesmo slide inteiro, com cada candidata no rodapé, na escala do editor (0,28)
        e a 0,5. “Some no feed” é percepção da imagem reduzida: se a diferença desaparece
        aqui, ela não existe."
      >
        <div className="flex flex-wrap gap-8">
          {FOOTERS.map(({ id, title, render }) => (
            <div key={id} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-azure-radiance-400">{id}</span>
                <span className="text-xs text-ink-400">{title}</span>
              </div>
              <div className="flex items-start gap-4">
                {[0.28, 0.5].map((scale) => (
                  <div key={scale} className="flex flex-col gap-2">
                    <SlideFrame format={FORMAT} scale={scale}>
                      <SlideBody />
                      {render({ handle: "@rafael", index: 3, total: 5 })}
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
        n={6}
        title="Os dois slides completos, com tudo ligado"
        lead="A peça f dentro da placa da candidata 6, mais a régua, o handle, a constelação e
        o chevron — as cinco partes acesas ao mesmo tempo, numa capa e num slide de miolo.
        É o teto do que o rodapé pode mostrar; qualquer combinação real vai ser mais quieta
        que esta."
      >
        <div className="flex flex-wrap gap-8">
          {[
            { id: "capa", title: "cover-statement", body: <CoverBody /> },
            { id: "miolo", title: "text-bullets", body: <SlideBody /> },
          ].map(({ id, title, body }) => (
            <div key={id} className="flex flex-col gap-3">
              <span className="text-xs text-ink-400">{title}</span>
              <SlideFrame format={FORMAT} scale={0.5}>
                {body}
                <FullFooter handle="@rafael" index={3} total={5} />
              </SlideFrame>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs text-ink-500">
            Os mesmos dois na escala do editor, k = 0,28 — e ao lado, o que acontece ao
            desligar peça por peça. A constelação e o handle não se mexem em nenhum dos
            casos: a placa cresce para fora da faixa, e a régua tem posição própria.
          </span>
          <div className="flex flex-wrap gap-6">
            {[
              { note: "tudo ligado", props: {} },
              { note: "sem placa", props: { showLogoPlate: false } },
              { note: "sem régua", props: { showRule: false } },
              { note: "só constelação", props: { showRule: false, showLogo: false, showHandle: false, showChevron: false } },
            ].map(({ note, props }) => (
              <div key={note} className="flex flex-col gap-2">
                <SlideFrame format={FORMAT} scale={0.28}>
                  <SlideBody />
                  <FullFooter handle="@rafael" index={3} total={5} {...props} />
                </SlideFrame>
                <span className="text-xs text-ink-500">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        n={7}
        title="A régua — a cor, e por que ela sumiu do PDF"
        lead="Medido no PDF a 72 dpi: a régua estava na linha 1190, dentro do traço de 2px que
        a grade desenha em 1189–1190, na cor idêntica. Não sumiu — estava camuflada, pixel a
        pixel. Aqui ela já está na posição nova, 1174, um --slide-gap-block acima da faixa do
        rodapé, e o que falta escolher é a cor."
      >
        <p className="max-w-[70ch] rounded-[8px] border border-sun-800 bg-sun-950 p-4 text-sm text-sun-200">
          As três candidatas <strong className="font-semibold">sun</strong> contrariam a
          §2.5 do design system, que reserva o âmbar a pontuação — no máximo um uso por
          slide, para <code className="font-mono">==marca==</code>, realce de linha em
          código e avisos. Uma régua de 920px atravessando o slide não é pontuação. Escolher
          uma delas é legítimo, mas custa uma emenda àquela seção e gasta a única nota
          quente do sistema numa linha estrutural.
        </p>

        <div className="flex flex-col gap-8">
          <span className="text-xs text-ink-500">
            1 · Recorte 1:1 da faixa y 1140–1290, com grade. A régua em 1174 e a linha da
            grade 15px abaixo dela. A pergunta: dá para dizer que são dois objetos?
          </span>
          <div className="flex flex-col gap-6 overflow-x-auto">
            {RULE_COLORS.map(({ token, hex, family }) => (
              <div key={token} className="flex w-[1080px] shrink-0 flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-azure-radiance-400">{token}</span>
                  <span className="font-mono text-xs text-ink-500">{hex}</span>
                  <span className="text-xs text-ink-500">{family}</span>
                </div>
                <RuleCrop color={hex} grid />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs text-ink-500">
            2 · Slide inteiro a k = 0,28, com grade — a escala do editor, e a que mais se
            parece com o post reduzido no feed. A pergunta: a diferença sobrevive ao
            downscale, ou a matiz some antes da luminosidade?
          </span>
          <div className="flex flex-wrap gap-6">
            {RULE_COLORS.map(({ token, hex }) => (
              <div key={token} className="flex flex-col gap-2">
                <SlideFrame format={FORMAT} scale={0.28} background="grid">
                  <SlideBody />
                  <FullFooter handle="@rafael" index={3} total={5} ruleColor={hex} />
                </SlideFrame>
                <span className="font-mono text-xs text-ink-500">{token}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs text-ink-500">
            3 · O mesmo, sem grade. A régua sozinha, sem nada com que se confundir. A
            pergunta: ela ficou alta demais?
          </span>
          <div className="flex flex-wrap gap-6">
            {RULE_COLORS.map(({ token, hex }) => (
              <div key={token} className="flex flex-col gap-2">
                <SlideFrame format={FORMAT} scale={0.28}>
                  <SlideBody />
                  <FullFooter handle="@rafael" index={3} total={5} ruleColor={hex} />
                </SlideFrame>
                <span className="font-mono text-xs text-ink-500">{token}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
