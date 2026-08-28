/**
 * A faixa de imagem — §11.0, §11.9 e §11.10 dos templates.
 *
 * Mora em `shared/` pelo mesmo motivo da janela de código: dois templates a desenham, o
 * `split-vertical` numa coluna de 440px e o `image-caption` na largura inteira, e a segunda
 * cópia divergiria da primeira no dia em que o estado vazio mudasse de rótulo.
 *
 * ## Ela sangra, e é a única coisa do slide que sangra
 *
 * O padding de 80px da §11.0 vale para **conteúdo**; imagem pode ir até a borda do canvas —
 * decisão 46. Contida, com raio de 12px, ela viraria figura ilustrando um slide de texto, e
 * os dois templates de mídia perderiam a razão de existir separados do `context`. Daí não
 * haver raio aqui: quem posiciona a faixa é quem a usa, e as duas geometrias encostam na
 * borda.
 *
 * O limite da sangria é geométrico e está na §11.0: **nenhuma imagem entra na faixa do
 * rodapé**, que precisa dos 920px inteiros. Quem faz esse corte é o `className` de quem
 * desenha, porque o número de onde a imagem para é do template.
 *
 * ## Sem imagem e id órfão são o mesmo estado
 *
 * A faixa desenha `slide-surface` com o rótulo centralizado nos dois casos: o slide que
 * nasceu sem imagem e o deck reidratado cujo `ImageId` não está mais no IndexedDB. A §11.9
 * é explícita em que o segundo não derruba o slide — o schema passa, porque o id é uma
 * string válida, e a decisão 31 continua sendo derrubar só o que não passa.
 *
 * O fundo é `slide-surface` sempre, e não só no estado vazio: com `contain` a imagem cabe
 * inteira e o que sobra é ele, que é o que a §11.9 pede.
 *
 * ## Nunca é região guardada
 *
 * A §11.0 marca com ⌐ a região de **conteúdo variável**, nunca uma imagem: ela se ajusta em
 * vez de crescer, então não há altura a comparar com a da faixa.
 */

import type { ImageId } from "@/deck/types";
import { useImageUrl } from "@/images/cache";

export type ImageBandProps = {
  image: ImageId;
  /** `cover` recorta para preencher; `contain` cabe inteira. §11.9. */
  fit: string;
  /** A posição e o tamanho da faixa, que são do template. */
  className: string;
};

export function ImageBand({ image, fit, className }: ImageBandProps) {
  const url = useImageUrl(image);

  return (
    <div
      data-testid="image-band"
      className={[
        "absolute flex items-center justify-center overflow-hidden bg-slide-surface",
        className,
      ].join(" ")}
    >
      {url === undefined ? (
        <span className="slide-meta text-ink-500">Sem imagem</span>
      ) : (
        /* `alt` vazio: o slide vira bitmap na exportação, e não há campo de texto
           alternativo no modelo — inventar um aqui seria descrever a imagem com o nome do
           arquivo, que é pior que não descrever. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          data-testid="image"
          src={url}
          alt=""
          className={`size-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        />
      )}
    </div>
  );
}
