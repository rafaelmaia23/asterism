# asterism — produto

> **Versão** 1.0 · **Status** planejamento · **Autor** Rafael
> Um asterismo é um padrão reconhecível formado ao agrupar estrelas que já existem
> no céu. Você não cria as estrelas — escolhe algumas e as compõe numa forma.
> É a descrição exata do que esta ferramenta faz com uma biblioteca de layouts.

Decide **por que o projeto existe, o que ele não é, como se usa e para onde vai**.

O vocabulário — o que cada termo significa — está no [`CONTEXT.md`](../CONTEXT.md) da raiz.
Aqui fica a norma: o que o sistema faz com eles.

---

## 1. O problema

Publicar carrosséis no LinkedIn com identidade visual consistente exige, hoje,
uma de duas rotas ruins:

- **Canva/Figma** — WYSIWYG confortável, mas o conteúdo fica preso numa ferramenta
  proprietária, as fontes do Observatório exigem plano pago (Canva), o código nos
  slides vira captura de tela, e nada é versionável.
- **Escrever cada deck do zero em HTML** — precisão total, mas cada post custa horas
  e a consistência depende de disciplina manual.

O `asterism` ocupa o meio: os layouts são código (precisos, versionados, com o design
system real), mas o preenchimento é uma interface de edição.

## 2. O que o projeto é

Um **editor de decks com biblioteca de layouts tipada**, que roda inteiramente no
navegador e exporta o resultado em formatos publicáveis.

A distinção importa para a arquitetura: o coração do projeto é o **modelo de dados**,
não a exportação. Um deck é um documento JSON; o editor manipula esse JSON; o renderer
o transforma em DOM; o exportador transforma DOM em arquivo. Cada estágio é substituível
sem tocar nos outros.

### Duas razões de existir

1. **Uso real.** É a ferramenta com que os carrosséis do LinkedIn serão feitos,
   a partir do sistema visual *Observatório* já definido.
2. **Portfólio.** É um projeto de front-end que complementa o `pet-oasis` (back-end).
   Demonstra arquitetura extensível, tipagem forte, design system aplicado e um
   parser próprio — e tem uma história de origem concreta em vez de ser um CRUD de exemplo.

## 3. Objetivos

- Compor um carrossel escolhendo layouts de uma biblioteca e preenchendo campos.
- Preview fiel — o que aparece na tela é exatamente o que sai no arquivo.
- Exportar PDF 1080×1350 pronto para publicar, sem retoque externo.
- Adicionar um novo layout deve custar **uma pasta e uma linha de registro**.
- Adicionar um novo formato de saída deve custar **um módulo**, sem tocar em nada existente.
- O deck deve ser um arquivo portátil e autocontido.

## 4. Não-objetivos

Explicitamente fora de escopo, hoje e no médio prazo:

| Fora | Motivo |
|---|---|
| Back-end, banco, autenticação | Aplicação de usuário único, tudo local |
| Colaboração ou multiplayer | Idem |
| WYSIWYG livre (arrastar elementos, redimensionar) | Destruiria a consistência que o sistema visual garante |
| Editor de tema / troca de paleta | Existe um sistema visual; a ferramenta o aplica, não o edita |
| Tema claro | O Observatório é escuro por decisão |
| Geração de texto por IA | O texto é a parte que precisa ser autoral |
| Agendamento ou publicação automática | Fora do domínio |
| Títulos e cercas de código na marcação | Título é elemento próprio, código é elemento próprio — ver a §7 |

Quando surgir a tentação de adicionar qualquer um destes, esta tabela é a resposta.

**A linha da marcação encolheu na Etapa 3½.** Ela dizia "estrutura de bloco na marcação
(títulos, listas)", e proibia demais: parágrafo e lista são estrutura do **pensamento** e
passaram a existir, enquanto título e cerca de código continuam fora porque cada um deles
já é um elemento. Decisão 60.

## 5. Interface

Três colunas, sem invenção:

- **Esquerda** — lista de slides com miniatura, índice, nome da composição, marca de
  transbordo, reordenação por arraste, duplicar e remover.
- **Centro** — canvas com o slide ativo em escala, seletor de zoom, indicador de validade.
- **Direita** — inspector: o layout do slide no topo e, abaixo, um cartão por elemento da
  pilha, com os campos que cada descritor declara e contadores de caractere.
- **Topo** — nome do deck, ações de deck (novo, importar, exportar JSON) e o botão de
  exportação com escolha de alvo.

As quatro áreas nascem juntas, na 1C, e se preenchem por etapa. Criar o quadrilátero de
uma vez custa nada e faz o editor ter, desde o primeiro dia, as proporções que vai ter no
fim.

Estado no fim da Etapa 3: o centro funciona; o topo tem o nome do deck e a exportação —
um botão por alvo do registry, hoje um só, com spinner enquanto a captura acontece, e o
menu com escolha de alvo entra quando houver mais de um; a direita tem o seletor de layout
e o formulário derivado dos descritores, em seções que se ligam e se encolhem, com
contadores; a esquerda lista os slides com miniatura, número e nome, troca o ativo, rola até
ele, marca os que transbordam e tem, no pé, a barra que acrescenta e remove — sem arraste
nem duplicar.

A coluna da direita é a que a Etapa 3½ reescreve, e a subseção abaixo diz para quê.

Acrescentar e remover ficam numa barra fixa no pé da coluna, agindo sobre o slide ativo, e
não como um controle por miniatura: o item da lista é um `<button>` inteiro, e botão dentro
de botão é HTML inválido; e a §6 do design system diz que ícone nunca substitui rótulo em
ação destrutiva, o que um X pendurado em cada uma das doze miniaturas seria.

**A lista rola até o slide ativo.** Quem rola é o `<ol>`, e não a coluna — a coluna é quem
segura a barra do pé. Acrescentar já tornava o slide novo o ativo, mas num deck de doze ele
nascia abaixo da dobra: a única pista de que algo tinha acontecido ficava no canvas, e a
coluna que existe para mostrar onde se está mostrava outro lugar. A rolagem é `nearest` e
instantânea — não mexe em nada quando o item já está visível, e a §7 do design system não
anima posição por mais de 8px.

### O inspector é uma lista de cartões

O formulário era duas seções fixas — Conteúdo escrevendo em `fields`, Apresentação em
`options` —, e na 2F passou a ler `sections` do descritor. As duas formas descreviam um
slide com um conjunto fixo de campos, e o slide deixou de ter isso.

O modelo agora é o **inspector de componentes da Unity**: cada elemento da pilha é um cartão
com cabeçalho — nome do tipo, setas de ordem, remover — e os campos dentro.

```
Layout            grade, cabeçalho, rodapé, âncora; o preset e "salvar como"
─────────────────────────────────────────────
▸ Título                              ↑ ↓ ✕
▾ Texto                               ↑ ↓ ✕
    Texto        [ textarea ]  120/320
▾ Duas colunas                        ↑ ↓ ✕
    Proporção    [ 50/50 ▾ ]
    Alinhamento  [ Topo ▾ ]
  │ Esquerda
  │   ▸ Etiqueta                    ↑ ↓ → ✕
  │   ▸ Texto                       ↑ ↓ → ✕
  │   [ + Adicionar ]
  │ Direita
  │   [ + Adicionar ]
─────────────────────────────────────────────
[ + Adicionar ]
```

**Nada de arrastar.** O `@dnd-kit` da Etapa 4 se paga na lista lateral, que é onde o gesto
é natural; numa coluna estreita de cartões colapsáveis, arraste custa mais do que rende.

- **Colapsado quando não está em edição**, expandido quando está: senão um slide de cinco
  elementos não cabe na coluna.
- **Adicionar** é um seletor no fim da lista, e cada coluna tem o seu. É ele que aplica a
  cardinalidade da §11.23 do documento de elementos, **escondendo** a opção que atingiu o
  teto — bloqueio antes do erro, não validação depois.
- **Reordenar** é seta para cima e para baixo no cabeçalho do cartão. Nas pontas a seta
  fica desabilitada, para não haver clique morto.
- **As setas nunca atravessam fronteira de container.** Um elemento que saltasse de dentro
  de uma coluna para fora dela é o tipo de coisa que faz o autor apertar Ctrl+Z. Elemento
  dentro de coluna ganha, em vez disso, uma **seta lateral** que o move entre esquerda e
  direita, apontando para o destino e não para a origem.
- **O aninhamento é horizontal no slide e vertical no inspector.** As duas colunas aparecem
  empilhadas, cada uma com rótulo, sua lista de cartões e seu próprio seletor. Em painel
  estreito, indentar de verdade come a largura que os campos precisam — a contenção é
  marcada por uma barra vertical à esquerda, com recuo pequeno.

O seletor de layout do topo deixou de trocar o template do slide e passou a fazer duas
coisas: aplicar um preset — casando conteúdo por tipo, §8 — e salvar a composição atual como
preset ou snapshot. Os oito interruptores de cromo continuam ali, agora numa faixa só.

## 6. Roadmap

| Fase | Escopo | Estimativa |
|---|---|---|
| **1 — Fatia vertical** | Tipos, registry, parser inline, canvas escalado, inspector, **3 templates** (`cover-statement`, `text-bullets`, `final-cta`), alvo PDF | 6–8 h |
| **2 — Biblioteca** | Os outros 7 templates, shiki com tema próprio, guard de transbordo, imagens no IndexedDB | 4–6 h |
| **2½ — Composição** | Camada de blocos, o modelo de elementos com colunas, guard recursivo, inspector por cartões, os dez presets | 20–26 h |
| **3 — Editor** | dnd-kit, duplicar/remover, undo/redo, múltiplos decks, import/export JSON | 4–5 h |
| **4 — Produto** | Atalhos de teclado, estados vazios, README com GIF, deploy | 3 h |

Total aproximado: **20 horas**, dois fins de semana. A fase 1 já permite publicar um
carrossel real — a ferramenta é útil antes de estar pronta.

**A fase 2½ não estava no roadmap, e o primeiro uso real a impôs.** Ela dobra a estimativa
original, e é o preço de ter especificado a biblioteca por função narrativa antes de compor
um post de verdade: dez templates que aceitam um formato cada, quando o autor escreve o
texto primeiro e depois procura onde ele cabe. O que ela entrega não é template novo, é o
modelo de conteúdo que os dez estavam disfarçando — ver a Etapa 3½ do `TODO.md` e as
decisões 60 a 74 abaixo.

### Critério de conclusão da v1

Um carrossel completo, do zero ao PDF publicado no LinkedIn, sem sair da ferramenta e
sem retoque em nenhum outro programa.

