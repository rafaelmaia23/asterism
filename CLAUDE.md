@AGENTS.md

# asterism

Editor de carrosséis para LinkedIn que roda inteiramente no navegador e exporta PDF
1080×1350. Os layouts são código tipado; o conteúdo é um documento JSON; o editor
manipula esse JSON, o renderer o transforma em DOM e o exportador transforma DOM em
arquivo. Aplicação de usuário único: sem back-end, sem banco, sem autenticação.

O sistema visual é o **Observatório** — tema escuro único, sem variante clara.

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), `output: "export"` |
| UI | React 19 |
| Estilo | Tailwind CSS v4, config CSS-first |
| Componentes | shadcn/ui v4 sobre **Base UI** (`@base-ui/react`), preset `nova` |
| Ícones | lucide-react |
| Estado | zustand (cru; `persist` e `zundo` entram na Etapa 3) |
| Validação | zod |
| Exportação | modern-screenshot (DOM → bitmap) + jsPDF (bitmap → arquivo) |
| Testes | Vitest (`@testing-library/react` + `happy-dom` para componentes) |

Ainda não instalados, previstos pelo roadmap: zundo, shiki, @dnd-kit/sortable,
idb-keyval.

## Documentos de referência

Ficam em `docs/`, menos o glossário, que fica na raiz. Todos em português — só os
nomes de arquivo e os termos do glossário são em inglês. Cada um tem uma autoridade:

| Documento | Vence em |
|---|---|
| `CONTEXT.md`, na raiz | O vocabulário: o que cada termo significa, e qual palavra usar |
| `docs/model.md` | O dado: deck, marcação, elementos e presets, estado e persistência |
| `docs/pipeline.md` | O caminho do dado até o arquivo: renderização e exportação |
| `docs/architecture.md` | Princípios, formato como dado, stack e armadilhas conhecidas |
| `docs/product.md` | Problema, escopo, não-objetivos, interface e roadmap |
| `docs/adr/` | As decisões registradas, uma por arquivo, endereçadas `ADR-NNNN` |
| `observatorio-design-system.md` | Qualquer questão visual; é quem regenera o `theme.css` |
| `observatorio-elementos.md` | Os doze elementos, a pilha vertical e os dez presets |
| `theme.css` | Nada — é artefato derivado do design system |
| `TODO.md` | Estado da execução: etapas, tarefas, experimentos em aberto |
| `maiahub-logo.md` | As peças de logo e como foram adaptadas ao Observatório |

Em conflito entre um documento e o código, o documento vence.

Nenhum deles é para ser lido inteiro. O design system tem um **mapa na §0** que diz o que
cada seção decide e quando abri-la — leia o mapa antes da seção, e a seção por faixa de
linha. Referência `§N` sem nome de documento significa o próprio documento; referência a
outro sempre o nomeia — `§2 de docs/model.md`. Decisão se cita pelo endereço dela,
`ADR-0050`, que é o nome do arquivo em `docs/adr/` e nunca muda.

`docs/theme.css` e `src/app/globals.css` compartilham o mesmo bloco de tokens, entre os
marcadores `BEGIN/END Observatório`. Mudou um, muda o outro.

## Estrutura

```
docs/                 documentos de referência, em português
src/app/                App Router — layout, globals.css, rotas
src/deck/               modelo de dados do deck e suas factories
src/components/ui/      componentes shadcn (gerados; auditar contra a §2.4 do design system)
src/components/maiahub/ as cinco peças de logo
src/fonts/              as três famílias em arquivo local + licenças OFL
src/lib/                utilidades compartilhadas
```

Cada domínio do problema vira uma pasta autocontida, com fronteira clara e sem
dependência circular entre elas. **Nenhum estágio conhece o seguinte**: o parser não
sabe que existe DOM, o template não sabe que existe exportação, o exportador não sabe
quais templates existem. Templates e alvos de exportação são descobertos por registry,
nunca por `switch` espalhado.

Não crie estrutura para o que ainda não existe. Pasta vazia é custo sem retorno.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção (export estático em out/)
npm run lint     # eslint
npm test         # vitest, uma passada
npm run test:watch
npx tsc --noEmit # checagem de tipos
```

## Git

- `main` é produção. `dev` sai de `main`. O trabalho acontece em branches
  `feature/<slug>` puxadas de `dev`.
- **Inglês** em commits, nomes de branch, nomes de arquivo, identificadores e
  comentários de código. **Português** na documentação em `docs/`.
- Commits **não são assinados pelo Claude**: sem `Co-Authored-By`, sem menção a
  ferramenta, sem emoji de robô no rodapé.
- Mensagens no imperativo, curtas, uma linha quando couber.
- **Branch de feature morre com o merge.** Terminado o trabalho e mesclada em `dev`, a
  branch é apagada na mesma sessão — `git branch -d <nome>`, que recusa se ainda houver
  commit fora de `dev`. Só `main` e `dev` são permanentes. Branch mesclada que fica é lixo
  que esconde as vivas: uma lista de onze não diz mais o que está em andamento.

## Regra 1 — decisões de produto não são suas

Quando aparecer uma decisão que afeta comportamento, escopo, modelo de dados ou
aparência, não escolha por conta. Pare, apresente as opções, explique o que cada uma
ganha e o que perde, e recomende uma com o motivo. Espere a resposta.

Decisões puramente técnicas e reversíveis — nome de variável, organização interna de um
módulo, escolha entre duas formas equivalentes — você toma sozinho e segue.

## Regra 2 — os documentos são a fonte da verdade

Quando a implementação divergir do que está em `docs/`, o documento é atualizado junto,
**no mesmo commit**. Documento desatualizado é pior que documento ausente.

## TDD clássico

Teste primeiro, ver falhar, então implementar até passar. Vale para tudo que for lógica:
o parser de marcação inline, a migração de campos entre templates, os registries, as
factories do modelo. Não vale para layout de template, que se verifica olhando.

## Armadilhas já conhecidas

**Tokens do canvas em hex sRGB.** A rasterização passa por `foreignObject`/canvas e o
suporte a `oklch()` é irregular. Nada de OKLCH dentro de `.slide-canvas`.

**Fontes sempre same-origin.** Oxanium, Sora e JetBrains Mono via `next/font/local`.
Fonte de CDN não é inlinada na captura e o PDF sai em Arial.

**O reset do Tailwind não atravessa a captura.** Dentro do `foreignObject` vale a folha do
agente de usuário: `<p>`, `<h2>` e `<ul>` recuperam `1em` de margem, que a 72px são 72px de
espaçamento inventado. O `rasterize` reinjeta o reset por `onCloneNode` — ADR-0050, §3 de `docs/architecture.md`. Layout do PDF que não bate com o preview começa a se investigar aqui.

**Sonda de medida não pode pintar o nó medido.** Dar fundo a um elemento para achá-lo no
bitmap cria um atributo `style`, e isso muda o que a clonagem copia — o defeito some
justamente onde se olha. Compare **dois bitmaps** do mesmo nó intocado.

**Tailwind faz tree-shaking de tokens.** Variável declarada em `@theme` que nenhuma
classe referencia não chega ao CSS final. O bloco da superfície carrossel é
`@theme static` justamente por ser lido via `var()` dentro dos templates.

**Id de dado não vira atributo do DOM.** O deck nasce uma vez na pré-renderização estática
e outra no navegador, com `crypto.randomUUID()` nos dois — id de slide em `id`, `htmlFor`
ou `data-*` é divergência de hidratação. Identificador de formulário sai de `useId`.

**Elemento medido por `ResizeObserver` não pode ser dimensionado pelo que ele contém.**
O que se mede fica preso a algo de fora — altura de viewport, não altura mínima — e o que
a medida desenha fica fora do fluxo. Caso contrário a escala se realimenta e o slide
cresce sozinho. Ver a §3 de `docs/architecture.md`.

## Agent skills

Os contratos que as skills de engenharia leem ficam em `docs/agents/`. São os únicos
arquivos de `docs/` escritos em inglês: não são documentação do projeto, e sim o texto que
as skills consomem — mantê-los idênticos ao original as deixa comparáveis quando a skill
for atualizada.

As skills em si são as do Matt Pocock (`mattpocock/skills`), instaladas como plugin pelo
`.claude/settings.json` versionado — marketplace `mattpocock`, plugin `mattpocock-skills`.
É o que as faz existir também nas sessões na nuvem, onde o container nasce de um clone
novo e nada instalado à mão sobrevive. Por serem de plugin, se invocam com prefixo:
`/mattpocock-skills:tdd`.

### Issue tracker

Issues e specs vivem como markdown em `.scratch/<feature>/`, versionados junto com o
código. Sem `gh`, sem tracker remoto. Ver `docs/agents/issue-tracker.md`.

### Triage labels

O vocabulário canônico dos cinco papéis, sem renomear: `needs-triage`, `needs-info`,
`ready-for-agent`, `ready-for-human`, `wontfix`. Ver `docs/agents/triage-labels.md`.

### Domain docs

Contexto único: o `CONTEXT.md` da raiz é o glossário, e `docs/adr/` guarda as decisões,
uma por arquivo. Os dois existem desde a reorganização da ADR-0075. Ver
`docs/agents/domain.md`.
