---
status: accepted
---

# 40. A constelação desenha um ponto por slide em qualquer contagem — o recorte acima de 10 slides da §10.5 do design system foi revogado

O documento pedia "5 pontos mais um contador" sem dizer quais cinco, e a pergunta que parecia de detalhe era a regra inteira: as três leituras foram montadas numa rota descartável com um deck de 12 slides e nenhuma passou. **Os cinco primeiros** congelam no slide 5 e ficam idênticos pelos oito seguintes. **A janela deslizante** é pior do que a previsão do `TODO.md`: não é só que o último aceso não se move — do slide 4 ao 10 a faixa inteira mostra `●●●○○`, sete slides sem informação nenhuma, e só as duas pontas dizem alguma coisa. **A amostragem espalhada** é a única que se mexe de ponta a ponta, mas avança em quatro degraus (slides 4, 7, 9 e 12) com espaçamento irregular, e o que ela entrega em troca de perder oito pontos é um número que ninguém pediu. O recorte existia para resolver um problema de espaço que **não se mediu antes de escrever a regra**: a faixa comporta 26 pontos antes de a constelação encostar no handle, e o teto da Etapa 2 é 12. É a §1 do design system aplicada à própria §10.5 — restrição sobre invenção —, e o custo de manter a regra simples é um limite que nenhum carrossel real alcança.

## Alternativas consideradas

As três leituras do recorte que o experimento 2 levantou: os cinco primeiros pontos, uma janela deslizante de cinco em torno do atual, ou cinco posições amostradas pelo deck — todas com o contador `03 / 12` ao lado.
