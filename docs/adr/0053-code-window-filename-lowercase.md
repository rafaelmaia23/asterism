---
status: accepted
---

# 53. O nome do arquivo na barra da janela de código sai em caixa baixa, contra a versalização da utility `slide-meta`

A §10.5 justifica a caixa alta do `slide-meta` dizendo que ela é **da escala, não do conteúdo**: `api/ · 04` é digitado assim e sai versal sem que o dado guardado mude. O nome do arquivo é a única peça `slide-meta` da biblioteca que é um **identificador literal**, e ali a justificativa se inverte — `CACHE.TS` não é o mesmo nome em outra caixa, é um arquivo que não existe no repositório, num slide cujo assunto é justamente o código daquele arquivo. A exceção é nomeada nos dois documentos, §10.3 do design system e §11.6 dos templates, para não virar divergência de implementação.

## Alternativas consideradas

Deixar a utility valer, como no kicker e no handle, e o nome sair `CACHE.TS`.
