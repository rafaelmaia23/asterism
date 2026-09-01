---
status: accepted
---

# 76. A lista ordenada é renumerada de 1, e o número escrito é ignorado

A §2 de `docs/model.md` dizia que em `1. ` "o número é o que estiver escrito", mas o tipo
que ela mesma declarava — `{ t: "ol"; items: string[] }` — não tinha onde guardá-lo. O
marcador desenhado é sempre nosso, em mono `azure-400`, e não o `::marker` do navegador,
então a numeração é escolha do renderizador de qualquer jeito: `parseBlocks` descarta o
número da linha e o `<Blocks>` numera pela posição.

## Consequências

Como o número escrito é descartado, um marcador de mais de dois dígitos apagaria texto do
autor: `2024. o ano em que tudo mudou` sairia como item `1.` sem o ano. Por isso o marcador
de lista ordenada aceita **um ou dois dígitos** — lista de até 99 itens, que é mais do que
um slide comporta, e ano ou valor no começo da frase continuam sendo parágrafo.

## Alternativas consideradas

Guardar o `start` da lista e renumerar a partir dele; ou guardar o número por item, de modo
que `1. / 1. / 1.` saísse como três "1.". As duas devolvem ao autor um controle de
apresentação disfarçado de conteúdo — a mesma porta dos fundos que a ADR-0067 fechou ao
recusar o elemento de espaçamento —, e a lista real de um carrossel tem três a cinco itens
começando em 1.
