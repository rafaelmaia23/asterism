import { describe, expect, test } from "vitest";
import type { Field } from "@/templates/types";

/**
 * Quem verifica o critério de pronto da tarefa 1.4 é o `tsc`, não a asserção: o valor
 * está em o arquivo compilar com um literal de cada variante. A asserção existe para
 * que a suíte falhe se um tipo sumir da união e alguém apagar o literal órfão junto.
 */
describe("Field", () => {
  test("os sete tipos de descritor aceitam um literal cada", () => {
    const fields: Field[] = [
      { key: "kicker", type: "text", label: "Kicker", max: 12, placeholder: "api/ · 04" },
      { key: "heading", type: "textarea", label: "Título", max: 70, md: true, rows: 3 },
      { key: "items", type: "list", label: "Itens", maxItems: 4, maxPerItem: 90, md: true },
      { key: "image", type: "image", label: "Imagem", ratio: "4/3" },
      { key: "code", type: "code", label: "Código", maxLines: 14 },
      {
        key: "anchor",
        type: "select",
        label: "Ancoragem",
        options: [
          { value: "top", label: "Topo" },
          { value: "center", label: "Centro" },
        ],
      },
      { key: "showChevron", type: "toggle", label: "Afordância de deslize" },
    ];

    expect(new Set(fields.map((field) => field.type)).size).toBe(7);
  });
});
