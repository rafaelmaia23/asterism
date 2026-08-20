# asterism — plano de execução

> **Status** bootstrap concluído · Etapa 1 aguardando início
> Estrutura em três níveis: **etapa** → **tarefa atômica** → **critério de pronto**.
> Cada tarefa cabe num commit. Etapas 1 e 2 estão expandidas; as demais têm apenas
> objetivo e entrega, e são quebradas em tarefas quando chegarem.

## Mapeamento com o roadmap

O roadmap da §15 do documento de contexto tem quatro fases. Este plano tem cinco etapas,
porque a Fase 1 é grande demais para uma etapa só e vale a pena separar a prova de que o
caminho funciona da construção da biblioteca:

| Etapa daqui | Fase do §15 |
|---|---|
| 1 — MVP + 2 — Templates | Fase 1 — fatia vertical |
| 3 — Biblioteca | Fase 2 |
| 4 — Editor | Fase 3 |
| 5 — Produto | Fase 4 |

---

## Etapa 0 — Bootstrap ✅

Concluída. Next.js 16 com App Router, Tailwind v4 e shadcn/ui sobre Base UI; tema do
Observatório aplicado e verificado; as três fontes como arquivos locais; git com `main`
e `dev`; `CLAUDE.md`; este arquivo.

---

## Etapa 1 — MVP, prova de conceito

**Objetivo.** Provar o caminho inteiro de ponta a ponta: um deck existir, um template
renderizar, o canvas exibir e sair um PDF. Cru é aceitável; incompleto no meio do
caminho não é.

**Fora desta etapa.** Marcação inline, os outros dois templates, persistência, undo,
guard de transbordo, imagens, shiki, reordenação por arraste, múltiplos decks,
componentes de rodapé.

**Pronto quando** um deck de um slide vira um PDF 1080×1350 que abre no visualizador,
com Oxanium e o grid de fundo visíveis no arquivo — não no preview, no arquivo.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.1 | Instalar e configurar Vitest com `@testing-library/react` e `happy-dom`; script `npm test` | `npm test` roda e um teste-sentinela falha por asserção, não por configuração |
| 1.2 | Tipos do domínio em `src/deck/types.ts` — `Deck`, `Slide`, `SlideId`, `ImageId`, `FieldValue`, `OptionValue`, `DeckMeta` | `npx tsc --noEmit` limpo; `format` é dado do deck, não constante |
| 1.3 | Factories `createDeck` e `createSlide` | Testes escritos antes passam: id único, `version: 1`, `format` 1080×1350, slide criado com os defaults do template |
| 1.4 | Tipos `TemplateDef` e `Field` em `src/templates/types.ts` — o descritor declarativo da §8 | Os sete tipos de `Field` compilam; `TemplateDef` é genérico em `F` e `O` |
| 1.5 | Registry de templates — `register`, `get`, `list` | Testes antes: registrar e recuperar, `list` preserva ordem de registro, `get` de id desconhecido lança |
| 1.6 | `capa-declaracao`: `meta.ts` e `fields.ts` com descritores e schema zod | `defaults` do §11.1 validam contra o próprio schema, verificado em teste |
| 1.7 | `capa-declaracao`: `index.tsx` com as regiões do §11.1, texto literal | Kicker em 80–148, título ancorado à **base** da região 300–1160; título de uma linha e de quatro linhas pousam na mesma altura |
| 1.8 | `SlideFrame` — raiz de tamanho fixo que injeta `--slide-w`/`--slide-h` a partir de `deck.format` | Nenhum template hardcoda 1080 ou 1350; mudar `format` muda o quadro |
| 1.9 | Canvas central com `transform: scale(k)` e `transform-origin: top left` num wrapper de tamanho fixo | O slide cabe na viewport sem media query; nenhuma matemática responsiva dentro do template |
| 1.10 | Store zustand mínimo — deck, slide ativo, `setField` | Digitar no inspector muda o canvas. Sem `persist`, sem `zundo` |
| 1.11 | Inspector: formulário derivado dos descritores, tipos `text` e `textarea`, com contador de caracteres | Campo novo no descritor aparece no formulário sem tocar no inspector |
| 1.12 | Lista lateral de slides — índice, rótulo do template, seleção | Clicar troca o slide ativo. Somente leitura: sem arraste, sem duplicar, sem remover |
| 1.13 | `rasterize(source, escala)` sobre `modern-screenshot`, escala 2 | Devolve um `Frame` de 2160×2700 com as fontes inlinadas — conferir que o bitmap não saiu em Arial |
| 1.14 | Registry de alvos de exportação + alvo `pdf` com jsPDF, uma página por slide | `ExportResult` devolve lista de arquivos mesmo com um só; o alvo não conhece nenhum template |
| 1.15 | Botão de exportação na barra superior | Clicar baixa o PDF; o botão não sabe quais alvos existem, só consulta o registry |
| 1.16 | Remover a página de verificação do tema | `src/app/page.tsx` passa a ser o editor |

---

## Etapa 2 — Templates

**Objetivo.** Os três templates da Fase 1 especificados no design system, com a marcação
inline funcionando. Ao fim desta etapa a ferramenta publica um carrossel real.

**Fora desta etapa.** Os outros sete templates, shiki, guard de transbordo, imagens,
undo/redo, múltiplos decks.

**Pronto quando** um carrossel de 8 a 12 slides é composto com os três templates,
usando marcação, e exportado para publicação no LinkedIn sem retoque externo.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.1 | `parseInline(src): Inline[]` — os sete marcadores da §7, sem aninhamento | TDD pesado, é o alvo de cobertura séria da v1: cada marcador isolado, marcadores adjacentes, marcador não fechado, `**a *b* c**` tratado como literal no marcador externo, string vazia, texto sem marcador. Devolve AST, **nunca** HTML |
| 2.2 | `<Inline>` — AST → spans, com os tokens da §10.2 | Os sete marcadores renderizam com a cor e a forma da tabela; `==marca==` com cantos retos, `` `código` `` com raio 6px |
| 2.3 | `capa-declaracao` passa a renderizar o título via `<Inline>` | `[[destaque]]` sai em `azure-400` dentro do título em 96px |
| 2.4 | Componentes recorrentes da §10.5 — `Kicker`, `Constelacao`, `Chevron`, `Rodape` | Constelação com dois estados apenas, sem estado para o slide atual; chevron só na capa. **Bloqueada pelas decisões 3 e 4** |
| 2.5 | Fundo aplicado a partir de `meta.fundo` — `plain` ou `grid` | `grid` desenha linhas de 0.5px a cada 60px; nenhum template de código ou imagem recebe grid |
| 2.6 | Inspector: tipo de campo `lista`, com `maxItens` e `maxPorItem` | Adicionar, remover e reordenar itens dentro do limite do descritor |
| 2.7 | Inspector: tipos `select` e `toggle`, na seção de opções | Opções ficam visualmente separadas dos campos de conteúdo |
| 2.8 | `texto-topicos` completo — regiões da §11.2, marcador travessão, opção `ancoragem` | `centro` distribui os itens no miolo, `topo` encosta abaixo do cabeçalho; três itens é o alvo, quatro o teto |
| 2.9 | `final-cta` completo — conteúdo ancorado à base, bloco de CTA, opção `mostrarSeta` | Lead vazio faz o bloco desaparecer junto com o gap; constelação inteira acesa |
| 2.10 | `migrarCampos(de, para, fields)` — migração de conteúdo na troca de template | TDD: chave compartilhada migra, chave sem correspondência é descartada, `options` sempre resetam para os defaults do template novo. **Bloqueada pela decisão 1** |
| 2.11 | Seletor de layout no topo do inspector, usando `migrarCampos` | Trocar o layout preserva o que já foi digitado e reseta as opções |
| 2.12 | `persist` do zustand em localStorage | Recarregar a página não perde o deck |

> A tarefa 2.12 é antecipada da Fase 3 do §15. Motivo: o próprio §15 afirma que a Fase 1
> já permite publicar um carrossel real, e um deck que some no reload não permite. Custa
> poucas linhas de middleware.

---

## Etapa 3 — Biblioteca

**Objetivo.** Fechar a biblioteca de dez templates e tornar a ferramenta confiável para
conteúdo denso. Corresponde à Fase 2 do §15.

**Entrega.** Os sete templates restantes — `contexto`, `texto-impacto`, `codigo-janela`,
`codigo-anotado`, `comparacao-2col`, `split-vertical`, `imagem-legenda`. Bloco de código
com shiki e tema derivado dos tokens da §10.4, não importado pronto. Guard de transbordo
por `ResizeObserver`, marcando o slide como inválido no canvas e na lista lateral.

O guard não é polimento opcional: slide tem altura fixa e texto longo transborda: é a
falha número um deste tipo de ferramenta.

---

## Etapa 4 — Editor

**Objetivo.** Transformar o protótipo funcional em algo que aguenta uso semanal.
Corresponde à Fase 3 do §15.

**Entrega.** Reordenação por arraste com `@dnd-kit/sortable`; duplicar e remover slide;
undo/redo com `zundo`; múltiplos decks com tela de listagem; import/export `.json` com
imagens embutidas em base64; imagens no IndexedDB via `idb-keyval`, com o deck guardando
apenas `ImageId`.

Apenas upload local de imagem. URL externa contamina o canvas e faz a exportação falhar
em silêncio.

---

## Etapa 5 — Produto

**Objetivo.** Deixar a ferramenta apresentável como projeto de portfólio e publicá-la.
Corresponde à Fase 4 do §15.

**Entrega.** Atalhos de teclado; estados vazios; README com GIF de demonstração
substituindo o do `create-next-app`; deploy estático na Vercel.

**Critério de conclusão da v1.** Um carrossel completo, do zero ao PDF publicado no
LinkedIn, sem sair da ferramenta e sem retoque em nenhum outro programa.

---

## Decisões pendentes

Nenhuma foi assumida. Cada uma bloqueia a tarefa indicada.

### 1. Conflito no vocabulário de campos — *bloqueia 2.10*

A §6 do documento de contexto define o vocabulário canônico como `kicker`, `heading`,
`corpo`, `itens`, `imagem`, `legenda`, `codigo`/`arquivo`/`lang`, e diz que templates
diferentes devem usar as mesmas chaves para papéis equivalentes. Mas as specs da §11.1 e
da §11.3 do design system usam `titulo`, `lead` e `cta`, que não estão no vocabulário.

Na prática: o título de `capa-declaracao` está em `titulo` e o de `texto-topicos` em
`heading`, então trocar o layout apagaria o que a pessoa escreveu — exatamente o
problema que a separação `fields`/`options` existe para resolver, e o "pior momento
possível de uso da ferramenta" nas palavras do §6.

**Recomendação.** Renomear `titulo` → `heading` em `capa-declaracao` e `final-cta`, e
acrescentar `lead` e `cta` ao vocabulário canônico, já que não têm equivalente. Atualiza
os dois documentos no mesmo commit.

**Alternativa.** Manter as chaves como estão e escrever uma tabela de equivalência dentro
de `migrarCampos`. Ganha em não mexer nos documentos, perde em ter duas fontes de verdade
sobre o mesmo assunto e em precisar manter a tabela a cada template novo.

### 2. Origem do kicker — *afeta 1.6 e 2.4*

A §10.5 descreve o kicker no formato `pilar/ · índice`, o que sugere derivação de
`deck.meta.pilar` e da posição do slide. A §11.1 o define como campo `text` digitado à
mão, limite 12 caracteres. Os dois não podem valer ao mesmo tempo.

Derivar dá consistência automática em todo o deck e um campo a menos no inspector, mas
tira a liberdade de escrever qualquer outra coisa ali. Digitar dá liberdade ao custo de
a pessoa ter de acertar o índice à mão em cada slide — e de errar quando reordenar.

Sem resposta, a tarefa 1.6 implementa como campo digitado, por ser o que a spec do
template diz, e a mudança para derivado fica barata.

### 3. Logo do rodapé — *bloqueia 2.4*

A §11.0 exige "logo de 32px" no rodapé de todo slide que não seja capa ou final. Não
existe arquivo, nem especificação de forma, nem menção a ele em nenhuma outra seção.

É um símbolo do asterismo? Um monograma? O rodapé pode existir sem logo, só com handle e
constelação?

### 4. Constelação acima de 10 slides — *bloqueia parte de 2.4*

A §10.5 diz que acima de 10 slides a constelação mostra "5 pontos mais um contador
`03 / 12`". Falta definir **quais** cinco: os cinco primeiros, uma janela deslizante em
torno do slide atual, ou uma amostragem espalhada pelo deck.

Janela deslizante é a leitura mais provável, mas colide com a regra de que "o atual é
simplesmente o último aceso" — numa janela deslizante o último aceso é sempre o mesmo
ponto, e a constelação para de comunicar progresso.

### 5. Variantes do shadcn contra a §2.4 — *afeta a Etapa 3*

O preset `nova` do shadcn desenha o botão destrutivo como `bg-destructive/10` com texto
`destructive` — fundo tingido, não o padrão uniforme "tom 400 como preenchimento, tom 950
como texto" da §2.4. Divergência de baixa gravidade, no chrome do editor e não no
carrossel, mas é divergência.

Adaptar as variantes ao Observatório é trabalho de uma tarefa própria. Fica registrado
para não passar despercebido, sem bloquear nada.
