/**
 * As quatro operações de um campo `list` — a lógica que o controle do inspector aciona.
 *
 * Funções puras sobre `string[]`, sem React e sem store: o campo `items` é um valor do
 * modelo (§6 do documento de contexto), e o controle só troca o array inteiro por
 * `setField`. Separar assim é o que deixa a regra ser testada primeiro — reordenação e
 * teto são lógica, e o CLAUDE.md manda TDD em lógica.
 *
 * **Nenhuma delas muta a entrada.** O store preserva a referência dos slides que não
 * mudaram, e é isso que faz o `memo` da lista lateral pular a re-renderização do deck
 * inteiro a cada tecla. Uma função que mutasse o array aqui devolveria a mesma referência
 * ao React, que não veria mudança nenhuma.
 *
 * O teto é `maxItems`, do descritor. Ao contrário do limite de caracteres da §11.0 dos
 * templates — que é conselho, e quem reprova é o guard —, este é trava: acrescentar um
 * quinto tópico não é texto longo demais, é uma lista que o template não desenha.
 */

/** Troca o texto de um item. Posição fora da lista não muda nada. */
export function setItem(items: string[], at: number, value: string): string[] {
  const next = [...items];

  if (at >= 0 && at < next.length) {
    next[at] = value;
  }

  return next;
}

/** Acrescenta um item vazio no fim, se ainda couber. */
export function addItem(items: string[], maxItems: number): string[] {
  if (items.length >= maxItems) {
    return [...items];
  }

  return [...items, ""];
}

/**
 * Tira o item da posição. Esvaziar a lista é permitido: o botão de acrescentar é o
 * caminho de volta, e uma lista vazia é estado legítimo enquanto se recompõe o slide.
 */
export function removeItem(items: string[], at: number): string[] {
  return items.filter((_, position) => position !== at);
}

/** Sobe (`-1`) ou desce (`1`) um item. Nas pontas não faz nada. */
export function moveItem(items: string[], at: number, by: -1 | 1): string[] {
  const to = at + by;
  const next = [...items];

  if (at < 0 || at >= next.length || to < 0 || to >= next.length) {
    return next;
  }

  [next[at], next[to]] = [next[to], next[at]];

  return next;
}
