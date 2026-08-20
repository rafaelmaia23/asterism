# Observatório — design system

> **Versão** 2.0 · **Autor** Rafael · **Escopo** tema escuro único
> Substitui a v1.0, que definia os tokens em OKLCH com hue 262. As escalas agora são
> hex sRGB no padrão de degradê do Tailwind — decisão que também resolve a
> serialização de cor na rasterização do `asterism`.

---

## 1. Conceito

Um observatório é um instrumento: preciso, sóbrio, feito para olhar longe no escuro.
O sistema é escuro por padrão, frio na base, e usa cor com parcimônia — luz sobre
fundo escuro é informação, não decoração.

### Princípios

**Profundidade vem de superfície e borda.** Não há sombra projetada, glow, ruído,
blur ou neon. Um elemento se destaca por ser um degrau mais claro que o fundo e por
ter uma borda de 1px, nunca por flutuar.

**Cor é sinal.** A base é neutra fria. Azul marca estrutura e importância; âmbar marca
atenção. Se tudo está colorido, nada está.

**Restrição sobre invenção.** As escalas são as do Tailwind. O trabalho do sistema é
dizer quais degraus são permitidos, não criar degraus novos.

**Tipografia carrega a personalidade.** É de onde vem o caráter — Oxanium tem desenho
técnico e anguloso, JetBrains Mono é instrumento. O neutro pode ser familiar porque
não é ele que diferencia.

---

## 2. Cor

### 2.1 Escalas

Cinco ramps completas. Os degraus fora dos papéis semânticos ficam disponíveis para
situações que apareçam — não são proibidos, apenas não têm papel atribuído.

**`azure-radiance`** — marca, estrutura, ação

|               |               |               |               |
| ------------- | ------------- | ------------- | ------------- |
| 50 `#eff6ff`  | 100 `#dbeafe` | 200 `#bfdbfe` | 300 `#93c5fd` |
| 400 `#60a5fa` | 500 `#3b82f6` | 600 `#2563eb` | 700 `#1d4ed8` |
| 800 `#1e40af` | 900 `#1e3a8a` | 950 `#172554` |               |

**`sun`** — atenção, realce pontual

|               |               |               |               |
| ------------- | ------------- | ------------- | ------------- |
| 50 `#fff9eb`  | 100 `#fdeec8` | 200 `#fada8d` | 300 `#f8c251` |
| 400 `#f6a823` | 500 `#f08810` | 600 `#d4640b` | 700 `#b0450d` |
| 800 `#8f3511` | 900 `#762c11` | 950 `#441504` |               |

**`crown-of-thorns`** — erro, destrutivo

|               |               |               |               |
| ------------- | ------------- | ------------- | ------------- |
| 50 `#fef2f2`  | 100 `#fee2e2` | 200 `#fecaca` | 300 `#fba6a6` |
| 400 `#f77272` | 500 `#ee4545` | 600 `#db2727` | 700 `#b81d1d` |
| 800 `#981c1c` | 900 `#7c1d1d` | 950 `#450a0a` |               |

**`pacifika`** — sucesso, confirmação

|               |               |               |               |
| ------------- | ------------- | ------------- | ------------- |
| 50 `#fbfce9`  | 100 `#f3f7d0` | 200 `#e7efa7` | 300 `#d4e373` |
| 400 `#bfd447` | 500 `#a1b929` | 600 `#7e931d` | 700 `#697c1d` |
| 800 `#4d5a1a` | 900 `#414c1b` | 950 `#222a09` |               |

**`ink`** — neutro (Tailwind `slate`)

|               |               |               |               |
| ------------- | ------------- | ------------- | ------------- |
| 50 `#f8fafc`  | 100 `#f1f5f9` | 200 `#e2e8f0` | 300 `#cbd5e1` |
| 400 `#94a3b8` | 500 `#64748b` | 600 `#475569` | 700 `#334155` |
| 800 `#1e293b` | 900 `#0f172a` | 950 `#020617` |               |

O `slate` está em hue ~215°, praticamente a mesma matiz do `azure-radiance` (217°).
Base e marca pertencem à mesma família de temperatura, e o âmbar entra como a única
nota quente do sistema.

### 2.2 Escada de superfícies

Quatro degraus, do mais profundo ao mais alto. Nunca pule degraus e nunca use mais de
dois níveis empilhados na mesma tela.

| Papel      | Token                          | Valor               | Uso                                          |
| ---------- | ------------------------------ | ------------------- | -------------------------------------------- |
| Canvas     | `background`                   | `ink-950` `#020617` | Fundo da página; fundo do slide              |
| Superfície | `card`, `popover`              | `ink-900` `#0f172a` | Painéis, cartões, área de trabalho do editor |
| Elevada    | `secondary`, `accent`, `muted` | `ink-800` `#1e293b` | Blocos de código, campos, hover, chips       |
| Borda      | `border`, `input`              | `ink-800` `#1e293b` | Hairline de 1px                              |

Borda e superfície elevada compartilham o valor de propósito: um elemento ou é um
degrau mais claro, ou tem borda, raramente os dois.

No editor do `asterism` isso se inverte de forma útil — a área de trabalho é
`ink-900` e o slide é `ink-950`, então o slide fica **mais escuro** que o entorno e
se lê como objeto, sem precisar de borda que depois teria de ser removida na exportação.

### 2.3 Texto

| Papel              | Valor               | Contraste sobre canvas | Uso                               |
| ------------------ | ------------------- | ---------------------- | --------------------------------- |
| `foreground`       | `ink-100` `#f1f5f9` | 17:1                   | Corpo e títulos                   |
| `muted-foreground` | `ink-400` `#94a3b8` | 7,3:1                  | Texto de apoio, rótulos           |
| —                  | `ink-500` `#64748b` | 3,9:1                  | **Só** metadados a partir de 18px |
| Desabilitado       | `ink-600` `#475569` | 2,2:1                  | Estado desabilitado apenas        |

Branco puro não é usado em lugar nenhum. `ink-100` reduz o brilho sem custar legibilidade.

`ink-500` reprova em AA para texto pequeno. Se algo precisa ser lido, o piso é `ink-400`.

### 2.4 Papéis de cor

| Papel      | Fundo                    | Texto sobre ele          | Contraste |
| ---------- | ------------------------ | ------------------------ | --------- |
| Primário   | `azure-400` `#60a5fa`    | `azure-950` `#172554`    | 5,7:1     |
| Destrutivo | `crown-400` `#f77272`    | `crown-950` `#450a0a`    | 5,7:1     |
| Sucesso    | `pacifika-400` `#bfd447` | `pacifika-950` `#222a09` | 10:1      |
| Aviso      | `sun-400` `#f6a823`      | `sun-950` `#441504`      | 9,1:1     |

O padrão é uniforme: **tom 400 como preenchimento, tom 950 como texto.** Cor saturada
com texto branco reprovaria em AA em três dos quatro casos, então o sistema não usa
essa combinação em lugar nenhum.

Para texto colorido sobre o canvas (links, ênfase), use o tom 400 diretamente.
Para fundos tingidos discretos, o tom 950 sobre o canvas com texto no tom 300.

### 2.5 Regras de uso

**Azul é estrutura.** Links, foco, botão primário, o marcador `[[destaque]]`, pontos
percorridos do indicador de progresso, borda esquerda de callout informativo.

**Âmbar é pontuação.** No máximo **um uso por tela ou por slide**. Reservado ao
marcador `==marca-texto==`, ao realce de linha em bloco de código e a avisos.
Azul e âmbar nunca aparecem no mesmo parágrafo — se ambos parecem necessários, a
hierarquia do conteúdo está errada.

**Verde e vermelho são estado.** Nunca decorativos. Não use verde para "positivo" em
contexto de conteúdo, só em contexto de sistema — a exceção é o par diff dentro de
bloco de código.

**Proibições.** Sem gradiente (exceto overlay escuro sobre foto), sem sombra projetada,
sem glow, sem ruído, sem blur, sem neon.

---

## 3. Tipografia

### 3.1 Famílias

| Papel      | Família            | Peso          | Uso                                   |
| ---------- | ------------------ | ------------- | ------------------------------------- |
| Display    | **Oxanium**        | 600, 700      | Títulos, números grandes, logo        |
| Corpo      | **Sora**           | 400, 500, 600 | Todo texto corrido e de interface     |
| Utilitária | **JetBrains Mono** | 400, 500      | Código, kicker, contadores, metadados |

Todas sob OFL 1.1, arquivos locais no projeto. Oxanium nunca é usada em texto corrido —
o desenho anguloso cansa acima de duas linhas.

### 3.2 Escala web

| Token        | Família        | Tamanho | Altura | Peso | Tracking          |
| ------------ | -------------- | ------- | ------ | ---- | ----------------- |
| `display`    | Oxanium        | 48px    | 1.1    | 700  | -0.02em           |
| `title`      | Oxanium        | 32px    | 1.15   | 600  | -0.01em           |
| `heading`    | Oxanium        | 24px    | 1.3    | 600  | 0                 |
| `subheading` | Sora           | 18px    | 1.4    | 600  | 0                 |
| `lead`       | Sora           | 18px    | 1.6    | 400  | 0                 |
| `body`       | Sora           | 16px    | 1.7    | 400  | 0                 |
| `small`      | Sora           | 14px    | 1.6    | 400  | 0                 |
| `code`       | JetBrains Mono | 14px    | 1.6    | 400  | 0                 |
| `meta`       | JetBrains Mono | 12px    | 1.4    | 500  | 0.08em, maiúscula |

### 3.3 Escala carrossel — canvas 1080×1350

Valores absolutos, sem relação com a escala web. **Nada abaixo de 28px.**

| Token           | Família        | Tamanho | Altura | Peso | Tracking          |
| --------------- | -------------- | ------- | ------ | ---- | ----------------- |
| `slide-display` | Oxanium        | 96px    | 1.05   | 700  | -0.02em           |
| `slide-title`   | Oxanium        | 72px    | 1.1    | 700  | -0.02em           |
| `slide-heading` | Oxanium        | 56px    | 1.15   | 600  | -0.01em           |
| `slide-lead`    | Sora           | 44px    | 1.45   | 400  | 0                 |
| `slide-body`    | Sora           | 40px    | 1.5    | 400  | 0                 |
| `slide-caption` | Sora           | 32px    | 1.4    | 400  | 0                 |
| `slide-code`    | JetBrains Mono | 34px    | 1.5    | 400  | 0                 |
| `slide-meta`    | JetBrains Mono | 28px    | 1.0    | 500  | 0.12em, maiúscula |

### 3.4 Regras

Medida de linha entre **45 e 75 caracteres** na web; no carrossel, entre 28 e 42, o
que na prática significa que o texto raramente ocupa a largura total do slide.

Um único nível de ênfase por bloco. Alinhamento sempre à esquerda — nada centralizado,
com a exceção do template `text-impact`, que é uma frase isolada.

---

## 4. Espaçamento e layout

### 4.1 Escala sancionada — web

Base 4px, escala do Tailwind, **restrita** a estes degraus:

`1` 4px · `2` 8px · `3` 12px · `4` 16px · `6` 24px · `8` 32px · `12` 48px · `16` 64px · `24` 96px

Os degraus intermediários (5, 7, 9, 10, 11, 14, 20) existem no Tailwind mas não são
usados. Se um deles parece necessário, o problema costuma ser de estrutura.

Convenções: gap interno de componente `2`; entre componentes relacionados `4`; entre
grupos `8`; entre seções `16` ou `24`.

### 4.2 Grade do slide

| Medida                                      | Valor         |
| ------------------------------------------- | ------------- |
| Padding de borda                            | 80px          |
| Zona morta (nada de logo ou CTA além disso) | 60px da borda |
| Gap entre blocos maiores                    | 64px          |
| Gap entre itens de lista                    | 48px          |
| Padding interno de bloco de código          | 32px          |
| Largura útil                                | 920px         |

### 4.3 Grid de fundo

Presente apenas nos templates que declaram `background: "grid"` — capas e slide final.
Nunca em slides de código ou com imagem: o grid compete com o conteúdo.

```css
--grid-size: 60px; /* 18px na web */
--grid-line: #1e293b; /* ink-800 */

background-image:
  linear-gradient(var(--grid-line) 1px, transparent 1px),
  linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
background-size: var(--grid-size) var(--grid-size);
```

A intensidade é fixa. Não varie entre slides do mesmo carrossel.

A linha é de **1px inteiro**. A v2.0 deste documento especificava 0.5px, calibrado
para a rasterização a 2×, onde meio pixel vira exatamente um pixel de dispositivo.
Na tela isso não sobrevive: meio pixel arredonda para 0 ou 1 conforme a posição, e
parte das linhas não é pintada — o grid aparece com células de larguras diferentes.
Como o preview é escalado por `transform`, o problema é pior ali do que numa página
comum. Com 1px a linha nunca some, e na exportação a 2× ela vira 2px num bitmap de
2160px, proporcionalmente idêntica ao que 1px em 1080 aparenta.

---

## 5. Forma

| Propriedade                             | Valor                              |
| --------------------------------------- | ---------------------------------- |
| Raio padrão                             | **6px** (`0.375rem`)               |
| Raio pequeno — chips, badges            | 4px                                |
| Raio grande — cartões, blocos de código | 8px                                |
| Raio no carrossel                       | 12px (proporcional ao canvas 1080) |
| Espessura de borda                      | 1px, sempre                        |
| Anel de foco                            | 2px `azure-500` com offset de 2px  |

Cantos arredondados só com borda completa. Elementos com acento em um lado só
(`border-left` de callout) têm raio **0** — canto arredondado com borda de um lado
parece defeito.

### Elevação

Não existe escala de sombra. `--shadow-*` do Tailwind não é usado. O único
`box-shadow` do sistema é o anel de foco.

---

## 6. Ícones

**Lucide** (licença ISC), família única — sem set paralelo.

| Contexto        | Tamanho | Traço |
| --------------- | ------- | ----- |
| Inline em texto | 16px    | 1.75  |
| Interface       | 20px    | 1.75  |
| Destaque        | 24px    | 1.75  |
| Carrossel       | 48px    | 2     |

Ícone decorativo recebe `aria-hidden`; ícone sozinho em botão recebe `aria-label`.
Ícone nunca substitui rótulo em ação destrutiva.

---

## 7. Movimento

_Esqueleto — detalhar quando o showcase HTML existir._

| Token      | Valor                        | Uso                           |
| ---------- | ---------------------------- | ----------------------------- |
| `dur-fast` | 120ms                        | Hover, mudança de cor         |
| `dur-base` | 180ms                        | Abertura de popover, expansão |
| `dur-slow` | 260ms                        | Transição de painel           |
| `ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | Padrão                        |

Respeite `prefers-reduced-motion`. Nada anima posição por mais de 8px.

---

## 8. Estados

| Estado       | Tratamento                                                    |
| ------------ | ------------------------------------------------------------- |
| Hover        | Superfície sobe um degrau; cor não muda                       |
| Foco         | Anel de 2px `azure-500`, offset 2px; nunca removido           |
| Ativo        | `scale(0.98)`, sem mudança de cor                             |
| Desabilitado | Texto `ink-600`, superfície inalterada, `cursor: not-allowed` |
| Inválido     | Borda `crown-400`, mensagem em `crown-400` abaixo do campo    |
| Carregando   | Texto do botão trocado, largura preservada                    |

Evite botão desabilitado. Prefira mantê-lo ativo e responder no clique.

---

## 9. Aplicação — tokens shadcn/ui

O shadcn tem um vocabulário próprio e **duas armadilhas de nomenclatura**:

- `accent` **não é a cor de marca.** É a superfície de hover de item de menu, comando
  e seleção. Recebe neutro. Mapear âmbar aqui deixaria todo dropdown laranja.
- Não existem `success` nem `warning`. `pacifika` e `sun` vivem como cores de tema do
  Tailwind e alimentam variantes próprias.

| Token shadcn               | Valor                                             | Origem      |
| -------------------------- | ------------------------------------------------- | ----------- |
| `--background`             | `#020617`                                         | `ink-950`   |
| `--foreground`             | `#f1f5f9`                                         | `ink-100`   |
| `--card`                   | `#0f172a`                                         | `ink-900`   |
| `--card-foreground`        | `#f1f5f9`                                         | `ink-100`   |
| `--popover`                | `#0f172a`                                         | `ink-900`   |
| `--popover-foreground`     | `#f1f5f9`                                         | `ink-100`   |
| `--primary`                | `#60a5fa`                                         | `azure-400` |
| `--primary-foreground`     | `#172554`                                         | `azure-950` |
| `--secondary`              | `#1e293b`                                         | `ink-800`   |
| `--secondary-foreground`   | `#f1f5f9`                                         | `ink-100`   |
| `--muted`                  | `#1e293b`                                         | `ink-800`   |
| `--muted-foreground`       | `#94a3b8`                                         | `ink-400`   |
| `--accent`                 | `#1e293b`                                         | `ink-800`   |
| `--accent-foreground`      | `#f1f5f9`                                         | `ink-100`   |
| `--destructive`            | `#f77272`                                         | `crown-400` |
| `--destructive-foreground` | `#450a0a`                                         | `crown-950` |
| `--border`                 | `#1e293b`                                         | `ink-800`   |
| `--input`                  | `#1e293b`                                         | `ink-800`   |
| `--ring`                   | `#3b82f6`                                         | `azure-500` |
| `--radius`                 | `0.375rem`                                        | 6px         |
| `--chart-1` … `--chart-5`  | `#60a5fa` `#f6a823` `#bfd447` `#f77272` `#bfdbfe` | —           |

**As variantes geradas pelo shadcn são adaptadas a este documento, não o contrário.**
Os presets do CLI trazem escolhas próprias que nem sempre batem com a §2.4 — o preset
`nova`, por exemplo, desenha o botão destrutivo como fundo tingido a 10% com texto na
própria cor, em vez do padrão uniforme "tom 400 de preenchimento, tom 950 de texto".
Toda instalação de componente novo precisa dessa conferência, senão a divergência volta
sem ninguém notar.

Fora do vocabulário shadcn, como cores de tema do Tailwind:

| Token                        | Valor     |
| ---------------------------- | --------- |
| `--color-success`            | `#bfd447` |
| `--color-success-foreground` | `#222a09` |
| `--color-warning`            | `#f6a823` |
| `--color-warning-foreground` | `#441504` |

---

## 10. Aplicação — superfície carrossel

Tokens específicos do canvas 1080×1350, consumidos pelos templates do `asterism`.

### 10.1 Superfícies

| Token               | Valor     |
| ------------------- | --------- |
| `--slide-bg`        | `#020617` |
| `--slide-surface`   | `#0f172a` |
| `--slide-raised`    | `#1e293b` |
| `--slide-border`    | `#1e293b` |
| `--slide-grid-line` | `#1e293b` |

### 10.2 Marcadores inline

Os sete marcadores do subset de marcação, e como cada um renderiza:

| Marcador         | Token                   | Render                                              |
| ---------------- | ----------------------- | --------------------------------------------------- |
| `**forte**`      | —                       | Peso 600, mesma cor                                 |
| `*ênfase*`       | —                       | Itálico, mesma cor                                  |
| `~~riscado~~`    | `ink-500`               | `line-through`, cor reduzida                        |
| `++sublinhado++` | —                       | `underline`, offset 0.15em, espessura 2px           |
| `==marca==`      | `sun-950` / `sun-300`   | Fundo tingido, cantos retos, padding lateral 0.15em |
| `` `código` ``   | `ink-800` / `azure-200` | Mono, fundo elevado, raio 6px                       |
| `[[destaque]]`   | `azure-400`             | Só cor                                              |

`==marca==` é o único lugar do carrossel onde o âmbar aparece em texto. Um por slide.

### 10.3 Bloco de código

Superfície `--slide-raised`, raio 12px, sem borda. Barra superior com três pontos
`ink-700` de 10px e o nome do arquivo em `slide-meta`. Padding interno 32px.
**Máximo de 14 linhas** por slide — se passar, quebre em dois slides.

Realce de linha: fundo `sun-950`, `border-left: 4px solid sun-400`, raio 0.

Diff: adicionado `pacifika-950` com barra `pacifika-500`; removido `crown-950` com
barra `crown-500`.

### 10.4 Tema do shiki

Gerado a partir destes tokens, não importado pronto — senão o bloco de código é a
única coisa do carrossel que não parece do sistema.

| Escopo                | Cor                           |
| --------------------- | ----------------------------- |
| Base                  | `ink-200` `#e2e8f0`           |
| Comentário            | `ink-500` `#64748b` (itálico) |
| Palavra-chave         | `azure-400` `#60a5fa`         |
| String                | `pacifika-300` `#d4e373`      |
| Número, constante     | `sun-300` `#f8c251`           |
| Função                | `azure-200` `#bfdbfe`         |
| Tipo, classe          | `sun-200` `#fada8d`           |
| Variável, propriedade | `ink-200` `#e2e8f0`           |
| Operador, pontuação   | `ink-400` `#94a3b8`           |
| Inválido              | `crown-400` `#f77272`         |

### 10.5 Componentes recorrentes

**Kicker** — canto superior esquerdo, `slide-meta`, `azure-400`.
Formato `pilar/ · índice`, por exemplo `api/ · 04`.

O formato é **convenção, não derivação**. O kicker é um campo de texto digitado à mão,
não é montado a partir de `deck.meta.pillar` com a posição do slide. Derivar daria
consistência automática ao custo de não poder escrever outra coisa ali, e a liberdade
venceu. A contrapartida é que reordenar slides não reescreve o índice sozinho.

**Constelação de progresso** — rodapé direito. Um ponto por slide, 12px de diâmetro,
gap 12px, alinhada à direita dentro do padding.

Dois estados apenas:

| Estado       | Cor                   |
| ------------ | --------------------- |
| Visitado     | `azure-400` `#60a5fa` |
| Não visitado | `ink-700` `#334155`   |

Não existe estado para o slide atual — o atual é simplesmente o último aceso.
Não existe prenúncio do próximo. Um significado por cor.

Acima de 10 slides, mostre 5 pontos mais um contador `03 / 12` em mono.

**Afordância de deslize** — chevron duplo (Lucide `chevrons-right`), 40px, traço 2.25,
`azure-400`, à direita da constelação com gap de 20px.

**Presente somente na capa.** A partir do slide 2 a pessoa já executou o gesto, e o
rodapé volta a ser apenas progresso. Repetir a seta seria instruir alguém que já sabe.

**Rodapé fixo** — presente em todos os slides exceto capa e final. Alinhado à base,
dentro do padding: logo de 32px, `@handle` em `slide-meta` `ink-400`, constelação à direita.

**Callout** — `border-left: 4px`, raio 0, fundo tingido no tom 950 correspondente,
padding 24px. Variantes: `info` (azure), `atencao` (sun), `positivo` (pacifika),
`negativo` (crown).

---

## 11. Biblioteca de templates

Dez templates organizados por função narrativa. Estrutura de deck:
`capa → contexto → desenvolvimento (n) → payoff → cta`, alvo de 8 a 12 slides.

`cover-statement` · `context` · `text-bullets` · `text-impact` · `code-window` ·
`code-annotated` · `compare-2col` · `split-vertical` · `image-caption` · `final-cta`

Especificados abaixo: os três da Fase 1 do `asterism`. Os demais seguem o mesmo formato
quando forem implementados.

### 11.0 Regras comuns

Todo template ocupa 1080×1350 com padding de 80px em todos os lados, o que dá uma
largura útil de **920px**. Nada de logo ou CTA a menos de 60px da borda.

O rodapé ocupa a última faixa, com a linha de base do conteúdo alinhada a 80px do
fundo. Composição: logo de 32px, gap 20px, handle em `slide-meta` `ink-400` à esquerda;
constelação à direita. A capa é exceção — não tem logo nem handle, só constelação e
chevron.

Todo texto é alinhado à esquerda. Toda quebra de linha é natural: não existe campo de
quebra manual, porque quebra manual congela o layout e some com a razão de os templates
existirem.

Os limites de caractere na tabela de campos são **conselho, não trava**. O campo aceita
mais; o contador fica âmbar ao passar do limite e o guard de transbordo é quem reprova
de fato, medindo altura real.

---

### 11.1 `cover-statement`

**Função** gancho · **Fundo** `grid` · **Grupo** `cover`

Único slide sem rodapé de identidade. O título é a única coisa que importa e nada
compete com ele.

#### Regiões

| Região | Faixa vertical | Conteúdo                                       |
| ------ | -------------- | ---------------------------------------------- |
| Kicker | 80 – 148       | `slide-meta`, `azure-400`                      |
| Título | 300 – 1160     | `slide-display`, alinhado à **base** da região |
| Rodapé | 1240 – 1270    | Constelação + chevron, à direita               |

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

| Chave         | Tipo     | Padrão | Efeito                |
| ------------- | -------- | ------ | --------------------- |
| `showChevron` | `toggle` | `true` | Afordância de deslize |

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
  options: { showChevron: true },
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
  options: { anchor: "center" },
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
| Texto do CTA | 36px JetBrains Mono                                                                                             | `azure-400` |
| Prefixo      | `→ `                                                                                                            | `azure-400` |

O CTA reusa a forma do callout em vez de um botão. Num PDF nada é clicável, e desenhar
algo com aparência de botão promete uma interação que não existe.

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

**Constelação** — sempre inteira acesa, independentemente da contagem. Este é o último
slide por definição.

```ts
defaults: {
  fields: {
    heading: "Escrevo sobre os erros antes dos acertos.",
    lead: "Backend, infra e o que aprendo quebrando os dois.",
    cta: "blog.maiahub.com.br",
  },
  options: { showArrow: true },
}
```

---

## 12. Ativos

| Fonte          | Licença | Origem                             |
| -------------- | ------- | ---------------------------------- |
| Oxanium        | OFL 1.1 | github.com/sevmeyer/oxanium        |
| Sora           | OFL 1.1 | Google Fonts                       |
| JetBrains Mono | OFL 1.1 | github.com/JetBrains/JetBrainsMono |

A OFL permite embutir em PDF e usar em logo — a exportação do `asterism` está coberta.

Arquivos versionados no repositório, carregados como fontes locais. Fonte servida por
CDN externo não é inlinada na captura de tela e a exportação sai em Arial.

---

## 13. Artefatos do sistema

| Artefato                        | Status             | Papel                                             |
| ------------------------------- | ------------------ | ------------------------------------------------- |
| `observatorio-design-system.md` | **este documento** | Fonte da verdade                                  |
| `theme.css`                     | pronto             | Tema shadcn + tokens Tailwind, derivado deste doc |
| `showcase.html`                 | futuro             | Vitrine viva com componentes, estados e movimento |

Quando houver conflito, este documento vence e os outros são regerados.
