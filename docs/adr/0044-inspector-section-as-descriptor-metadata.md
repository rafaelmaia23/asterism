---
status: superseded by ADR-0061
---

# 44. A seção do inspector é metadado de desenho no descritor

O painel precisava de "Cabeçalho" e "Rodapé" como categorias que se ligam e se encolhem, e o cabeçalho é uma faixa com **um texto e um interruptor** — separá-los em duas seções distantes faria ligar a coisa numa e escrever nela em outra. A saída é a seção ser desenho e não dado: `fields` e `options` continuam sendo dois sacos separados no modelo, a §6 continua inteira, e o que a seção diz é onde o controle **aparece**. Mover o kicker para `options` resolveria o desenho e quebraria o modelo: opção reseta na troca de layout, e o texto digitado seria perdido justamente onde a decisão 13 acabou de garantir que sobrevive. Conteúdo e Apresentação viraram seções como as outras para que a **ordem** também fosse declarativa — sem isso, a posição do Cabeçalho acima do conteúdo seria uma regra escrita no componente em vez de no descritor. O interruptor continua declarado em `options`, e não na seção, para que `options` siga sendo a lista completa das chaves de opção, que é o invariante que os testes de paridade de cada template conferem.

Superada pela [ADR-0061](./0061-slide-is-layout-plus-elements.md). A ressalva original: e uma delas mistura `field` e `option`.

## Alternativas consideradas

Duas seções fixas no componente, com o kicker aparecendo em "Conteúdo" e o interruptor em "Apresentação"; ou mover o texto do kicker para `options`, unificando o saco.
