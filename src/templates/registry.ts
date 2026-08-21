/**
 * O registry de templates. É por aqui que o resto do sistema descobre quais templates
 * existem — nunca por um `switch` sobre o id.
 *
 * A mecânica é a do `createRegistry` genérico de `src/lib/registry.ts`, compartilhada com
 * os alvos de exportação: ordem de inserção preservada, id desconhecido lança, e em
 * desenvolvimento registrar de novo substitui em vez de derrubar o `next dev`.
 *
 * Quem popula é `src/templates/index.ts`, o único módulo que importa template.
 */

import { createRegistry, type Registry } from "@/lib/registry";
import type { AnyTemplateDef } from "@/templates/types";

export type TemplateRegistry = Registry<AnyTemplateDef>;

export function createTemplateRegistry(): TemplateRegistry {
  return createRegistry<AnyTemplateDef>("Template");
}

const registry = createTemplateRegistry();

export const { register, get, list } = registry;
