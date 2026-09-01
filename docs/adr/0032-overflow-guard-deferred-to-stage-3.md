---
status: accepted
---

# 32. O guard de transbordo continua na Etapa 3

Foi considerado porque a Etapa 2 termina compondo 8 a 12 slides de conteúdo de verdade, que é exatamente quando texto longo transborda. Fica onde está: na Etapa 2 o aviso é o contador de caractere, que já existe e já fica âmbar ao passar do limite, mais o próprio canvas — quem compõe está olhando cada slide enquanto digita. Antecipar traria `ResizeObserver` medindo **dentro** do slide, que é o laço de medição da §13, e essa é a tarefa mais delicada da Etapa 3: não é trabalho para fazer de passagem no fim de outra etapa.

## Alternativas consideradas

Antecipar um guard mínimo para a Etapa 2, que é quando o primeiro carrossel real é composto.
