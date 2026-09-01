---
status: accepted
---

# 52. O tema do shiki é gerado dos tokens e um teste é quem garante: o `theme.test.ts` lê o `globals.css` e compara cor por cor

A §10.4 do design system já mandava gerar o tema dos tokens, e um módulo com os hex escritos à mão cumpre a letra da regra e não a regra: no dia em que um degrau da rampa mudar no `globals.css`, o tema fica para trás **em silêncio**, e o sintoma aparece num PDF meses depois. Ler as variáveis em tempo de execução resolveria a divergência e criaria duas piores: o tokenizador devolve cor como string e a põe em `style` inline, e uma `var()` teria de resolver contra o documento — o que dentro do `foreignObject` do palco de exportação não está garantido —, e um token que nenhuma classe referencia é podado pelo Tailwind antes de chegar ao CSS, que é a armadilha da §13. O literal com o teste contra a fonte é a única forma que é ao mesmo tempo à prova de rasterização e à prova de divergência.

## Alternativas consideradas

Escrever os dez hex da §10.4 num módulo e confiar na revisão; ou ler as variáveis CSS em tempo de execução com `getComputedStyle`.
