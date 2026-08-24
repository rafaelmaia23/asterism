/**
 * Opções que qualquer template expõe — as partes do rodapé e a grade de fundo.
 *
 * Todas seguem a mesma forma, que é a da **decisão 25** da §16 do documento de contexto:
 * o descritor do template diz com o que o slide **nasce**, e a opção manda daí em diante.
 * Nada aqui é fixo por template; o que era regra virou padrão.
 *
 * A grade foi a primeira a fazer esse caminho. As cinco do rodapé vieram atrás, na 2B: a
 * §10.5 do design system prendia a identidade a "todos os slides exceto a capa" e o
 * chevron a "somente a capa", e as duas frases viraram o **padrão** de cada descritor. A
 * régua e o fundo da logo nasceram já assim, no experimento 5.
 *
 * Os descritores moram aqui, e não copiados em cada `fields.ts`, porque é o mesmo campo
 * nos dez templates: declarado à mão em cada um, o rótulo divergiria no terceiro.
 *
 * A constelação é a única peça da faixa sem opção — progresso é o que o rodapé é, e um
 * rodapé sem ele não seria um rodapé mais enxuto, seria outra coisa.
 */

import type { Field } from "@/templates/types";

export const showGridOption: Field = {
  key: "showGrid",
  type: "toggle",
  label: "Grade de fundo",
};

export const showRuleOption: Field = {
  key: "showRule",
  type: "toggle",
  label: "Régua acima do rodapé",
};

export const showLogoOption: Field = {
  key: "showLogo",
  type: "toggle",
  label: "Logo no rodapé",
};

export const showLogoPlateOption: Field = {
  key: "showLogoPlate",
  type: "toggle",
  label: "Fundo da logo",
};

export const showHandleOption: Field = {
  key: "showHandle",
  type: "toggle",
  label: "@handle no rodapé",
};

export const showChevronOption: Field = {
  key: "showChevron",
  type: "toggle",
  label: "Afordância de deslize",
};

/**
 * A ordem em que as seis aparecem na seção "Apresentação" do inspector. Um template as
 * espalha com `...sharedOptions` e acrescenta as próprias depois.
 *
 * A ordem é a de leitura da faixa, de fora para dentro: o fundo do slide, a régua que o
 * separa do rodapé, a identidade — logo, o fundo dela, handle — e por fim a seta. A §11.0
 * dos templates pede a grade primeiro, e o resto segue a geometria.
 */
export const sharedOptions: Field[] = [
  showGridOption,
  showRuleOption,
  showLogoOption,
  showLogoPlateOption,
  showHandleOption,
  showChevronOption,
];
