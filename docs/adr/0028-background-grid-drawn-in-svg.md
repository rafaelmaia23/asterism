---
status: accepted
---

# 28. Grade de fundo desenhada em `<svg>`, com módulo tirado do formato e moldura fechada nos quatro lados

Não é preferência: o gradiente **não sobrevive à rasterização**, e as quatro alternativas foram medidas num PDF antes da escolha — as duas de gradiente saem chapadas e o `<pattern>` sai com metade da espessura, porque o traço na borda do ladrilho é recortado. Linha de verdade em SVG atravessa intacta, como a constelação e o chevron já atravessavam. O módulo passou de 60px fixos para o divisor comum de largura e altura mais próximo de 54px — 54 em 1080×1350, 20 por 25 quadrados inteiros —, o que fecha a grade em qualquer formato e resolve de uma vez a assimetria que o ladrilho tinha: linha colada no topo e na esquerda, nenhuma na direita, e a faixa de baixo cortada ao meio.

## Alternativas consideradas

Manter os dois `linear-gradient` ladrilhados da §4.3; ou trocá-los por `repeating-linear-gradient`; ou usar `<pattern>` de SVG.
