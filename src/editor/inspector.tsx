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
 * Duas seções, porque o modelo tem duas — §6: **Conteúdo** escreve em `fields` e
 * **Apresentação** em `options`. Ao trocar de layout, um migra e o outro reseta, e essa
 * regra só existe enquanto os dois não se misturarem.
 *
 * O store chega por prop, com o singleton como padrão. É o que deixa o teste montar um
 * deck de fixture — inclusive com um template que só existe no teste — sem estado global
 * atravessando de um caso para o outro.
 */

import { useId } from "react";
import type { StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import type { FieldValue, OptionValue } from "@/deck/types";
import { editorStore, selectActiveSlide, type EditorState } from "@/editor/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { get } from "@/templates/registry";
import type { Field } from "@/templates/types";

export type InspectorProps = {
  store?: StoreApi<EditorState>;
};

/**
 * O contador da §11.0 dos templates: o limite é **conselho**, não trava. O campo aceita
 * mais, o contador fica âmbar, e quem reprova de fato é o guard de transbordo, medindo
 * altura real. Por isso nenhum controle aqui recebe `maxLength`.
 */
function Counter({ field, value }: { field: Field; value: string }) {
  if (!("max" in field) || field.max === undefined) {
    return null;
  }

  const over = value.length > field.max;

  return (
    <span
      data-testid={`counter-${field.key}`}
      className={`font-mono text-xs font-medium tracking-[0.08em] tabular-nums ${
        over ? "text-warning" : "text-ink-500"
      }`}
    >
      {value.length}/{field.max}
    </span>
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

  return (
    <div data-testid={`field-${field.key}`} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm text-ink-300">
          {field.label}
        </label>
        <Counter field={field} value={text} />
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

      {/* Tipo ainda sem controle — `list`, `image`, `code`, `select`. Aparece assim
          mesmo: pular em silêncio faria um campo novo sumir do formulário sem aviso. */}
      {field.type !== "text" && field.type !== "textarea" && (
        <span className="text-sm text-ink-600">Ainda não editável aqui</span>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-mono text-xs font-medium tracking-[0.08em] text-ink-500 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Inspector({ store = editorStore }: InspectorProps) {
  const slide = useStore(store, selectActiveSlide);
  const setField = useStore(store, (state) => state.setField);
  const setOption = useStore(store, (state) => state.setOption);

  const def = get(slide.template);

  return (
    <div className="flex flex-col gap-8 p-4">
      <Section title="Conteúdo">
        {def.fields.map((field: Field) => (
          <FieldRow
            key={field.key}
            field={field}
            value={slide.fields[field.key]}
            onChange={(value) => setField(slide.id, field.key, value as FieldValue)}
          />
        ))}
      </Section>

      {def.options.length > 0 && (
        <Section title="Apresentação">
          {def.options.map((option: Field) => (
            <FieldRow
              key={option.key}
              field={option}
              value={slide.options[option.key]}
              onChange={(value) => setOption(slide.id, option.key, value as OptionValue)}
            />
          ))}
        </Section>
      )}
    </div>
  );
}
