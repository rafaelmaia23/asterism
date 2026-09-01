---
status: accepted
---

# 34. O peso de `forte` é `max(600, --slide-font-weight)`, lido por herança da utility de escala

Os documentos se contradiziam: a §10.2 dá 600 ao marcador e a §11.1 dos templates diz que ele "não tem efeito visível" no título em Oxanium 700 — com 600 fixo o trecho marcado sairia **mais leve** que a frase, que é o oposto do que o marcador significa, e a marcação passaria a depender do template em que o texto caiu. `bolder` não resolve: é relativo por degrau, levaria a Sora 400 a 700 em vez de 600 e a Oxanium 700 a 900, fora do eixo declarado da família. Passar o peso por prop faria o `<Inline>` conhecer template, quebrando a §5 — o parser e o renderer de marcação não sabem o que existe adiante. Herança de custom property resolve sem nenhum dos três preços: cada `@utility slide-*` publica o próprio peso, o marcador lê com `max()`, e as duas seções passam a ser verdadeiras ao mesmo tempo.

## Alternativas consideradas

Aplicar os 600 fixos que a §10.2 escreve; ou usar `font-weight: bolder`; ou o template informar o peso base ao `<Inline>`.
