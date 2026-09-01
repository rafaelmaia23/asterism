---
status: accepted
---

# 43. Ligar o cabeçalho empurra o conteúdo do `text-bullets`, em vez de a faixa ser reservada sempre

Reservar sempre custaria **132px do topo do template mais usado do sistema**, permanentemente, por uma faixa que ali nasce desligada: a região de itens cairia de 866 para 734px em todo slide de tópicos do carrossel, inclusive nos que nunca vão ter kicker. Empurrar custa um ternário numa string de classe, do mesmo formato que o `anchor` já usa no mesmo componente. A regra do rodapé não é contrariada onde foi escrita: ela fala das peças **dentro** de uma faixa, e vale porque o rodapé nunca disputou espaço com nada — mover o que está embaixo dele seria mover o nada. A capa e o `final-cta` não pagam nada de qualquer forma, porque os dois já têm a faixa 80–148 livre.

## Alternativas consideradas

Reservar 80–148 em todo template, com o conteúdo começando em 212 com a faixa ligada ou não — a regra "ligar uma peça não move as outras" que o rodapé segue desde a 2B.
