---
status: accepted
---

# 25. Grade de fundo é opção do slide, com o `background` do template como padrão

Quem edita ganha a escolha slide a slide, e o custo é a consistência automática que a regra anterior dava de graça: nada impede uma capa com grade e outra sem no mesmo carrossel. O descritor continua dizendo com o que o slide nasce, e a §4.3 passa a chamar de recomendação o que era proibição — grade em slide de código continua má ideia, só não é mais impossível. O `SlideView` é o único ponto que lê a opção; o `SlideFrame` continua recebendo `grid` ou `plain` e não sabe de onde veio.

## Alternativas consideradas

Grade fixa por template, como a §4.3 do design system definia.
