/**
 * `<Blocks>` — a camada de blocos virando parágrafos e listas, com os gaps da §4.2 do
 * design system.
 *
 * O template escreve `<Blocks>{content.body}</Blocks>` no lugar do `<Inline>` e **nunca vê
 * a lista de blocos**: quem chama passa a string crua do campo e recebe o texto desenhado.
 * Este módulo é o único que conhece as duas camadas — `parseBlocks` acima, `<Inline>`
 * abaixo, um por bloco.
 *
 * **Espaçamento é `gap`, nunca margem.** Margem de `<p>` e de `<ul>` não sobrevive à
 * captura: a clonagem não emite valor inicial, então `margin: 0` declarado aqui não
 * chegaria ao `foreignObject` e a folha do agente de usuário devolveria `1em` — ADR-0050 e
 * ADR-0019. `gap` é valor declarado e não inicial, e atravessa. Quem zera o que ninguém
 * declarou continua sendo a folha reinjetada pelo `rasterize`.
 *
 * **Nenhuma largura aqui.** A medida de linha é da região que o template desenha, e passa
 * a ser do elemento `text` na C-C.
 */

import { Inline } from "@/markup/inline";
import { parseBlocks } from "@/markup/parse-blocks";

/**
 * O gap é o mesmo entre parágrafos e entre itens: parágrafo e item são a mesma unidade de
 * leitura, e a §4.2 dá 48px aos dois. Quem separa **elementos** é o `--slide-gap-block`,
 * de 64px, e ele não entra aqui.
 */
const STACK = "flex flex-col gap-[var(--slide-gap-item)]";

/**
 * O marcador é nó de verdade, não `::marker`: pseudo-elemento com fonte e cor próprias tem
 * suporte irregular na serialização da captura, o guard mede nós reais, e o recuo pendurado
 * — a linha que quebra alinhando com o texto, não com o travessão — sai de graça do flex.
 * É o mesmo desenho que o `text-bullets` já usava.
 */
function Item({ marker, children }: { marker: string; children: string }) {
  return (
    <li className="flex gap-[32px]">
      <span className="font-mono text-azure-radiance-400" aria-hidden>
        {marker}
      </span>
      <span>
        <Inline>{children}</Inline>
      </span>
    </li>
  );
}

export function Blocks({ children }: { children: string }) {
  const blocks = parseBlocks(children);

  if (blocks.length === 0) return null;

  return (
    <div className={STACK}>
      {blocks.map((block, position) => {
        // A chave é a posição porque a lista é derivada da string a cada render: não há
        // identidade estável a preservar, e reordenação não existe neste nível.
        if (block.t === "p") {
          return (
            <p key={position}>
              <Inline>{block.v}</Inline>
            </p>
          );
        }

        const List = block.t;

        return (
          <List key={position} className={STACK}>
            {block.items.map((item, index) => (
              <Item key={index} marker={block.t === "ul" ? "—" : `${index + 1}.`}>
                {item}
              </Item>
            ))}
          </List>
        );
      })}
    </div>
  );
}
