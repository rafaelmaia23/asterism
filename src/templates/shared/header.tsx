import { Kicker } from "@/templates/shared/kicker";

/**
 * A faixa do topo — §10.5 do design system e §11.0 dos templates. O simétrico do `Footer`,
 * e chegou tarde por isso: o rodapé virou peça compartilhada com seis opções na 2B, e o
 * topo do slide continuou sendo um `<div>` escrito à mão dentro da capa, o único template
 * que tinha um.
 *
 *   kicker   80 – 148   `slide-meta` em `azure-400`, canto superior esquerdo
 *
 * Uma peça só, por enquanto. A faixa existe mesmo assim, e não é o `Kicker` posicionado
 * direto pelo template, pelo mesmo motivo do rodapé: quando a segunda peça chegar — um
 * indicador de seção à direita, digamos —, ela chega aqui e não em dez lugares.
 *
 * **A faixa se posiciona sozinha.** `top: var(--slide-pad)` mora aqui em vez de repetido em
 * cada template — mesmo argumento da decisão 19 para a escala tipográfica: valor repetido
 * em dez lugares diverge no terceiro.
 *
 * ## Desligada, a faixa não existe
 *
 * Não é uma faixa vazia de 68px: é nada. A diferença importa para os templates que têm
 * conteúdo no topo — o `text-bullets` é o caso —, porque é o que permite a eles recuperarem
 * os 132px quando o cabeçalho está desligado, em vez de reservá-los para sempre. É a única
 * diferença de comportamento entre esta faixa e a do rodapé, e ela vem de onde as duas
 * ficam: o rodapé nunca disputou espaço com nada.
 *
 * Ligada com o texto vazio, a faixa continua desenhada. Kicker em branco é escolha de quem
 * edita — o slide mantém o ritmo da série sem escrever nada ali —, e quem não quer a faixa
 * desliga a opção, que é para isso que ela existe.
 *
 * Recebe o `kicker` como string, e não o slide: nada aqui é derivado de `meta`, que é a
 * decisão 14, e é a mesma escolha que o `Footer` faz ao receber só o `handle`.
 */
export function Header({ kicker, show }: { kicker: string; show: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <div
      data-testid="header-band"
      className="absolute top-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[68px] items-start"
    >
      <Kicker>{kicker}</Kicker>
    </div>
  );
}
