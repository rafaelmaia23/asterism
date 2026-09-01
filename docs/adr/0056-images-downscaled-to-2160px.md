---
status: accepted
---

# 56. A imagem é reduzida a 2160px no maior lado na importação, com o original descartado

2160 é o 1080 do formato vezes a escala 2 do alvo PDF: **é a maior resolução que o arquivo consegue aproveitar**, e o que passa dela é peso puro em quatro lugares de uma vez — o IndexedDB, o DOM, o `foreignObject` da captura e o base64 do `.json` autocontido da Etapa 4. Uma foto de celular de 4000×3000 pagaria os quatro por nada. O custo é uma função pura de dimensões e um desenho em canvas, e a redução é **oportunista**: ambiente que não decodifica o blob devolve o original, porque numa ferramenta de um usuário só guardar a foto grande é melhor que recusar a foto. O PNG na saída é o que preserva a transparência do screenshot de diagrama, que é justamente o caso que o `contain` da §11.9 existe para servir — o JPEG 0.92 continua sendo escolha do alvo, e não do armazenamento.

## Alternativas consideradas

Guardar o arquivo como veio, que é o caminho mínimo estrito que a 3F escreveu; ou reduzir e reencodar em JPEG 0.92, que é o plano B que a §10 já reserva.
