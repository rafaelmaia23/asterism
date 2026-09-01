---
status: accepted
---

# 29. O `final-cta` leva o rodapé completo — glyph, handle e constelação toda acesa

Os documentos se contradiziam: a §10.5 tirava o rodapé da capa **e do final**, e a tabela de regiões da §11.3 dos templates dava ao final "Logo, handle, constelação toda acesa". Vence a §11.3, que é a mais específica — nomeia as três peças na faixa deste template — e que o `CLAUDE.md` faz autoridade sobre comportamento de template. O motivo de produto é que o último slide é onde o handle mais importa: quem chegou até o fim é quem vai seguir. A objeção real é que o bloco de CTA já carrega um destino escrito e o handle competiria com ele, que foi o que descartou o wordmark no experimento 1; a diferença é que o CTA fica no miolo, em 36px mono `azure-400`, e o handle no rodapé em 28px `ink-400` — hierarquias distintas, não duas vozes no mesmo canto. A §10.5 foi corrigida no mesmo commit.

## Alternativas consideradas

Espelhar a capa: só constelação, sem logo nem handle, como a §10.5 do design system dizia.
