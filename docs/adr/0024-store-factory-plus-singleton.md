---
status: accepted
---

# 24. Store como factory mais singleton, em `src/editor/store.ts`

O provider se paga quando há dois decks vivos ao mesmo tempo, que é a tela de listagem da Etapa 4. Até lá ele é cerimônia: a factory já dá ao teste um store isolado por deck de fixture, sem reset global, e o singleton dá à aplicação o único deck que ela tem. O preço é que o deck é criado duas vezes, uma na pré-renderização estática e outra no cliente, com ids diferentes: manter esses ids fora do DOM deixa de ser consequência do desenho e passa a ser condição que o código sustenta — ver a armadilha na §13.

## Alternativas consideradas

Provider de contexto com o store criado no componente, como o guia do zustand para Next prescreve.
