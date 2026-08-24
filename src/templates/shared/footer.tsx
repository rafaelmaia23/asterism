import { MaiahubGlyph } from "@/components/maiahub";
import { Chevron } from "@/templates/shared/chevron";
import { Constellation } from "@/templates/shared/constellation";

/**
 * A faixa do rodapé — §10.5 do design system e §11.0 dos templates. **Todo template a
 * tem**, e o que varia é quais peças estão acesas:
 *
 *   régua      1px `ink-600`, a 176px da base, separando o conteúdo do rodapé
 *   esquerda   glyph a 32px, com ou sem a placa atrás; handle em `slide-meta` `ink-400`
 *   direita    constelação de progresso, e o chevron depois dela com gap de 20px
 *
 * Cinco das seis peças são opção do slide, com o descritor do template dando o padrão — a
 * forma da decisão 25, a mesma da grade. A §10.5 prendia a identidade a "todos os slides
 * exceto a capa" e o chevron a "somente a capa"; as duas frases viraram o valor com que
 * cada template nasce, e quem edita decide daí em diante.
 *
 * A **constelação não tem opção**: progresso é o que a faixa é.
 *
 * ## Ligar uma peça não move as outras
 *
 * É a propriedade que faz seis interruptores serem controle e não bagunça, e ela custa
 * duas escolhas de geometria:
 *
 * - **A placa cresce para fora da faixa.** A faixa continua tendo 32px de altura com a
 *   base a `--slide-pad` do fundo. A placa é um quadrado de 56px com `-my-[12px]`, então
 *   avança 12px para cima e 12px para baixo sem entrar no cálculo de altura. Ligá-la e
 *   desligá-la não desloca o handle nem a constelação.
 * - **A régua se mede da base do slide**, não do topo da faixa. Ancorada na faixa, ela
 *   pularia junto com a placa.
 *
 * ## A régua não pode cair em cima da grade
 *
 * A primeira versão a pôs em `--slide-pad * 2` = y 1190, e ela **sumia do PDF quando a
 * grade estava ligada**. Medido a 72 dpi: a grade desenha horizontais em `54k + 1` com
 * traço de 2px, e em k = 22 isso ocupa exatamente 1189–1190. A régua era pintada dentro do
 * traço, no mesmo `ink-800` — camuflada pixel a pixel, não perdida na rasterização.
 *
 * Duas correções, e as duas importam: a posição passou a ser a base da faixa mais a altura
 * dela mais um `--slide-gap-block`, o que dá **y 1174**, 15px acima da linha da grade; e a
 * cor passou a `ink-600`, dois degraus acima do `ink-800` da grade, escolhida no
 * experimento 5 comparando nove candidatas em `ink`, `azure` e `sun` sobre páginas reais.
 *
 * A espessura é `slide-hairline` e não `h-px`: 1px fixo a k = 0,28 dá 0,28 pixel de
 * dispositivo e o navegador não pinta. Ver a §4.3 do design system — a compensação da
 * decisão 15 vale para qualquer hairline dentro do slide, não só para a grade.
 *
 * A placa é o único elemento do slide que entra na faixa de padding — o fundo dela chega a
 * 68px da borda, contra os 80px da grade da §4.2. Fica bem dentro da zona morta de 60px
 * que a §11.0 protege, e é o preço de a glyph continuar oticamente alinhada com o handle:
 * encostar a placa nos 80px desalinharia os dois em 12px.
 *
 * A peça de marca é a glyph, e não a `MaiahubMark` do sistema de marca, que a faixa de
 * tamanho apontaria — decisão 18 da §16 do documento de contexto. Ela sai em `ink-200`,
 * um degrau acima do `ink-400` do handle: dentro da placa, sobre `slide-raised`, é o que
 * mantém a hierarquia entre marca e assinatura.
 *
 * **O rodapé se posiciona sozinho.** A faixa é a mesma em todo template, então
 * `bottom: var(--slide-pad)` mora aqui em vez de repetido em cada um — mesmo argumento da
 * decisão 19 para a escala tipográfica: valor repetido em dez lugares diverge no terceiro.
 *
 * Recebe o `handle` como string, e não o `DeckMeta` inteiro: não há uso para `pillar`
 * aqui, e o kicker já estabeleceu que nada no slide é derivado de `meta`.
 */
export function Footer({
  handle,
  index,
  total,
  showRule,
  showLogo,
  showLogoPlate,
  showHandle,
  showChevron,
}: {
  handle: string;
  index: number;
  total: number;
  showRule: boolean;
  showLogo: boolean;
  showLogoPlate: boolean;
  showHandle: boolean;
  showChevron: boolean;
}) {
  // No último slide não há para onde deslizar, e a seta que convida ao próximo mentiria.
  // A regra mora aqui porque o `Footer` já recebe a posição para desenhar a constelação:
  // escrita uma vez, ela não pode divergir entre dez templates.
  const chevron = showChevron && index < total - 1;

  // A placa emoldura a glyph; sem glyph ela não é meia peça, é nada.
  const glyph = <MaiahubGlyph className="size-[32px] text-ink-200" />;

  return (
    <>
      {showRule && (
        <div
          data-testid="footer-rule"
          aria-hidden
          className="slide-hairline absolute right-[var(--slide-pad)] bottom-[calc(var(--slide-pad)+32px+var(--slide-gap-block))] left-[var(--slide-pad)] bg-ink-600"
        />
      )}

      <div className="absolute right-[var(--slide-pad)] bottom-[var(--slide-pad)] left-[var(--slide-pad)] flex h-[32px] items-center justify-between">
        {/* Sempre renderizado, mesmo vazio: sem filhos ele tem largura zero, o
            `justify-between` mantém a constelação na borda direita, e o `gap` só existe
            entre filhos presentes — desligar uma das peças não deixa buraco. */}
        <div className="flex items-center gap-[20px]">
          {showLogo &&
            (showLogoPlate ? (
              <span
                data-testid="logo-plate"
                className="-my-[12px] flex size-[56px] items-center justify-center rounded-[var(--slide-radius)] border border-ink-700 bg-slide-raised"
              >
                {glyph}
              </span>
            ) : (
              glyph
            ))}
          {showHandle && <span className="slide-meta text-ink-400">{handle}</span>}
        </div>

        <div className="flex items-center gap-[20px]">
          <Constellation index={index} total={total} />
          {chevron && <Chevron />}
        </div>
      </div>
    </>
  );
}
