---
status: accepted
---

# 55. O `ImageId` vira URL num cache de módulo em `src/images/cache.ts`, fora do store, e a pasta `src/images` é folha — não importa nada do sistema

O store persiste o deck e **só o deck**, e um object URL não é estado a guardar: é um handle do documento vivo, que morre no reload e nasce de novo. Numa fatia do store ele obrigaria o `partialize` a excluí-lo e o `reviveDeck` a ignorá-lo, para guardar uma coisa que nunca deve ser guardada. O contexto resolveria o preview e não o segundo consumidor: o palco de exportação monta uma **raiz React própria** e precisa das URLs antes de renderizar, porque um `<img>` cujo `src` chega no quadro seguinte não está no bitmap — e o que o template desenha nesse quadro é o estado "Sem imagem", que é honesto e vai para o arquivo. O cache de módulo serve os dois caminhos com uma cópia só, e a folha é o que impede o ciclo: o `ImageBand` dos templates importa `src/images`, então `src/images` não pode importar o registry. Daí o `collectImageIds` morar no palco, onde as chaves de imagem saem dos **descritores** e nunca de um `"image"` escrito à mão.

## Alternativas consideradas

Uma fatia do store zustand com as URLs, ao lado do deck; ou um contexto React com o cache, com provider no shell e outro no palco de exportação.
