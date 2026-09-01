---
status: accepted
---

# 57. Blob órfão não é coletado na 3F.

Trocar a imagem ou remover o slide deixa o binário no banco

Apagar cedo cria uma armadilha para o `zundo` da Etapa 4: o undo devolve o `ImageId` e o blob não volta com ele, então desfazer a troca traria o slide de volta **sem a imagem** — a perda de trabalho que a decisão 31 existe para impedir, chegando pela porta de trás. A varredura na reidratação é pior: na tela de múltiplos decks da Etapa 4 o deck aberto não conhece as imagens dos outros, e a limpeza apagaria o que está em uso. O lugar certo é o import/export da Etapa 4, que é quem terá o deck inteiro à mão. Vazar binário num banco local de um usuário só é o lado barato da troca, e o caso inverso — id no deck, blob ausente — já é estado **desenhado**: a §11.9 dos templates o descreve, o schema o aceita porque um id órfão é uma string válida, e a faixa mostra "Sem imagem".

## Alternativas consideradas

Apagar o blob anterior quando o campo `image` recebe outro valor, que cobre o caso comum e não custa nada hoje; ou varrer o banco na reidratação, comparando as chaves com os `ImageId` do deck.
