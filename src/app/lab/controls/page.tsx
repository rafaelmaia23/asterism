"use client";

/**
 * Experimento 3 — foco e raio dos controles de formulário. Rota **descartável**.
 *
 * Mesma forma dos experimentos 4 e 5: as candidatas lado a lado, olhadas onde vão ser
 * vistas, e a escolha feita comparando em vez de argumentando. A pasta sai quando a decisão
 * estiver registrada na §16 do documento de contexto.
 *
 * A pergunta não é "qual fica mais bonito". A §9 do design system é explícita em que **quem
 * cede é o componente, não o documento**, então cada seção mostra o que o preset `nova`
 * instalou contra o que a §5 e a §8 pedem, e o que se decide é se a regra escrita continua
 * valendo agora que dá para vê-la aplicada.
 *
 * Cinco seções, e a quinta é a que a tarefa 3.6 exige que exista:
 *
 *   1  o anel de foco — 3px apagado e colado contra 2px cheio com offset
 *   2  o raio — 8px do preset contra os 6px da §5, e o cartão a 12px contra 8px
 *   3  o botão destrutivo — fundo tingido contra o par 400/950 da §2.4
 *   4  hover, ativo e desabilitado — os outros três estados da §8
 *   5  a matriz inteira das variantes, como estão instaladas
 *
 * As duas colunas de cada seção são o **mesmo** componente: o da esquerda como ele está no
 * repositório, o da direita com as classes do documento por cima, via `className`. Nada
 * aqui edita `src/components/ui` — a rota compara, o commit seguinte é que muda.
 */

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/**
 * O anel da §5 como classe utilitária: 2px `azure-500` com offset de 2px. O offset precisa
 * de cor própria, senão o Tailwind desenha a folga em branco — sobre `ink-950` ela apareceria
 * como um segundo anel claro.
 */
const RING_SPEC = "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** O mesmo anel, aceso sem depender de foco: é o que permite comparar os dois de uma vez. */
const RING_SPEC_ON = "ring-2 ring-ring ring-offset-2 ring-offset-background";

/** E o do preset, também aceso à força, para a comparação ser de igual para igual. */
const RING_PRESET_ON = "ring-3 ring-ring/50 border-ring";

/** Os 6px da §5, contra o `rounded-lg` — 8px — que o preset usa nos controles. */
const RADIUS_SPEC = "rounded-md";

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

/** Duas colunas rotuladas: o instalado à esquerda, o documento à direita. */
function Pair({
  installed,
  spec,
  note,
}: {
  installed: React.ReactNode;
  spec: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Preset nova, como está", body: installed },
          { label: "§5 e §8, como pedem", body: spec },
        ].map((column) => (
          <div key={column.label} className="flex flex-col gap-3">
            <span className="font-mono text-[11px] tracking-[0.08em] text-ink-600 uppercase">
              {column.label}
            </span>
            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-ink-800 bg-card p-6">
              {column.body}
            </div>
          </div>
        ))}
      </div>
      {note && <p className="max-w-[70ch] text-xs text-ink-500">{note}</p>}
    </div>
  );
}

function Sample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] text-ink-600">{label}</span>
      {children}
    </div>
  );
}

function Options() {
  return (
    <>
      <SelectItem value="center">Centralizado</SelectItem>
      <SelectItem value="top">No topo</SelectItem>
    </>
  );
}

const ITEMS = { center: "Centralizado", top: "No topo" };

export default function ControlsLab() {
  const [on, setOn] = useState(true);
  const [anchor, setAnchor] = useState("center");

  return (
    /*
     * `h-full overflow-y-auto` porque o `body` do `layout.tsx` é `h-full overflow-hidden`:
     * o editor é shell de aplicação, não documento que rola. Esta rota **é** um documento,
     * então rola por dentro. Sem isto, tudo abaixo da primeira dobra some sem aviso.
     */
    <main className="mx-auto flex h-full min-h-0 max-w-[1400px] flex-col gap-12 overflow-y-auto p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-ink-100">
          Experimento 3 — foco e raio dos controles
        </h1>
        <p className="max-w-[70ch] text-sm text-ink-400">
          Rota descartável. Cada seção põe o componente instalado ao lado do que a §5, a §8 e
          a §2.4 do design system pedem. A §9 diz que quem cede é o componente; o que se
          decide aqui é se, vendo as duas telas, a regra escrita continua sendo a melhor.
        </p>
      </header>

      <Section
        n={1}
        title="O anel de foco"
        lead="O preset traz ring-3 com ring/50 e sem offset: mais grosso, mais apagado e colado no
        controle. A §5 pede 2px azure-500 cheio, com 2px de folga. Os de cima estão com o anel
        aceso à força, para comparar de igual para igual; os de baixo respondem ao Tab de verdade."
      >
        <Pair
          note="Tabule pela linha de baixo de cada coluna. O anel do preset se apoia também numa troca
          de cor da borda (focus-visible:border-ring), que some quando o controle já tem borda tingida."
          installed={
            <>
              <Sample label="aceso à força">
                <Input defaultValue="Título do slide" className={RING_PRESET_ON} />
              </Sample>
              <Sample label="Tab responde">
                <Input defaultValue="Título do slide" />
              </Sample>
              <Sample label="botão, Tab responde">
                <Button>Exportar PDF</Button>
              </Sample>
            </>
          }
          spec={
            <>
              <Sample label="aceso à força">
                <Input defaultValue="Título do slide" className={RING_SPEC_ON} />
              </Sample>
              <Sample label="Tab responde">
                <Input
                  defaultValue="Título do slide"
                  className={`focus-visible:ring-0 ${RING_SPEC}`}
                />
              </Sample>
              <Sample label="botão, Tab responde">
                <Button className={`focus-visible:ring-0 ${RING_SPEC}`}>Exportar PDF</Button>
              </Sample>
            </>
          }
        />

        <div className="grid grid-cols-2 gap-6">
          {[RING_PRESET_ON, RING_SPEC_ON].map((ring, at) => (
            <div
              key={ring}
              className="flex flex-wrap items-center gap-6 rounded-lg border border-ink-800 bg-card p-6"
            >
              <span className="w-full font-mono text-[11px] tracking-[0.08em] text-ink-600 uppercase">
                {at === 0 ? "o resto dos controles, preset" : "o resto dos controles, §5"}
              </span>
              <Textarea defaultValue="Três coisas que eu mudaria" className={`w-56 ${ring}`} />
              <Select value={anchor} items={ITEMS} onValueChange={(next) => setAnchor(String(next))}>
                <SelectTrigger className={`w-40 ${ring}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <Options />
                </SelectContent>
              </Select>
              <Switch checked={on} onCheckedChange={setOn} className={ring} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        n={2}
        title="O raio"
        lead="Os controles usam rounded-lg, que o globals.css resolve em 8px — a §5 dá 8px a cartão e
        bloco de código, e 6px ao resto. O cartão é a terceira divergência, e maior do que o TODO
        registrou: ele usa rounded-xl, e --radius-xl não está declarado, então cai no default do
        Tailwind, 12px, contra os 8px da §5."
      >
        <Pair
          note="A diferença é de 2px em controle e de 4px em cartão. A pergunta é se, na coluna estreita
          do inspector, os 6px lêem como mais técnicos ou apenas como mais duros."
          installed={
            <>
              <Sample label="Input · 8px">
                <Input defaultValue="Título do slide" className="w-56" />
              </Sample>
              <Sample label="Button · 8px">
                <Button>Exportar PDF</Button>
              </Sample>
              <Sample label="Select · 8px">
                <Select value={anchor} items={ITEMS} onValueChange={(next) => setAnchor(String(next))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <Options />
                  </SelectContent>
                </Select>
              </Sample>
            </>
          }
          spec={
            <>
              <Sample label="Input · 6px">
                <Input defaultValue="Título do slide" className={`w-56 ${RADIUS_SPEC}`} />
              </Sample>
              <Sample label="Button · 6px">
                <Button className={RADIUS_SPEC}>Exportar PDF</Button>
              </Sample>
              <Sample label="Select · 6px">
                <Select value={anchor} items={ITEMS} onValueChange={(next) => setAnchor(String(next))}>
                  <SelectTrigger className={`w-40 ${RADIUS_SPEC}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <Options />
                  </SelectContent>
                </Select>
              </Sample>
            </>
          }
        />

        <div className="grid grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Cartão · 12px, como está</CardTitle>
              <CardDescription>rounded-xl, sem --radius-xl declarado</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-ink-400">
              O cartão não tem anel de foco, então a única pergunta dele é o raio.
            </CardContent>
          </Card>
          <Card className="w-full rounded-lg *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg">
            <CardHeader className="rounded-t-lg">
              <CardTitle>Cartão · 8px, como a §5 pede</CardTitle>
              <CardDescription>rounded-lg, que aqui vale 8px</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-ink-400">
              8px é o degrau que a §5 reserva a cartão e a bloco de código.
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        n={3}
        title="O botão destrutivo"
        lead="A decisão 17 já está tomada — o Observatório vence —, e esta seção existe para conferir o
        resultado, não para reabrir a escolha. O preset desenha fundo tingido a 10% com texto na
        própria cor; a §2.4 é uniforme em toda a paleta: tom 400 de preenchimento, tom 950 de texto."
      >
        <Pair
          note="O botão de remover slide da lista lateral é ghost com texto destrutivo, e não muda aqui:
          o que a §2.4 governa é o preenchimento."
          installed={
            <>
              <Button variant="destructive">
                <Trash2 />
                Remover slide
              </Button>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 />
                Remover, como na lista
              </Button>
            </>
          }
          spec={
            <>
              <Button
                variant="destructive"
                className="bg-destructive text-destructive-foreground hover:bg-crown-of-thorns-300"
              >
                <Trash2 />
                Remover slide
              </Button>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 />
                Remover, como na lista
              </Button>
            </>
          }
        />
      </Section>

      <Section
        n={4}
        title="Hover, ativo e desabilitado"
        lead="A auditoria da 1D olhou foco e raio; a §8 tem seis linhas, e as outras três também
        divergem. Hover no preset é a cor com 80% de opacidade — a §8 diz que a superfície sobe um
        degrau e a cor não muda. Ativo é translate-y de 1px, e a §8 pede scale(0.98). Desabilitado é
        opacity-50 sem cursor, e a §8 pede texto ink-600 com not-allowed."
      >
        <Pair
          note="Passe o mouse e segure o clique nos dois lados. O 'sobe um degrau' num botão de
          preenchimento cheio é azure-300 sobre azure-400, e é a leitura que esta seção precisa
          confirmar ou derrubar — a §8 foi escrita pensando em superfície, não em botão tingido."
          installed={
            <>
              <Sample label="hover: primary/80">
                <Button>Exportar PDF</Button>
              </Sample>
              <Sample label="ativo: translate-y-px">
                <Button variant="secondary">Segure o clique</Button>
              </Sample>
              <Sample label="desabilitado: opacity-50">
                <Button disabled>Exportar PDF</Button>
              </Sample>
            </>
          }
          spec={
            <>
              <Sample label="hover: azure-300">
                <Button className="hover:bg-azure-radiance-300">Exportar PDF</Button>
              </Sample>
              <Sample label="ativo: scale(0.98)">
                <Button
                  variant="secondary"
                  className="active:translate-y-0 active:scale-[0.98]"
                >
                  Segure o clique
                </Button>
              </Sample>
              <Sample label="desabilitado: ink-600 + not-allowed">
                <Button
                  disabled
                  className="disabled:pointer-events-auto disabled:cursor-not-allowed disabled:bg-secondary disabled:text-ink-600 disabled:opacity-100"
                >
                  Exportar PDF
                </Button>
              </Sample>
            </>
          }
        />
      </Section>

      <Section
        n={5}
        title="A matriz inteira, como está instalada"
        lead="A §9 do design system manda conferir toda instalação de componente contra a §2.4, e a
        tarefa 3.6 diz todas as variantes na mesma passada. Esta seção não compara nada: é o
        inventário do que existe hoje, para nada passar sem ser olhado."
      >
        <div className="flex flex-col gap-6 rounded-lg border border-ink-800 bg-card p-6">
          {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map(
            (variant) => (
              <div key={variant} className="flex items-center gap-4">
                <span className="w-24 font-mono text-[11px] text-ink-600">{variant}</span>
                {(["default", "sm", "xs", "lg"] as const).map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {size}
                  </Button>
                ))}
                <Button variant={variant} size="icon" aria-label={`ícone ${variant}`}>
                  <Trash2 />
                </Button>
              </div>
            ),
          )}

          <div className="flex flex-wrap items-center gap-6 border-t border-ink-800 pt-6">
            <Input defaultValue="Input" className="w-40" />
            <Input placeholder="Placeholder" className="w-40" />
            <Input defaultValue="Inválido" aria-invalid className="w-40" />
            <Input defaultValue="Desabilitado" disabled className="w-40" />
            <Textarea defaultValue="Textarea" className="w-56" />
            <Switch checked={on} onCheckedChange={setOn} aria-label="interruptor" />
            <Switch checked={!on} onCheckedChange={(next) => setOn(!next)} aria-label="o outro" />
            <Switch checked disabled aria-label="desabilitado" />
          </div>
        </div>
      </Section>
    </main>
  );
}
