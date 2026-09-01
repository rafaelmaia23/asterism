---
status: accepted
---

# 51. O realce do shiki é síncrono: `createHighlighterCoreSync`, motor de regex em JavaScript e as gramáticas importadas estaticamente

A 3D chegou esperando a armadilha: realce assíncrono chegando **depois** da captura, e o PDF saindo com o código cru. O caminho síncrono faz a armadilha não existir, e o que ele apaga é mais do que a espera do palco. Não há um quadro em que o código apareça sem cor, então nada pisca no editor; o guard de transbordo não mede uma altura antes e outra depois do realce, o que num bloco de 14 linhas é a diferença entre marcar e não marcar; e nenhum teste de template precisa de `await`, o que mantém o `describeGuardedRegion` da 3B valendo para os dois templates de código sem exceção. O preço é o bundle, e ele foi medido: 864KB crus, 133KB comprimidos. Numa ferramenta de um usuário só, que roda local e cujo produto é um arquivo que precisa sair certo, esse é o lado barato da troca. As nove linguagens da §11.6 são todas compatíveis com o motor em JavaScript, conferido na tabela de compatibilidade do shiki antes de escolher.

## Alternativas consideradas

`createHighlighterCore` com import dinâmico por linguagem, que é o caminho da documentação do shiki e o que a 3D previa — com uma segunda espera no palco de exportação, ao lado de `document.fonts.ready`.
