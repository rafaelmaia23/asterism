---
status: accepted
---

# 63. `columns` é tupla de dois, com um nível de profundidade, proporção e alinhamento fechados

Três colunas em 920px dão sete caracteres por linha. Tupla e `Exclude<Element, { t: "columns" }>` põem as duas impossibilidades no compilador, e não numa validação que alguém precisa lembrar de rodar.

## Alternativas consideradas

Uma lista de N colunas, com largura livre e aninhamento arbitrário.
