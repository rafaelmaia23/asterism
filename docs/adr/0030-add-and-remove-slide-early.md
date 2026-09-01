---
status: accepted
---

# 30. `addSlide` e `removeSlide` antecipados da Etapa 4 para a Etapa 2

O "pronto quando" da Etapa 2 é um carrossel de 8 a 12 slides composto com os três templates, e o store da 1D só tem `selectSlide`, `setField` e `setOption`: não existe caminho para acrescentar um slide sequer, então o critério da própria etapa é inalcançável sem isso. Um deck semente grande faria o "compor" da etapa virar ficção — o número de slides ficaria congelado até a Etapa 4. E `addSlide` sozinho seria pior que os dois juntos: um clique errado deixaria um slide órfão sem saída, justo na etapa em que se compõe pela primeira vez. Arraste, duplicar e undo continuam na Etapa 4, que é onde a lista lateral vira ferramenta de verdade.

## Alternativas consideradas

Deixar os dois na Etapa 4 e fechar a Etapa 2 editando um deck semente já com 8 a 12 slides; ou antecipar só o `addSlide`.
