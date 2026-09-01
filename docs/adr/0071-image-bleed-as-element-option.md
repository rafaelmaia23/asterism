---
status: accepted
---

# 71. O sangramento de imagem vira opção fechada do elemento `image` — `none`, `top`, `edge`

Mantém a decisão 46 viva sem recriar o molde fixo que a 61 dissolveu. Um valor `edge` em vez de uma lista de bordas, porque a borda que faz sentido sangrar é sempre a que o container encosta — escolher lado a lado seria devolver a folha de estilo.

## Alternativas consideradas

Faixa de sangramento declarada no layout do slide; ou acabar com o sangramento e conter toda imagem nos 920px.
