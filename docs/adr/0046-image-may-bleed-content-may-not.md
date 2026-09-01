---
status: accepted
---

# 46. Imagem pode sangrar até a borda do canvas; conteúdo, não.

O padding de 80px da §11.0 dos templates passa a valer para conteúdo, e a imagem do `split-vertical` para em y 1174

Contida, a imagem vira figura ilustrando um slide de texto, e os dois templates de mídia perdem a razão de existir separados do `context`. Sangrar nos quatro lados é o oposto: põe texto sobre foto arbitrária, que só se sustenta com overlay escuro — a única exceção de gradiente que a §2.5 do design system permite, e justamente a que a decisão 28 mostrou não sobreviver à rasterização. O meio-termo é a regra acima, e o limite dela não é estético: **o rodapé precisa dos 920px**. Com a imagem do `split-vertical` descendo até a base, o rodapé caberia só na coluna de texto de 480px, e ali a placa da logo mais o handle mais doze pontos de constelação passam de 500px — não cabe, e num deck maior a constelação ainda cresce. A imagem para em y 1174, que é a linha da régua da §10.5, e a faixa de baixo continua inteira.

## Alternativas consideradas

Manter os 80px nos quatro lados para tudo, com a imagem contida e raio de 12px como o bloco de código; ou deixar a imagem sangrar nos quatro lados, com legenda e rodapé por cima dela.
