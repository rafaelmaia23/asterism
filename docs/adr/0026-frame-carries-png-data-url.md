---
status: accepted
---

# 26. `Frame` carrega o bitmap como PNG em data URL

O jsPDF consome data URL direto em `addImage`, e é a forma que um teste inspeciona sem canvas — `happy-dom` não tem nenhum. O canvas deixaria o alvo escolher a codificação sem recapturar, que é o que o plano de contingência da §13 pediria se um deck com fotos estourasse o tamanho; o preço seria um `Frame` que deixa de ser dado e passa a ser objeto de DOM vivo, com o alvo dependendo do navegador. O `Blob` economiza a base64, mas o jsPDF a exigiria de volta a cada página.

## Alternativas consideradas

Devolver o `HTMLCanvasElement`, ou um `Blob`.
