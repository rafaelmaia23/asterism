---
status: accepted
---

# 48. A marca de transbordo é a borda do quadro externo do `SlideFrame`, mais um ícone na linha da lista

A §8 do design system dá borda `crown-400` ao estado inválido, e o único lugar onde ela pode morar é a camada de fora: dentro do `transform` ela encolheria com a escala e — pior — entraria no nó que a exportação captura, e **o PDF sairia com borda vermelha**. É a mesma razão pela qual a borda de 1px do preview já morava lá desde a decisão 23. Há um segundo motivo, e ele é do guard: a borda do quadro externo já existe em 1px nos dois estados, então marcar **não muda medida nenhuma** — uma marca que alterasse o layout medido faria medir mudar o que se mede, e o guard oscilaria. O ícone na linha da lista existe porque 1px numa miniatura de 216px é discreto demais para se ler varrendo a coluna: a borda diz qual slide, o ícone diz que há um.

## Alternativas consideradas

Marcar dentro do slide — uma borda na região que estourou, ou uma tarja no canvas; ou deixar só a borda, sem ícone.
