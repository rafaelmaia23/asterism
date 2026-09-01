---
status: accepted
---

# 20. Palco de exportação oculto, montado a 1:1

O exportador precisa do deck inteiro, não do slide ativo — e capturar o nó do preview arrastaria a compensação de `--slide-scale` para dentro do arquivo, que é justamente o que a §9 diz não pode acontecer.

## Alternativas consideradas

Zerar a escala do canvas visível antes de capturar.
