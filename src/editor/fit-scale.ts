/**
 * A escala do canvas — decisão 22 da §16 do documento de contexto.
 *
 * Auto-fit puro: o slide ocupa o maior tamanho que couber inteiro na área central, sem
 * seletor de zoom. Um seletor entra quando houver barra onde colocá-lo.
 *
 * O teto de 1 é deliberado: numa tela grande a área central passa de 1080×1350, e exibir
 * o slide acima do tamanho real não ajuda ninguém — o carrossel é publicado reduzido, não
 * ampliado.
 *
 * Área sem dimensão positiva devolve 0, e não uma escala mínima qualquer. Zero é o sinal
 * de "ainda não medido", e quem chama não desenha quadro nenhum enquanto for 0 —
 * `calc(1px / 0)` na compensação do grid não pode acontecer.
 */

export type Size = { w: number; h: number };

export function fitScale(area: Size, format: Size): number {
  if (area.w <= 0 || area.h <= 0) {
    return 0;
  }

  return Math.min(area.w / format.w, area.h / format.h, 1);
}
