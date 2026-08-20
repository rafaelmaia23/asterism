import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Temporary theme verification page.
 *
 * Exists only to confirm the Observatorio theme landed correctly after the
 * bootstrap. It is disposable — task 1.16 removes it.
 */

const INK = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

const ROLES = [
  { name: "Primário", bg: "bg-azure-radiance-400", fg: "text-azure-radiance-950", note: "azure-400 / azure-950" },
  { name: "Destrutivo", bg: "bg-crown-of-thorns-400", fg: "text-crown-of-thorns-950", note: "crown-400 / crown-950" },
  { name: "Sucesso", bg: "bg-pacifika-400", fg: "text-pacifika-950", note: "pacifika-400 / pacifika-950" },
  { name: "Aviso", bg: "bg-sun-400", fg: "text-sun-950", note: "sun-400 / sun-950" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-mono text-xs font-medium tracking-[0.08em] uppercase text-azure-radiance-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ThemeCheck() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-8 py-24">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs font-medium tracking-[0.08em] uppercase text-ink-400">
          asterism · bootstrap
        </p>
        <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em]">
          Verificação do tema
        </h1>
        <p className="text-ink-400">
          Página descartável. Removida na tarefa 1.16.
        </p>
      </header>

      <Section title="Papéis de cor — fundo 400, texto 950">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ROLES.map((r) => (
            <div key={r.name} className={`${r.bg} ${r.fg} rounded-md p-4`}>
              <p className="font-display text-[18px] font-semibold">{r.name}</p>
              <p className="font-mono text-[12px]">{r.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Escala neutra — ink">
        <div className="flex overflow-hidden rounded-md border">
          {INK.map((step) => (
            <div
              key={step}
              className="flex h-20 flex-1 items-end justify-center pb-1"
              style={{ backgroundColor: `var(--color-ink-${step})` }}
            >
              <span
                className="font-mono text-[10px]"
                style={{
                  color: Number(step) >= 500 ? "var(--color-ink-100)" : "var(--color-ink-950)",
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Oxanium — display">
        <div className="flex flex-col gap-3">
          <p className="font-display text-[48px] leading-[1.1] font-bold tracking-[-0.02em]">
            display 48 / 700
          </p>
          <p className="font-display text-[32px] leading-[1.15] font-semibold tracking-[-0.01em]">
            title 32 / 600
          </p>
          <p className="font-display text-[24px] leading-[1.3] font-semibold">
            heading 24 / 600
          </p>
        </div>
      </Section>

      <Section title="Sora — corpo">
        <div className="flex flex-col gap-3">
          <p className="text-[18px] leading-[1.4] font-semibold">subheading 18 / 600</p>
          <p className="text-[18px] leading-[1.6]">lead 18 / 400</p>
          <p className="text-[16px] leading-[1.7]">
            body 16 / 400 — o texto corrido do sistema. Se este parágrafo estiver
            em Arial, o arquivo local não carregou.
          </p>
          <p className="text-[16px] leading-[1.7] italic">
            itálico 16 / 400 — arquivo próprio, não oblíquo sintético. Compare o{" "}
            <span className="not-italic">a</span> e o <span>a</span>: o desenho
            muda, não só a inclinação.
          </p>
          <p className="text-[14px] leading-[1.6] text-ink-400">small 14 / 400 · ink-400</p>
        </div>
      </Section>

      <Section title="JetBrains Mono — utilitária">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[14px] leading-[1.6]">
            code 14 / 400 — const deck: Deck = createDeck()
          </p>
          <p className="font-mono text-[12px] font-medium tracking-[0.08em] uppercase text-ink-400">
            meta 12 / 500 · tracking 0.08em
          </p>
        </div>
      </Section>

      <Section title="Componentes shadcn — Base UI">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destrutivo</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Título do deck" />
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
            </CardHeader>
            <CardContent className="text-ink-400">
              Superfície ink-900 sobre canvas ink-950, borda ink-800.
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Grid de fundo — utilitário slide-grid">
        <div className="slide-grid h-48 rounded-md border bg-slide-bg" />
      </Section>
    </main>
  );
}
