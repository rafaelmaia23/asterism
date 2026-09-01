---
status: accepted
---

# 50. O reset do `preflight` é reinjetado no clone pelo `onCloneNode` do `rasterize`, como folha de seletor universal

O defeito chegou como "o `final-cta` transborda no rodapé", e a tentação era corrigir o `final-cta`. Medindo o bitmap com e sem o reset, **quatro dos cinco templates mudavam de desenho** — a capa subia o título 96px, o `context` descia o corpo 40, o `text-bullets` descia o título, e só o `text-impact` passava intacto porque centralizar cancela margem simétrica. Corrigir no template seria remendar o sintoma num dos quatro e deixar os outros três errados em silêncio, além de comprometer os cinco templates que faltam com uma regra que ninguém saberia explicar. `m-0` não resolve: `margin: 0px` é o valor inicial, e é justamente o que a clonagem não emite. `includeStyleProperties` inverte o problema — vira uma lista de propriedades para manter em dia a cada elemento novo. A folha injetada é uma linha, vale para os dez templates de uma vez e tem a especificidade certa: estilo em linha vence, então o `padding` que um bloco declara de verdade continua valendo e some só o que ninguém declarou.

## Alternativas consideradas

Corrigir template a template, tirando o `justify-end` do `final-cta` e ajustando o que mais aparecesse; ou declarar `m-0` em cada elemento dos templates; ou copiar mais propriedades no clone com `includeStyleProperties`.
