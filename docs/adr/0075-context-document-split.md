---
status: accepted
---

# 75. O documento de contexto vira quatro documentos, um glossário na raiz e 74 ADRs

O `asterism-context.md` acumulava seis assuntos em 1080 linhas e era a única autoridade
citada por 124 referências. Ele foi partido por **quem manda em quê** — `docs/product.md`,
`docs/architecture.md`, `docs/model.md` e `docs/pipeline.md` —, o vocabulário saiu para o
`CONTEXT.md` da raiz, no formato que a skill de domain modeling lê, e a §16 virou
`docs/adr/`, uma decisão por arquivo. Cada arquivo renumera as seções a partir de 1, e por
isso toda referência passou a nomear o documento: `§2 de docs/model.md`. O número da
decisão sobreviveu inteiro como nome de arquivo — `ADR-0050` é o mesmo 50 —, então nenhuma
citação de decisão apontou para lugar errado.

## Alternativas consideradas

Manter o documento inteiro e só extrair o glossário, que deixaria a autoridade repartida
entre um arquivo novo e um arquivo antigo com os mesmos assuntos; ou partir preservando a
numeração global, de forma que `§6` continuasse significando o modelo de dados em qualquer
arquivo — mais barato de reescrever, e foi o que a discussão recomendou, mas deixaria três
arquivos sem `§1` e a numeração de cada um cheia de buracos.

## Consequências

As 124 referências foram reescritas numa passada mecânica **filtrada pela frase**, não pelo
número: só as linhas que diziam "documento de contexto" mudaram, porque `§11.0` e `§10.2`
em `src/` apontam para o documento de elementos e para o design system, e um `sed` por
número as teria quebrado em silêncio. A conferência é `grep`: zero ocorrências de
"documento de contexto" e de "asterism-context" no repositório.
