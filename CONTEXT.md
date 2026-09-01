# Asterism

Editor de carrosséis para LinkedIn que roda no navegador e exporta PDF 1080×1350. Este
arquivo é o **glossário**: o que cada palavra significa, e qual palavra usar quando existem
duas. O que o sistema **faz** — as tabelas normativas, as medidas, os degraus — mora em
`docs/model.md`, `docs/pipeline.md`, `docs/architecture.md` e `docs/product.md`; as
decisões, em `docs/adr/`.

## Language

### O documento

**Deck**:
O documento inteiro — título, formato, metadados do autor e a lista ordenada de slides. É
a unidade que se salva e a que se exporta.
_Avoid_: projeto, arquivo, post

**Slide**:
Uma página do carrossel: um `Layout` mais uma lista ordenada de `Element`. Não é um
formato fixo com campos — foi até a Etapa 3½, e a [ADR-0061](./docs/adr/0061-slide-is-layout-plus-elements.md) diz por que deixou de ser.
_Avoid_: página, card, tela

**Layout**:
O cromo do slide mais a âncora vertical da pilha: o que existe **em volta** do conteúdo e
onde o conteúdo pousa. Não descreve o conteúdo.
_Avoid_: template, tema, estilo

**Chrome**:
As duas faixas que não são conteúdo — o cabeçalho e o rodapé —, ligáveis por slide. O
`Kicker` é a única peça de texto que mora nele.
_Avoid_: moldura, decoração

**Kicker**:
A etiqueta digitada no alto do cabeçalho (`api/ · 04`). É conteúdo, mas pertence ao
`Layout`, e [ADR-0066](./docs/adr/0066-kicker-stays-layout-chrome.md) explica a exceção.
_Avoid_: eyebrow, tag, categoria

**Anchor**:
Onde a pilha pousa na região de conteúdo — `top`, `center` ou `bottom`. É o único controle
de posição vertical que o autor tem, e existe para não haver elemento de espaçamento.
_Avoid_: alinhamento, posição

**Format**:
As dimensões do slide como **dado** (`{ w, h }`), não como constante no código. A v1 trava
em 4:5 e não expõe controle.
_Avoid_: tamanho, resolução

**Pillar**:
A trilha editorial do deck — `api`, `forge` ou `log`. Vem do sistema da marca e alimenta o
cromo.
_Avoid_: categoria, tema

**Handle**:
O `@usuario` que aparece no rodapé. É metadado do deck, não do slide.

### A pilha

**Stack**:
A região de conteúdo do slide, entre as duas faixas de cromo: uma pilha vertical em que
cada elemento ocupa a altura do que contém. Não há faixa fixa por slide.
_Avoid_: corpo, área, grid

**Element**:
A unidade de conteúdo da pilha, de um dos doze tipos (`statement`, `text`, `image`,
`code`, `columns`…). Carrega conteúdo e nunca estilo.
_Avoid_: bloco, componente, widget

**Leaf**:
Um `Element` que não pode conter outro — todos, menos `columns`. A distinção é de tipo, e é
o que impede coluna dentro de coluna em tempo de compilação.

**Columns**:
O único elemento container: uma tupla de **duas** colunas, com um nível de profundidade,
proporção e alinhamento fechados.
_Avoid_: grid, linha, split

**Overflow guard**:
A medida que compara a altura do que foi desenhado com a altura do container e **reprova**
o slide que passa, nomeando o elemento culpado. Avisa; não impede a digitação.
_Avoid_: validação, limite, contador

### O texto

**Inline markup**:
O subset fechado da sintaxe do Obsidian que vale **dentro** de uma linha — `**forte**`,
`*ênfase*`, `==marca==`, `[[destaque]]`. Marcadores não aninham.
_Avoid_: markdown, rich text

**Marker**:
Um par de delimitadores da marcação inline. O que não fecha é texto literal, nunca erro.
_Avoid_: tag, token

**Block**:
A unidade acima da linha dentro de um mesmo campo de texto: um parágrafo, uma lista não
ordenada ou uma ordenada. Um `Element` do tipo `text` contém vários blocos; um bloco não é
um elemento.
_Avoid_: elemento, seção, parágrafo (parágrafo é **um** tipo de bloco)

**Typographic break**:
Um enter no meio da frase, para ela ficar bonita. **Não existe** no produto: congela o
layout e some com a razão de os presets existirem.

**Content break**:
Uma linha em branco ou uma linha de `- `. É estrutura do pensamento, vale, e é o que a
camada de blocos materializa. A confusão entre esta e a de cima custou o primeiro uso real
da ferramenta — [ADR-0060](./docs/adr/0060-block-layer-above-inline-parser.md).

### Composição

**Preset**:
Uma composição nomeada guardada como **dado**: um `Layout` e uma lista de elementos com o
conteúdo vazio. É o esqueleto, não o texto.
_Avoid_: template, modelo, layout

**Snapshot**:
Um preset salvo **com** o texto junto. A diferença entre os dois é uma caixa de seleção no
momento de salvar, não dois conceitos na interface.
_Avoid_: cópia, rascunho

**Seed preset**:
Um dos dez presets que vêm com o produto e reproduzem as dez composições da v1. São fixos:
o autor não os renomeia nem os apaga.
_Avoid_: preset padrão, template de fábrica

**Template**:
O modelo fixo de slide da v1 — `template + campos fixos`. **Termo morto**: o que existe
hoje é `Layout` mais elementos, e a composição reutilizável chama-se `Preset`.

### Render e exportação

**Slide canvas**:
A raiz do slide desenhada em pixels reais, `1080×1350`. Dentro dela nenhuma cor é `oklch()`
e nenhuma fonte vem de CDN, porque é o que atravessa a rasterização.
_Avoid_: preview, tela

**Slide frame**:
O quadro **externo** que envolve o canvas no editor: é ele que carrega a borda, a marca de
transbordo e a escala. Não vai para o arquivo exportado.
_Avoid_: moldura, borda, frame (o `Frame` é outra coisa)

**Slide scale**:
O fator `k` pelo qual o canvas é reduzido para caber na tela. Declarado num lugar só, o
`Slide frame`, e lido por quem precisa compensar espessura de linha.

**Stage**:
O palco oculto onde o slide é montado a 1:1 para ser capturado. Existe porque o preview
carrega a escala dentro, e escala nenhuma pode chegar ao arquivo.
_Avoid_: preview, sandbox

**Frame**:
O resultado de uma captura: o bitmap de um slide mais suas dimensões. É o que o alvo de
exportação recebe.
_Avoid_: imagem, screenshot, quadro

**Target**:
Um alvo de exportação — o `pdf` de hoje, um `png` amanhã. Recebe `Frame`s e devolve
arquivos; não conhece nenhum elemento.
_Avoid_: exportador, formato, plugin

**Rasterize**:
Transformar o DOM do slide em bitmap. É o estágio único e compartilhado por todos os
alvos, e a razão de o PDF ser imagem e não vetor.
_Avoid_: renderizar, capturar, printar

### Assets

**ImageId**:
A referência a um binário guardado fora do deck. O deck carrega o id; o `IndexedDB` carrega
os bytes, e a ponte entre os dois é um cache de módulo.
_Avoid_: caminho, URL, src

**Asset**:
O binário em si. Só entra por upload local — URL externa contamina o canvas e quebra a
exportação em silêncio.

### Sistema visual

**Observatório**:
O sistema visual do projeto: tema escuro único, sem variante clara. É quem decide qualquer
questão de aparência, e o `theme.css` é artefato derivado dele.
_Avoid_: tema, design system genérico

**Constellation**:
O indicador de posição no rodapé — um ponto por slide, com o atual aceso. Não é paginação
numérica.
_Avoid_: paginação, dots, stepper
