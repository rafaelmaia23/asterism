---
status: accepted
---

# 54. Os três descritores do bloco de código — `code`, `file` e `lang` — são o mesmo objeto nos dois templates de código, em `shared/fields.ts`

A §6 exige que a mesma chave tenha o mesmo **tipo de campo** na biblioteca inteira, e não por elegância: `migrateFields` compara chave **e** forma de valor, e chave cuja forma não bate fica com o default do destino. Dois descritores copiados passam em qualquer teste de propriedade no dia em que nascem e divergem no dia em que um limite muda num só — e o sintoma é o mais caro que a ferramenta tem, porque a troca entre `code-window` e `code-annotated` é a mais provável da biblioteca: percebi que a janela precisava de uma frase. O que se perderia é o código, não a formatação. É o caminho que o `kicker` já tinha percorrido na 2F pelo mesmo argumento, e o custo é um `import`. O `heading` ficou de fora de propósito, apesar de os dois templates o declararem com os mesmos 60 caracteres: o limite acompanha a região — 70 na capa em 96px, 60 num slide de código em 56px —, e compartilhá-lo transformaria uma coincidência de dois em regra para dez.

## Alternativas consideradas

Declarar os três em cada um dos dois, com as mesmas propriedades, que é como o `code-window` nasceu na 3D; e guardar a igualdade com um teste de propriedade em cada lado.
