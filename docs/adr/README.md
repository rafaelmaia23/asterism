# Decisões registradas

As decisões de arquitetura do projeto, uma por arquivo, no formato `NNNN-slug.md`. O
número é o endereço: `ADR-0050` é o mesmo 50 que os comentários do código citam, e ele
não muda nunca — decisão superada ganha `status` no frontmatter e continua onde está.

Antes eram a §16 do `asterism-context.md`, numa tabela só.

| # | Decisão | Status |
|---|---|---|
| 1 | [Templates em código](./0001-templates-as-code.md) | accepted |
| 2 | [Rasterizar o DOM](./0002-rasterize-the-dom.md) | accepted |
| 3 | [Parser devolve AST](./0003-parser-returns-ast.md) | accepted |
| 4 | [Descritor de campos declarativo](./0004-declarative-field-descriptor.md) | accepted |
| 5 | [`fields` separado de `options`](./0005-fields-separate-from-options.md) | superseded by ADR-0061 |
| 6 | [Exportação em dois estágios](./0006-two-stage-export.md) | accepted |
| 7 | [Imagens no IndexedDB](./0007-images-in-indexeddb.md) | accepted |
| 8 | [Apenas upload local de imagem](./0008-local-image-upload-only.md) | accepted |
| 9 | [Marcação sem construções de bloco](./0009-markup-without-block-constructs.md) | superseded by ADR-0060 |
| 10 | [Marcadores não aninham](./0010-markers-do-not-nest.md) | accepted |
| 11 | [Tokens em hex sRGB no canvas](./0011-srgb-hex-tokens-on-canvas.md) | accepted |
| 12 | [`format` como dado desde a v1](./0012-format-as-data.md) | accepted |
| 13 | [Vocabulário de campos único, em inglês](./0013-single-english-field-vocabulary.md) | accepted |
| 14 | [Kicker é campo digitado](./0014-kicker-is-a-typed-field.md) | accepted |
| 15 | [Grid com linha de 2px, compensada no preview](./0015-two-pixel-grid-line.md) | accepted |
| 16 | [Estrela da logo em `azure-400`](./0016-logo-star-in-azure-400.md) | accepted |
| 17 | [Variantes do shadcn adaptadas à §2.4 do design system](./0017-shadcn-variants-adapted.md) | accepted |
| 18 | [`MaiahubGlyph` a 32px no rodapé do slide](./0018-maiahub-glyph-at-32px.md) | accepted |
| 19 | [Escala tipográfica do carrossel materializada em `@utility slide-*`](./0019-carousel-type-scale-as-utilities.md) | accepted |
| 20 | [Palco de exportação oculto, montado a 1:1](./0020-hidden-export-stage.md) | accepted |
| 21 | [Página do PDF em pt, 1080×1350](./0021-pdf-page-in-points.md) | accepted |
| 22 | [Escala do canvas por auto-fit na fatia vertical](./0022-canvas-scale-by-auto-fit.md) | accepted |
| 23 | [Área de trabalho em `ink-900` e moldura de 1px `ink-700` no quadro externo, fora do `transform`](./0023-workspace-ground-and-frame-hairline.md) | accepted |
| 24 | [Store como factory mais singleton, em `src/editor/store.ts`](./0024-store-factory-plus-singleton.md) | accepted |
| 25 | [Grade de fundo é opção do slide, com o `background` do template como padrão](./0025-background-grid-as-slide-option.md) | accepted |
| 26 | [`Frame` carrega o bitmap como PNG em data URL](./0026-frame-carries-png-data-url.md) | accepted |
| 27 | [Um `createRegistry` genérico em `src/lib/registry.ts`, com dois usuários](./0027-generic-create-registry.md) | accepted |
| 28 | [Grade de fundo desenhada em `<svg>`, com módulo tirado do formato e moldura fechada nos quatro lados](./0028-background-grid-drawn-in-svg.md) | accepted |
| 29 | [O `final-cta` leva o rodapé completo — glyph, handle e constelação toda acesa](./0029-final-cta-keeps-full-footer.md) | accepted |
| 30 | [`addSlide` e `removeSlide` antecipados da Etapa 4 para a Etapa 2](./0030-add-and-remove-slide-early.md) | accepted |
| 31 | [A reidratação do `persist` valida e descarta slide a slide](./0031-rehydration-validates-slide-by-slide.md) | accepted |
| 32 | [O guard de transbordo continua na Etapa 3](./0032-overflow-guard-deferred-to-stage-3.md) | accepted |
| 33 | [O parser não conhece limite de palavra: marcador vale em qualquer posição](./0033-no-word-boundary-rule.md) | accepted |
| 34 | [O peso de `forte` é `max(600, --slide-font-weight)`, lido por herança da utility de escala](./0034-strong-weight-max-600.md) | accepted |
| 35 | [As seis partes da faixa do rodapé são opção do slide, com o descritor do template dando o padrão](./0035-footer-parts-as-slide-options.md) | accepted |
| 36 | [O chevron está disponível em todo template e é suprimido no último slide por posição](./0036-chevron-suppressed-by-position.md) | accepted |
| 37 | [A `MaiahubGlyph` engrossou: traço 1.6 → 2.25 em opacidade cheia, estrela 3.4 → 4.0](./0037-thicker-maiahub-glyph.md) | accepted |
| 38 | [A régua do rodapé fica em y 1174, em `ink-600`, e toda hairline do canvas usa a compensação de escala](./0038-footer-rule-at-y-1174.md) | accepted |
| 39 | [O texto do CTA do `final-cta` usa `slide-code`, a 34px](./0039-final-cta-uses-slide-code.md) | accepted |
| 40 | [A constelação desenha um ponto por slide em qualquer contagem — o recorte acima de 10 slides da §10.5 do design system foi revogado](./0040-constellation-one-dot-per-slide.md) | accepted |
| 41 | [Ao reidratar, o slide salvo é lido por cima dos defaults do template antes de ser validado](./0041-saved-slide-read-over-defaults.md) | accepted |
| 42 | [O cabeçalho é faixa compartilhada de todo template, ligável por `showHeader`, e o `kicker` virou campo compartilhado](./0042-shared-header-band.md) | accepted |
| 43 | [Ligar o cabeçalho empurra o conteúdo do `text-bullets`, em vez de a faixa ser reservada sempre](./0043-header-pushes-bullets-content.md) | accepted |
| 44 | [A seção do inspector é metadado de desenho no descritor](./0044-inspector-section-as-descriptor-metadata.md) | superseded by ADR-0061 |
| 45 | [A biblioteca inteira foi especificada como conjunto, numa sub-etapa de documento, e o vocabulário canônico fechou sem nenhuma chave nova](./0045-library-specified-as-a-set.md) | accepted |
| 46 | [Imagem pode sangrar até a borda do canvas; conteúdo, não](./0046-image-may-bleed-content-may-not.md) | accepted |
| 47 | [O guard de transbordo mede dois nós — a faixa, que tem altura de spec, e o bloco de conteúdo dentro dela — e o resultado não vai para o store](./0047-guard-measures-two-nodes.md) | accepted |
| 48 | [A marca de transbordo é a borda do quadro externo do `SlideFrame`, mais um ícone na linha da lista](./0048-overflow-mark-on-frame-border.md) | accepted |
| 49 | [Os seis componentes shadcn cedem ao documento em foco, raio, hover, ativo, desabilitado e inválido — experimento 3](./0049-shadcn-yields-to-the-document.md) | accepted |
| 50 | [O reset do `preflight` é reinjetado no clone pelo `onCloneNode` do `rasterize`, como folha de seletor universal](./0050-clone-reset-sheet.md) | accepted |
| 51 | [O realce do shiki é síncrono: `createHighlighterCoreSync`, motor de regex em JavaScript e as gramáticas importadas estaticamente](./0051-synchronous-shiki-highlighting.md) | accepted |
| 52 | [O tema do shiki é gerado dos tokens e um teste é quem garante: o `theme.test.ts` lê o `globals.css` e compara cor por cor](./0052-shiki-theme-generated-from-tokens.md) | accepted |
| 53 | [O nome do arquivo na barra da janela de código sai em caixa baixa, contra a versalização da utility `slide-meta`](./0053-code-window-filename-lowercase.md) | accepted |
| 54 | [Os três descritores do bloco de código — `code`, `file` e `lang` — são o mesmo objeto nos dois templates de código, em `shared/fields.ts`](./0054-shared-code-field-descriptors.md) | accepted |
| 55 | [O `ImageId` vira URL num cache de módulo em `src/images/cache.ts`, fora do store, e a pasta `src/images` é folha — não importa nada do sistema](./0055-image-url-module-cache.md) | accepted |
| 56 | [A imagem é reduzida a 2160px no maior lado na importação, com o original descartado](./0056-images-downscaled-to-2160px.md) | accepted |
| 57 | [Blob órfão não é coletado na 3F](./0057-orphan-blobs-not-collected.md) | accepted |
| 58 | [`image` e `imageFit` são declarados nos dois templates de mídia](./0058-media-templates-declare-image-locally.md) | superseded by ADR-0061 |
| 59 | [O carrossel de referência usa os dez templates em doze slides e nasce sem imagem](./0059-reference-carousel-without-images.md) | accepted |
| 60 | [A marcação ganha uma camada de blocos acima do parser inline: linha em branco separa parágrafo, `- ` e `1. ` abrem lista](./0060-block-layer-above-inline-parser.md) | accepted |
| 61 | [Slide é `layout` mais uma lista ordenada de elementos; os dez templates viram dado](./0061-slide-is-layout-plus-elements.md) | accepted |
| 62 | [Elemento não carrega estilo; a restrição migra para a cardinalidade no menu de adicionar](./0062-elements-carry-no-style.md) | accepted |
| 63 | [`columns` é tupla de dois, com um nível de profundidade, proporção e alinhamento fechados](./0063-columns-is-a-pair.md) | accepted |
| 64 | [Toda operação do store é por `ElementId`, não por caminho](./0064-store-operations-by-element-id.md) | accepted |
| 65 | [O guard de transbordo é recursivo e nomeia o elemento que estourou](./0065-recursive-overflow-guard.md) | accepted |
| 66 | [O `kicker` continua cromo do layout, e é a única peça de conteúdo que mora lá](./0066-kicker-stays-layout-chrome.md) | accepted |
| 67 | [Não existe elemento de espaçamento; a âncora vertical do layout resolve o caso legítimo](./0067-no-spacer-element.md) | accepted |
| 68 | [Deck da v1 é descartado na virada, e `deck.version` vai a 2](./0068-v1-deck-discarded.md) | accepted |
| 69 | [Preset guarda o esqueleto e snapshot guarda o texto, separados por uma caixa de seleção ao salvar; os dez de seed são fixos](./0069-preset-and-snapshot.md) | accepted |
| 70 | [Slide novo herda a composição do anterior, com o conteúdo limpo](./0070-new-slide-inherits-composition.md) | accepted |
| 71 | [O sangramento de imagem vira opção fechada do elemento `image` — `none`, `top`, `edge`](./0071-image-bleed-as-element-option.md) | accepted |
| 72 | [Os doze elementos incluem `quote` e `divider`, dois papéis que nenhum dos dez templates tinha](./0072-quote-and-divider-elements.md) | accepted |
| 73 | [A função que converte os dez templates da v1 é a definição dos dez presets de seed](./0073-conversion-function-defines-presets.md) | accepted |
| 74 | [A etapa nova usa numeração intermediária — Etapa 3½, tarefas `C.n`](./0074-half-step-stage-numbering.md) | accepted |
| 75 | [O documento de contexto vira quatro documentos, um glossário na raiz e 74 ADRs](./0075-context-document-split.md) | accepted |
| 76 | [A lista ordenada é renumerada de 1, e o número escrito é ignorado](./0076-sequential-ordered-list-numbering.md) | accepted |
