---
status: accepted
---

# 39. O texto do CTA do `final-cta` usa `slide-code`, a 34px

Os documentos se contradiziam outra vez, e desta vez a mais específica perde: a §11.3 dava "36px JetBrains Mono" ao texto do CTA e a §3.3 do design system — que é quem decide escala tipográfica — não tem esse degrau, porque o mono dela é `slide-code`, a 34px. A decisão 19 já tinha estabelecido que o template escreve o token e nunca recompõe família, tamanho, altura e peso; escrever 36px no `index.tsx` seria exatamente a divergência que ela existe para impedir, e criar o degrau seria pior, porque a §1 pede restrição sobre invenção e o nono degrau serviria a um uso só. Os 2px de diferença são invisíveis em mono a essa escala, e a hierarquia que a decisão 29 protege continua intacta: 34px `azure-400` no miolo contra 28px `ink-400` no rodapé são vozes distintas do mesmo jeito. A §11.3 passou a nomear o token em vez do número.

## Alternativas consideradas

Criar um nono degrau na escala carrossel, `slide-cta` a 36px, como a §11.3 dos templates escrevia; ou escrever os 36px direto no template.
