# Observatório — design system

> **Versão** 2.1 · **Autor** Rafael · **Escopo** tema escuro único
> A v2.0 substituiu a v1.0, que definia os tokens em OKLCH com hue 262. As escalas agora
> são hex sRGB no padrão de degradê do Tailwind — decisão que também resolve a
> serialização de cor na rasterização do `asterism`.
> A v2.1 não muda nenhuma regra visual: acrescenta o mapa da §0 e move a §11 para
> `observatorio-templates.md`, preservando a numeração.

---

## 0. Mapa

Este documento não foi feito para ser lido inteiro. Localize a seção com
`grep -n "^#\+ "` e leia só a faixa dela.

A coluna **Valor em código** diz onde o número já está materializado. Quando ela aponta
um arquivo, é lá que se lê *quanto* vale um token; aqui está o **porquê** e a regra de
uso, que é o que não cabe em CSS.

| §         | Decide                                                  | Ler quando                             | Valor em código                |
| --------- | ------------------------------------------------------- | -------------------------------------- | ------------------------------ |
| 1         | Princípios; o que é proibido — sombra, glow, blur, neon | Em dúvida se um efeito é permitido     | —                              |
| 2.1–2.3   | As cinco rampas, escada de superfícies, cores de texto  | Escolher cor que ainda não tem papel   | `globals.css`, `@theme static` |
| 2.4–2.5   | Papéis 400/950 e quando cada cor entra                  | Variante de componente, cor de estado  | parcial                        |
| 3.1–3.3   | Famílias e as duas escalas, web e carrossel             | Texto novo em template ou no editor    | `globals.css`, `slide-*`       |
| 3.4       | Medida de linha, um nível de ênfase por bloco           | Revisar densidade de texto             | —                              |
| 4.1       | Degraus de espaçamento sancionados                      | Espaçamento no chrome do editor        | Tailwind                       |
| 4.2       | Grade do slide: padding 80, largura útil 920, gaps      | Definir as regiões de um template      | `--slide-*`                    |
| 4.3       | Grid de fundo e a compensação de `--slide-scale`        | Mexer no fundo ou na escala do preview | `slide-grid.tsx` + `@utility slide-grid` |
| 5–8       | Forma, ícones, movimento, estados                       | Componente novo no editor              | `--radius` e afins             |
| 9         | Mapeamento shadcn e as duas armadilhas de nome          | Instalar componente shadcn novo        | `globals.css`, `@theme inline` |
| 10.1–10.4 | Superfícies, marcadores inline, bloco de código, shiki  | Parser, `<Inline>`, bloco de código    | 10.1 e 10.2 (`inline.tsx`)     |
| 10.5      | Cabeçalho, kicker, constelação, chevron, rodapé, callout | Peças recorrentes dos slides           | —                              |
| 11        | Layout, campos e comportamento de cada template         | Implementar um template                | `observatorio-templates.md`    |
| 12–13     | Fontes, licenças, artefatos do sistema                  | Raramente                              | —                              |

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
se lê como objeto.

A inversão sozinha não bastou, e o quadro do preview ganhou **borda de 1px `ink-700`** —
verificado olhando, na 1C: com o degrau de superfície apenas, a página não tinha contorno
e não dava para saber onde começa o que vai virar PDF. O tom é 700 e não o 800 de
hairline porque, entre um slide `ink-950` e uma área `ink-900`, o 800 cai a meio caminho
dos dois e some. É exceção de uma linha e vale **só no chrome do editor**.

Ela não chega ao arquivo exportado, e não por cuidado: a borda mora no quadro externo, do
lado de fora do `transform` de escala, e a exportação captura a raiz do slide, que está
dentro. Ver a §9 e a decisão 23 do documento de contexto.

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

Cada linha desta tabela é uma `@utility` de mesmo nome em `globals.css`, carregando as
cinco propriedades. O template escreve `slide-display` e nunca recompõe família, altura,
peso e tracking — decisão 19 da §16 do documento de contexto. Só o tamanho vira token
automático (`--text-slide-*`), e é justamente por isso que a utility existe: as outras
quatro propriedades não têm onde morar senão repetidas em cada template.

Cada utility também **publica o próprio peso** em `--slide-font-weight` antes de
aplicá-lo. Não é para ser lido pelos templates: existe para o marcador `**forte**` da
§10.2 saber em que bloco caiu e nunca sair mais leve que o texto em volta. Custom
property herda; o `<Inline>` não precisa receber nada de quem o chamou.

A caixa alta de `slide-meta` é da escala, não do conteúdo. O kicker é guardado como
`api/ · 04` e sai em versal na renderização; o dado no deck não muda.

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

**Disponível em qualquer template, e quem decide é quem edita.** Cada template declara em
`background` se o slide nasce com grade — capas e slide final nascem com, o resto sem —, e
a opção `showGrid` do slide manda daí em diante. A regra anterior, que restringia a grade
aos templates que a declaravam, virou padrão em vez de trava.

A recomendação continua de pé: em slide de código ou com imagem o grid compete com o
conteúdo, e ligá-lo ali costuma ser erro. É conselho, como os limites de caractere da
§11.0 dos templates — o sistema informa, não impede.

A intensidade é fixa. Não varie entre slides do mesmo carrossel.

#### A grade é elemento, não fundo

A v2.0 deste documento especificava dois `linear-gradient` ladrilhados por
`background-size`. Funcionava no preview e **se perdia na exportação**: o rasterizador
desenha o ladrilho uma vez e chapa o resto da página com a primeira parada do gradiente.
Medido no PDF, com quatro implementações comparadas — ver o experimento 4 do `TODO.md` e a
decisão 28 do documento de contexto. Gradiente repetente falha igual; `<pattern>` de SVG
sai com metade da espessura, porque o traço na borda do ladrilho é recortado.

A grade é um `<svg>` com linhas de verdade, dentro da raiz do slide:

```html
<svg class="slide-grid absolute inset-0" viewBox="0 0 1080 1350" aria-hidden="true">
  <path d="M1 0V1350 M55 0V1350 … M0 1 H1080 …"
        style="stroke: var(--color-slide-grid-line);
               stroke-width: var(--slide-grid-line-render);
               fill: none" />
</svg>
```

**O módulo sai do formato, não de constante.** É o divisor comum de largura e altura mais
próximo de **54px**, para que a grade feche em módulos inteiros em qualquer proporção:
1080×1350 dá 54 — 20 por 25 quadrados —, 1080×1920 daria 60. Formato sem divisor
utilizável cai nos 54 e aceita o corte.

**A moldura fecha nos quatro lados.** Cada traço entra meia espessura para dentro da
coordenada, e as linhas da direita e da base entram meia espessura para dentro da borda:
sem isso metade do traço cai fora do slide e a linha da borda sai pela metade. Foi o que
reprovou a variante `<pattern>`.

Quem desenha é `src/render/slide-grid.tsx`, e quem decide se aparece é o `SlideFrame`, a
partir do `background` do template e da opção `showGrid` do slide.

#### Por que 2px

A v2.0 deste documento especificava 0.5px, calibrado para a rasterização a 2×, onde meio
pixel vira exatamente um pixel de dispositivo. A calibragem estava certa para o bitmap e
errada para todo o resto, porque o slide quase nunca é visto a 1:1. A cadeia inteira,
com linha de `L` px medida no slide de 1080:

| Onde | Escala | Linha resultante |
| ------------------------------- | ----- | ---------------- |
| Slide a 1:1 | 1× | `L` px |
| Bitmap exportado | 2× | `2L` px |
| PDF exibido num feed a ~700px de largura | ÷3 | `0,65L` px |
| Preview do editor | ~0,3× | `0,3L` px |

Com `L = 1` a linha cai abaixo de um pixel em toda linha da tabela que não seja a
primeira — some no artefato publicado, que é o único lugar que de fato importa. Com
`L = 2` ela sobrevive ao downscale do feed. A 1:1 são 2px a cada 54px em `ink-800` sobre
`ink-950`: cobertura de 3,7%, ainda textura e não desenho.

#### Compensação no preview

Nenhuma espessura fixa sobrevive a uma redução arbitrária, então o preview compensa. Quem
exibe o slide reduzido declara a escala numa variável, e a espessura efetiva vira:

```css
/* no wrapper que escala: o mesmo k passado ao transform */
--slide-scale: 0.28;

/* no proprio elemento que desenha o grid, nunca no :root */
--grid-line-render: max(var(--grid-line-w), calc(1px / var(--slide-scale, 1)));
```

`calc(1px / k)` devolve a espessura que, **depois** de escalada, dá exatamente um pixel
de dispositivo. O `max()` faz a compensação entrar só quando é necessária: em `k = 1`, o
caso da exportação, o valor de spec passa intocado.

A declaração de `--grid-line-render` tem de ficar **no elemento que desenha o grid**, não
no `:root`. Uma custom property resolve os `var()` do próprio valor no elemento onde é
declarada; morando no `:root` ela resolveria `--slide-scale` como 1 ali, e os descendentes
herdariam o resultado já pronto — sobrescrever a escala no wrapper não teria efeito
nenhum.

| `k` | `1px / k` | `max(2px, …)` | Depois da escala |
| ---- | --------- | ------------- | ---------------- |
| 1 | 1px | **2px** | 2px — valor de spec |
| 0,5 | 2px | **2px** | 1px |
| 0,28 | 3,57px | **3,57px** | 1px |

É a mesma ideia do `vector-effect: non-scaling-stroke` do SVG. Feita com variável em vez
da propriedade nativa porque o caminho de exportação precisa do comportamento oposto: lá
a escala é 1 e vale a espessura de spec, não uma hairline de dispositivo.

**A regra vale para qualquer linha fina dentro do slide, não só para o grid.** A régua do
rodapé da §10.5 foi a segunda, e reaprendeu a lição do jeito difícil: nascida com
`height: 1px`, ela aparecia no PDF — que rasteriza a `k = 1` — e faltava no preview, onde
1px × 0,28 dá 0,28 pixel de dispositivo e o navegador não pinta. O sintoma é traiçoeiro
porque é o inverso do esperado: some no editor, sobrevive no arquivo.

Toda hairline de 1px do canvas usa a utility `slide-hairline`, que é esta mesma conta com
base 1px:

```css
@utility slide-hairline {
  height: max(1px, calc(1px / var(--slide-scale, 1)));
}
```

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
| Carregando   | Conteúdo do botão trocado, largura preservada                 |

Evite botão desabilitado. Prefira mantê-lo ativo e responder no clique.

**Carregando é o ícone, não o rótulo.** Esta linha dizia "texto do botão trocado", e o botão
de exportar mostrou por que a versão mais forte é pior: trocar `PDF` por `Exportando` muda a
largura, e preservá-la exigiria uma largura mínima escrita à mão que passa a existir para o
estado que dura três segundos. Trocar o **ícone** por um `loader-circle` girando dá o mesmo
sinal e a largura fica de graça. O rótulo é a identidade do botão e não muda de estado.

Um botão que carrega leva `aria-busy`. É o que diz a mesma coisa a quem não vê o ícone, e é
o que continua dizendo com `prefers-reduced-motion: reduce`, em que o spinner não gira — o
ícone diferente ainda é um segundo sinal, e nenhum dos dois depende de movimento.

As seis linhas foram escritas pensando em **superfície**, e o experimento 3 as cobrou em
controles que não são superfície. Duas leituras ficaram fixadas ali, sem que nenhuma regra
mudasse:

**Num preenchimento cheio, "subir um degrau" é o tom 300 sobre o tom 400.** É o que o hover
do botão primário faz — `azure-400` → `azure-300` —, e do destrutivo — `crown-400` →
`crown-300`. Escurecer por opacidade, que é como o preset `nova` resolvia, é mudança de cor
e não de degrau, e vai na direção contrária: no escuro, a superfície que responde ao ponteiro
sobe, não afunda.

**Em controle sem texto, quem vai a `ink-600` é a marca.** O desabilitado dá texto `ink-600`
com a superfície intacta; num interruptor não há texto, e o que escurece é o polegar. A
trilha fica como está, porque a linha diz superfície inalterada — e o `cursor: not-allowed`
só aparece se o controle continuar recebendo ponteiro, o que exclui `pointer-events: none`
como forma de desabilitar.

E o **inválido é a borda, e só ela**: sem anel translúcido em volta, que é o que os presets
costumam acrescentar. É a mesma borda `crown-400` com que o `asterism` marca o slide que
transborda, e um sinal só vale mais que dois parecidos.

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

A auditoria completa aconteceu uma vez, no experimento 3, com os seis componentes juntos —
`button`, `card`, `input`, `select`, `switch` e `textarea`. **O que ela encontrou é a lista
de conferência de todo componente novo**, porque tudo aqui vem do mesmo preset e volta pelo
mesmo caminho:

| O que o preset traz                                     | O que vale             |
| ------------------------------------------------------- | ---------------------- |
| `focus-visible:ring-3` com `ring/50` e sem offset       | O anel da §5           |
| `rounded-lg` em controle, `rounded-xl` em cartão        | 6px e 8px, §5          |
| `hover:` na cor com opacidade                           | Um degrau acima, §8    |
| `active:translate-y-px`                                 | `scale(0.98)`, §8      |
| `disabled:opacity-50` com `pointer-events-none`         | Texto `ink-600`, §8    |
| `aria-invalid:ring-3` translúcido junto da borda        | Só a borda, §8         |
| `shadow-md` em popup                                    | Nenhuma sombra, §1     |
| Duplicatas `dark:` de valores que já são os únicos      | Colapsar               |

Duas armadilhas de token apareceram junto. **`--radius-xl` não existe** neste tema — só
`sm`, `md` e `lg` —, então `rounded-xl` cai no default do Tailwind, 12px, e não numa medida
do sistema; use `rounded-lg` em cartão. E a folha ordena por **peso de variante**, não pela
ordem das classes na string: uma regra de um variante perde para uma de dois, ainda que
escrita depois. Quando o valor certo precisa vencer duas regras `dark:` do preset, ou se
escreve com o mesmo número de variantes, ou se marca com `!`.

A classe `dark` no `<html>` está sempre presente e não há tema claro, então `dark:` no
componente não é condição: é o valor que de fato vale, com um variante a mais para brigar
com o resto. Nas variantes que se toca, colapse.

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
| `**forte**`      | —                       | Peso 600, **nunca abaixo do herdado**; mesma cor    |
| `*ênfase*`       | —                       | Itálico, mesma cor                                  |
| `~~riscado~~`    | `ink-500`               | `line-through`, cor reduzida                        |
| `++sublinhado++` | —                       | `underline`, offset 0.15em, espessura 2px           |
| `==marca==`      | `sun-950` / `sun-300`   | Fundo tingido, cantos retos, padding lateral 0.15em |
| `` `código` ``   | `ink-800` / `azure-200` | Mono, fundo elevado, raio 6px                       |
| `[[destaque]]`   | `azure-400`             | Só cor                                              |

`==marca==` é o único lugar do carrossel onde o âmbar aparece em texto. Um por slide.

**O peso 600 do forte é piso, não valor** — decisão 34. Sobre a Sora 400 do corpo de
texto ele sobe para 600 e funciona; sobre a Oxanium 700 de um título, um 600 fixo deixaria
o trecho marcado mais **leve** que a frase em volta, que é o oposto do que o marcador
significa — e contradiria a §11.1 dos templates, que diz que `**forte**` não tem efeito
visível em título. Em código é `max(600, var(--slide-font-weight, 400))`, na utility
`slide-strong`, contra o peso que a escala da §3.3 publicou.

`==marca==` e `` `código` `` carregam fundo, então também carregam
`box-decoration-break: clone`: quando o trecho quebra de linha, cada pedaço fecha o próprio
fundo com o padding lateral. Sem isso o padding apareceria só nas duas pontas do trecho.

### 10.3 Bloco de código

Superfície `--slide-raised`, raio 12px, sem borda. Barra superior com três pontos
`ink-700` de 10px e o nome do arquivo em `slide-meta`. Padding interno 32px.
**Máximo de 14 linhas** por slide — se passar, quebre em dois slides.

**O nome do arquivo é a única peça `slide-meta` em caixa baixa.** A utility versaliza, e a
§10.5 diz por quê: no kicker e no handle a caixa alta é da escala, não do conteúdo —
`api/ · 04` é digitado assim e sai versal sem que o dado mude. Nome de arquivo é a exceção
porque é a única peça `slide-meta` que é um **identificador literal**: `CACHE.TS` desmente o
nome que está no repositório, e o slide passa a mostrar um arquivo que não existe. Em código
é `normal-case` sobre a utility. Decisão 53 da §16 do documento de contexto.

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

**Cabeçalho** — a faixa do topo, 80–148, dentro do padding. Simétrica ao rodapé, e opção do
slide pela chave `showHeader`.

| Peça | Chave | Descrição |
| --- | --- | --- |
| Kicker | — | `slide-meta` `azure-400`, canto superior esquerdo |

Uma peça só, por enquanto, e ela não tem opção própria: o kicker é o que a faixa é, do mesmo
jeito que a constelação é o que o rodapé é. Quem o tira é quem tira a faixa.

**Desligada, a faixa não existe** — não é uma faixa vazia de 68px. É a única diferença de
comportamento entre ela e o rodapé, e vem de onde as duas ficam: um template pode ter
conteúdo colado no topo, e nenhum tem conteúdo colado no fim. Ver a §11.2 dos templates, que
é onde isso se paga.

Cada template declara com o que o slide **nasce**. Só a capa nasce com o cabeçalho ligado —
esta seção prendia o kicker à capa, e o que era regra virou padrão, pela mesma forma da
decisão 25. Decisão 42.

**Kicker** — canto superior esquerdo do cabeçalho, `slide-meta`, `azure-400`.
Formato `pilar/ · índice`, por exemplo `api/ · 04`.

O formato é **convenção, não derivação**. O kicker é um campo de texto digitado à mão,
não é montado a partir de `deck.meta.pillar` com a posição do slide. Derivar daria
consistência automática ao custo de não poder escrever outra coisa ali, e a liberdade
venceu. A contrapartida é que reordenar slides não reescreve o índice sozinho.

Kicker vazio com a faixa ligada é escolha válida: o slide mantém o ritmo da série sem
escrever nada ali. Quem não quer a faixa desliga a opção.

**Constelação de progresso** — rodapé direito. Um ponto por slide, 12px de diâmetro,
gap 12px, alinhada à direita dentro do padding.

Dois estados apenas:

| Estado       | Cor                   |
| ------------ | --------------------- |
| Visitado     | `azure-400` `#60a5fa` |
| Não visitado | `ink-700` `#334155`   |

Não existe estado para o slide atual — o atual é simplesmente o último aceso.
Não existe prenúncio do próximo. Um significado por cor.

**Um ponto por slide, em qualquer contagem.** Não há recorte, não há janela e não há
contador. Esta seção pedia, acima de 10 slides, "5 pontos mais um contador `03 / 12` em
mono", e o experimento 2 derrubou a regra: as três leituras possíveis do recorte foram
montadas com um deck de 12 slides e nenhuma sobreviveu à comparação com o comportamento
sem recorte. Ver a decisão 40 da §16 do documento de contexto.

O limite existe, mas é largo: a faixa comporta **26 pontos** antes de a constelação
encostar no handle — 920px de largura útil menos o grupo da esquerda, o chevron e os gaps
de 20px, divididos pelo passo de 24px. Nenhum carrossel de LinkedIn chega perto disso, e
o dia em que chegar é o dia de reabrir o assunto com um deck real na mão.

**Afordância de deslize** — chevron duplo (Lucide `chevrons-right`), 40px, traço 2.25,
`azure-400`, à direita da constelação com gap de 20px.

**Disponível em todo slide, e nasce ligada só na capa.** A partir do slide 2 a pessoa já
executou o gesto e o rodapé volta a ser apenas progresso, então repetir a seta seria
instruir quem já sabe — mas isso é o **padrão**, não uma trava. A única regra que
permanece é a do fim: **no último slide a seta não é desenhada**, com a opção ligada ou
não, porque ali não há para onde deslizar. A supressão é por posição no deck, não por
template.

**Rodapé** — a faixa da base, dentro do padding, e opção do slide pela chave `showFooter`.
Seis peças, e cinco delas são opção também:

| Peça | Chave | Descrição |
| --- | --- | --- |
| Régua | `showRule` | 1px `ink-600`, a `--slide-pad + 32 + --slide-gap-block` da base (y 1174 em 1350), na largura útil |
| Logo | `showLogo` | `MaiahubGlyph` a 32px em `ink-200` |
| Fundo da logo | `showLogoPlate` | Quadrado de 56px, `slide-raised`, borda 1px `ink-700`, raio 12px |
| Handle | `showHandle` | `slide-meta` `ink-400`, gap 20px após a logo |
| Constelação | — | Sem opção própria: progresso é o que a faixa é |
| Chevron | `showChevron` | À direita da constelação, gap 20px |

**`showFooter` é a faixa, não uma sétima peça.** As cinco opções escolhem o que a faixa
mostra; o interruptor escolhe se ela existe. Desligado, não sobra nada — nem a constelação.

A constelação continua sem opção própria, e a frase da tabela é a mesma de sempre:
desligá-la sozinha não faz sentido, porque progresso é o que a faixa é. O que a 2F
acrescentou foi poder desligar a faixa inteira, e um slide sem rodapé não contradiz a regra
porque não é um rodapé.

Cada template declara com o que o slide **nasce** e quem edita decide daí em diante — a
forma da decisão 25, a mesma que a grade de fundo tem desde a 1E. Esta seção dizia
"presente em todos os slides exceto a capa"; o que era regra virou padrão.

**Ligar uma peça não move as outras.** É o que separa seis interruptores de bagunça, e
custa duas escolhas de geometria: a faixa mantém 32px de altura e a placa da logo, que tem
56px, cresce simetricamente para fora dela; e a régua se mede da base do slide, não do topo
da faixa. Ancorada à faixa, ela pularia junto com a placa.

**A régua não pode cair no módulo da grade.** A primeira versão a pôs em `--slide-pad × 2`
= y 1190, e ela sumia do PDF com a grade ligada: a grade desenha horizontais em `54k + 1`
com traço de 2px, e em k = 22 isso ocupa exatamente 1189–1190. A régua era pintada dentro
do traço, no mesmo `ink-800` — camuflada, não perdida. Daí as duas correções: y 1174, 15px
acima da linha da grade, e `ink-600`, dois degraus acima dela. A cor saiu do experimento 5,
comparando nove candidatas em `ink`, `azure` e `sun` sobre páginas reais; o âmbar foi
descartado porque a §2.5 o reserva a pontuação, e uma linha de 920px não é pontuação.

A placa é o único elemento do slide que entra na faixa de padding — o fundo dela chega a
68px da borda, contra os 80px da §4.2. Continua bem dentro da zona morta de 60px da §11.0
dos templates, e é o preço de a glyph ficar oticamente alinhada com o handle: encostá-la
nos 80px desalinharia os dois em 12px.

O `final-cta` **nasce com o rodapé completo**, com a constelação toda acesa — decisão 29.
Esta seção dizia "exceto capa e final" e contradizia a tabela de regiões da §11.3 dos
templates, que sempre deu ao final as três peças. O último slide é onde o handle mais
importa: quem chegou até o fim é quem vai seguir. O bloco de CTA no miolo não compete com
ele — 36px mono `azure-400` contra 28px `ink-400` no rodapé são hierarquias distintas, e
é isso que separa este caso do wordmark descartado no experimento 1, que traria "maiahub"
escrito no mesmo canto que o handle.

A capa é o único template que **nasce** sem logo e sem handle, e a §11.1 dos templates diz
por quê. Ligar as duas ali é uma escolha válida, não uma violação.

**Callout** — `border-left: 4px`, raio 0, fundo tingido no tom 950 correspondente,
padding 24px. Variantes: `info` (azure), `atencao` (sun), `positivo` (pacifika),
`negativo` (crown).

---

## 11. Biblioteca de templates

Movida para `observatorio-templates.md`, com a numeração preservada — as referências
`§11.x` continuam válidas, mudou só o arquivo onde a seção mora. São dez templates
organizados por função narrativa, **os dez especificados lá** desde a 3A, com regiões,
elementos, campos, opções e comportamento.

O que vale para todos eles continua aqui: a grade do slide na §4.2, a escala tipográfica
do carrossel na §3.3 e os componentes recorrentes na §10.5.

Duas regras deste documento ganharam exceção nomeada quando a biblioteca fechou, e as duas
estão na §11.0 de lá: o padding de 80px passa a valer para conteúdo, porque imagem sangra
até a borda nos dois templates de mídia; e o alinhamento à esquerda da §3.4 abre para o
`text-impact`, que já era a exceção que aquela seção previa.

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

| Artefato                        | Status             | Papel                                              |
| ------------------------------- | ------------------ | -------------------------------------------------- |
| `observatorio-design-system.md` | **este documento** | Fonte da verdade                                   |
| `observatorio-templates.md`     | pronto             | A §11, especificação de cada template              |
| `theme.css`                     | pronto             | Tema shadcn + tokens Tailwind, derivado deste doc  |
| `showcase.html`                 | futuro             | Vitrine viva com componentes, estados e movimento  |

Quando houver conflito, este documento vence e os outros são regerados.
