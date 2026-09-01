---
status: accepted
---

# 37. A `MaiahubGlyph` engrossou: traço 1.6 → 2.25 em opacidade cheia, estrela 3.4 → 4.0

Não é gosto, é medida. O traço da glyph é dado num `viewBox` de 32, então exibida a 32px cada unidade vale 1px: ela desenhava **1,6px**. O chevron ao lado, num `viewBox` de 24 exibido a 40px, desenha 3,75px; a linha da grade, 2px. Com o traço ainda a 55% de opacidade, a tinta resultante sobre `ink-950` era ≈`#858993` — mais escura que o `ink-400` do handle ao lado dela. A peça era a linha mais fina e mais apagada do slide inteiro, que é o oposto do que ela existe para fazer: a glyph quebra proporção de propósito para não sumir em tamanho pequeno, e a correção não ia longe o bastante para os 32px em que o asterism a usa. Compensar por fora trataria o sintoma e deixaria o desenho errado para todo uso futuro. A 16px, que é a faixa que a documentação da marca dá à peça, 2.25 rende 1,1px efetivo — ela continua fazendo lá o que fazia.

## Alternativas consideradas

Não tocar na peça de marca e compensar por fora — tamanho maior, tinta mais clara, ou a placa sozinha resolvendo o contraste.
