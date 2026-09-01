---
status: accepted
---

# 42. O cabeçalho é faixa compartilhada de todo template, ligável por `showHeader`, e o `kicker` virou campo compartilhado

A §10.5 do design system prendia o kicker à capa, e o rodapé já tinha feito o caminho contrário na 2B: virou peça compartilhada com seis opções, e o que era regra virou padrão. O topo do slide ficou como a assimetria óbvia da arquitetura — uma faixa desenhada à mão dentro de um template, e nenhum outro slide podia ter etiqueta superior. Compartilhar tem dois retornos além do óbvio: a **migração passa a preservar o kicker** de graça, pela interseção de chaves da decisão 13, e a segunda peça que a faixa ganhar chega num lugar em vez de dez. O par com `showFooter` fecha o desenho: as duas faixas do slide são opção, as peças dentro delas são sub-opção, e a constelação continua sem opção própria porque quem a tira é quem tira a faixa toda.

## Alternativas consideradas

Manter o kicker como campo do `cover-statement`; ou dar a cada template um campo de etiqueta próprio, com chave própria.
