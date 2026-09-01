---
status: accepted
---

# 41. Ao reidratar, o slide salvo é lido por cima dos defaults do template antes de ser validado

Um slide salvo deixa de bater com o código por dois motivos que a decisão 31 tratava como um só. Falta uma chave? O commit anterior acrescentou um campo ao descritor e o que está salvo é de antes dele — dado velho, não dado torto. Uma chave tem valor de outra forma? Aí sim é dado que o template não sabe desenhar. Sem a distinção, **acrescentar uma opção compartilhada apaga o carrossel de quem já tinha um salvo**: os dez slides reprovam de uma vez e o editor abre na semente, que é exatamente a perda de trabalho que a decisão 31 existe para impedir, chegando pela porta de trás. O `showHeader` da 2F foi o primeiro caso real, e o custo do degrau são dois espalhamentos de objeto antes do `safeParse`. Uma tabela de migração por versão é o que a decisão 31 já tinha descartado, e continua descartada pelo mesmo motivo: o schema por template já sabe o que o template quer, e os defaults por template já sabem com o que ele nasce. Guardar o **resultado do parse** em vez do slide cru fecha o outro lado — chave que o template perdeu sai do dado em vez de ficar pendurada até o import/export da Etapa 4.

## Alternativas consideradas

Manter a validação crua da decisão 31, descartando todo slide a que falte uma chave; ou escrever uma tabela de migração por versão do descritor.
