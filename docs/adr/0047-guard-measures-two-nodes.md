---
status: accepted
---

# 47. O guard de transbordo mede dois nós — a faixa, que tem altura de spec, e o bloco de conteúdo dentro dela — e o resultado não vai para o store

Medir um nó só **reprova em silêncio nos templates que ancoram o conteúdo à base**: o que não cabe sobe acima da borda superior, e o que sobe não entra no `scrollHeight` do pai. O `cover-statement` alinha o título à base desde a 1.7 e o `final-cta` faz o mesmo com o bloco de fecho — dois dos três templates existentes, e nada no papel avisava. Comparar a altura do conteúdo com a da faixa funciona nas duas âncoras, e cobra do template só o que ele já tinha: uma faixa com altura escrita e um bloco dentro dela. O `final-cta` ganhou o bloco, que era o único dos três em que os três elementos eram filhos diretos da faixa. Sobre o store: `scrollHeight` e `clientHeight` são medidas de layout e **não enxergam o `transform: scale()`**, então a mesma leitura vale a 1:1 na exportação, a k ≈ 0,28 no canvas e a k = 0,2 na miniatura — e como a lista lateral desenha todos os slides pelo mesmo `SlideView`, cada slide desenhado mede a si mesmo. O critério da 3.5, "a lista mostra o slide inválido sem que o canvas esteja nele", sai de graça, sem estado global para manter em dia, sem sincronizar dois caminhos de medida e sem um mapa que precisaria ser limpo ao remover slide.

## Alternativas consideradas

Comparar `scrollHeight` com `clientHeight` no mesmo elemento, que é como a §9 descrevia e como o teste óbvio faria; e guardar um mapa de transbordo por slide no store, alimentado por quem estivesse exibindo o slide.
