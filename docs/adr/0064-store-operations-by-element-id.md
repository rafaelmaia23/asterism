---
status: accepted
---

# 64. Toda operação do store é por `ElementId`, não por caminho

Com árvore, `elements[2]` não identifica nada. Numa árvore de dez nós, caminhar procurando pai e posição é gratuito, e um caminho carregado erra num canto e some em outro.

## Alternativas consideradas

Carregar caminhos do tipo `["el_3", "left", 1]` da árvore até a ação.
