---
status: accepted
---

# 38. A régua do rodapé fica em y 1174, em `ink-600`, e toda hairline do canvas usa a compensação de escala

Foi relatada como "some do PDF quando a grade está ligada", e a medida a 72 dpi mostrou outra coisa: a grade desenha horizontais em `54k + 1` com traço de 2px, o que em k = 22 ocupa 1189–1190, e a régua estava em 1190 no mesmo `ink-800`. Não sumia — era pintada dentro do traço da grade, na cor idêntica. Só trocar a cor deixaria uma listra de outro tom dentro de uma linha de 2px, que parece defeito de impressão; por isso mudam a posição **e** a cor. O âmbar foi comparado e descartado: a §2.5 do design system o reserva a pontuação, no máximo um uso por slide, e uma linha de 920px atravessando o canvas não é pontuação. A mesma medida expôs o segundo defeito: `height: 1px` a k = 0,28 dá 0,28 pixel de dispositivo e o navegador não pinta, então a régua aparecia no PDF — que rasteriza a k = 1 — e faltava no preview. É a decisão 15 outra vez, e ela deixou de ser um detalhe da grade para virar a utility `slide-hairline`, que vale para qualquer linha fina dentro do slide.

## Alternativas consideradas

Deixá-la em y 1190 e só trocar a cor; ou tingi-la de âmbar; ou aceitar `height: 1px` como as outras bordas do editor.
