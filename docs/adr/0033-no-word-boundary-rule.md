---
status: accepted
---

# 33. O parser não conhece limite de palavra: marcador vale em qualquer posição

É uma regra a menos para lembrar na hora de digitar e uma exceção a menos no tokenizer, que passa a ter uma só pergunta por posição: abriu e fechou com conteúdo? Casos legítimos em português dependem disso — `micro**serviços**`, plural colado ao fechador, sufixo depois de `[[destaque]]` — e a regra do CommonMark os recusaria sem nada na tela explicando por quê. A contrapartida é `2*3*4` virar ênfase sem que ninguém tenha pedido; é aceitável porque o canvas mostra o resultado a cada tecla, e porque um asterisco solto entre dígitos é raro em texto de carrossel.

## Alternativas consideradas

Exigir espaço, início ou pontuação antes do abridor e depois do fechador, como o `*` do CommonMark.
