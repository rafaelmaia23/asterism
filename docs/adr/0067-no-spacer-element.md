---
status: accepted
---

# 67. Não existe elemento de espaçamento; a âncora vertical do layout resolve o caso legítimo

Espaçador é estilo livre pela porta dos fundos: o autor passa a ajustar altura em vez de escrever, e o guard não sabe julgar um vazio de 200px. O que ele resolveria — empurrar o fecho para a base — a âncora `bottom` já fazia.

## Alternativas consideradas

Um `spacer` com alturas fechadas — 48, 96, 160.
