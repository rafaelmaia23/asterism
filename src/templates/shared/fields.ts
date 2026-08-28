/**
 * Campos que mais de um template expõe: o kicker, que os dez declaram, e os três do bloco
 * de código, que os dois templates de código declaram idênticos.
 *
 * O simétrico de `shared/options.ts`, e pelo mesmo argumento: é o mesmo campo nos dez
 * templates, e declarado à mão em cada um o rótulo divergiria no terceiro.
 *
 * O kicker morava no `cover-statement`, que era o único template a declará-lo. Isso tinha
 * duas consequências que só apareceram com o deck de doze slides da 2E: nenhum slide de
 * miolo podia ter etiqueta superior, e sair da capa **descartava** o kicker digitado — a
 * migração da 2.10 é uma interseção de chaves, e uma chave que só um lado declara não
 * atravessa. Compartilhado, ele migra de graça, que é exatamente o que a decisão 13 comprou.
 *
 * É a mesma forma da decisão 25 aplicada ao topo do slide: o descritor do template diz com
 * o que o slide **nasce** — e só a capa nasce com o cabeçalho ligado —, e a opção manda daí
 * em diante. O que era regra ("kicker é coisa de capa") virou padrão.
 *
 * O `section` é metadado de desenho: põe o campo na seção "Cabeçalho" do inspector, junto
 * do interruptor que o liga. O valor continua morando em `fields`, que é conteúdo — ver a
 * §6 do documento de contexto e o `Grouped` de `types.ts`.
 */

import { LANG_IDS } from "@/code/langs";
import type { Field } from "@/templates/types";

/** Decisão 14: texto digitado e literal, nunca derivado de `meta.pillar` com a posição. */
export const kickerField: Field = {
  key: "kicker",
  type: "text",
  label: "Kicker",
  max: 12,
  placeholder: "api/ · 04",
  section: "header",
};

/** Um template os espalha com `...sharedFields` e acrescenta os próprios depois. */
export const sharedFields: Field[] = [kickerField];

/**
 * Os três do bloco de código — `code-window` da §11.6 e `code-annotated` da §11.7.
 *
 * Sobem para cá pelo argumento que a §6 do documento de contexto escreve para as chaves
 * seguintes do vocabulário: a promessa é de papel **e de forma**, porque `migrateFields`
 * compara as duas, e "um descritor compartilhado é o que faz a promessa ser verdadeira em
 * vez de disciplina". Declarados à mão nos dois templates, os três passariam num teste de
 * propriedade e divergiriam no dia em que um limite mudasse num só — e o sintoma seria o
 * pior da ferramenta: trocar o layout de um slide de código e perder o código.
 *
 * `heading` **não** subiu junto, apesar de os dois o declararem com os mesmos 60: o limite
 * acompanha a região e a região é do template — 70 na capa em 96px, 60 aqui em 56px. O que
 * é comum nos dez é o rótulo, e não o descritor.
 */

/**
 * Os rótulos do select saem do **bundle**, não de uma lista escrita à mão.
 *
 * É o que impede o formulário de oferecer uma linguagem que o realçador não tem: a §11.6
 * escreve a lista, o `langs.ts` a materializa em gramática, e o `map` abaixo garante que o
 * controle mostre exatamente o que foi carregado. Uma lista paralela divergiria no dia em
 * que uma linguagem entrasse ou saísse do bundle, e o sintoma seria um slide sem cor.
 */
const LANG_LABELS: Record<(typeof LANG_IDS)[number], string> = {
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  json: "JSON",
  bash: "Shell",
  sql: "SQL",
  css: "CSS",
  python: "Python",
  text: "Texto puro",
};

/** O nome na barra da janela. Literal por natureza: é um identificador, não prosa. */
export const fileField: Field = {
  key: "file",
  type: "text",
  label: "Arquivo",
  max: 40,
  placeholder: "cache.ts",
};

export const langField: Field = {
  key: "lang",
  type: "select",
  label: "Linguagem",
  options: LANG_IDS.map((id) => ({ value: id, label: LANG_LABELS[id] })),
};

/**
 * O teto de 14 linhas é o da §10.3 do design system, e ele não foi escolhido duas vezes: a
 * região de 866px menos os 92 da barra e os 32 do padding de baixo deixa 742px, que a 51px
 * por linha dão exatamente 14. O contador fica âmbar acima disso e não trava — quem reprova
 * é o guard, medindo altura. No `code-annotated` o guard reprova bem antes dele, e é assim
 * que deve ser: limite é estático, e é conselho.
 */
export const codeField: Field = {
  key: "code",
  type: "code",
  label: "Código",
  maxLines: 14,
};

/** Um template de código os espalha com `...codeFields`, na ordem das §11.6 e §11.7. */
export const codeFields: Field[] = [fileField, langField, codeField];
