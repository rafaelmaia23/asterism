---
status: accepted
---

# 36. O chevron está disponível em todo template e é suprimido no último slide por posição

"Último slide" é onde o deck acaba, não um layout: um carrossel pode terminar em `text-bullets` sem nunca registrar um `final-cta`, e amarrar a regra ao template deixaria a seta convidando para um próximo que não existe. O `Footer` já recebe `index` e `total` para desenhar a constelação, então a supressão sai de graça e é escrita uma vez só, em vez de repetida em dez templates. O preço é um toggle que fica inerte no último slide; é aceitável porque o efeito é visível no canvas a cada clique, e porque o inverso — esconder o controle ali — faria o formulário mudar de forma conforme a posição do slide.

## Alternativas consideradas

Mantê-lo exclusivo da capa; ou suprimi-lo no template `final-cta`, que é o fechamento por definição.
