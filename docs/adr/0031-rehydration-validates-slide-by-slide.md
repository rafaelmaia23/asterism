---
status: accepted
---

# 31. A reidratação do `persist` valida e descarta slide a slide

O que está salvo deixa de bater com o código quando um template some, muda de chave ou de tipo — e num projeto de um usuário só o autor dessa divergência é sempre o commit anterior. Tudo-ou-nada apaga o carrossel inteiro por causa de um slide, que é a perda de trabalho no pior momento possível; confiar sem validar deixa o `get()` do registry lançar dentro do render e abre a ferramenta em tela branca, com o erro só no console. Validar a forma do deck e derrubar apenas os slides que não passam preserva o resto e nunca apaga a tela. O zod já está instalado e cada template já carrega o próprio schema, então o custo é da ordem de vinte linhas.

## Alternativas consideradas

Reiniciar do deck semente a qualquer falha; ou confiar no que está no localStorage, sem validação.
