/**
 * Constelação de progresso — §10.5 do design system. Um ponto por slide, 12px de
 * diâmetro, gap 12px, alinhada à direita dentro do padding.
 *
 * Dois estados apenas: visitado em `azure-400`, não visitado em `ink-700`. Não existe
 * estado para o slide atual — o atual é simplesmente o último aceso — nem prenúncio do
 * próximo. Um significado por cor.
 *
 * O recorte acima de dez slides que a §10.5 descreve ("5 pontos mais um contador") está
 * reservado à tarefa 2.4b, que decide entre as três leituras do experimento 2. Até lá,
 * doze slides são doze pontos.
 */
export function Constellation({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex items-center gap-[12px]">
      {Array.from({ length: total }, (_, position) => {
        const lit = position <= index;

        return (
          <span
            key={position}
            data-testid="constellation-dot"
            data-lit={String(lit)}
            className={[
              "size-[12px] rounded-full",
              lit ? "bg-azure-radiance-400" : "bg-ink-700",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
