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

| §     | Template          | Função                 | Fundo   | Grupo     | Status       |
| ----- | ----------------- | ---------------------- | ------- | --------- | ------------ |
| 11.1  | `cover-statement` | Gancho                 | `grid`  | `cover`   | especificado |
| 11.4  | `context`         | Segurar o leitor       | `plain` | `content` | especificado |
| 11.2  | `text-bullets`    | Desenvolvimento        | `plain` | `content` | especificado |
| 11.5  | `text-impact`     | Respiro                | `grid`  | `content` | especificado |
| 11.6  | `code-window`     | Código puro            | `plain` | `code`    | especificado |
| 11.7  | `code-annotated`  | Código com explicação  | `plain` | `code`    | especificado |
| 11.8  | `compare-2col`    | Antes/depois           | `plain` | `content` | especificado |
| 11.9  | `split-vertical`  | Texto + imagem         | `plain` | `media`   | especificado |
| 11.10 | `image-caption`   | Imagem dominante       | `plain` | `media`   | especificado |
| 11.3  | `final-cta`       | Fechamento             | `grid`  | `final`   | especificado |

A tabela está na ordem de **função narrativa** — a da estrutura de deck acima —, e não na
das seções: a numeração §11.1–§11.3 é a dos três primeiros a serem escritos, na Fase 1, e
ficou como está porque referências de outros documentos apontam para ela.

**A biblioteca fechou na 3A**, e fechou como conjunto: os dez de uma vez, num documento só,
antes de qualquer linha de código dos sete últimos. O motivo é a migração de conteúdo na
troca de layout, que é uma interseção de chave **e** de forma — uma chave decidida no
sétimo template obrigaria a voltar no terceiro. Decisão 45 da §16 do documento de contexto.

Onde a §11.x diz uma coisa e o código diz outra, a §11.x vence: é a Regra 2 do `CLAUDE.md`,
e é o que faz o critério de pronto de cada sub-etapa de template ser conferível.

### 11.0 Regras comuns

Todo template ocupa 1080×1350 com padding de 80px em todos os lados, o que dá uma
largura útil de **920px**. Nada de logo ou CTA a menos de 60px da borda.

**O padding vale para conteúdo. Imagem pode sangrar** — e só ela, nos dois templates de
mídia: o `split-vertical` sangra pelo topo e pela direita, o `image-caption` pelo topo,
pela esquerda e pela direita. Contida, com raio de 12px como o bloco de código, a imagem
vira figura ilustrando um slide de texto, e os dois deixam de se distinguir do `context`.
A zona morta de 60px continua valendo para o que ela sempre valeu — logo e CTA. Decisão 46.

O sangramento tem um limite, e ele é geométrico: **nenhuma imagem entra na faixa do
rodapé**. O rodapé precisa dos 920px inteiros — a placa da logo mais o handle somam cerca
de 217px e doze pontos de constelação somam 276px, e com o gap entre os dois grupos isso
passa de 500px, contra os 480px que sobrariam ao lado da imagem do `split-vertical`. Daí a
imagem parar em y 1174, que é a linha da régua da §10.5 do design system.

**Todo template tem duas faixas, e as duas são opção do slide.**

O **cabeçalho** ocupa 80–148 e traz o kicker em `slide-meta` `azure-400`. A capa é o único
template que **nasce** com ele ligado. Desligado, a faixa não existe — não é uma faixa vazia
de 68px —, e é isso que permite a um template com conteúdo no topo recuperar o espaço em vez
de reservá-lo para sempre. A §11.2 é onde isso se paga.

O **rodapé** ocupa a última faixa, com a linha de base do conteúdo alinhada a 80px do
fundo. Composição: `MaiahubGlyph` a 32px em `ink-200`, com ou sem a placa atrás, gap 20px,
handle em `slide-meta` `ink-400` à esquerda; constelação à direita, e o chevron depois
dela. Acima da faixa, opcionalmente, a régua. A capa é o único template que **nasce** sem
logo e sem handle — é padrão, não trava. Ver a §10.5 do design system.

`showHeader` e `showFooter` são interruptores **de faixa**, não peças a mais: desligados, a
faixa inteira some, e no rodapé isso inclui a constelação. As cinco opções do rodapé
escolhem o que ele mostra; o interruptor escolhe se ele existe.

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

**Todo template expõe oito opções compartilhadas**, que vêm dos descritores em
`src/templates/shared/options.ts` e abrem a lista de opções, nesta ordem:

| Chave | Seção | Efeito |
| --- | --- | --- |
| `showGrid` | — | Grade de fundo |
| `showHeader` | — | A faixa do cabeçalho |
| `showFooter` | — | A faixa do rodapé, inteira |
| `showRule` | `footer` | Régua entre o conteúdo e o rodapé |
| `showLogo` | `footer` | A glyph no rodapé |
| `showLogoPlate` | `footer` | O fundo quadrado atrás da glyph |
| `showHandle` | `footer` | O `@handle` no rodapé |
| `showChevron` | `footer` | A afordância de deslize |

**E um campo compartilhado**, de `src/templates/shared/fields.ts`, que abre a lista de
campos de todo template:

| Chave | Tipo | Limite | Marcação | Seção | Descrição |
| --- | --- | --- | --- | --- | --- |
| `kicker` | `text` | 12 | não | `header` | Pilar e índice, ex. `api/ · 04` |

**E uma segunda chave que os dez declaram, sem descritor compartilhado.** `heading` é o
título em qualquer template — §6 do documento de contexto —, e desde a 3A é declarado
pelos dez, inclusive onde o layout não o desenha por padrão. O descritor **não** mora em
`shared/fields.ts` como o do kicker: o limite de caractere acompanha a região, e a região é
do template. O que é comum é o rótulo, **"Título"**, nos dez.

Onde o valor está vazio, a região some junto com o gap — o comportamento que o `lead` do
`final-cta` já tinha. Um título vazio não deixa buraco no slide; deixa o resto subir.

Em todas vale a mesma regra: o descritor do template diz apenas com que valor o slide
**nasce**, e a escolha é de quem edita — §4.3 e §10.5 do design system, decisão 25. O
`background` do template é o padrão de `showGrid`, e nada mais.

A coluna **Seção** é metadado do inspector, não do dado: diz em que faixa do formulário o
controle aparece. As cinco peças do rodapé são sub-opções da faixa e só aparecem com ela
ligada; o kicker aparece dentro da seção "Cabeçalho", junto do interruptor que o liga,
apesar de ser conteúdo e não apresentação. Ver a §14 do documento de contexto.

A ordem é a de leitura vertical do slide, e dentro do rodapé a da faixa de fora para
dentro; é a ordem em que o inspector desenha os controles. A tabela de campos e a de opções
de cada template abaixo **omitem os compartilhados**, e listam só o que é próprio dele; as
tabelas de padrões, no bloco `defaults` ao fim de cada seção, trazem tudo.

**Toda seção nomeia a região que o guard de transbordo mede.** O guard da §9 do documento
de contexto não é um recurso de um template: é uma convenção que os dez declaram, e a
tabela de regiões de cada §11.x marca com **⌐** a região — ou as regiões — cuja altura real
é comparada com a altura da faixa. É sempre a região de conteúdo variável, nunca a faixa do
cabeçalho, nunca a do rodapé e nunca uma imagem, que se ajusta em vez de crescer.

A marca fica no documento porque a alternativa é descobri-la template a template na hora de
implementar, e aí ela vira dez decisões em vez de uma. Vale a armadilha da §13 do contexto:
**a região medida tem altura de faixa, não altura de conteúdo** — o que a mede não pode ser
dimensionado pelo que ela contém, senão a escala se realimenta.

---

### 11.1 `cover-statement`

**Função** gancho · **Fundo** `grid` · **Grupo** `cover`

O único template que **nasce** sem identidade no rodapé. O título é a única coisa que
importa e nada compete com ele — recomendação, não trava: `showLogo` e `showHandle` estão
ali para quem quiser assinar a capa.

#### Regiões

| Região    | Faixa vertical | Conteúdo                                       |
| --------- | -------------- | ---------------------------------------------- |
| Cabeçalho | 80 – 148       | A faixa compartilhada; nasce **ligada** — o único template em que isso acontece |
| Título ⌐  | 300 – 1160     | `slide-display`, alinhado à **base** da região |
| Rodapé    | 1238 – 1270    | A faixa compartilhada; nasce com constelação e chevron |

O título ser alinhado à base da região é a decisão estrutural do template: com uma linha
ou com quatro, a última linha pousa sempre na mesma altura. Sem isso, cada capa do
carrossel teria um ritmo diferente e a série perderia identidade.

**O título não se move com o cabeçalho.** A região dele começa em 300 nos dois estados, e
os 152px entre as duas faixas são respiro, não espaçamento — é o que mantém a âncora de base
funcionando igual com a faixa ligada ou desligada.

#### Elementos

| Elemento           | Token                                                             | Cor                     |
| ------------------ | ----------------------------------------------------------------- | ----------------------- |
| Kicker             | `slide-meta` (28px mono, tracking 0.12em, caixa alta)             | `azure-400`             |
| Título             | `slide-display` (96px Oxanium 700, altura 1.05, tracking -0.02em) | `ink-100`               |
| Destaque no título | idem                                                              | `azure-400`             |
| Constelação        | 12px, gap 12px                                                    | `azure-400` / `ink-700` |
| Chevron            | 40px, traço 2.25, gap 20px após a constelação                     | `azure-400`             |

#### Campos

| Chave     | Tipo       | Limite | Marcação | Descrição              |
| --------- | ---------- | ------ | -------- | ---------------------- |
| `heading` | `textarea` | 70     | sim      | Declaração ou pergunta |

Nenhum outro próprio — o `kicker` era declarado aqui até a 2F e virou compartilhado, como o
`showChevron` antes dele. A capa passou a ser apenas o único template que nasce com a faixa
ligada.

#### Opções

Nenhuma própria — a capa expõe só as oito compartilhadas da §11.0.

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
    showGrid: true, showHeader: true, showFooter: true, showRule: false,
    showLogo: false, showLogoPlate: true, showHandle: false,
    showChevron: true,
  },
}
```

---

### 11.2 `text-bullets`

**Função** desenvolvimento · **Fundo** `plain` · **Grupo** `content`

O template mais usado de um carrossel. Título no topo, itens no miolo, rodapé fixo.

#### Regiões

**Com o cabeçalho desligado**, que é como o template nasce:

| Região | Faixa vertical | Conteúdo                                    |
| ------ | -------------- | ------------------------------------------- |
| Título | 80 – 230       | `slide-heading`, até duas linhas            |
| Itens ⌐ | 294 – 1160    | Lista, centralizada verticalmente na região |
| Rodapé | 1238 – 1270    | Logo, handle, constelação                   |

**Com o cabeçalho ligado**, as duas regiões de baixo descem um `--slide-gap-block`:

| Região    | Faixa vertical | Conteúdo                                     |
| --------- | -------------- | -------------------------------------------- |
| Cabeçalho | 80 – 148       | A faixa compartilhada, com o kicker           |
| Título    | 212 – 362      | A mesma altura de 150px, 132px abaixo         |
| Itens ⌐   | 426 – 1160     | O mesmo fim, 734px de altura em vez de 866    |
| Rodapé    | 1238 – 1270    | Sem mudança                                   |

Foi o primeiro template em que ligar o cabeçalho move alguma coisa, e a quebra da regra
"ligar uma peça não move as outras" que a §10.5 estabeleceu para o rodapé. O `context` da
§11.4 repete a mesma geometria, número por número, e não por acaso: os dois são o miolo do
carrossel, e um empurrar 132px enquanto o outro reserva a faixa seria uma diferença sem
motivo entre slides vizinhos.
**Empurrar só quando ligado**, em vez de reservar a faixa sempre, é a decisão 43: duas
variantes custam um ternário no componente; reservar sempre custaria 132px do topo do
template mais usado do sistema, permanentemente, por uma faixa que aqui nasce desligada.
A regra do rodapé continua valendo onde foi escrita — ele nunca disputou espaço com nada.

Quatro itens de duas linhas ocupam 624px, então continuam cabendo nos 734.

#### Elementos

| Elemento             | Token                                           | Cor         |
| -------------------- | ----------------------------------------------- | ----------- |
| Título               | `slide-heading` (56px Oxanium 600, altura 1.15) | `ink-100`   |
| Marcador             | travessão `—` em `slide-body` mono              | `azure-400` |
| Item                 | `slide-body` (40px Sora 400, altura 1.5)        | `ink-100`   |
| Gap marcador → texto | 32px                                            | —           |
| Gap entre itens      | 48px                                            | —           |

O marcador é um travessão, não uma bolinha. Bolinha lê como apresentação corporativa;
travessão em JetBrains Mono puxa para o registro de terminal, que é o do sistema.

#### Campos

| Chave     | Tipo       | Limite                      | Marcação | Descrição       |
| --------- | ---------- | --------------------------- | -------- | --------------- |
| `heading` | `textarea` | 60                          | não      | Título do slide |
| `items`   | `list`     | 4 itens, 80 caracteres cada | sim      | Tópicos         |

O rótulo do `heading` no inspector é **"Título"**, e era "Cabeçalho" até a 2F: o cabeçalho
passou a ser a faixa do topo, e o formulário mostraria dois controles com o mesmo nome na
mesma coluna. "Título" é também o nome do papel no vocabulário canônico da §6 do documento
de contexto — `heading` é o título em todo template.

#### Opções

| Chave    | Tipo     | Padrão   | Efeito                                                                        |
| -------- | -------- | -------- | ----------------------------------------------------------------------------- |
| `anchor` | `select` | `center` | `center` distribui os itens no miolo; `top` encosta logo abaixo do título |

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
    kicker: "log/ · 01",
    heading: "Três coisas que eu mudaria",
    items: ["Primeiro ponto", "Segundo ponto", "Terceiro ponto"],
  },
  options: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
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
| Vazio    | 80 – 400       | Respiro                                  |
| Conteúdo ⌐ | 400 – 1160   | Título, lead e CTA, alinhados à **base** |
| Rodapé   | 1238 – 1270    | Logo, handle, constelação toda acesa     |

**O respiro é o que a região é com o cabeçalho desligado**, que é como o template nasce. A
faixa compartilhada cabe em 80–148 sem empurrar nada, porque os 320px acima do conteúdo já
estavam vazios: é o único template em que ligá-la sai de graça. Trocar respiro por etiqueta
é escolha de quem edita — esta seção recomenda o vazio, não o obriga.

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
    kicker: "log/ · 01",
    heading: "Escrevo sobre os erros antes dos acertos.",
    lead: "Backend, infra e o que aprendo quebrando os dois.",
    cta: "blog.maiahub.com.br",
  },
  options: {
    showGrid: true, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
    showArrow: true,
  },
}
```

---

### 11.4 `context`

**Função** segurar o leitor · **Fundo** `plain` · **Grupo** `content`

O segundo slide do carrossel, e o único de texto corrido da biblioteca. A capa fez uma
declaração; este parágrafo é onde ela ganha o chão que a torna verdadeira. É também a linha
de base do miolo: `code-annotated` e `split-vertical` reusam a mesma chave `body`, e trocar
entre os três preserva o que foi escrito.

#### Regiões

**Com o cabeçalho desligado**, que é como o template nasce:

| Região  | Faixa vertical | Conteúdo                                     |
| ------- | -------------- | -------------------------------------------- |
| Título  | 80 – 230       | `slide-heading`, até duas linhas              |
| Corpo ⌐ | 294 – 1160     | Texto corrido, ancorado ao **topo** da região |
| Rodapé  | 1238 – 1270    | A faixa compartilhada                         |

**Com o cabeçalho ligado**, as duas regiões de baixo descem um `--slide-gap-block`, como
no `text-bullets`:

| Região    | Faixa vertical | Conteúdo                                  |
| --------- | -------------- | ----------------------------------------- |
| Cabeçalho | 80 – 148       | A faixa compartilhada, com o kicker        |
| Título    | 212 – 362      | A mesma altura de 150px, 132px abaixo      |
| Corpo ⌐   | 426 – 1160     | O mesmo fim, 734px de altura em vez de 866 |
| Rodapé    | 1238 – 1270    | Sem mudança                                |

É a mesma geometria da §11.2, e de propósito: os dois são o miolo do carrossel, e um deles
empurrar 132px enquanto o outro reserva a faixa seria uma diferença sem motivo entre slides
vizinhos. Decisão 43.

**O texto não ocupa os 920px.** A linha se limita a **760px**, e o que sobra à direita é
respiro. A §3.4 do design system pede entre 28 e 42 caracteres por linha no carrossel: em
`slide-body` 40px, 920px dão cerca de 46 e 760px dão cerca de 38. É a única região da
biblioteca em que a medida de linha aperta de verdade, porque é a única com parágrafo de
várias linhas — num item de lista de duas linhas a conta não chega a doer.

#### Elementos

| Elemento | Token                                           | Cor       |
| -------- | ----------------------------------------------- | --------- |
| Título   | `slide-heading` (56px Oxanium 600, altura 1.15) | `ink-100` |
| Corpo    | `slide-body` (40px Sora 400, altura 1.5)        | `ink-200` |

O corpo é `ink-200` e não `ink-100`: são muitas linhas seguidas, e o degrau abaixo do
título separa os dois sem precisar de peso nem de cor. O título continua sendo a coisa
mais clara do slide.

#### Campos

| Chave     | Tipo       | Limite | Marcação | Descrição       |
| --------- | ---------- | ------ | -------- | --------------- |
| `heading` | `textarea` | 60     | não      | Título do slide |
| `body`    | `textarea` | 320    | sim      | Texto corrido   |

O limite de 320 sai da região: 38 caracteres por linha dão cerca de oito linhas, e oito
linhas de 60px ocupam 480px dos 866 disponíveis. Sobra folga de propósito — texto que
preenche a região inteira é o slide que pedia dois.

#### Opções

Nenhuma própria — o `context` expõe só as oito compartilhadas da §11.0.

#### Comportamento

**Título vazio** — a região some e o corpo sobe para 80, tomando os 1080px inteiros. É um
slide de parágrafo puro, e é uma escolha válida quando o texto já abre com a própria tese.

Com o cabeçalho **ligado**, o corpo sobe para **212** e não para 80: a faixa do topo
continua ocupada, e o que o título liberou são os 214px entre 212 e 426. São quatro
combinações de cabeçalho e título, e nas quatro o corpo acaba em 1160, no topo do rodapé —
866, 1080, 734 ou 948px de altura.

**Parágrafo único.** O campo aceita quebra de linha, mas dois parágrafos num slide de
carrossel quase sempre são dois slides. Quem precisa de mais de um bloco tem o
`text-bullets` ao lado.

**Marcação** — vale a regra de um nível de ênfase por bloco da §3.4. Num parágrafo longo,
`[[destaque]]` numa frase é o que faz o slide ser lido em três segundos por quem só
desliza.

```ts
defaults: {
  fields: {
    kicker: "log/ · 02",
    heading: "O que estava acontecendo",
    body: "Durante três semanas, uma fração pequena das requisições devolvia dados de outra pessoa. Nenhum alerta disparou, porque do ponto de vista da infraestrutura estava tudo saudável.",
  },
  options: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
  },
}
```

---

### 11.5 `text-impact`

**Função** respiro · **Fundo** `grid` · **Grupo** `content`

Uma frase, centralizada, e mais nada. É o payoff no meio da série — o slide que existe para
ficar vazio, e que dá ao leitor um lugar para respirar entre dois blocos densos.

**A única exceção de alinhamento do sistema.** A §3.4 do design system manda alinhar tudo à
esquerda e abre exceção para este template, nominalmente. A exceção vale para a frase e para
mais nada: o kicker continua no canto superior esquerdo, e o rodapé continua sendo o rodapé.

#### Regiões

| Região  | Faixa vertical            | Conteúdo                                            |
| ------- | ------------------------- | --------------------------------------------------- |
| Frase ⌐ | 80 – 1160, ou 212 – 1160  | `slide-display`, centralizada nos **dois** eixos     |
| Rodapé  | 1238 – 1270               | A faixa compartilhada                                |

Com o cabeçalho ligado a região começa em 212 e a frase se recentraliza — desce 66px, metade
do que as outras descem inteiro. É consequência de centralizar, não uma regra à parte.

#### Elementos

| Elemento          | Token                                                             | Cor         |
| ----------------- | ----------------------------------------------------------------- | ----------- |
| Frase             | `slide-display` (96px Oxanium 700, altura 1.05, tracking -0.02em) | `ink-100`   |
| Destaque na frase | idem                                                              | `azure-400` |

**96px, o mesmo da capa, e não um degrau abaixo.** O `text-impact` é onde a série entrega o
que prometeu, e entregá-lo menor do que se prometeu inverteria a hierarquia. O que separa os
dois templates não é o tamanho: a capa ancora à base e alinha à esquerda, este centraliza
nos dois eixos. Mesmo tipo, gestos opostos.

#### Campos

| Chave     | Tipo       | Limite | Marcação | Descrição           |
| --------- | ---------- | ------ | -------- | ------------------- |
| `heading` | `textarea` | 70     | sim      | A frase, e só ela   |

Um campo próprio e mais nada — nem lead, nem atribuição, nem legenda. Cada campo a mais é um
convite a preencher o slide que existe para ficar vazio, e a série já tem onde pôr o
desdobramento: o slide seguinte.

O limite é o mesmo 70 da capa, porque a região e o corpo tipográfico são os mesmos. Isso faz
a troca `cover-statement` ↔ `text-impact` ser exata nos dois sentidos: mesma chave, mesma
forma, mesmo conselho de limite.

#### Opções

Nenhuma própria — expõe só as oito compartilhadas da §11.0.

#### Comportamento

**Frase curta é o alvo.** Uma linha de doze palavras centralizada em 96px, com o grid ao
fundo e tudo mais vazio, é o slide mais forte da biblioteca. Duas ou três linhas ainda
funcionam; acima disso o template está sendo usado como capa.

**Marcação** — como na capa, na prática só `[[destaque]]`. `**forte**` não tem efeito
visível em Oxanium 700 e `==marca==` fica pesado demais a 96px.

**Nasce com grade.** É o único template de miolo que nasce com o fundo ligado, e é o que o
marca visualmente como pausa: o leitor reconhece o respiro antes de ler a frase.

```ts
defaults: {
  fields: {
    kicker: "log/ · 06",
    heading: "Três semanas para um [[bug de uma linha]]",
  },
  options: {
    showGrid: true, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
  },
}
```

---

### 11.6 `code-window`

**Função** código puro · **Fundo** `plain` · **Grupo** `code`

Um bloco de código e o título que diz o que olhar nele. O bloco é o da §10.3 do design
system, com o tema do shiki derivado dos tokens da §10.4 — **gerado**, nunca importado
pronto, senão é a única coisa do carrossel que não parece do sistema.

#### Regiões

| Região  | Faixa vertical | Conteúdo                                        |
| ------- | -------------- | ----------------------------------------------- |
| Título  | 80 – 230       | `slide-heading`, até duas linhas                 |
| Bloco ⌐ | 294 – 1160     | A janela de código, centralizada verticalmente   |
| Rodapé  | 1238 – 1270    | A faixa compartilhada                            |

Com o cabeçalho ligado, título em 212 – 362 e bloco em 426 – 1160, como no `context`.

**A janela tem a altura do código, não a da região.** Ela cresce com as linhas e se
centraliza nos 866px; quatro linhas não desenham um painel vazio de 866px de altura. A
região é que tem altura fixa — é ela que o guard mede, e é a armadilha da §13 do documento
de contexto: o que se mede não pode ser dimensionado pelo que contém.

#### Elementos

| Elemento        | Token                                              | Cor              |
| --------------- | -------------------------------------------------- | ---------------- |
| Título          | `slide-heading` (56px Oxanium 600, altura 1.15)    | `ink-100`        |
| Janela          | superfície `slide-raised`, raio 12px, **sem borda** | —                |
| Pontos da barra | três círculos de 10px, gap 16px                    | `ink-700`        |
| Nome do arquivo | `slide-meta` **em caixa baixa** (28px mono, 0.12em) | `ink-400`        |
| Código          | `slide-code` (34px JetBrains Mono, altura 1.5)     | tema da §10.4    |

Geometria da janela: padding interno de 32px — o `--slide-pad-code` da §4.2 —, barra
superior de 92px contando o padding, e o código começando aí. Numa região de 866px isso
deixa 742px para o código, e a 51px por linha dão **14 linhas**, que é exatamente o teto
que a §10.3 escreve. O número não foi escolhido duas vezes: a régua confirma a regra.

Os 92px da barra são 32 de padding, 28 do nome do arquivo — `slide-meta` tem altura de
linha 1 — e 32 até a primeira linha de código. Entre os pontos e o nome, os mesmos 32px:
dentro da janela, o ritmo é o do `--slide-pad-code`, e não o dos gaps da §4.2, que são da
grade do slide.

**O nome do arquivo sai em caixa baixa**, contra a versalização que a utility `slide-meta`
aplica ao kicker e ao handle. É a exceção da §10.3 do design system, e ela vale só aqui:
nome de arquivo é identificador literal, e `CACHE.TS` mostra um arquivo que não existe no
repositório.

#### Campos

| Chave     | Tipo       | Limite    | Marcação | Descrição                     |
| --------- | ---------- | --------- | -------- | ----------------------------- |
| `heading` | `textarea` | 60        | não      | Título do slide               |
| `file`    | `text`     | 40        | não      | Nome do arquivo, na barra     |
| `lang`    | `select`   | —         | não      | Linguagem, para o realce      |
| `code`    | `code`     | 14 linhas | não      | O código                      |

`code` é o tipo de campo `code` do descritor, com `maxLines`: o contador de linhas fica
âmbar acima do limite e **não trava**, como todo limite desta §11.0. Quem reprova é o guard.

Valores de `lang`, que são as linguagens que entram no bundle do shiki — a lista é fina de
propósito, e a 3D a fecha contra o que o carrossel usa de verdade:

`ts` · `tsx` · `js` · `json` · `bash` · `sql` · `css` · `python` · `text`

`text` existe para colar log, stack trace ou saída de terminal sem realce nenhum, que é
metade do que um carrossel de backend mostra.

#### Opções

Nenhuma própria — expõe só as oito compartilhadas da §11.0.

**O realce de linha e o diff da §10.3 não têm controle na v1.** A seção diz como eles
aparecem quando aparecerem; expor um campo de faixa de linhas — `3-5` — é assunto de outra
etapa, e a v1 entrega o bloco realçado, que é o que o carrossel precisa. Fica registrado
para não parecer esquecimento.

#### Comportamento

**Grade desligada, e é mais que padrão aqui.** A §4.3 do design system recomenda não ligar
o fundo em slide de código: a linha da grade atravessa a janela e compete com o realce. É
conselho, como todo o resto — mas é o conselho mais fácil de comprovar olhando.

**Código longo** — a 34px mono, a janela comporta cerca de 45 caracteres por linha. Linha
mais longa que isso quebra ou vaza, e nenhuma das duas é boa num slide: reescreva a linha
antes de aceitar a quebra. É a mesma regra de "estrutura é responsabilidade do template" da
§7 do documento de contexto, aplicada ao código.

**Título vazio** — a região some e a janela ocupa 80 – 1160. Continuam valendo as 14 linhas
do teto da §10.3: a janela ganha ar em volta, não mais linhas.

```ts
defaults: {
  fields: {
    kicker: "api/ · 04",
    heading: "A linha que ninguém tinha lido",
    file: "cache.ts",
    lang: "ts",
    code: "const key = `user:${id}`\n\nexport function get(id: string) {\n  return cache.get(key) ?? load(id)\n}",
  },
  options: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
  },
}
```

---

### 11.7 `code-annotated`

**Função** código com explicação · **Fundo** `plain` · **Grupo** `code`

O mesmo bloco da §11.6 com a explicação **abaixo**, nunca ao lado. Não é preferência de
composição: a 34px mono, uma coluna de 428px comporta 21 caracteres por linha, e código
nessa medida não é legível. O `compare-2col` pode dividir a largura porque compara texto; o
código exige os 920px.

As três chaves de código são **idênticas** às da §11.6 — mesmo nome, mesmo tipo, mesmo
`maxLines`. Trocar entre os dois preserva o código, o arquivo e a linguagem, e é a troca
mais provável da biblioteca inteira: percebi que a janela precisava de uma frase.

#### Regiões

**Com o cabeçalho desligado:**

| Região       | Faixa vertical | Conteúdo                                       |
| ------------ | -------------- | ---------------------------------------------- |
| Título       | 80 – 230       | `slide-heading`, até duas linhas                |
| Bloco ⌐      | 294 – 826      | A janela de código, centralizada verticalmente  |
| Explicação ⌐ | 890 – 1160     | Texto corrido, ancorado ao topo                 |
| Rodapé       | 1238 – 1270    | A faixa compartilhada                           |

Os 64px entre o bloco e a explicação são o `--slide-gap-block` da §4.2. Nos 532px do bloco
cabem oito linhas de código pela conta da §11.6; nos 270px da explicação cabem quatro linhas
de `slide-body`.

**Com o cabeçalho ligado, quem encolhe é o código:**

| Região       | Faixa vertical | Conteúdo                                    |
| ------------ | -------------- | ------------------------------------------- |
| Cabeçalho    | 80 – 148       | A faixa compartilhada                        |
| Título       | 212 – 362      | 132px abaixo, como nos outros                |
| Bloco ⌐      | 426 – 826      | 400px em vez de 532 — cerca de cinco linhas  |
| Explicação ⌐ | 890 – 1160     | **Sem mudança**                              |

É a única variação de cabeçalho da biblioteca que não empurra tudo por igual, e o motivo é
o que cada região perde ao encolher. Prosa que perde duas linhas vira pensamento cortado ao
meio; código que perde duas linhas é um trecho mais curto, que já era conselho antes. O
`maxLines` do descritor continua 14 — limite é estático, e é conselho: com o cabeçalho
ligado o guard reprova bem antes dele, e é assim que deve ser.

#### Elementos

Os da §11.6 para a janela, mais:

| Elemento   | Token                                    | Cor       |
| ---------- | ---------------------------------------- | --------- |
| Explicação | `slide-body` (40px Sora 400, altura 1.5) | `ink-200` |

A explicação usa o mesmo corpo e a mesma cor do `context`, porque é a mesma coisa: texto
corrido. A largura aqui são os 920px inteiros — são quatro linhas, não oito, e a medida de
linha só dói em parágrafo longo.

#### Campos

| Chave     | Tipo       | Limite    | Marcação | Descrição                 |
| --------- | ---------- | --------- | -------- | ------------------------- |
| `heading` | `textarea` | 60        | não      | Título do slide           |
| `file`    | `text`     | 40        | não      | Nome do arquivo, na barra |
| `lang`    | `select`   | —         | não      | Linguagem, para o realce  |
| `code`    | `code`     | 14 linhas | não      | O código                  |
| `body`    | `textarea` | 180       | sim      | A explicação              |

`body` é a chave do vocabulário canônico, e não uma `note` própria — decisão 45. O papel é o
mesmo texto corrido do `context` e do `split-vertical`, e a chave compartilhada faz a troca
entre os três preservar o que foi escrito. O limite de 180 são as quatro linhas da região.

#### Opções

Nenhuma própria — expõe só as oito compartilhadas da §11.0.

#### Comportamento

**A explicação não repete o código.** Ela diz o que não está escrito ali: por que a linha
existe, o que ela custou, o que ela quebrou. Se a frase descreve o que se lê logo acima, o
slide é um `code-window`.

**Explicação vazia** — o bloco de código desce e ocupa 294 – 1160, e o slide vira um
`code-window` com mais uma chave guardada. Funciona, mas trocar o layout é mais honesto.

**Título vazio** — a região some e o bloco sobe, como em qualquer template da §11.0. Sobe
para 80 com o cabeçalho desligado e para 212 com ele ligado: a faixa do topo continua
ocupada, e o bloco toma o que sobra.

**As oito faixas do bloco.** Este é o único template cuja faixa de conteúdo depende de três
interruptores em vez de dois, e a tabela abaixo é o cruzamento das duas de cima com as duas
regras de região vazia. O **topo** é o mesmo do `code-window`; o **fim** é o que este
template acrescenta — 826 com a explicação embaixo, 1160 sem ela.

| Cabeçalho | Título | Explicação | Faixa do bloco |
| --------- | ------ | ---------- | -------------- |
| desligado | sim    | sim        | 294 – 826      |
| desligado | sim    | não        | 294 – 1160     |
| desligado | não    | sim        | 80 – 826       |
| desligado | não    | não        | 80 – 1160      |
| ligado    | sim    | sim        | 426 – 826      |
| ligado    | sim    | não        | 426 – 1160     |
| ligado    | não    | sim        | 212 – 826      |
| ligado    | não    | não        | 212 – 1160     |

A explicação **não aparece na tabela porque não se move**: 890 – 1160 nas oito, sempre que
existe. É a mesma razão da variação de cabeçalho acima — quem paga o espaço é o código, não
a prosa.

**Marcação** — a explicação aceita, e `` `código` `` inline é o marcador natural aqui: citar
um identificador do bloco acima é exatamente o que a anotação faz.

```ts
defaults: {
  fields: {
    kicker: "api/ · 05",
    heading: "A correção",
    file: "cache.ts",
    lang: "ts",
    code: "const key = `user:${id}:${tenant}`",
    body: "A chave não incluía o tenant. Dois clientes com o mesmo id de usuário liam a mesma entrada — e o cache respondia antes do banco, então nenhum log registrava a troca.",
  },
  options: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
  },
}
```

---

### 11.8 `compare-2col`

**Função** antes/depois · **Fundo** `plain` · **Grupo** `content`

Duas colunas lado a lado, com um rótulo cada. É o template mais denso da biblioteca e o
único com um par simétrico de campos.

#### Regiões

| Região   | Faixa vertical | Conteúdo                                     |
| -------- | -------------- | -------------------------------------------- |
| Título   | 80 – 230       | `slide-heading`, até duas linhas              |
| Colunas ⌐ | 294 – 1160    | Duas colunas, as duas ancoradas ao **topo**   |
| Rodapé   | 1238 – 1270    | A faixa compartilhada                         |

Com o cabeçalho ligado, título em 212 – 362 e colunas em 426 – 1160.

**A divisão dos 920px é 428 + 64 + 428.** Os 64px são o gap entre blocos da §4.2, que é o
degrau sancionado para separar duas coisas de igual peso. As duas colunas ancoram ao topo
para que os dois rótulos fiquem na mesma linha: é o que faz a comparação ser lida como par
e não como duas listas soltas.

#### Elementos

| Elemento | Token                                                        | Cor         |
| -------- | ------------------------------------------------------------ | ----------- |
| Título   | `slide-heading` (56px Oxanium 600, altura 1.15)              | `ink-100`   |
| Rótulo   | `slide-meta` (28px mono, tracking 0.12em, caixa alta)        | `ink-400`   |
| Régua    | `slide-hairline` sob o rótulo, na largura da coluna, gap 24px | `ink-700`   |
| Conteúdo | `slide-caption` (32px Sora 400, altura 1.4)                  | `ink-100`   |

Os 24px do gap valem também entre a régua e o conteúdo: dentro da coluna o ritmo é o da
coluna, e não os degraus da §4.2, que são da grade do slide. É o mesmo raciocínio dos 32px
dentro da janela de código, na §11.6.

**O conteúdo desce um degrau da escala, para 32px.** Numa coluna de 428px, `slide-body`
40px daria 21 caracteres por linha; `slide-caption` 32px dá cerca de 27, encostando na faixa
de 28 a 42 da §3.4. É o preço honesto de duas colunas num canvas de 1080, e é a mesma
escolha que o `split-vertical` faz pelo mesmo motivo.

**As duas colunas são iguais em cor.** Nada de verde no "depois" e vermelho no "antes": a
§2.5 do design system reserva verde e vermelho a estado de sistema e proíbe usá-los como
juízo de conteúdo. O que distingue os lados são os rótulos, e o que o leitor conclui é
assunto dele. A régua sob o rótulo usa a utility `slide-hairline`, com a compensação de
`--slide-scale` da decisão 38 — sem ela a linha some no preview reduzido.

#### Campos

| Chave         | Tipo       | Limite | Marcação | Descrição                  |
| ------------- | ---------- | ------ | -------- | -------------------------- |
| `heading`     | `textarea` | 60     | não      | Título do slide            |
| `beforeLabel` | `text`     | 20     | não      | Rótulo da coluna esquerda  |
| `before`      | `textarea` | 200    | sim      | Conteúdo da coluna esquerda |
| `afterLabel`  | `text`     | 20     | não      | Rótulo da coluna direita   |
| `after`       | `textarea` | 200    | sim      | Conteúdo da coluna direita |

**As quatro são próprias deste template**, e não entram no vocabulário canônico da §6:
nenhum segundo template tem o papel antes/depois, e vocabulário com um usuário só reserva à
biblioteca inteira o que um layout usa. Decisão 45. Se um segundo template de comparação
aparecer, é aí que elas sobem.

O limite de 200 são cerca de sete linhas por coluna — 336px dos 866 disponíveis. A folga é
deliberada: comparação que enche as duas colunas até o fim não se lê em três segundos, que
é o tempo que um slide de carrossel tem.

#### Opções

Nenhuma própria — expõe só as oito compartilhadas da §11.0.

#### Comportamento

**Os rótulos são curtos e concretos.** "Antes" e "Depois" funcionam; `sem cache` e
`com cache` funcionam melhor, porque dizem o que mudou em vez de dizer que mudou. Os 20
caracteres são conselho para manter os dois numa linha só.

**Colunas de tamanhos diferentes** — não se equalizam, e não deveriam: as duas começam no
topo e cada uma acaba onde acaba. Forçar altura igual encheria a menor de espaço em branco
com o rótulo pendurado longe do conteúdo.

**Título vazio** — a região some e as colunas sobem, como em qualquer template da §11.0:
para 80 com o cabeçalho desligado, para 212 com ele ligado. São as mesmas quatro
combinações do `context`, e nas quatro as colunas acabam em 1160.

**O guard mede a linha das duas colunas, não cada uma.** A marca ⌐ da tabela de regiões é
uma só de propósito: num par lado a lado, a altura que interessa é a da coluna mais alta, e
é ela que a linha tem. Dois guards mediriam a mesma coisa por dois caminhos.

**Marcação** — vale nas duas colunas, e a regra de um nível de ênfase por bloco da §3.4 vale
para o slide inteiro, não por coluna. `` `código` `` inline é o marcador mais útil aqui, e
o único que costuma aparecer nas duas colunas sem competir consigo mesmo.

```ts
defaults: {
  fields: {
    kicker: "api/ · 07",
    heading: "O que mudou no monitoramento",
    beforeLabel: "Antes",
    before: "Alertas de infraestrutura: CPU, memória, latência. Todos verdes durante as três semanas.",
    afterLabel: "Depois",
    after: "Um alerta por invariante de negócio: duas respostas com tenants diferentes para a mesma chave.",
  },
  options: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
  },
}
```

---

### 11.9 `split-vertical`

**Função** texto + imagem · **Fundo** `plain` · **Grupo** `media`

O corte é **vertical**: texto à esquerda, imagem à direita, sangrando pelo topo e pela
borda. É o primeiro dos dois templates de mídia, e o mais contido dos dois — aqui a imagem
acompanha o texto; no `image-caption` ela manda.

#### Regiões

| Região  | Faixa horizontal | Faixa vertical | Conteúdo                                           |
| ------- | ---------------- | -------------- | -------------------------------------------------- |
| Texto ⌐ | 80 – 560         | 80 – 1160      | Título e corpo, centralizados **verticalmente**     |
| Imagem  | 640 – 1080       | 0 – 1174       | Sangra pelo topo e pela direita                     |
| Rodapé  | 80 – 1000        | 1238 – 1270    | A faixa compartilhada, na largura útil inteira      |

Com o cabeçalho ligado, a região de texto começa em 212 e o bloco se recentraliza; a imagem
não se mexe, porque o kicker fica na coluna da esquerda.

**A imagem para em y 1174.** Não é escolha estética: o rodapé precisa dos 920px. Descendo
até a base, ela deixaria à faixa apenas os 480px da coluna de texto, e a identidade com a
placa mais doze pontos de constelação passam de 500px — não cabe, e num deck maior a
constelação cresce. A linha de corte é a mesma da régua da §10.5 do design system, então
quando as duas aparecem juntas elas se alinham.

**O bloco de texto se centraliza verticalmente.** Ao lado de uma imagem de altura quase
cheia, texto ancorado ao topo deixa um buraco entre a última linha e o rodapé que a imagem
não deixa — e a assimetria salta. É a única região de texto da biblioteca centralizada por
padrão em vez de por opção.

#### Elementos

| Elemento | Token                                                     | Cor       |
| -------- | --------------------------------------------------------- | --------- |
| Título   | `slide-heading` (56px Oxanium 600, altura 1.15)           | `ink-100` |
| Corpo    | `slide-caption` (32px Sora 400, altura 1.4), gap 32px      | `ink-200` |
| Imagem   | preenche a faixa, ajuste pela opção `imageFit`             | —         |
| Sem imagem | superfície `slide-surface`, rótulo `slide-meta` centrado | `ink-500` |

O corpo desce para 32px pelo mesmo motivo do `compare-2col`: numa coluna de 480px,
`slide-body` daria 24 caracteres por linha. O título fica em 56px e aceita as três linhas
que a coluna estreita impõe — reduzi-lo faria o slide perder a hierarquia que todos os
outros têm.

#### Campos

| Chave     | Tipo       | Limite | Marcação | Descrição                |
| --------- | ---------- | ------ | -------- | ------------------------ |
| `heading` | `textarea` | 50     | não      | Título do slide          |
| `body`    | `textarea` | 240    | sim      | Texto ao lado da imagem  |
| `image`   | `image`    | —      | —        | A imagem, `ratio` 5:16   |

`body` é a chave canônica, a mesma do `context` e do `code-annotated`. `image` é a mesma
chave e o mesmo tipo do `image-caption`, e é isso que faz trocar entre os dois preservar a
imagem escolhida — o que muda é o `ratio` que o inspector sugere no recorte.

#### Opções

| Chave       | Tipo     | Padrão  | Efeito                                                       |
| ----------- | -------- | ------- | ------------------------------------------------------------ |
| `imageFit`  | `select` | `cover` | `cover` preenche a faixa e recorta; `contain` cabe inteira, com o que sobra em `slide-surface` |

A faixa é alta e estreita — 440 × 1174 —, e a maioria dos screenshots é larga. `cover` é o
padrão porque recortar uma foto costuma ser melhor que emoldurá-la em duas tarjas; `contain`
existe para quando o que importa é a imagem inteira, como um diagrama.

**`imageFit` não é opção compartilhada**, embora os dois templates de mídia a declarem
igual. Compartilhada, na §11.0, é o que os **dez** expõem; dois de dez é uma opção própria
declarada duas vezes com o mesmo nome e os mesmos valores. Se um terceiro template de mídia
aparecer, ela sobe para `shared/options.ts` — e não antes.

#### Comportamento

**Sem imagem** — a faixa desenha `slide-surface` com o rótulo "Sem imagem" centralizado. É o
estado em que o slide nasce, e também o estado de um deck reidratado cujo `ImageId` não está
mais no IndexedDB: o slide fica, a imagem some, e o schema passa porque o id é uma string
válida. A decisão 31 continua valendo — derruba-se o que não passa, e um id órfão passa.

**Texto longo** — 240 caracteres são cerca de nove linhas de 45px na coluna. Passando disso
o bloco encosta no rodapé e o guard reprova; e quatro linhas já é o ponto em que o slide
teria mais força como `context` com a imagem num slide próprio.

**Grade desligada, e o conselho é forte.** A §4.3 do design system diz que grade compete com
imagem, e aqui ela desenharia por baixo de uma metade e não da outra.

```ts
defaults: {
  fields: {
    kicker: "log/ · 08",
    heading: "O gráfico que não mostrava nada",
    body: "Latência estável, erro em zero, memória plana. O painel inteiro em verde enquanto a fração de respostas trocadas subia.",
    image: "",
  },
  options: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
    imageFit: "cover",
  },
}
```

---

### 11.10 `image-caption`

**Função** imagem dominante · **Fundo** `plain` · **Grupo** `media`

A imagem manda. Sangra pelo topo, pela esquerda e pela direita, e o que sobra embaixo é
título, legenda e rodapé sobre o fundo do slide.

#### Regiões

**Com o cabeçalho desligado**, que é como o template nasce:

| Região   | Faixa horizontal | Faixa vertical | Conteúdo                                 |
| -------- | ---------------- | -------------- | ---------------------------------------- |
| Imagem   | 0 – 1080         | 0 – 910        | Sangra por três lados                     |
| Título ⌐ | 80 – 1000        | 974 – 1038     | `slide-heading`, **uma** linha            |
| Legenda ⌐ | 80 – 1000       | 1070 – 1160    | `slide-caption`, até duas linhas          |
| Rodapé   | 80 – 1000        | 1238 – 1270    | A faixa compartilhada                     |

**Com o cabeçalho ligado**, a imagem começa em 212 e perde altura; nada mais se move:

| Região    | Faixa vertical | Conteúdo                                  |
| --------- | -------------- | ----------------------------------------- |
| Cabeçalho | 80 – 148       | A faixa compartilhada, sobre o fundo       |
| Imagem    | 212 – 910      | 698px em vez de 910                        |
| Título ⌐  | 974 – 1038     | Sem mudança                                |
| Legenda ⌐ | 1070 – 1160    | Sem mudança                                |

O 212 é o mesmo número que todos os outros templates usam quando a faixa liga — 148 do fim
do cabeçalho mais o `--slide-gap-block`. O que muda é a direção: aqui a faixa **corta** a
imagem em vez de empurrar o que está abaixo, porque o que está abaixo é o que o slide
promete e a imagem é quem tem folga para ceder.

#### Elementos

| Elemento   | Token                                                      | Cor       |
| ---------- | ---------------------------------------------------------- | --------- |
| Imagem     | preenche a faixa, ajuste pela opção `imageFit`              | —         |
| Título     | `slide-heading` (56px Oxanium 600, altura 1.15)            | `ink-100` |
| Legenda    | `slide-caption` (32px Sora 400, altura 1.4)                | `ink-400` |
| Sem imagem | superfície `slide-surface`, rótulo `slide-meta` centrado    | `ink-500` |

A legenda é `ink-400` — o papel de texto de apoio da §2.3, e a única região de texto da
biblioteca que não é `ink-100` ou `ink-200`. Ela não disputa com a imagem; explica.

#### Campos

| Chave     | Tipo       | Limite | Marcação | Descrição                    |
| --------- | ---------- | ------ | -------- | ---------------------------- |
| `heading` | `textarea` | 40     | não      | Título, uma linha            |
| `caption` | `textarea` | 90     | sim      | Legenda, até duas linhas     |
| `image`   | `image`    | —      | —        | A imagem, `ratio` 108:91     |

`caption` é a chave canônica da §6 — texto auxiliar de imagem — e este é o único template
que a declara. Está na tabela canônica desde a v1, então continua lá: a diferença entre uma
chave de vocabulário e uma chave própria não é quantos templates a usam hoje, é se o papel
pertence à biblioteca ou a um layout, e "legenda de imagem" pertence à biblioteca.

O limite de 40 no título é o que cabe em uma linha de 56px nos 920px.

#### Opções

| Chave      | Tipo     | Padrão  | Efeito                                        |
| ---------- | -------- | ------- | --------------------------------------------- |
| `imageFit` | `select` | `cover` | O mesmo da §11.9, com os mesmos dois valores  |

#### Comportamento

**Título vazio** — a região some e a legenda sobe para 974. É a versão mais limpa do
template: imagem e uma linha de legenda, que é o que um screenshot com contexto precisa.

**Título e legenda vazios** — a imagem desce até 1174, o limite que a §11.0 dá a qualquer
imagem, e o slide vira só a imagem com o rodapé por cima do fundo. É uma escolha válida e é
o slide mais gráfico que a biblioteca produz.

**A imagem nunca cobre o rodapé.** Nem com os dois campos vazios, nem com `contain`. É a
regra da §11.0, e o motivo é a constelação: um progresso ilegível sobre foto é pior que
imagem menor.

**Sem imagem** — o mesmo estado do `split-vertical`, na faixa maior.

```ts
defaults: {
  fields: {
    kicker: "log/ · 09",
    heading: "O alerta que passou a existir",
    caption: "Duas respostas com tenants diferentes para a mesma chave, na mesma janela de 30 segundos.",
    image: "",
  },
  options: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true,
    showChevron: false,
    imageFit: "cover",
  },
}
```
