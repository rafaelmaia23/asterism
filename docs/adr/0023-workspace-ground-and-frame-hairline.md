---
status: accepted
---

# 23. Área de trabalho em `ink-900` e moldura de 1px `ink-700` no quadro externo, fora do `transform`

A primeira versão da 1C pôs slide e área no mesmo tom e separou por hairline `ink-800`: reprovou olhando, não dava para saber onde termina a página. A inversão da §2.2 do design system resolve o grosso, e a borda dá o contorno que faltava — em `ink-700`, porque o 800 cai entre os dois tons e some. Na raiz do slide a borda encolheria com a escala e viajaria dentro do nó capturado, contra a §9; no quadro externo ela vale 1px em qualquer `k` e a exportação nunca a vê.

## Alternativas consideradas

Só a inversão de superfície, sem borda, como a §2.2 previa; ou só a borda, com a área no mesmo `ink-950` do slide.
