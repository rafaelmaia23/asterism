# Observatório — biblioteca de templates

> **Versão** 1.0 · **Autor** Rafael · **Escopo** os dez templates do `asterism`
> Extraído da §11 de `observatorio-design-system.md`, que continua sendo a fonte da
> verdade visual — cor, tipografia, grade do slide e componentes recorrentes moram lá.
> Aqui está apenas o que muda de um template para o outro: regiões, campos, opções e
> comportamento.
> A numeração é preservada de propósito. Este arquivo abre em §11 e as referências
> `§11.x` feitas de outros documentos continuam válidas — mudou o arquivo onde a seção
> mora, não o endereço dela.

---

## 11. Biblioteca de templates

Dez templates organizados por função narrativa. Estrutura de deck:
`capa → contexto → desenvolvimento (n) → payoff → cta`, alvo de 8 a 12 slides.

| §    | Template          | Função                 | Fundo   | Status        |
| ---- | ----------------- | ---------------------- | ------- | ------------- |
| 11.1 | `cover-statement` | Gancho                 | `grid`  | especificado  |
| 11.2 | `text-bullets`    | Desenvolvimento        | `plain` | especificado  |
| 11.3 | `final-cta`       | Fechamento             | `grid`  | especificado  |
| —    | `context`         | Segurar o leitor       | `plain` | a especificar |
| —    | `text-impact`     | Respiro                | `grid`  | a especificar |
| —    | `code-window`     | Código puro            | `plain` | a especificar |
| —    | `code-annotated`  | Código com explicação  | `plain` | a especificar |
| —    | `compare-2col`    | Antes/depois           | `plain` | a especificar |
| —    | `split-vertical`  | Texto + imagem         | `plain` | a especificar |
| —    | `image-caption`   | Imagem dominante       | `plain` | a especificar |

Os três especificados são os da Fase 1 do `asterism`. Os demais seguem o mesmo formato
quando forem implementados: regiões, elementos, campos, opções, comportamento e o bloco
de `defaults`.

### 11.0 Regras comuns

Todo template ocupa 1080×1350 com padding de 80px em todos os lados, o que dá uma
largura útil de **920px**. Nada de logo ou CTA a menos de 60px da borda.

O rodapé ocupa a última faixa, com a linha de base do conteúdo alinhada a 80px do
fundo. Composição: `MaiahubGlyph` a 32px em `ink-200`, com ou sem a placa atrás, gap 20px,
handle em `slide-meta` `ink-400` à esquerda; constelação à direita, e o chevron depois
dela. Acima da faixa, opcionalmente, a régua. A capa é o único template que **nasce** sem
logo e sem handle — é padrão, não trava. Ver a §10.5 do design system.

A peça é a **glyph**, escolhida por comparação visual das três só-símbolo a 32px sobre a
superfície do slide. A escolha contraria a faixa de 16–24px que a documentação da marca
dá à glyph, e é deliberada: a 32px sobre `ink-950`, o traço mais grosso e os pontos
maiores da correção ótica é justamente o que mantém a peça legível — a `MaiahubMark`,
apesar de estar dentro da própria faixa, some no rodapé escuro. Ver `maiahub-logo.md`.

A assinatura e o wordmark estão descartados para este uso: os dois trazem "maiahub"
escrito, que competiria com o `@handle` do deck no mesmo canto.

Todo texto é alinhado à esquerda. Toda quebra de linha é natural: não existe campo de
quebra manual, porque quebra manual congela o layout e some com a razão de os templates
existirem.

Os limites de caractere na tabela de campos são **conselho, não trava**. O campo aceita
mais; o contador fica âmbar ao passar do limite e o guard de transbordo é quem reprova
de fato, medindo altura real.

**Todo template expõe seis opções compartilhadas**, que vêm dos descritores em
`src/templates/shared/options.ts` e abrem a lista de opções, nesta ordem:

| Chave | Efeito |
| --- | --- |
| `showGrid` | Grade de fundo |
| `showRule` | Régua entre o conteúdo e o rodapé |
| `showLogo` | A glyph no rodapé |
| `showLogoPlate` | O fundo quadrado atrás da glyph |
| `showHandle` | O `@handle` no rodapé |
| `showChevron` | A afordância de deslize |

Em todas vale a mesma regra: o descritor do template diz apenas com que valor o slide
**nasce**, e a escolha é de quem edita — §4.3 e §10.5 do design system, decisão 25. O
`background` do template é o padrão de `showGrid`, e nada mais.

A ordem é a de leitura da faixa, de fora para dentro, e é a ordem em que o inspector
desenha os controles. A tabela de opções de cada template abaixo **omite as seis**, que
são comuns a todos, e lista só o que é próprio dele; a tabela de padrões, no bloco
`defaults` ao fim de cada seção, traz todas.

---

### 11.1 `cover-statement`

**Função** gancho · **Fundo** `grid` · **Grupo** `cover`

O único template que **nasce** sem identidade no rodapé. O título é a única coisa que
importa e nada compete com ele — recomendação, não trava: `showLogo` e `showHandle` estão
ali para quem quiser assinar a capa.

#### Regiões

| Região | Faixa vertical | Conteúdo                                       |
| ------ | -------------- | ---------------------------------------------- |
| Kicker | 80 – 148       | `slide-meta`, `azure-400`                      |
| Título | 300 – 1160     | `slide-display`, alinhado à **base** da região |
| Rodapé | 1238 – 1270    | A faixa compartilhada; nasce com constelação e chevron |

O título ser alinhado à base da região é a decisão estrutural do template: com uma linha
ou com quatro, a última linha pousa sempre na mesma altura. Sem isso, cada capa do
carrossel teria um ritmo diferente e a série perderia identidade.

#### Elementos

| Elemento           | Token                                                             | Cor                     |
| ------------------ | ----------------------------------------------------------------- | ----------------------- |
| Kicker             | `slide-meta` (28px mono, tracking 0.12em, caixa alta)             | `azure-400`             |
| Título             | `slide-display` (96px Oxanium 700, altura 1.05, tracking -0.02em) | `ink-100`               |
| Destaque no título | idem                                                              | `azure-400`             |
| Constelação        | 12px, gap 12px                                                    | `azure-400` / `ink-700` |
| Chevron            | 40px, traço 2.25, gap 20px após a constelação                     | `azure-400`             |

#### Campos

| Chave     | Tipo       | Limite | Marcação | Descrição                       |
| --------- | ---------- | ------ | -------- | ------------------------------- |
| `kicker`  | `text`     | 12     | não      | Pilar e índice, ex. `api/ · 04` |
| `heading` | `textarea` | 70     | sim      | Declaração ou pergunta          |

#### Opções

Nenhuma própria — a capa expõe só as seis compartilhadas da §11.0. O `showChevron` era
próprio dela até a 2B; virou compartilhado, e a capa passou a ser apenas o único template
que nasce com ele ligado.

#### Comportamento

**Título curto** (uma ou duas linhas) — pousa na base da região e deixa o topo vazio.
É intencional: o vazio acima é respiro, não erro de layout.

**Título longo** — em 96px com 920px de largura, cabem cerca de 19 caracteres por linha.
O limite de 70 dá aproximadamente quatro linhas, o que preenche a região. Acima de cinco
linhas o texto invade o rodapé e o guard reprova.

**Marcação** — na prática só `[[destaque]]` é usado aqui. `**forte**` não tem efeito
visível em Oxanium 700, que já é o peso máximo da família. `==marca==` fica pesado
demais em 96px e não deve ser usado em título.

```ts
defaults: {
  fields:  { kicker: "log/ · 01", heading: "Um título que declara algo em vez de prometer" },
  options: {
    showGrid: true, showRule: false,
    showLogo: false, showLogoPlate: true, showHandle: false,
    showChevron: true,
  },
}
```

---

### 11.2 `text-bullets`

**Função** desenvolvimento · **Fundo** `plain` · **Grupo** `content`

O template mais usado de um carrossel. Cabeçalho no topo, itens no miolo, rodapé fixo.

#### Regiões

| Região    | Faixa vertical | Conteúdo                                    |
| --------- | -------------- | ------------------------------------------- |
| Cabeçalho | 80 – 230       | `slide-heading`, até duas linhas            |
| Itens     | 294 – 1160     | Lista, centralizada verticalmente na região |
| Rodapé    | 1238 – 1270    | Logo, handle, constelação                   |

#### Elementos

| Elemento             | Token                                           | Cor         |
| -------------------- | ----------------------------------------------- | ----------- |
| Cabeçalho            | `slide-heading` (56px Oxanium 600, altura 1.15) | `ink-100`   |
| Marcador             | travessão `—` em `slide-body` mono              | `azure-400` |
| Item                 | `slide-body` (40px Sora 400, altura 1.5)        | `ink-100`   |
| Gap marcador → texto | 32px                                            | —           |
| Gap entre itens      | 48px                                            | —           |

O marcador é um travessão, não uma bolinha. Bolinha lê como apresentação corporativa;
travessão em JetBrains Mono puxa para o registro de terminal, que é o do sistema.

#### Campos

| Chave     | Tipo       | Limite                      | Marcação | Descrição          |
| --------- | ---------- | --------------------------- | -------- | ------------------ |
| `heading` | `textarea` | 60                          | não      | Cabeçalho do slide |
| `items`   | `list`     | 4 itens, 80 caracteres cada | sim      | Tópicos            |

#### Opções

| Chave    | Tipo     | Padrão   | Efeito                                                                        |
| -------- | -------- | -------- | ----------------------------------------------------------------------------- |
| `anchor` | `select` | `center` | `center` distribui os itens no miolo; `top` encosta logo abaixo do cabeçalho |

#### Comportamento

**Três itens é o alvo, quatro é o teto.** Com dois itens o slide fica vazio e o conteúdo
pede `text-impact`; com cinco, transborda e o conteúdo pede dois slides.

**Item longo** — 40px em 888px de largura útil comporta cerca de 44 caracteres por linha.
O limite de 80 dá até duas linhas por item. Três linhas ainda cabem se houver apenas
dois itens, mas o resultado fica denso.

**Marcação** — vale a regra de um nível de ênfase por bloco. Negrito, código inline e
marca-texto no mesmo slide competem entre si e anulam a hierarquia. Escolha um.

```ts
defaults: {
  fields: {
    heading: "Três coisas que eu mudaria",
    items: ["Primeiro ponto", "Segundo ponto", "Terceiro ponto"],
  },
  options: {
    showGrid: false, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
    anchor: "center",
  },
}
```

---

### 11.3 `final-cta`

**Função** fechamento · **Fundo** `grid` · **Grupo** `final`

O bloco de conteúdo é ancorado à base, espelhando a capa — a série abre e fecha com o
mesmo gesto tipográfico. A constelação aparece inteira acesa.

#### Regiões

| Região   | Faixa vertical | Conteúdo                                 |
| -------- | -------------- | ---------------------------------------- |
| Vazio    | 80 – 400       | Respiro, sempre                          |
| Conteúdo | 400 – 1160     | Título, lead e CTA, alinhados à **base** |
| Rodapé   | 1238 – 1270    | Logo, handle, constelação toda acesa     |

#### Elementos

| Elemento     | Token                                                                                                           | Cor         |
| ------------ | --------------------------------------------------------------------------------------------------------------- | ----------- |
| Título       | `slide-title` (72px Oxanium 700, altura 1.1, tracking -0.02em)                                                  | `ink-100`   |
| Lead         | `slide-lead` (44px Sora 400, altura 1.45), gap 48px do título                                                   | `ink-400`   |
| Bloco de CTA | superfície `slide-surface`, `border-left: 4px solid azure-400`, raio **0**, padding 32px 40px, gap 64px do lead | —           |
| Texto do CTA | `slide-code` (34px JetBrains Mono, altura 1.5)                                                                  | `azure-400` |
| Prefixo      | `→ `                                                                                                            | `azure-400` |

O CTA reusa a forma do callout em vez de um botão, e ocupa a largura útil inteira. Num PDF
nada é clicável, e desenhar algo com aparência de botão promete uma interação que não
existe.

Esta linha dizia "36px JetBrains Mono", tamanho que a escala da §3.3 do design system não
tem — o degrau mono dela é `slide-code`, a 34px. Vence a escala: a decisão 19 diz que o
template escreve o token e nunca recompõe família, tamanho, altura e peso, e um nono
degrau para um uso só seria invenção onde o sistema pede restrição. Decisão 39.

#### Campos

| Chave     | Tipo       | Limite | Marcação | Descrição             |
| --------- | ---------- | ------ | -------- | --------------------- |
| `heading` | `textarea` | 55     | sim      | Fecho                 |
| `lead`    | `textarea` | 90     | não      | Complemento, opcional |
| `cta`     | `text`     | 40     | não      | Destino ou ação       |

#### Opções

| Chave       | Tipo     | Padrão | Efeito             |
| ----------- | -------- | ------ | ------------------ |
| `showArrow` | `toggle` | `true` | Prefixo `→` no CTA |

#### Comportamento

**Lead vazio** — o bloco desaparece junto com o gap. Título e CTA encostam com 64px
entre eles. É a versão mais limpa do template e uma escolha válida.

**Título longo** — 72px em 920px comporta cerca de 25 caracteres por linha; o limite de
55 dá duas ou três linhas.

**Constelação** — inteira acesa, porque este é o último slide. A contagem sai da
**posição** no deck, como em todo template: o fechamento não força nada. Um `final-cta`
parado no meio do carrossel mostra o progresso real, e o rodapé nunca discorda da lista
lateral — é a decisão 36 aplicada à peça vizinha do chevron.

**Lead** — vazio é string vazia, não campo ausente: o dado continua lá para ser escrito de
volta, e é o template que decide não desenhar o bloco.

```ts
defaults: {
  fields: {
    heading: "Escrevo sobre os erros antes dos acertos.",
    lead: "Backend, infra e o que aprendo quebrando os dois.",
    cta: "blog.maiahub.com.br",
  },
  options: {
    showGrid: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
    showArrow: true,
  },
}
```
