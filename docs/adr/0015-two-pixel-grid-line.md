---
status: accepted
---

# 15. Grid com linha de 2px, compensada no preview

A calibragem valia só para o bitmap: o slide quase nunca é visto a 1:1, e abaixo de 1080px de largura uma linha de 1px cai abaixo de um pixel e some do post publicado. 2px sobrevive ao downscale; e como nenhuma espessura fixa sobrevive a uma redução arbitrária, o preview declara `--slide-scale` e a espessura efetiva vira `max(base, 1px / k)`. Ver §4.3 do design system.

## Alternativas consideradas

0.5px calibrado para a rasterização 2×.
