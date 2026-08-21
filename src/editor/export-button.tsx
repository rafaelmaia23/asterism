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
 */

import { useState } from "react";
import { Download } from "lucide-react";
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
      {list().map((target) => (
        <Button
          key={target.id}
          size="sm"
          disabled={running !== null}
          onClick={() => run(target.id)}
        >
          <Download data-icon="inline-start" />
          {target.label}
        </Button>
      ))}
    </>
  );
}
