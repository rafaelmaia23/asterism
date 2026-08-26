"use client";

/**
 * O controle de exportação da barra superior.
 *
 * **Ele não sabe quais alvos existem**: pergunta ao registry e desenha um botão por
 * resposta, com o rótulo que o alvo declarou. Hoje isso dá um botão, "PDF". Um alvo PNG
 * amanhã aparece aqui sem que este arquivo seja editado — e o menu com escolha de alvo da
 * §14 do documento de contexto entra quando houver mais de um para escolher.
 *
 * Enquanto a captura acontece o botão fica desabilitado: são segundos com o deck inteiro
 * sendo rasterizado, e um segundo clique montaria um segundo palco por cima do primeiro.
 *
 * **Desabilitado não é sinal de progresso.** A §8 do design system pede que carregando troque
 * o conteúdo do botão com a largura preservada, e num deck de doze slides a captura leva
 * segundos em que a única diferença visível era o `opacity-50` do `disabled` — que lê como
 * "não pode", não como "está indo". Então o ícone troca: `Download` vira `LoaderCircle`
 * girando, e o rótulo fica onde está, que é o que mantém a largura.
 *
 * `running` guarda o **id do alvo**, não um booleano, e é o que deixa o spinner aparecer só no
 * botão que está trabalhando enquanto todos ficam desabilitados. Com um alvo só isso não se
 * nota; com o PNG da §10 do documento de contexto, nota.
 *
 * Sob `prefers-reduced-motion` o ícone não gira. Ele continua sendo outro ícone, e o
 * `aria-busy` continua dizendo a mesma coisa a quem não olha para nenhum dos dois — a §7 pede
 * respeito ao ajuste, e o estado não depende do movimento para ser legível.
 */

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/editor/store";
import { list } from "@/export";
import { exportDeck } from "@/export/run";

export function ExportButtons() {
  const deck = useEditor((state) => state.deck);
  const [running, setRunning] = useState<string | null>(null);

  async function run(targetId: string) {
    setRunning(targetId);
    try {
      await exportDeck(deck, targetId);
    } catch (error) {
      // Sem estado de erro na interface até a Etapa 5; o console é honesto e o botão
      // volta ao normal, que é o que impede a tela de ficar travada por uma falha.
      console.error("Exportação falhou", error);
    } finally {
      setRunning(null);
    }
  }

  return (
    <>
      {list().map((target) => {
        const busy = running === target.id;

        return (
          <Button
            key={target.id}
            size="sm"
            aria-busy={busy}
            disabled={running !== null}
            onClick={() => run(target.id)}
          >
            {busy ? (
              <LoaderCircle
                data-testid="export-spinner"
                data-icon="inline-start"
                aria-hidden
                className="animate-spin motion-reduce:animate-none"
              />
            ) : (
              <Download data-icon="inline-start" />
            )}
            {target.label}
          </Button>
        );
      })}
    </>
  );
}
