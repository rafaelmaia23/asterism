# asterism — arquitetura

Decide **as regras que valem para todo o código, o formato do slide como dado e a
stack**. Em conflito com o código, este documento vence.

O vocabulário — o que cada termo significa — está no [`CONTEXT.md`](../CONTEXT.md) da raiz.
Aqui fica a norma: o que o sistema faz com eles.

---

## 1. Princípios de arquitetura

**Conteúdo é dado, apresentação é código.** O deck não guarda HTML, cor, tamanho ou
posição. Guarda texto, referências de imagem e escolhas fechadas de geometria. Toda
decisão visual vive no elemento, e **elemento não carrega estilo**: o autor escolhe *que*
elemento usar, nunca *como* ele se parece.

**Nenhum estágio conhece o seguinte.** O parser não sabe que existe DOM. O elemento
não sabe que existe exportação. O exportador não sabe quais elementos existem.

**Registry em vez de switch.** Elementos e alvos de exportação são descobertos por
registro, nunca por condicional espalhada pelo código. Um `switch` sobre o tipo de um
elemento fora do registry é sinal de erro de arquitetura.

**Fidelidade por identidade, não por aproximação.** O preview e a exportação usam o
mesmo DOM. Divergência entre os dois é impossível por construção, não por cuidado.

---

## 2. Formato como dado

O `Deck` carrega `format: { w, h }` e os templates leem as variáveis CSS `--slide-w` /
`--slide-h` em vez de hardcodar `1080`. A v1 trava em 4:5 e não expõe nenhum controle.

Custa meia hora hoje e evita reescrever dez templates no dia em que 1:1 ou 9:16
fizerem sentido.

## 3. Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), `output: 'export'` |
| Estilo | Tailwind CSS v4, config CSS-first, tokens do Observatório |
| Componentes | shadcn/ui v4 sobre Base UI (`@base-ui/react`), preset `nova` |
| Ícones | lucide-react |
| Estado | zustand + persist + zundo |
| Validação | zod |
| Marcação | parser próprio (~40 linhas) |
| Código nos slides | shiki, tema derivado dos tokens do Observatório |
| Rasterização | modern-screenshot |
| PDF | jsPDF |
| Reordenação | @dnd-kit/sortable |
| Assets | idb-keyval |
| Testes | Vitest, com `@testing-library/react` e `happy-dom` |
| Deploy | Vercel (estático); Nginx Proxy Manager na Forge se crescer |

O tema do shiki precisa sair dos tokens do projeto. Um tema pronto faz o bloco de
código ser a única coisa do carrossel que não parece sua. Ele mora em `src/code/theme.ts`,
e quem impede que ele divirja da fonte é um teste: o `theme.test.ts` lê o `globals.css` e
exige que cada cor da paleta seja a que o token declara.

**O shiki entra pelo caminho síncrono** — `createHighlighterCoreSync` com o motor de regex
em JavaScript e as gramáticas importadas estaticamente, ADR-0051. É o que faz o realce
não ser uma espera: não há um quadro com o código sem cor, o palco da §2 de `docs/pipeline.md` continua
esperando só as fontes, e o guard de transbordo da §1 de `docs/pipeline.md` mede uma vez só. Se alguém for
trocar isto por import dinâmico, é este parágrafo que está sendo revogado, e o preço é a
espera nova no palco.

`supertest` não entra: é cliente HTTP para testar servidor, e não há servidor.

`@vitejs/plugin-react` também não entra, apesar de o guia do Next pedi-lo. Ele traz a
cadeia do Babel 8 e o `shadcn` já fixa o Babel 7 na árvore — o `npm install` falha por
conflito de peer. O que o plugin dá é Fast Refresh e ganchos de Babel, nenhum dos dois
usado numa rodada de teste: o JSX é transformado direto pelo `"jsx": "react-jsx"` do
`tsconfig.json`.

### Armadilhas conhecidas

**OKLCH quebra a serialização.** As bibliotecas de captura passam por
`foreignObject`/canvas e o suporte a `oklch()` é irregular. Os tokens da subárvore
`.slide-canvas` devem ser declarados em **hex sRGB** (conversão já existente no
documento do Observatório). OKLCH permanece no chrome do editor.

**Fontes precisam ser same-origin.** Oxanium, Sora e JetBrains Mono carregadas como
arquivos locais (`next/font/local`). Fonte servida pelo CDN do Google não é inlinada
na captura e o arquivo exportado sai em Arial.

**Gradiente não sobrevive à rasterização.** No Firefox, um `linear-gradient` ladrilhado
por `background-size` dentro do nó capturado sai como **um módulo desenhado e o resto da
página chapado com a primeira parada** — a grade da §4.3 do design system some e o fundo
inteiro troca de cor. `repeating-linear-gradient` falha igual, e `<pattern>` de SVG sai
com metade da espessura, porque o traço na borda do ladrilho é recortado. O que a
exportação precisa ver tem de ser **elemento**: um `<svg>` com linhas de verdade atravessa
intacto, e a constelação e o chevron já provavam isso no mesmo PDF que reprovou o fundo.
Medido na 1E, com quatro implementações comparadas no arquivo. Ver a ADR-0028.

**O reset do Tailwind não atravessa a clonagem.** A captura copia estilo computado para
dentro de um `foreignObject`, e ali dentro vale a folha do **agente de usuário** outra vez.
Onde o `preflight` zerava por folha e não por elemento — `margin` de `<p>`, `<h2>` e
`<ul>`, o `padding-inline-start` da lista —, o clone não leva nada, e o navegador aplica os
defaults dele: `1em` de margem em cada parágrafo, medido no corpo tipográfico do slide, que
a 72px são **72px de espaço que ninguém pediu**.

O sintoma foi o `final-cta` no PDF, com o bloco de fecho 96px abaixo do lugar, por cima do
rodapé. O defeito nunca foi dele: medindo o bitmap com e sem o reset, **quatro dos cinco
templates** mudavam de desenho — a capa subia o título 96px, o `context` descia o corpo 40,
o `text-bullets` descia o título. Só o `text-impact` passava intacto, porque centralizar
nos dois eixos cancela margem simétrica. O fechamento era o único em que o deslocamento
encontrava outra coisa no caminho.

A correção é uma folha injetada no clone por `onCloneNode`, em `src/export/rasterize.ts`,
com **especificidade de seletor universal**: estilo em linha vence, então o `padding` que um
bloco declara de verdade continua valendo, e some só o que ninguém declarou. Ver a decisão
50.

**A Etapa 3½ agravou essa armadilha em vez de resolvê-la.** Até ela, `<ul>` e `<p>` mal
existiam no canvas: os tópicos do `text-bullets` eram a única lista da biblioteca e os
parágrafos eram um por slide. Com a camada de blocos da §2 de `docs/model.md`, um `text` sozinho pode desenhar
três parágrafos e uma lista, e cada um deles é um nó que o clone deixa sem reset. O reset
injetado pelo `onCloneNode` não é mais uma correção pontual: é o que segura o formato de
todo texto do sistema, e **é a primeira coisa a conferir no PDF** quando o arquivo não bate
com o preview.

E a lição de método, que custou mais que a correção: **pintar um nó para medi-lo altera a
medida**. A primeira sonda dava fundo colorido ao bloco para achá-lo no bitmap, e o atributo
`style` que ela criava mudava o que o clone copiava — o defeito sumia justamente onde se
olhava. O que serve é comparar **dois bitmaps** do mesmo nó intocado.

**Tamanho do arquivo.** PNG 2× sobre fundo escuro chapado comprime bem; dez slides
devem ficar bem abaixo de 3 MB. Se um deck com fotos estourar, o alvo PDF cai para
JPEG 0.92 apenas nos slides com imagem.

**Tailwind faz tree-shaking de token.** Variável declarada em `@theme` que nenhuma classe
referencia não chega ao CSS final, e `var(--color-ink-700)` num estilo inline resolve
para nada — silenciosamente, sem erro de build. Por isso as rampas de cor e o bloco da
superfície carrossel são declarados como `@theme static`. Só o mapeamento semântico do
shadcn, em `@theme inline`, pode ser podado sem prejuízo.

**Elemento medido não pode ser dimensionado pelo que ele contém.** O `ResizeObserver` do
canvas mede a área central para calcular a escala, e a escala desenha o quadro dentro
dela. Se a altura da área depender do conteúdo — basta um `min-height` no lugar de uma
altura no caminho até o `body` —, cada medida realimenta uma escala maior e o slide cresce
sozinho até o teto do auto-fit. Aconteceu na 1C, e o sintoma engana: parece animação, e é
laço.

São duas condições, e vale manter as duas. **O que se mede fica preso a algo de fora** —
o shell tem altura de viewport, não altura mínima. **O que o resultado desenha fica fora
do fluxo** — o quadro mora num palco `absolute` dentro da área, e conteúdo posicionado em
absoluto não contribui para o tamanho do pai. A segunda sozinha já fecha a porta, e é a
que vai valer também para o palco de exportação da §2 de `docs/pipeline.md`, que monta o deck inteiro fora da
tela.

**Id de dado não vira atributo do DOM.** O deck é criado duas vezes — uma na
pré-renderização estática, no Node, e outra no navegador — e os ids saem de
`crypto.randomUUID()`, então os dois lados discordam. Id de slide em `id`, `htmlFor`,
`aria-labelledby` ou `data-*` é divergência de hidratação garantida, e o React não remenda
atributo: ele avisa no console e segue com o valor do cliente. Identificador de formulário
sai de `useId`, que o React gera pela posição na árvore e por isso casa dos dois lados.
Aconteceu na 1D, no inspector. Vale para o palco de exportação da 1E e para a lista de
arraste da Etapa 4, que também vão querer marcar nós — e passou a valer para o `ElementId`
da Etapa 3½, que multiplica por dez os ids em jogo: o cartão do inspector, a chave de
reordenação e o guard que nomeia o elemento que estourou são três lugares novos onde a
tentação de escrever o id no DOM aparece. O guard reporta o id **para o escopo em
JavaScript**, nunca para um atributo.

**Estado que vem do navegador não pode chegar no primeiro render.** É a mesma família da
armadilha acima, e o `persist` do zustand cai nela por padrão: ele lê o storage de forma
**síncrona**, na criação do store, e a página é pré-renderizada estaticamente — o HTML do
build traz o deck semente e o primeiro render do cliente traria o deck salvo. O caminho é
`skipHydration: true` na configuração do middleware e `store.persist.rehydrate()` num
efeito, que só roda no navegador e depois do primeiro quadro. O deck salvo entra no
segundo render, e os dois lados concordam no primeiro. Não chegou a virar defeito na 2D
porque o store já nasceu assim; vale para qualquer estado que venha de `localStorage`,
`IndexedDB` ou `matchMedia` daqui em diante.

