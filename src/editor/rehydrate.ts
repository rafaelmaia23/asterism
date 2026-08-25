/**
 * A validação do que volta do localStorage — tarefa 2.12, decisão 31 da §16.
 *
 * **Reidratar valida, e descarta slide a slide.** O que está salvo deixa de bater com o
 * código quando um template some, muda de chave ou muda de tipo — e num projeto de um
 * usuário só, o autor dessa divergência é sempre o commit anterior. Tudo-ou-nada apagaria
 * o carrossel inteiro por causa de um slide; confiar sem validar deixaria o `get()` do
 * registry lançar dentro do render e abriria a ferramenta em tela branca, com o erro só no
 * console.
 *
 * São duas perguntas por slide, e a segunda é de graça: o template ainda existe? e o
 * conteúdo passa no schema que **ele próprio** declara? Cada template já carrega o seu
 * desde a 1B, e é por isso que a decisão 31 custa vinte linhas em vez de uma tabela de
 * migração.
 *
 * Mora em `src/editor` e não em `src/deck` por duas razões: `src/deck/types.ts` não importa
 * nada, nem de biblioteca, e a validação por slide precisa do registry, que `src/deck` não
 * pode conhecer — a seta é `templates → deck`. Quando o import/export JSON da Etapa 4
 * chegar, ele encontra esta função pronta.
 */

import { z } from "zod";
import type { Deck, Slide } from "@/deck/types";
import { get } from "@/templates";

/**
 * A forma do `Deck` da §6, e só ela: `fields` e `options` ficam genéricos aqui porque
 * quem sabe o que cada slide deve conter é o schema do template dele.
 */
const deckSchema = z.object({
  version: z.literal(1),
  id: z.string(),
  title: z.string(),
  format: z.object({ w: z.number(), h: z.number() }),
  meta: z.object({
    handle: z.string(),
    pillar: z.enum(["api", "forge", "log"]),
  }),
  slides: z.array(
    z.object({
      id: z.string(),
      template: z.string(),
      fields: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
      options: z.record(z.string(), z.union([z.string(), z.boolean()])),
    }),
  ),
  assets: z.record(z.string(), z.string()),
});

/**
 * O slide continua desenhável? Template desconhecido faz o registry lançar, e é a única
 * exceção que se espera aqui — daí o `catch` em vez de um `has` no registry, que não
 * existe justamente porque nenhuma outra tela pergunta.
 */
function survives(slide: Slide): boolean {
  try {
    return get(slide.template).schema.safeParse({
      fields: slide.fields,
      options: slide.options,
    }).success;
  } catch {
    return false;
  }
}

/**
 * O deck que estava salvo, ou o `fallback` quando não dá para aproveitar nada.
 *
 * Devolve o `fallback` quando a forma do deck não bate e quando **nenhum** slide
 * sobrevive: o deck nunca fica sem slides (§11), porque deck vazio pediria um estado
 * vazio, que é da Etapa 5. Um deck que perde parte dos slides volta com o resto.
 */
export function reviveDeck(raw: unknown, fallback: Deck): Deck {
  const parsed = deckSchema.safeParse(raw);

  if (!parsed.success) {
    return fallback;
  }

  const slides = parsed.data.slides.filter(survives);

  if (slides.length === 0) {
    return fallback;
  }

  return { ...parsed.data, slides };
}
