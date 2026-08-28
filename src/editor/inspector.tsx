"use client";

/**
 * A coluna da direita: o formulário do slide ativo.
 *
 * **O inspector não conhece template nenhum.** Ele pede o descritor ao registry e desenha
 * uma linha por `Field`, na ordem em que o template as declara. Campo novo no descritor
 * aparece aqui sem que este arquivo seja tocado — é o critério de pronto da 1.11, e é
 * também o que a decisão 4 da §16 do documento de contexto compra: o zod valida, o
 * descritor desenha.
 *
 * ## As seções saem do descritor, e a divisão do modelo continua de pé
 *
 * O formulário era duas seções fixas, porque o modelo tem duas — §6: `fields` é conteúdo e
 * `options` é apresentação. Ao trocar de layout, um migra e o outro reseta, e essa regra só
 * existe enquanto os dois não se misturarem **no dado**.
 *
 * Na 2F o desenho deixou de espelhar essa divisão. O cabeçalho do slide é uma faixa com um
 * texto e um interruptor — o kicker e o `showHeader` —, e separá-los em duas seções
 * distantes faria ligar a coisa numa e escrever nela na outra. Então a seção passou a ser
 * **metadado de desenho** no descritor: ela diz onde o controle aparece, nunca onde o valor
 * mora. `Conteúdo` e `Apresentação` viraram duas seções entre quatro, e é isso que torna a
 * **ordem** declarativa — sem elas na lista, a posição do Cabeçalho acima do conteúdo seria
 * uma regra escrita aqui em vez de no descritor. Decisão 44.
 *
 * O interruptor de uma seção continua declarado em `options` como qualquer opção, e é este
 * componente que sabe desenhá-lo no cabeçalho da seção em vez de como mais uma linha. O
 * contrário — declará-lo na seção — faria `options` deixar de ser a lista completa das
 * chaves de opção, que é o invariante que o teste de paridade de cada template confere.
 *
 * O store chega por prop, com o singleton como padrão. É o que deixa o teste montar um
 * deck de fixture — inclusive com um template que só existe no teste — sem estado global
 * atravessando de um caso para o outro.
 */

import { useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImageUp, Plus, X } from "lucide-react";
import type { StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import type { FieldValue, OptionValue } from "@/deck/types";
import { addItem, moveItem, removeItem, setItem } from "@/editor/list-field";
import { editorStore, selectActiveSlide, type EditorState } from "@/editor/store";
import { importImage, useImageUrl } from "@/images/cache";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { get, list } from "@/templates/registry";
import type { Field, FieldSection } from "@/templates/types";

export type InspectorProps = {
  store?: StoreApi<EditorState>;
};

/**
 * O contador da §11.0 dos templates: o limite é **conselho**, não trava. O campo aceita
 * mais, o contador fica âmbar, e quem reprova de fato é o guard de transbordo, medindo
 * altura real. Por isso nenhum controle aqui recebe `maxLength`.
 *
 * Conta caracteres num campo de texto e itens num campo `list` — a peça é a mesma porque
 * a leitura é a mesma: quanto do orçamento já foi gasto, e o âmbar quando ele estourou.
 * Vale para os dois porque `maxItems` também é conselho: um quinto tópico curto pode
 * caber onde três longos não caberiam, e quem sabe disso é o guard, medindo altura.
 */
function Counter({ count, max, testId }: { count: number; max?: number; testId: string }) {
  if (max === undefined) {
    return null;
  }

  return (
    <span
      data-testid={testId}
      className={`font-mono text-xs font-medium tracking-[0.08em] tabular-nums ${
        count > max ? "text-warning" : "text-ink-500"
      }`}
    >
      {count}/{max}
    </span>
  );
}

/** O limite de caracteres do descritor, para os tipos que têm um. */
function maxOf(field: Field): number | undefined {
  return "max" in field ? field.max : undefined;
}

/**
 * O que o contador conta neste campo, e contra o quê.
 *
 * Em quase todo campo é caractere contra `max`. No `code` é **linha** contra `maxLines`,
 * porque é em linha que o limite do bloco de código é escrito — as 14 da §10.3 do design
 * system saem da altura da região dividida pela altura da linha, e contar caractere ali
 * não diria nada a quem cola um trecho. A leitura do contador continua a mesma: quanto do
 * orçamento já foi gasto.
 *
 * Campo de código vazio tem **zero** linha, e não uma: `"".split("\n")` devolve um item.
 */
function budget(field: Field, text: string): { count: number; max?: number } {
  if (field.type === "code") {
    return { count: text === "" ? 0 : text.split("\n").length, max: field.maxLines };
  }

  return { count: text.length, max: maxOf(field) };
}

/**
 * Um item de campo `list`: a textarea com o texto, os três botões de ordem e remoção, e o
 * contador contra `maxPerItem`.
 *
 * Reordenar é por botão, e não por arraste: `@dnd-kit` é da Etapa 4, e trazê-lo agora
 * seria instalar dependência de etapa futura para o menor dos dois usos que ela vai ter —
 * a lista lateral é o outro, e é lá que o arraste se paga.
 *
 * A textarea tem duas linhas porque o item tem duas no slide: o limite da §11.2 é de 80
 * caracteres, que em 40px sobre a largura útil rende até duas linhas. Um input de uma
 * linha esconderia o fim do item enquanto se digita, justo onde a marcação inline costuma
 * fechar.
 */
function ListItem({
  field,
  items,
  at,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  items: string[];
  at: number;
  onChange: (items: string[]) => void;
}) {
  const item = items[at];

  return (
    <div data-testid={`item-${field.key}-${at}`} className="flex flex-col gap-1">
      <div className="flex items-start gap-1">
        {/* Rótulo por `aria-label`, não por `htmlFor`: a etiqueta do campo é uma só e os
            controles são muitos, então cada item se nomeia pela posição. */}
        <Textarea
          aria-label={`${field.label} ${at + 1}`}
          rows={2}
          value={item}
          className="flex-1"
          onChange={(event) => onChange(setItem(items, at, event.target.value))}
        />

        <div className="flex flex-col">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Subir item ${at + 1}`}
            disabled={at === 0}
            onClick={() => onChange(moveItem(items, at, -1))}
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Descer item ${at + 1}`}
            disabled={at === items.length - 1}
            onClick={() => onChange(moveItem(items, at, 1))}
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Remover item ${at + 1}`}
            onClick={() => onChange(removeItem(items, at))}
          >
            <X />
          </Button>
        </div>
      </div>

      {/* O contador alinha com a textarea, não com a coluna de botões. */}
      <div className="flex justify-end pr-7">
        <Counter
          testId={`counter-${field.key}-${at}`}
          count={item.length}
          max={field.maxPerItem}
        />
      </div>
    </div>
  );
}

/**
 * O campo de imagem — 3.16, e o sétimo tipo de `Field` a ganhar controle.
 *
 * **Só arquivo local.** Não há campo de texto onde colar um endereço, e a ausência é a
 * decisão 8: URL externa contamina o canvas e faz a exportação falhar em silêncio. O que o
 * slide guarda é o `ImageId` que o `importImage` devolve; o binário fica no IndexedDB, e é
 * isso que mantém o `localStorage` do `persist` longe da cota — §11 do documento de contexto.
 *
 * O `<input type="file">` é escondido e disparado por um `<button>` irmão. Não é enfeite: o
 * controle nativo traz um rótulo próprio que ninguém consegue redigir, e envolvê-lo num
 * botão seria controle dentro de controle — a mesma armadilha de HTML inválido que a lista
 * lateral e o cabeçalho de seção já documentam. `sr-only` e não `display:none`, para que ele
 * continue focável pelo `<label>` do campo.
 *
 * A moldura tem a **proporção do `ratio`** do descritor — 5:16 no `split-vertical`, 108:91 no
 * `image-caption` —, e é só isso que o `ratio` faz na 3F: mostra o formato do buraco que a
 * imagem vai preencher. Recorte de verdade não é desta sub-etapa. A altura é fixa e a
 * largura sai da proporção, e não o contrário: numa coluna de inspector, 5:16 em largura
 * cheia daria uma moldura de novecentos pixels.
 */
function ImageField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Extract<Field, { type: "image" }>;
  value: string;
  onChange: (value: FieldValue) => void;
}) {
  const url = useImageUrl(value);
  const input = useRef<HTMLInputElement>(null);

  /** `"5:16"` vira o `aspect-ratio` do CSS. Sem `ratio`, a moldura fica quadrada. */
  const aspect = (field.ratio ?? "1:1").replace(":", " / ");

  async function escolher(file: File | undefined) {
    if (!file) {
      return;
    }

    onChange(await importImage(file));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center">
        <div
          data-testid={`preview-${field.key}`}
          style={{ aspectRatio: aspect }}
          className="flex h-48 max-w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted"
        >
          {url === undefined ? (
            /* O mesmo estado que o slide desenha: sem imagem, ou com um id órfão cujo blob
               não está mais no banco — a §11.9 dos templates trata os dois como um só. */
            <span className="px-2 text-center text-sm text-ink-600">Sem imagem</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-testid={`image-${field.key}`}
              src={url}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>
      </div>

      <input
        ref={input}
        id={id}
        data-testid={`file-${field.key}`}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void escolher(event.target.files?.[0])}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => input.current?.click()}
        >
          <ImageUp />
          {value === "" ? "Escolher imagem" : "Trocar imagem"}
        </Button>

        {value !== "" && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Remover imagem
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * O `id` do par label/controle sai do `useId`, e **não** de `slide.id`.
 *
 * O deck é criado uma vez na pré-renderização estática, no Node, e outra no navegador; os
 * ids vêm de `crypto.randomUUID()` e são diferentes nas duas. Id de dado em atributo do
 * DOM viraria divergência de hidratação, que o React não remenda por ser atributo. O
 * `useId` é gerado pela posição na árvore e por isso casa dos dois lados.
 *
 * A regra vale para o projeto inteiro, não só aqui — ver a §13 do documento de contexto.
 */
function FieldRow({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: FieldValue | OptionValue | undefined;
  onChange: (value: FieldValue | OptionValue) => void;
}) {
  const id = useId();
  const text = typeof value === "string" ? value : "";

  if (field.type === "toggle") {
    return (
      <div data-testid={`field-${field.key}`} className="flex items-center justify-between gap-4">
        <label id={`${id}-label`} className="text-sm text-ink-300">
          {field.label}
        </label>
        <Switch
          aria-labelledby={`${id}-label`}
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    );
  }

  /**
   * A lista tem controle por item, então a etiqueta do campo não aponta para um controle
   * só: vira texto, e cada item se nomeia pela posição. O contador do cabeçalho conta
   * **itens** contra `maxItems`; o de cada item conta caracteres contra `maxPerItem`.
   */
  if (field.type === "list") {
    const items = Array.isArray(value) ? value : [];

    return (
      <div data-testid={`field-${field.key}`} className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm text-ink-300">{field.label}</span>
          <Counter
            testId={`counter-${field.key}`}
            count={items.length}
            max={field.maxItems}
          />
        </div>

        {items.map((item, at) => (
          // A chave é a posição: item de lista não tem id no modelo, e reordenar reescreve
          // o array inteiro — a mesma escolha que o `text-bullets` faz ao desenhá-los.
          <ListItem key={at} field={field} items={items} at={at} onChange={onChange} />
        ))}

        {/* Sem `disabled` no teto: `maxItems` é conselho como todo limite do descritor —
            §8 do documento de contexto. O contador acima fica âmbar, e quem reprova de
            fato é o guard de transbordo, medindo altura. */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid={`add-${field.key}`}
          onClick={() => onChange(addItem(items))}
        >
          <Plus />
          Adicionar
        </Button>
      </div>
    );
  }

  return (
    <div data-testid={`field-${field.key}`} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm text-ink-300">
          {field.label}
        </label>
        <Counter testId={`counter-${field.key}`} {...budget(field, text)} />
      </div>

      {field.type === "text" && (
        <Input
          id={id}
          value={text}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          id={id}
          rows={field.rows}
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {/* O bloco de código, §11.6 dos templates. Monoespaçado porque o que se digita ali é
          código, e a indentação precisa se ver enquanto se escreve; `rows` é o teto do
          descritor, para que o campo mostre de uma vez o que o slide comporta. Sem
          `maxLength`, como nenhum controle deste formulário tem — o limite é conselho, e
          quem reprova é o guard. */}
      {field.type === "code" && (
        <Textarea
          id={id}
          rows={field.maxLines}
          value={text}
          className="font-mono"
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {/* O `items` do Base UI é o mapa valor→rótulo: é ele que faz o gatilho mostrar
          "Centralizado" fechado, sem o popup precisar ter sido aberto uma vez. */}
      {field.type === "select" && (
        <Select
          value={text}
          items={Object.fromEntries(field.options.map((option) => [option.value, option.label]))}
          onValueChange={(next) => onChange(String(next))}
        >
          <SelectTrigger id={id} data-testid={`select-${field.key}`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "image" && (
        <ImageField id={id} field={field} value={text} onChange={onChange} />
      )}

      {/* Tipo ainda sem controle. **Não há nenhum hoje** — a 3.16 fechou os sete do `Field`
          dando o dele ao `image` —, e a linha fica: pular em silêncio faria um campo novo
          sumir do formulário sem aviso. A condição continua sendo **a negação dos tipos
          desenhados**, e não o nome do tipo que falta: escrita pelo positivo, o tipo que a
          Etapa 4 acrescentar sumiria do formulário sem uma linha sequer. */}
      {field.type !== "text" &&
        field.type !== "textarea" &&
        field.type !== "select" &&
        field.type !== "code" &&
        field.type !== "image" && (
          <span className="text-sm text-ink-600">Ainda não editável aqui</span>
        )}
    </div>
  );
}

function Heading({ title }: { title: string }) {
  return (
    <h2 className="font-mono text-xs font-medium tracking-[0.08em] text-ink-500 uppercase">
      {title}
    </h2>
  );
}

/**
 * Uma seção do formulário: o título, o gatilho que a encolhe, e — quando a seção tem uma —
 * a chave que liga a faixa inteira.
 *
 * **O cabeçalho é um `<div>` com dois controles irmãos, não um `<button>` que envolve
 * tudo.** Switch dentro de button é HTML inválido, que é a mesma armadilha que a lista
 * lateral documenta para o X por miniatura. É também o motivo de não haver um
 * `Collapsible` do Base UI aqui: o `Trigger` dele quer envolver o cabeçalho, e envolveria
 * o interruptor junto.
 *
 * Nada anima. A §7 do design system não anima posição por mais de 8px, e uma seção que
 * abre é bem mais que isso.
 */
function Section({
  title,
  open,
  onToggleOpen,
  testId,
  toggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggleOpen: () => void;
  testId: string;
  toggle?: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void };
  children: React.ReactNode;
}) {
  const body = useId();

  return (
    <section data-testid={`section-${testId}`} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          data-testid={`collapse-${testId}`}
          aria-expanded={open}
          aria-controls={body}
          onClick={onToggleOpen}
          className="flex flex-1 items-center gap-1.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ChevronDown
            aria-hidden
            className={`size-3 text-ink-600 ${open ? "" : "-rotate-90"}`}
          />
          <Heading title={title} />
        </button>

        {toggle && (
          <Switch
            aria-label={toggle.label}
            checked={toggle.checked}
            onCheckedChange={toggle.onCheckedChange}
          />
        )}
      </div>

      {open && (
        <div id={body} className="flex flex-col gap-4">
          {children}
        </div>
      )}
    </section>
  );
}

/**
 * O seletor de layout da §14 — o topo do inspector.
 *
 * Trocar o layout **preserva o conteúdo** e reseta as opções: quem sabe a regra é o
 * `setTemplate` do store, sobre o `migrateFields` da 2.10. Aqui só se escolhe.
 *
 * A lista sai do registry, nunca de um array à parte: um template novo aparece aqui pelo
 * mesmo caminho que aparece no resto do sistema.
 */
function LayoutPicker({
  template,
  onChange,
}: {
  template: string;
  onChange: (template: string) => void;
}) {
  const labels = Object.fromEntries(list().map((def) => [def.id, def.label]));

  return (
    <Select value={template} items={labels} onValueChange={(next) => onChange(String(next))}>
      <SelectTrigger data-testid="layout-trigger" className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {list().map((def) => (
          <SelectItem key={def.id} value={def.id}>
            {def.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * A seção em que um controle desenha. Campo sem `section` cai em `content`, opção sem
 * `section` cai em `style` — as duas sem interruptor. É o que fez as seções chegarem sem
 * que nenhum descritor de template existente precisasse ser editado.
 */
const FIELD_SECTION = "content";
const OPTION_SECTION = "style";

/**
 * A única seção que nasce encolhida.
 *
 * São cinco interruptores que se mexe uma vez e não se olha mais, e ocupavam metade da
 * coluna. Encolhida, a coluna abre mostrando o que se edita em vez do que se configurou.
 */
const COLLAPSED_AT_FIRST = new Set(["footer"]);

export function Inspector({ store = editorStore }: InspectorProps) {
  const slide = useStore(store, selectActiveSlide);
  const setField = useStore(store, (state) => state.setField);
  const setOption = useStore(store, (state) => state.setOption);
  const setTemplate = useStore(store, (state) => state.setTemplate);

  /**
   * Encolher é estado do painel, não do slide: fica aqui e não no store, que persiste o
   * deck e só ele. Sobrevive à troca de slide porque este componente não desmonta, e some
   * no reload — que é o que preferência de coluna deve fazer enquanto não houver um lugar
   * para guardar preferência de interface.
   */
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries([...COLLAPSED_AT_FIRST].map((key) => [key, true])),
  );

  const def = get(slide.template);

  /**
   * As chaves que desenham como interruptor de seção. São excluídas do corpo de **toda**
   * seção, e não só da própria: `showHeader` não declara `section`, então cairia em
   * "Apresentação" — como linha solta, ao lado do mesmo interruptor que já está no
   * cabeçalho da seção "Cabeçalho".
   */
  const toggles = new Set(
    def.sections
      .map((section: FieldSection) => section.toggle)
      .filter((key): key is string => key !== undefined),
  );

  /** Os controles de uma seção: os campos primeiro, as opções depois, na ordem declarada. */
  function contentOf(section: FieldSection) {
    const fields = def.fields.filter(
      (field: Field) => (field.section ?? FIELD_SECTION) === section.key,
    );

    const options = def.options.filter(
      (option: Field) =>
        (option.section ?? OPTION_SECTION) === section.key && !toggles.has(option.key),
    );

    return { fields, options };
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* O seletor de layout não é uma seção do descritor: não desenha campo nenhum, e
          encolhê-lo esconderia o controle que troca o template do slide. */}
      <section className="flex flex-col gap-4">
        <Heading title="Layout" />
        <LayoutPicker
          template={slide.template}
          onChange={(template) => setTemplate(slide.id, template)}
        />
      </section>

      {def.sections.map((section: FieldSection) => {
        const { fields, options } = contentOf(section);

        // O interruptor da seção é uma opção como as outras: se o template não a declara,
        // a seção não tem faixa para ligar.
        const toggle = def.options.find((option: Field) => option.key === section.toggle);

        // Seção que não tem controle nenhum nem interruptor não desenha. Sem isso, um
        // template que não usa o cabeçalho ganharia uma faixa vazia no formulário.
        if (toggle === undefined && fields.length === 0 && options.length === 0) {
          return null;
        }

        const on = toggle === undefined || slide.options[toggle.key] === true;
        const open = collapsed[section.key] !== true;

        return (
          <Section
            key={section.key}
            testId={section.key}
            title={section.label}
            open={open}
            onToggleOpen={() =>
              setCollapsed((state) => ({ ...state, [section.key]: !state[section.key] }))
            }
            toggle={
              toggle && {
                label: toggle.label,
                checked: on,
                onCheckedChange: (checked) => setOption(slide.id, toggle.key, checked),
              }
            }
          >
            {/* Faixa desligada não tem o que ajustar: a seção fica só com o cabeçalho, e é
                por ele que se liga de volta. O valor dos controles continua no slide. */}
            {on && (
              <>
                {fields.map((field: Field) => (
                  <FieldRow
                    key={field.key}
                    field={field}
                    value={slide.fields[field.key]}
                    onChange={(value) => setField(slide.id, field.key, value as FieldValue)}
                  />
                ))}

                {options.map((option: Field) => (
                  <FieldRow
                    key={option.key}
                    field={option}
                    value={slide.options[option.key]}
                    onChange={(value) => setOption(slide.id, option.key, value as OptionValue)}
                  />
                ))}
              </>
            )}
          </Section>
        );
      })}
    </div>
  );
}
