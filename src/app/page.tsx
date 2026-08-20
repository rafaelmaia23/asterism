import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MaiahubGlyph,
  MaiahubMark,
  MaiahubSeal,
  MaiahubSignature,
  MaiahubWordmark,
} from "@/components/maiahub";

/**
 * Temporary theme verification page.
 *
 * Exists only to confirm the Observatorio theme landed correctly after the
 * bootstrap. It is disposable — task 1.16 removes it.
 */

// Classes literais, nao `bg-ink-${step}`: Tailwind resolve as classes lendo o
// source, entao um nome montado em runtime nunca gera a utility.
const INK = [
  { step: "50", bg: "bg-ink-50", fg: "text-ink-950" },
  { step: "100", bg: "bg-ink-100", fg: "text-ink-950" },
  { step: "200", bg: "bg-ink-200", fg: "text-ink-950" },
  { step: "300", bg: "bg-ink-300", fg: "text-ink-950" },
  { step: "400", bg: "bg-ink-400", fg: "text-ink-950" },
  { step: "500", bg: "bg-ink-500", fg: "text-ink-50" },
  { step: "600", bg: "bg-ink-600", fg: "text-ink-50" },
  { step: "700", bg: "bg-ink-700", fg: "text-ink-50" },
  { step: "800", bg: "bg-ink-800", fg: "text-ink-50" },
  { step: "900", bg: "bg-ink-900", fg: "text-ink-50" },
  { step: "950", bg: "bg-ink-950", fg: "text-ink-50" },
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

function LogoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[12px] text-ink-500">{label}</p>
      <div className="flex flex-wrap items-end gap-8">{children}</div>
    </div>
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
          {INK.map((s) => (
            <div
              key={s.step}
              className={`${s.bg} flex h-20 flex-1 items-end justify-center pb-1`}
            >
              <span className={`${s.fg} font-mono text-[10px]`}>{s.step}</span>
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
        <p className="text-[14px] text-ink-400">
          Células de 60px, linha de 1px. Confira com zoom em 100%, 150% e 200%: as
          células devem continuar do mesmo tamanho e nenhuma linha pode sumir.
        </p>
        <div className="slide-grid h-48 rounded-md border bg-slide-bg" />

        <p className="text-[14px] text-ink-400">
          O mesmo grid no contexto real: um quadro de 1080×1350 reduzido por{" "}
          <code className="text-[13px]">transform: scale()</code>, que é como o canvas
          vai exibir o slide.
        </p>
        <div
          className="overflow-hidden rounded-md border"
          style={{ width: 1080 * 0.28, height: 1350 * 0.28 }}
        >
          <div
            className="slide-grid bg-slide-bg"
            style={{
              width: "var(--slide-w)",
              height: "var(--slide-h)",
              transform: "scale(0.28)",
              transformOrigin: "top left",
            }}
          />
        </div>
      </Section>

      <Section title="Logo maiahub — estrela em azure-400">
        <p className="text-[14px] text-ink-400">
          A estrela usa a mesma cor do kicker acima. Compare os dois: devem ser
          idênticos.
        </p>

        <div className="flex flex-col gap-8 rounded-md border bg-card p-6">
          <LogoRow label="MaiahubWordmark · mín. 200px de largura">
            <MaiahubWordmark className="h-10 w-auto" />
          </LogoRow>
          <LogoRow label="MaiahubSignature · rodapé, cabeçalho">
            <MaiahubSignature />
            <MaiahubSignature bare />
            <MaiahubSignature className="[&_svg]:h-8" />
          </LogoRow>
          <LogoRow label="MaiahubMark · mín. 24px de altura">
            <MaiahubMark className="h-6 w-auto" />
            <MaiahubMark className="h-8 w-auto" />
            <MaiahubMark className="h-16 w-auto" />
          </LogoRow>
          <LogoRow label="MaiahubSeal · mín. 40px">
            <MaiahubSeal className="size-10" />
            <MaiahubSeal className="size-16" />
          </LogoRow>
          <LogoRow label="MaiahubGlyph · mín. 16px">
            <MaiahubGlyph className="size-4" />
            <MaiahubGlyph className="size-6" />
            <MaiahubGlyph className="size-12" />
          </LogoRow>
          <LogoRow label="mono — estrela em currentColor, para o PDF">
            <MaiahubMark mono className="h-16 w-auto" />
            <MaiahubMark mono className="h-16 w-auto text-azure-radiance-400" />
            <MaiahubGlyph mono className="size-12 text-ink-400" />
          </LogoRow>
        </div>
      </Section>
    </main>
  );
}
