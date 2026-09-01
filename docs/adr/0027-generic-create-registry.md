---
status: accepted
---

# 27. Um `createRegistry` genérico em `src/lib/registry.ts`, com dois usuários

A §10 já dizia "o registry é idêntico ao dos templates", e duas cópias da mesma lógica divergiriam na primeira correção — a regra de HMR, que existe para o `next dev` não cair a cada edição, vale para alvo tanto quanto para template. O genérico pede só o `id` e um rótulo para a mensagem de erro; cada registry continua sendo um módulo próprio, com o próprio tipo, e ninguém fora deles conhece a factory.

## Alternativas consideradas

Escrever o registry de alvos à mão, espelhando o de templates.
