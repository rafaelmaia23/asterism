/**
 * Constelação de progresso — §10.5 do design system. Um ponto por slide, 12px de
 * diâmetro, gap 12px, alinhada à direita dentro do padding.
 *
 * Dois estados apenas: visitado em `azure-400`, não visitado em `ink-700`. Não existe
 * estado para o slide atual — o atual é simplesmente o último aceso — nem prenúncio do
 * próximo. Um significado por cor.
 *
 * **Um ponto por slide, em qualquer contagem.** A §10.5 pedia, acima de dez slides, "5
 * pontos mais um contador `03 / 12`" sem dizer quais cinco, e o experimento 2 derrubou a
 * regra em vez de completá-la: as três leituras do recorte foram montadas com um deck de
 * 12 slides e nenhuma sobreviveu à comparação com o comportamento sem recorte — os cinco
 * primeiros congelam no slide 5, a janela deslizante fica sete slides sem se mexer, e a
 * amostragem avança em quatro degraus irregulares. Decisão 40 da §16 do documento de
 * contexto.
 *
 * O recorte existia para resolver um problema de espaço que ninguém tinha medido: a faixa
 * comporta 26 pontos antes de a constelação encostar no handle. Não há `total` no caminho
 * deste componente que precise de tratamento especial.
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
