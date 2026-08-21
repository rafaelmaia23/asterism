/**
 * O modelo de dados da §6 do documento de contexto. Este módulo não importa nada — nem
 * do projeto, nem de biblioteca. A seta é `templates → deck`: quem conhece a biblioteca
 * de templates é o registry, nunca o contrário.
 */

export type SlideId = string;
export type ImageId = string;

/**
 * Identificador de template, opaco de propósito. Uma união literal dos dez ids faria o
 * modelo de dados conhecer a biblioteca de templates e obrigaria a editá-lo a cada
 * template novo. Id desconhecido é erro de runtime, e quem o lança é o registry.
 */
export type TemplateId = string;

/** Conteúdo: `text`, `textarea`, `code` e `image` guardam string; `list` guarda array. */
export type FieldValue = string | string[];

/** Apresentação: `select` guarda string, `toggle` guarda booleano. */
export type OptionValue = string | boolean;

export type Pillar = "api" | "forge" | "log";

/** O que um template recebe do deck. O mínimo: o resto sai dos seus próprios campos. */
export type DeckMeta = {
  handle: string; // "@rafael", vai no rodapé
  pillar: Pillar;
};

/**
 * A forma mínima que `createSlide` precisa de um template. Declarada aqui, e não em
 * `src/templates`, justamente para que `src/deck` não importe o registry — o
 * `TemplateDef` é que será atribuível a ela.
 */
export type SlideDefaults = {
  fields: Record<string, FieldValue>;
  options: Record<string, OptionValue>;
};

export type Slide = {
  id: SlideId;
  template: TemplateId;
} & SlideDefaults;

export type Deck = {
  version: 1;
  id: string;
  title: string;
  format: { w: number; h: number }; // dado, não constante — ver §12
  meta: DeckMeta;
  slides: Slide[];
  assets: Record<ImageId, string>; // base64, apenas no arquivo exportado
};
