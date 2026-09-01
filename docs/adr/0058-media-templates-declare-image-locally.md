---
status: superseded by ADR-0061
---

# 58. `image` e `imageFit` são declarados nos dois templates de mídia

A regra da §6 é que a mesma chave tenha o mesmo **tipo de campo** na biblioteca inteira, e ela está cumprida: os dois declaram `type: "image"`, e é isso que faz a troca entre os dois preservar a imagem escolhida — há teste de migração para o caso, que é o mais provável da dupla. O que difere é o `ratio`, 5:16 contra 108:91, e ele acompanha a **região**: um descritor compartilhado teria de escolher um dos dois e mentir para o outro. É exatamente o precedente do `heading`, que ficou fora do `shared/` na 3E apesar de os dois templates de código o declararem com os mesmos 60 caracteres. O `imageFit` tem o argumento que a própria §11.9 escreve: compartilhada, na §11.0, é o que os **dez** expõem, e dois de dez é opção própria declarada duas vezes com o mesmo nome — se um terceiro template de mídia aparecer, ela sobe, e não antes.

Superada pela [ADR-0061](./0061-slide-is-layout-plus-elements.md). A ressalva original: e não em `shared/`.

## Alternativas consideradas

Subi-los para `shared/fields.ts` e `shared/options.ts` como a decisão 54 fez com `code`, `file` e `lang`, com o teste de identidade de objeto.
