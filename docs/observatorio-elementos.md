# Observatório — biblioteca de elementos

> **Versão** 2.0 · **Autor** Rafael · **Escopo** os doze elementos e os dez presets do
> `asterism`
> Extraído da §11 de `observatorio-design-system.md`, que continua sendo a fonte da
> verdade visual — cor, tipografia, grade do slide e componentes recorrentes moram lá.
> Aqui está apenas o que muda de um slide para o outro: os elementos, a pilha que os
> empilha e as composições de partida.
> A numeração é preservada de propósito, e **os endereços §11.1 a §11.10 continuam sendo
> os dez de sempre** — agora como presets, não como templates. São 255 referências
> `§11.x` espalhadas por `src/` e pelos outros documentos, e renumerá-las seria invalidar
> todas em silêncio. Os elementos entram em §11.11 e seguintes.
> A v1.0 deste arquivo, com os dez templates especificados como código, está no histórico
> do git sob o nome `observatorio-templates.md`.

---

## 11. Biblioteca de elementos

Um slide é **uma configuração de layout mais uma lista ordenada de elementos**. O layout
diz o que existe em volta do conteúdo — grade, cabeçalho, rodapé, âncora vertical — e a
lista diz o que o slide fala. Todo tipo de elemento está disponível em qualquer slide.

| §     | Elemento    | Papel                                   | Degrau da §3.3   |
| ----- | ----------- | --------------------------------------- | ---------------- |
| 11.11 | `statement` | A declaração — capa e respiro           | `slide-display`  |
| 11.12 | `heading`   | Título do slide                         | `slide-heading`  |
| 11.13 | `lead`      | Complemento do título                   | `slide-lead`     |
| 11.14 | `text`      | Parágrafos e listas                     | `slide-body`     |
| 11.15 | `caption`   | Texto de apoio                          | `slide-caption`  |
| 11.16 | `label`     | Etiqueta de bloco ou de coluna          | `slide-meta`     |
| 11.17 | `quote`     | Citação, com atribuição opcional        | `slide-body`     |
| 11.18 | `code`      | A janela de código                      | `slide-code`     |
| 11.19 | `image`     | Imagem, contida ou sangrada             | —                |
| 11.20 | `cta`       | Destino ou ação                         | `slide-code`     |
| 11.21 | `divider`   | Régua na largura do container           | —                |
| 11.22 | `columns`   | Duas colunas, um nível                  | —                |

E dez **presets** — nome, configuração de layout e lista de elementos com valores de
partida —, que são as dez composições que a v1 tinha como template:

| §     | Preset            | Função                | Composição                                    |
| ----- | ----------------- | --------------------- | --------------------------------------------- |
| 11.1  | `cover-statement` | Gancho                | `statement`                                   |
| 11.4  | `context`         | Segurar o leitor      | `heading` · `text`                            |
| 11.2  | `text-bullets`    | Desenvolvimento       | `heading` · `text` em lista                   |
| 11.5  | `text-impact`     | Respiro               | `statement`, âncora ao centro                 |
| 11.6  | `code-window`     | Código puro           | `heading` · `code`                            |
| 11.7  | `code-annotated`  | Código com explicação | `heading` · `code` · `text`                   |
| 11.8  | `compare-2col`    | Antes/depois          | `heading` · `columns` 50/50                   |
| 11.9  | `split-vertical`  | Texto + imagem        | `columns` 60/40 com imagem sangrada           |
| 11.10 | `image-caption`   | Imagem dominante      | `image` sangrada · `heading` · `caption`      |
| 11.3  | `final-cta`       | Fechamento            | `statement` · `lead` · `cta`, âncora à base   |

### Por que a biblioteca deixou de ser dez templates

Os dez foram especificados por **função narrativa**, assumindo que o texto se moldaria ao
template disponível. Na prática o autor escreve o post primeiro e depois procura onde ele
cabe: quando o trecho tem dois parágrafos e uma lista, nenhum dos dez serve, e a luta é com
a ferramenta em vez de ser com o texto.

A rigidez tinha assinatura no código. Eram oito opções por slide, as oito booleanas e as
oito controlando cromo — nenhuma tocava no formato do conteúdo —, e cada template declarava
um conjunto fixo de chaves. O sistema dava controle fino sobre **o que esconder** e nenhum
sobre **o que dizer**.

O que muda é o modelo de conteúdo, que é uma camada fina. O que fica de pé: a grade do
slide, a escala tipográfica, o cromo das duas faixas, o padrão de registry, o guard de
transbordo, o formulário derivado de descritor e o caminho de exportação. Ver as decisões
60 a 74 da §16 do documento de contexto.

**A restrição mudou de lugar, não desapareceu.** Antes era impossível fazer um slide feio
porque só havia dez formas. Agora é possível, e duas regras seguram quase tudo: elemento não
carrega estilo, e o menu de adicionar some quando a cardinalidade foi atingida. A pergunta
deixou de ser "qual template encaixa" e passou a ser "quais elementos convivem".

---

### 11.0 Regras comuns

Todo slide ocupa 1080×1350 com padding de 80px em todos os lados, o que dá uma largura
útil de **920px**. Nada de logo ou CTA a menos de 60px da borda.

#### As duas faixas de cromo

**Cabeçalho e rodapé não são elementos.** São cromo do layout, e continuam exatamente como a
§10.5 do design system os descreve. O cabeçalho ocupa 80–148 e traz o kicker em `slide-meta`
`azure-400`; o rodapé ocupa a última faixa, com a linha de base a 80px do fundo.

`showHeader` e `showFooter` são interruptores **de faixa**: desligados, a faixa inteira some,
e no rodapé isso inclui a constelação. As cinco opções do rodapé — `showRule`, `showLogo`,
`showLogoPlate`, `showHandle`, `showChevron` — escolhem o que ele mostra.

**O kicker é a única peça de conteúdo que mora no layout.** É texto digitado, e pela §6 do
documento de contexto conteúdo mora no conteúdo; ele fica aqui porque é o que a faixa **é**,
do mesmo jeito que a constelação é o que o rodapé é. Promovê-lo a elemento traria de volta
uma cardinalidade a mais, um caminho de migração a mais e uma faixa 80–148 que deixaria de
ser fixa, tudo para permitir uma etiqueta no meio do slide que ninguém pediu. Decisão 66,
que confirma a 42.

#### A região de conteúdo é uma pilha vertical

O que sobra entre as faixas é **uma região com pilha vertical**, e cada elemento ocupa o que
precisa. Não há faixa absoluta por template, porque ninguém sabe de antemão quantos blocos
existem.

| Cabeçalho | Topo da região |
| --------- | -------------- |
| desligado | 80             |
| ligado    | 212            |

O 212 é o de sempre: 148 do fim do cabeçalho mais o `--slide-gap-block`.

**A região acaba em 1160 com o rodapé ligado ou desligado.** Os 110px que sobram quando a
faixa some são respiro, não espaço a tomar: duas alturas de região em vez de quatro, e um
slide não muda de composição por causa de um interruptor de rodapé.

Espaçamento, todo ele da §4.2 do design system:

| Onde | Gap |
| --- | --- |
| Entre elementos da pilha | 64px, o `--slide-gap-block` |
| Entre itens de lista dentro de um `text` | 48px |
| Entre elementos dentro de uma coluna | 24px |
| Entre as duas colunas | 64px, ou 80px quando uma delas sangra |

**Não existe elemento de espaçamento.** Espaçador explícito é estilo livre pela porta dos
fundos — o autor passa a ajustar altura em vez de escrever, e o guard não sabe julgar um
vazio de 200px. O que existe é a **âncora vertical** do layout, que é o antigo `anchor` do
`text-bullets` generalizado. Decisão 67.

| Âncora | Efeito | Quem usava |
| --- | --- | --- |
| `topo` | A pilha começa no topo da região | O padrão, e o `context` |
| `centro` | A pilha se centraliza na região | `text-bullets`, `text-impact`, `split-vertical` |
| `base` | A última linha pousa no fim da região | `cover-statement`, `final-cta` |

**Elemento vazio não desenha nada e não consome gap.** É a regra de região vazia da v1
generalizada: um `lead` sem texto some junto com os 64px que o separariam do vizinho, e o
resto sobe. Vale para todo elemento de texto e para a imagem sem `ImageId`, que desenha o
estado "Sem imagem" no editor e nada no arquivo exportado.

**A imagem é o elemento elástico da pilha.** Todo elemento de texto tem a altura do que
contém; a imagem toma o que os outros deixarem. Duas imagens na mesma pilha dividem a sobra
em partes iguais. Abaixo de **200px** de altura a imagem não é mais imagem, e o guard
reprova — é o piso que impede um slide de cinco parágrafos de espremer a foto até a linha.

#### Quebra de linha: a correção da v1

Esta seção dizia que toda quebra de linha é natural e que não existe campo de quebra manual,
porque quebra manual congela o layout. **Isso vale para a quebra tipográfica e não vale para
o parágrafo**, e tratar as duas como uma só custou o primeiro uso real da ferramenta: um
enter no inspector não chegava ao slide.

| | O que é | Vale? |
| --- | --- | --- |
| Quebra **tipográfica** | Partir um título num ponto específico para ficar bonito | **Não.** Congela o layout e some com a razão de os presets existirem |
| Quebra **de conteúdo** | Parágrafo, item de lista | **Sim.** É estrutura do pensamento, não ajuste visual |

O elemento `text` da §11.14 é quem materializa isso, sobre a camada de blocos da §7 do
documento de contexto: linha em branco separa parágrafo, `- ` abre item não ordenado e
`1. ` abre item ordenado. Sem títulos e sem cercas de código nessa camada — título é
elemento próprio e código é elemento próprio. Decisão 60.

Nos elementos de uma linha — `heading`, `label`, `cta` — a quebra continua natural, e o
enter ali não faz nada. É onde a proibição original continua tendo razão.

#### Elemento não carrega estilo

Um título tem **um tamanho só**, o que a §3.3 do design system dá a ele. O autor escolhe
*que* elemento usar, nunca *como* ele se parece: não há seletor de tamanho, de cor nem de
peso em lugar nenhum desta biblioteca. Decisão 62.

As poucas escolhas de aparência que existem são **geometria fechada**, e cada uma está
justificada na seção do elemento: o ajuste e o sangramento da imagem, a proporção e o
alinhamento das colunas, a seta do CTA. Todas são listas de dois ou três valores, nunca um
slider — porque um slider é uma folha de estilo com outro nome.

**O que o container decide, o elemento obedece.** Dentro de uma coluna, `text` e `quote`
descem de `slide-body` 40px para `slide-caption` 32px: numa coluna de 428px, 40px daria 21
caracteres por linha e 32px dá cerca de 27, dentro da faixa de 28 a 42 da §3.4. É a mesma
conta que o `compare-2col` e o `split-vertical` já faziam, agora escrita uma vez em vez de
duas. E é escolha do sistema, não de quem edita.

#### Cardinalidade, e o menu que some

O limite de quantos elementos de um tipo cabem num slide é **bloqueio antes do erro**: a
opção desaparece do seletor de adicionar quando o teto foi atingido, em vez de haver
validação depois. A tabela completa está na §11.23.

#### Os limites de caractere são conselho

O campo aceita mais; o contador fica âmbar ao passar do limite e o guard de transbordo é
quem reprova de fato, medindo altura real. Continua valendo, e com mais força do que antes:
com lista livre de elementos, o guard deixa de ser rede de segurança e vira o mecanismo
central de validação. É a única coisa impedindo o autor de empilhar oito elementos.

#### O guard de transbordo é recursivo

O guard da §9 do documento de contexto compara a altura do conteúdo com a altura da região
que o contém. Com aninhamento isso passa a valer em cada nível:

- a região de conteúdo do slide é um container;
- **cada coluna é um container independente**;
- a altura de um `columns` é o **máximo** das duas colunas;
- o slide reprova se **qualquer** container estourar;
- o aviso **nomeia o elemento** que estourou — o primeiro cuja base passa da borda inferior
  do container —, senão o autor caça num slide de seis.

Continua valendo a armadilha da §13 do contexto: **o container medido tem altura de faixa,
não altura de conteúdo**. O que se mede não pode ser dimensionado pelo que contém, senão a
escala se realimenta.

A marca **⌐** que a v1 desta seção pedia em cada template não existe mais, porque não há mais
o que escolher: todo container de conteúdo é medido.

#### Imagem pode sangrar; conteúdo, não

O padding de 80px vale para conteúdo. **A imagem pode sangrar** — e só ela. É a decisão 46,
que sobrevive à virada porque é geometria e não estilo, e que na §11.19 vira uma opção
fechada do elemento em vez de uma propriedade de dois templates. Decisão 71.

O sangramento tem um limite, e ele é geométrico: **nenhuma imagem entra na faixa do rodapé**.
O rodapé precisa dos 920px inteiros — a placa da logo mais o handle somam cerca de 217px e
doze pontos de constelação somam 276px, e com o gap entre os dois grupos isso passa de 500px.
Daí a imagem parar em **y 1174**, que é a linha da régua da §10.5 do design system.

#### O vocabulário de chaves continua

As chaves de campo são as mesmas da §6 do documento de contexto, agora dentro do elemento:
`heading`, `lead`, `body`, `caption`, `image`, `code`/`file`/`lang`, `cta`. O que some é o
único par que era próprio de um template — `beforeLabel`/`before` e `afterLabel`/`after` do
`compare-2col` —, porque um rótulo dentro de uma coluna é o elemento `label` e o conteúdo é o
elemento `text`. A exceção que a decisão 45 previa deixou de existir sozinha.

---

## Os dez presets

Um preset é **nome, configuração de layout e lista de elementos com valores de partida**.
Não é código: é dado, carregado de um mapa de seed e aplicável a qualquer slide.

**O conteúdo do preset é vazio.** O texto de exemplo que a v1 escrevia no `defaults` de cada
template mora na **semente** — `src/editor/seed.ts` —, que é quem monta o carrossel de
referência. Preset guarda o esqueleto; snapshot guarda o texto, e a §11.23 diz como se
escolhe entre os dois na hora de salvar.

**Aplicar um preset a um slide que já tem conteúdo casa por tipo, na ordem.** O primeiro
`text` do preset recebe o texto do primeiro `text` do slide, e assim por diante; elemento sem
par no destino é descartado, elemento sem par na origem nasce vazio. É a regra de interseção
da decisão 13 levantada de chaves para tipos de elemento, e é o que impede a troca de
composição de apagar trabalho — o pior momento possível de uso da ferramenta.

Os dez são **fixos**: não se editam, não se apagam e não se renomeiam. São o vínculo entre
esta seção e o código, e a função que converte os dez templates da v1 em listas de elementos
**é** a definição deles — escrever as duas coisas em separado é garantir que divirjam.
Decisão 73. Preset salvo pelo autor é outra coisa, e a §11.23 trata dele.

---

### 11.1 `cover-statement`

**Função** gancho · **Fundo** `grid` · **Âncora** base

```ts
{
  layout: {
    showGrid: true, showHeader: true, showFooter: true, showRule: false,
    showLogo: false, showLogoPlate: true, showHandle: false, showChevron: true,
    anchor: "bottom", kicker: "",
  },
  elements: [{ t: "statement", heading: "" }],
}
```

O único preset que **nasce** com o cabeçalho ligado e sem identidade no rodapé. O título é a
única coisa que importa e nada compete com ele — recomendação, não trava.

**A âncora à base é a decisão estrutural.** Com uma linha ou com quatro, a última linha pousa
sempre na mesma altura. Sem isso, cada capa do carrossel teria um ritmo diferente e a série
perderia identidade. Na v1 isso era `items-end` escrito no componente; agora é `anchor` no
layout, e qualquer composição pode ter o mesmo gesto.

**Título curto deixa o topo vazio, e é intencional** — o vazio acima é respiro, não erro.
Em 96px com 920px de largura cabem cerca de 19 caracteres por linha; o conselho de 70 dá
aproximadamente quatro linhas, o que preenche a região.

---

### 11.2 `text-bullets`

**Função** desenvolvimento · **Fundo** `plain` · **Âncora** centro

```ts
{
  layout: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "center", kicker: "",
  },
  elements: [{ t: "heading", heading: "" }, { t: "text", body: "- \n- \n- " }],
}
```

O preset mais usado de um carrossel, e o que mais ganha com a virada: **os tópicos deixaram
de ser um campo `list` e passaram a ser um `text` com três linhas de `- `**. O autor digita,
em vez de operar um formulário com três botões por item.

Some com isso o campo `list` do inspector, com seus botões de subir, descer e remover por
item; some também o limite de "4 itens, 80 caracteres cada", que vira o conselho de
caracteres do `text` inteiro. Quem reprova continua sendo o guard.

O `anchor` que era opção própria deste template virou a âncora do layout, disponível em
qualquer composição — §11.0. **Três itens é o alvo, quatro é o teto**: com dois o slide fica
vazio e o conteúdo pede `text-impact`; com cinco, transborda e o conteúdo pede dois slides.

---

### 11.3 `final-cta`

**Função** fechamento · **Fundo** `grid` · **Âncora** base

```ts
{
  layout: {
    showGrid: true, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "bottom", kicker: "",
  },
  elements: [
    { t: "statement", heading: "" },
    { t: "lead", lead: "" },
    { t: "cta", cta: "", arrow: true },
  ],
}
```

Fecha com o mesmo gesto da capa — âncora à base —, e a constelação aparece inteira acesa
porque este é o último slide. A contagem sai da **posição** no deck, como sempre: um
`final-cta` parado no meio do carrossel mostra o progresso real.

**O fecho subiu de 72px para 96px**, e é a única mudança visual que a virada impõe a um
preset. A v1 desenhava o título aqui em `slide-title`, um degrau que nenhum outro template
usava; a biblioteca de elementos tem `statement` a 96 e `heading` a 56, e não um terceiro
título entre os dois. A escolha é subir e não descer pelo argumento que a §11.5 já fazia:
este é o slide onde a série entrega o que prometeu, e entregá-lo menor do que se prometeu
inverteria a hierarquia. O degrau `slide-title` continua na escala da §3.3 do design system,
agora sem uso na biblioteca.

**Lead vazio** — o bloco desaparece junto com o gap, e o preset vira título e CTA com 64px
entre eles. É a versão mais limpa, e uma escolha válida.

---

### 11.4 `context`

**Função** segurar o leitor · **Fundo** `plain` · **Âncora** topo

```ts
{
  layout: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "top", kicker: "",
  },
  elements: [{ t: "heading", heading: "" }, { t: "text", body: "" }],
}
```

A capa fez uma declaração; este parágrafo é onde ela ganha o chão que a torna verdadeira.
Mesma composição do `text-bullets` — título e texto —, e o que separa os dois é a âncora e o
que se digita no `text`: prosa aqui, linhas de `- ` lá.

**É este preset que provou que a v1 estava errada.** O `body` era um `<p>` único, e um `\n`
dentro de um `<p>` é espaço em branco por regra do HTML: o enter sumia antes de chegar ao
renderizador. Com a camada de blocos, o mesmo slide aceita parágrafo seguido de bullets, que
é como texto real se organiza — e isso sozinho elimina a pergunta "isso é `context` ou
`text-bullets`?", que era a pergunta errada desde o começo.

A medida de linha de **760px** continua, e agora é regra do elemento `text` em vez de deste
preset. Ver a §11.14.

---

### 11.5 `text-impact`

**Função** respiro · **Fundo** `grid` · **Âncora** centro

```ts
{
  layout: {
    showGrid: true, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "center", kicker: "",
  },
  elements: [{ t: "statement", heading: "" }],
}
```

Uma frase, centralizada, e mais nada. É o payoff no meio da série — o slide que existe para
ficar vazio.

**A exceção de alinhamento da §3.4 do design system mudou de dono.** Ela era nominal a este
template; agora é do `statement`, que centraliza horizontalmente **quando a âncora do slide é
`centro`**. É o que faz este preset e a capa serem o mesmo elemento com gestos opostos — a
capa ancora à base e alinha à esquerda, este centraliza nos dois eixos — sem que nenhum dos
dois escolha alinhamento.

**Nasce com grade**, o único preset de miolo que nasce com o fundo ligado: é o que marca a
pausa antes de a frase ser lida.

---

### 11.6 `code-window`

**Função** código puro · **Fundo** `plain` · **Âncora** centro

```ts
{
  layout: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "center", kicker: "",
  },
  elements: [
    { t: "heading", heading: "" },
    { t: "code", file: "", lang: "ts", code: "" },
  ],
}
```

Um bloco de código e o título que diz o que olhar nele. A janela é a da §10.3 do design
system, com o tema do shiki derivado dos tokens da §10.4 — gerado, nunca importado pronto.

**Grade desligada, e é mais que padrão aqui**: a linha da grade atravessa a janela e compete
com o realce. Conselho, como todo o resto, mas o mais fácil de comprovar olhando.

---

### 11.7 `code-annotated`

**Função** código com explicação · **Fundo** `plain` · **Âncora** topo

```ts
{
  layout: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "top", kicker: "",
  },
  elements: [
    { t: "heading", heading: "" },
    { t: "code", file: "", lang: "ts", code: "" },
    { t: "text", body: "" },
  ],
}
```

O mesmo bloco da §11.6 com a explicação **abaixo**, nunca ao lado — a 34px mono, uma coluna
de 428px comporta 21 caracteres por linha, e código nessa medida não é legível. É por isso
que a §11.23 não oferece `code` dentro de uma coluna.

**As oito faixas que a v1 tabelava aqui deixaram de existir.** Elas eram o cruzamento de três
interruptores — cabeçalho, título vazio, explicação vazia — e cada combinação dava uma faixa
diferente para o bloco. Numa pilha vertical isso não se calcula: cada elemento ocupa o que
precisa, elemento vazio não desenha nada e a janela de código, que tem altura de conteúdo,
fica com o que sobra. Oito linhas de tabela viram nenhuma, e essa é a mudança arquitetural
desta virada em uma frase.

**A explicação não repete o código.** Ela diz o que não está escrito ali: por que a linha
existe, o que ela custou, o que ela quebrou. Se a frase descreve o que se lê logo acima, o
slide é um `code-window`.

---

### 11.8 `compare-2col`

**Função** antes/depois · **Fundo** `plain` · **Âncora** topo

```ts
{
  layout: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "top", kicker: "",
  },
  elements: [
    { t: "heading", heading: "" },
    {
      t: "columns", ratio: "50/50", align: "top",
      columns: [
        [{ t: "label", label: "" }, { t: "divider" }, { t: "text", body: "" }],
        [{ t: "label", label: "" }, { t: "divider" }, { t: "text", body: "" }],
      ],
    },
  ],
}
```

Duas colunas lado a lado, com um rótulo cada, e a divisão de sempre: **428 + 64 + 428**.

**É o preset que mais ganha em legibilidade de dado.** As quatro chaves próprias da v1 —
`beforeLabel`, `before`, `afterLabel`, `after` — eram o único par assimétrico da biblioteca e
a única exceção ao vocabulário canônico. Elas somem: rótulo é `label`, régua é `divider`,
conteúdo é `text`, e os dois lados são a mesma coisa duas vezes.

**As duas colunas são iguais em cor.** Nada de verde no "depois" e vermelho no "antes": a
§2.5 do design system reserva verde e vermelho a estado de sistema. O que distingue os lados
são os rótulos, e o que o leitor conclui é assunto dele.

**Os rótulos são curtos e concretos.** "Antes" e "Depois" funcionam; `sem cache` e
`com cache` funcionam melhor, porque dizem o que mudou em vez de dizer que mudou.

**Colunas de tamanhos diferentes não se equalizam**, e não deveriam: as duas começam no topo
e cada uma acaba onde acaba. Forçar altura igual encheria a menor de espaço em branco com o
rótulo pendurado longe do conteúdo.

---

### 11.9 `split-vertical`

**Função** texto + imagem · **Fundo** `plain` · **Âncora** centro

```ts
{
  layout: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "center", kicker: "",
  },
  elements: [
    {
      t: "columns", ratio: "60/40", align: "center",
      columns: [
        [{ t: "heading", heading: "" }, { t: "text", body: "" }],
        [{ t: "image", image: "", fit: "cover", bleed: "edge" }],
      ],
    },
  ],
}
```

Texto à esquerda, imagem à direita sangrando pelo topo e pela borda. É o preset que a §4.4 do
redirecionamento previa: "colunas com imagem de um lado".

**A geometria mudou um pouco, e o documento não vai esconder.** A v1 dividia 480 + 80 + 440
com números escritos no template. A proporção fechada mais próxima é **60/40**, que com o gap
de 80px de uma coluna sangrada dá **504 + 80 + 336**, e a imagem sangrada estende os 336 até
a borda, chegando a 416. A coluna de texto ganha 24px e a imagem perde 24px. A conta que
importava continua de pé: em `slide-caption` 32px, 504px dão cerca de 31 caracteres por
linha, dentro da faixa de 28 a 42 da §3.4 — e era essa conta, não os 480px, que a v1 estava
protegendo.

A alternativa era uma quarta proporção só para este caso, e proporção existente para um
usuário só é a mesma armadilha que o vocabulário de chaves da §6 evita.

**O bloco de texto se centraliza verticalmente**, que é o `align: "center"` da coluna. Ao
lado de uma imagem de altura quase cheia, texto ancorado ao topo deixa um buraco entre a
última linha e o rodapé que a imagem não deixa, e a assimetria salta.

**A imagem para em y 1174**, como toda imagem sangrada — §11.0.

---

### 11.10 `image-caption`

**Função** imagem dominante · **Fundo** `plain` · **Âncora** topo

```ts
{
  layout: {
    showGrid: false, showHeader: false, showFooter: true, showRule: false,
    showLogo: true, showLogoPlate: true, showHandle: true, showChevron: false,
    anchor: "top", kicker: "",
  },
  elements: [
    { t: "image", image: "", fit: "cover", bleed: "edge" },
    { t: "heading", heading: "" },
    { t: "caption", caption: "" },
  ],
}
```

A imagem manda. Sangra pelo topo, pela esquerda e pela direita, e o que sobra embaixo é
título, legenda e rodapé sobre o fundo do slide.

**As oito geometrias que a v1 tabelava aqui também deixaram de existir**, e pelo mesmo motivo
da §11.7 — mais um: a imagem é o elemento elástico da pilha, então ela toma exatamente o que
título e legenda deixarem. Com os dois vazios ela desce até 1174, o teto da §11.0, e o slide
vira só a imagem com o rodapé por cima do fundo. Com os dois preenchidos ela para por volta
de 910, que é o número que a v1 escrevia à mão.

**A legenda é `ink-400`**, o papel de texto de apoio da §2.3, e a única região de texto da
biblioteca que não é `ink-100` ou `ink-200`. Ela não disputa com a imagem; explica. É o que
separa o elemento `caption` do elemento `text`, e é por isso que os dois existem.

**A imagem nunca cobre o rodapé**, nem com os dois campos vazios, nem com `contain`. O motivo
é a constelação: um progresso ilegível sobre foto é pior que imagem menor.

---

## Os doze elementos

Cada seção abaixo é um `ElementDef` do registry da §8 do documento de contexto: papel,
degrau da escala, campos, cardinalidade e comportamento. O que não está aqui é escolha de
quem edita — e o que não está em lugar nenhum não existe, que é o ponto da regra "elemento
não carrega estilo" da §11.0.

**Todo campo de texto aceita marcação inline**, com uma exceção: os três do `code`. A v1
marcava campo a campo com uma flag `md`, e a divisão nunca teve regra — o título da capa
aceitava e o título do `context` não, pela mesma chave e com o mesmo papel. A flag continua
no descritor, porque o `code` precisa dela desligada; o que some é a divisão arbitrária entre
títulos. O conselho da §11.1 continua: em Oxanium 700, `**forte**` não tem efeito visível e
`==marca==` fica pesado demais a 96px.

---

### 11.11 `statement`

**Papel** a declaração · **Degrau** `slide-display` 96px Oxanium 700 · **Cor** `ink-100` ·
**Um por slide** · **Fora de coluna**

| Chave     | Tipo       | Conselho | Descrição              |
| --------- | ---------- | -------- | ---------------------- |
| `heading` | `textarea` | 70       | Declaração ou pergunta |

O elemento mais forte da biblioteca, e o único que sozinho já faz um slide. Em 96px sobre
920px cabem cerca de 19 caracteres por linha, então 70 dá aproximadamente quatro linhas.

**Alinha à esquerda, e centraliza quando a âncora do slide é `centro`.** É a exceção
nominal da §3.4 do design system, que deixou de pertencer a um template e passou a pertencer
a este elemento. Não é escolha de quem edita: é consequência da âncora, e é o que faz a capa
e o respiro serem o mesmo elemento com gestos opostos.

Fora de coluna porque 96px numa coluna de 428px dá quatro caracteres por linha.

---

### 11.12 `heading`

**Papel** título do slide · **Degrau** `slide-heading` 56px Oxanium 600 · **Cor** `ink-100` ·
**Um por slide** · **Dentro de coluna: sim**

| Chave     | Tipo       | Conselho | Descrição       |
| --------- | ---------- | -------- | --------------- |
| `heading` | `textarea` | 60       | Título do slide |

O título é **sempre** `heading`, em qualquer composição — a §6 do documento de contexto, que
continua valendo dentro do elemento. Duas linhas é o alvo, e o conselho de 60 é o que cabe
nelas.

**Um por slide, mas em qualquer posição**, inclusive dentro de uma coluna: é assim que o
`split-vertical` põe o título junto do texto, na coluna estreita, sem que ele atravesse os
920px. Dentro de uma coluna ele **não desce de tamanho**, ao contrário do `text` — reduzi-lo
faria o slide perder a hierarquia que todos os outros têm, e a §11.9 da v1 já dizia isso.

---

### 11.13 `lead`

**Papel** complemento do título · **Degrau** `slide-lead` 44px Sora 400 · **Cor** `ink-400` ·
**Um por slide** · **Fora de coluna**

| Chave  | Tipo       | Conselho | Descrição             |
| ------ | ---------- | -------- | --------------------- |
| `lead` | `textarea` | 90       | Complemento, opcional |

Um degrau abaixo do título na hierarquia, e um acima do corpo. Existe para o fecho — é o que
o `final-cta` põe entre o título e o CTA — e para qualquer composição que precise de uma
frase de apoio que não seja parágrafo.

Fora de coluna: 44px em 428px dá 19 caracteres por linha.

---

### 11.14 `text`

**Papel** parágrafos e listas · **Degrau** `slide-body` 40px Sora 400, ou `slide-caption`
32px dentro de coluna · **Cor** `ink-200` · **Sem limite de quantidade** ·
**Dentro de coluna: sim**

| Chave  | Tipo       | Conselho | Descrição                   |
| ------ | ---------- | -------- | --------------------------- |
| `body` | `textarea` | 320      | Parágrafos e itens de lista |

O elemento que a virada existe para criar. O valor é **uma string**, editada num textarea —
o autor quer digitar, não preencher formulário nem montar blocos com o mouse —, e a camada de
blocos da §7 do documento de contexto a transforma em parágrafos e listas:

| Escrita | Vira |
| --- | --- |
| Linha em branco | Fim de um parágrafo e começo de outro |
| Linha começando com `- ` | Item de lista não ordenada |
| Linha começando com `1. ` | Item de lista ordenada |

Sem títulos e sem cercas de código nessa camada: título é a §11.12 e código é a §11.18.

**Um `text` aceita parágrafo seguido de bullets**, que é como texto real se organiza — e é
isso que dissolveu a diferença entre o `context` e o `text-bullets` da v1.

Geometria, toda ela herdada dos templates que este elemento substitui:

| Medida | Valor | De onde vem |
| --- | --- | --- |
| Medida de linha, parágrafo | máximo **760px** | §11.4 da v1: em 40px, 920px dão 46 caracteres por linha e 760px dão 38, dentro da faixa de 28–42 da §3.4 |
| Medida de linha, item de lista | os 920px | §11.2 da v1: num item de duas linhas a conta não chega a doer |
| Marcador de item | travessão `—` em mono `azure-400`, gap 32px | Bolinha lê como apresentação corporativa; travessão puxa para o registro de terminal |
| Item ordenado | o número em mono `azure-400`, mesmo gap | Simétrico ao travessão |
| Gap entre itens | 48px | §4.2 |
| Gap entre parágrafos | 48px | O mesmo ritmo; parágrafo e item são a mesma unidade de leitura |

**O conselho de 320 caracteres é o do nível do slide**, tirado da região que o `context`
tinha. Dentro de uma coluna o guard reprova bem antes dele, e é assim que deve ser: limite é
estático, e é conselho — a mesma relação que o `maxLines` do `code` sempre teve com o
cabeçalho ligado.

**Um nível de ênfase por bloco**, §3.4. Negrito, código inline e marca-texto no mesmo slide
competem entre si e anulam a hierarquia.

---

### 11.15 `caption`

**Papel** texto de apoio · **Degrau** `slide-caption` 32px Sora 400 · **Cor** `ink-400` ·
**Sem limite de quantidade** · **Dentro de coluna: sim**

| Chave     | Tipo       | Conselho | Descrição                |
| --------- | ---------- | -------- | ------------------------ |
| `caption` | `textarea` | 90       | Legenda, até duas linhas |

Texto que **explica outro elemento** em vez de falar por si. O `ink-400` é o que o separa do
`text`: ele não disputa com a imagem ao lado, e é a única cor de texto da biblioteca que não é
`ink-100` nem `ink-200`.

Dentro de uma coluna o tamanho não muda — ele já é o degrau que o `text` desce ao entrar numa.
O que muda é a medida de linha, que passa a ser a da coluna.

---

### 11.16 `label`

**Papel** etiqueta de bloco ou de coluna · **Degrau** `slide-meta` 28px JetBrains Mono,
tracking 0.12em, caixa alta · **Cor** `ink-400` · **Sem limite de quantidade** ·
**Dentro de coluna: sim**

| Chave   | Tipo   | Conselho | Descrição                    |
| ------- | ------ | -------- | ---------------------------- |
| `label` | `text` | 20       | Etiqueta curta, uma linha só |

O rótulo que a v1 tinha preso ao `compare-2col` como `beforeLabel` e `afterLabel`. Solto, ele
serve a qualquer coluna e a qualquer bloco.

A caixa alta é da escala, não do conteúdo — §3.3: guarda-se `sem cache` e desenha-se
`SEM CACHE`. Os 20 caracteres são conselho para manter a etiqueta numa linha só.

**O par natural dele é o `divider`**, com 24px entre os dois, que é o que o `compare-2col`
desenhava como uma peça só. Separados, um rótulo sem régua passa a ser possível.

---

### 11.17 `quote`

**Papel** citação · **Degrau** `slide-body` 40px, ou 32px dentro de coluna · **Cor**
`ink-200`, atribuição em `ink-400` · **Sem limite de quantidade** · **Dentro de coluna: sim**

| Chave  | Tipo       | Conselho | Descrição            |
| ------ | ---------- | -------- | -------------------- |
| `body` | `textarea` | 200      | O texto citado       |
| `cite` | `text`     | 40       | Atribuição, opcional |

Régua de 4px `ink-700` à esquerda, padding de 40px depois dela, raio 0. A atribuição sai em
`slide-caption` `ink-400`, 24px abaixo, prefixada por `— `.

**Não é o callout da §10.5**, apesar de compartilhar a régua à esquerda. O callout tem fundo
tingido no tom 950 e quatro variantes de cor; a citação não tem fundo e não tem variante,
porque um retângulo tingido de 920px por várias linhas é uma mancha de cor que compete com a
imagem e com a janela de código, e porque escolher a cor de uma citação seria exatamente o
"como ele se parece" que a §11.0 tira das mãos de quem edita. O callout continua descrito no
design system para o chrome do editor.

Atribuição vazia some junto com o gap, como todo elemento vazio.

---

### 11.18 `code`

**Papel** a janela de código · **Degrau** `slide-code` 34px JetBrains Mono ·
**Sem limite de quantidade** · **Fora de coluna**

| Chave  | Tipo     | Conselho  | Marcação | Descrição                 |
| ------ | -------- | --------- | -------- | ------------------------- |
| `file` | `text`   | 40        | não      | Nome do arquivo, na barra |
| `lang` | `select` | —         | não      | Linguagem, para o realce  |
| `code` | `code`   | 14 linhas | não      | O código                  |

A janela da §10.3 do design system: superfície `slide-raised`, raio 12px, sem borda; três
pontos de 10px com gap 16px na barra; padding interno de 32px, o `--slide-pad-code` da §4.2.
O nome do arquivo sai em `slide-meta` **caixa baixa** `ink-400` — a única peça `slide-meta`
que é um identificador e não uma etiqueta, decisão 53.

Valores de `lang`, que são as gramáticas do bundle do shiki:
`ts` · `tsx` · `js` · `json` · `bash` · `sql` · `css` · `python` · `text`.
`text` existe para colar log, stack trace ou saída de terminal sem realce nenhum, que é
metade do que um carrossel de backend mostra.

**A janela tem a altura do código, não a da região.** Ela cresce com as linhas; quatro linhas
não desenham um painel vazio. É a armadilha da §13 do documento de contexto — o que se mede
não pode ser dimensionado pelo que contém —, e é o container da pilha que tem altura fixa.

**A 34px mono, a janela comporta 41 caracteres por linha.** Linha mais longa vaza pela
direita, por cima do padding, e é o defeito mais silencioso da biblioteca: `maxLines` conta
linhas e o guard mede altura, então **nada reprova uma linha larga**. O número é medido, não
estimado — 920px menos 32px de cada lado dão 856px, e o avanço da JetBrains Mono a 34px é de
20,4px: 856 ÷ 20,4 = 41,9.

Fora de coluna: numa coluna de 428px, os mesmos 34px dão 21 caracteres por linha, e código
nessa medida não é legível. Foi o argumento que impediu o `code-annotated` de pôr a explicação
ao lado, e ele não mudou.

**O realce de linha e o diff da §10.3 continuam sem controle.** A seção diz como eles
aparecem quando aparecerem; expor um campo de faixa de linhas é assunto de outra etapa.

---

### 11.19 `image`

**Papel** imagem · **Sem limite de quantidade** · **Dentro de coluna: sim**

| Chave   | Tipo     | Padrão  | Descrição                        |
| ------- | -------- | ------- | -------------------------------- |
| `image` | `image`  | vazio   | O `ImageId`; upload local apenas |
| `fit`   | `select` | `cover` | `cover` recorta; `contain` cabe inteira, com o que sobra em `slide-surface` |
| `bleed` | `select` | `none`  | `none`, `top`, `edge`            |

**A imagem é o elemento elástico da pilha** — §11.0. Ela toma o que os outros elementos
deixarem, com piso de 200px, e é isso que substitui as oito geometrias que o `image-caption`
da v1 tabelava à mão.

O sangramento é geometria fechada, e o **container decide quais bordas**:

| `bleed` | No nível do slide | Dentro de uma coluna |
| --- | --- | --- |
| `none` | Contida nos 920px, raio 12px | Contida na coluna, raio 12px |
| `top` | Sangra pelo topo, laterais no padding | Sangra pelo topo |
| `edge` | Sangra pelo topo e pelas duas laterais | Sangra pelo topo e pela borda externa da coluna |

Um valor só — `edge` — em vez de uma lista de bordas, porque a borda que faz sentido sangrar
é sempre a que o container encosta. Escolher lado a lado seria devolver a folha de estilo.

**Nenhuma imagem entra na faixa do rodapé**, e o corte é y 1174 — §11.0. Vale com `cover`,
com `contain` e com a pilha vazia.

**Sem imagem** — o editor desenha `slide-surface` com o rótulo "Sem imagem" centralizado em
`slide-meta` `ink-500`. É o estado em que o elemento nasce, e também o de um deck cujo
`ImageId` não está mais no IndexedDB: o slide fica, a imagem some, e o id órfão continua no
campo. No arquivo exportado esse estado não desenha nada.

`cover` é o padrão porque recortar uma foto costuma ser melhor que emoldurá-la em duas tarjas;
`contain` existe para quando o que importa é a imagem inteira, como um diagrama.

---

### 11.20 `cta`

**Papel** destino ou ação · **Degrau** `slide-code` 34px JetBrains Mono · **Cor**
`azure-400` · **Um por slide** · **Fora de coluna**

| Chave   | Tipo     | Padrão | Descrição            |
| ------- | -------- | ------ | -------------------- |
| `cta`   | `text`   | vazio  | Destino ou ação      |
| `arrow` | `toggle` | ligado | Prefixo `→` no texto |

Superfície `slide-surface`, `border-left: 4px solid azure-400`, raio **0**, padding 32px 40px,
na largura útil inteira. É a forma do callout da §10.5, e não um botão: num PDF nada é
clicável, e desenhar algo com aparência de botão promete uma interação que não existe.

O texto usa `slide-code` a 34px, e não os 36px que a v1 chegou a escrever — a escala da §3.3
não tem esse degrau, e a decisão 39 escolheu o token em vez de inventar o nono.

Um por slide, e fora de coluna pelo mesmo motivo do `code`: 34px mono numa coluna de 428px
não cabem.

---

### 11.21 `divider`

**Papel** régua · **Sem campo** · **Sem limite de quantidade** · **Dentro de coluna: sim**

Uma linha de 1px `ink-600` na largura do container, desenhada com a utility `slide-hairline`
e a compensação de `--slide-scale` da decisão 38 — sem ela a linha some no preview reduzido.

Separa dois blocos quando o gap de 64px não basta para dizer que eles são coisas diferentes.
O uso que a biblioteca já tinha é logo abaixo de um `label`, com 24px entre os dois, que é o
que o `compare-2col` desenhava como peça única.

**Não confundir com a régua do rodapé**, que é `showRule` e mora no layout, a y 1174. Esta
anda com a pilha.

---

### 11.22 `columns`

**Papel** duas colunas · **Sem limite de quantidade** · **Fora de coluna**

| Chave     | Tipo     | Padrão    | Valores                     |
| --------- | -------- | --------- | --------------------------- |
| `ratio`   | `select` | `50/50`   | `50/50`, `60/40`, `40/60`   |
| `align`   | `select` | `top`     | `top`, `center`             |
| `columns` | —        | `[[],[]]` | As duas listas de elementos |

É um elemento como os outros, não um tipo de layout à parte: pode aparecer no meio da pilha,
com um parágrafo antes e uma imagem depois.

**Duas colunas, nunca N.** Com 920px úteis, três colunas dão 280px cada, o que a 40px de corpo
são cerca de sete caracteres por linha. O tipo é uma **tupla de dois**, não uma lista, para que
a impossibilidade viva no compilador e não numa validação.

**Um nível de profundidade**, e também isso vive no compilador: as duas listas são de
`Exclude<Element, { t: "columns" }>`. O seletor de adicionar, aberto dentro de uma coluna, não
oferece `columns` — mesmo mecanismo da cardinalidade.

Larguras, com os 920px úteis:

| `ratio` | Gap 64 (padrão) | Gap 80 (uma coluna sangrando) |
| --- | --- | --- |
| `50/50` | 428 + 64 + 428 | 420 + 80 + 420 |
| `60/40` | 514 + 64 + 342 | 504 + 80 + 336 |
| `40/60` | 342 + 64 + 514 | 336 + 80 + 504 |

Os 64px são o gap entre blocos da §4.2, que é o degrau sancionado para separar duas coisas de
igual peso. **Sobe para 80px — o `--slide-pad` — quando uma das colunas tem imagem sangrada**,
para que a coluna de texto tenha margem igual dos dois lados; é a geometria que o
`split-vertical` já usava.

**Alinhamento com dois valores.** `top` põe as duas colunas no topo, que é o que faz dois
rótulos ficarem na mesma linha e a comparação ser lida como par; `center` centraliza cada
coluna na altura do bloco, que é o que texto ao lado de imagem quase sempre quer.

**Coluna vazia não desenha nada no arquivo exportado**, mas continua endereçável no editor,
com seletor próprio de adicionar.

**Remover um `columns` apaga o conteúdo dos dois lados de uma vez.** Isso precisa ser avisado
ou perfeitamente desfazível — deletar dois textos com um clique sem aviso é hostil. Enquanto o
undo do `zundo` não chegar, o aviso é obrigatório.

**Cada coluna é um container do guard**, e a altura do `columns` é o máximo das duas — §11.0.

---

### 11.23 Convivência

#### Cardinalidade

O teto por slide, e onde cada elemento pode ser adicionado. O seletor **esconde** a opção
quando o teto foi atingido: bloqueio antes do erro, nunca validação depois.

| Elemento    | Por slide | Dentro de coluna |
| ----------- | --------- | ---------------- |
| `statement` | 1         | não              |
| `heading`   | 1         | **sim**          |
| `lead`      | 1         | não              |
| `text`      | sem teto  | **sim**          |
| `caption`   | sem teto  | **sim**          |
| `label`     | sem teto  | **sim**          |
| `quote`     | sem teto  | **sim**          |
| `code`      | sem teto  | não              |
| `image`     | sem teto  | **sim**          |
| `cta`       | 1         | não              |
| `divider`   | sem teto  | **sim**          |
| `columns`   | sem teto  | não              |

Os quatro que ficam de fora de uma coluna são os que não cabem em 428px: `statement` a 96px
dá quatro caracteres por linha, `lead` a 44px dá 19, `code` e `cta` a 34px mono dão 21. O
`columns` fica de fora pelo nível de profundidade.

**A cardinalidade é por slide, não por container**: um `heading` dentro de uma coluna consome
o único do slide.

#### Slide novo herda o slide anterior

Slide vazio é ótimo como opção e ruim como padrão. Trocamos rigidez por liberdade, e o custo
da liberdade é decisão: se todo slide começa vazio, o autor paga uma escolha de composição a
cada vez, e isso cansa mais rápido que preencher formulário.

**Slide novo nasce com a composição do slide anterior e o conteúdo limpo** — mesmos tipos,
mesma ordem, mesmo layout, texto vazio. Um carrossel costuma ter três ou quatro slides de
miolo com a mesma forma, então o padrão acerta na maioria das vezes, e limpar fica a um
clique. Decisão 70.

#### Preset e snapshot

Duas coisas que parecem uma, e uma caixa de seleção no momento de salvar resolve as duas sem
inventar dois conceitos na interface:

| | Guarda | Serve para |
| --- | --- | --- |
| **Preset** | Tipos de elemento, ordem e layout, com o conteúdo vazio | Substituir os dez templates da v1 |
| **Snapshot** | Tudo, inclusive o texto | O slide de CTA final, que é sempre o mesmo |

**Presets são transversais aos decks** — não pertencem a um deck específico, e por isso não
moram dentro do `Deck` da §6. Ficam em chave própria do `localStorage`.

Os **dez de seed são fixos**: não se editam, não se renomeiam e não se apagam, porque são o
vínculo entre esta §11 e o código — editáveis, divergiriam do documento no primeiro ajuste e a
Regra 2 do `CLAUDE.md` ficaria sem chão. Preset salvo pelo autor é renomeável, substituível
por cima e apagável.
