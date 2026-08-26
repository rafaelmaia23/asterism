/**
 * Opções que qualquer template expõe — as duas faixas do slide, suas partes e a grade.
 *
 * Todas seguem a mesma forma, que é a da **decisão 25** da §16 do documento de contexto:
 * o descritor do template diz com o que o slide **nasce**, e a opção manda daí em diante.
 * Nada aqui é fixo por template; o que era regra virou padrão.
 *
 * A grade foi a primeira a fazer esse caminho. As cinco do rodapé vieram atrás, na 2B: a
 * §10.5 do design system prendia a identidade a "todos os slides exceto a capa" e o
 * chevron a "somente a capa", e as duas frases viraram o **padrão** de cada descritor. A
 * régua e o fundo da logo nasceram já assim, no experimento 5. O `showHeader` fechou o
 * conjunto na 2F, e com ele a última frase presa a um template: o kicker deixou de ser
 * coisa de capa e virou a faixa que qualquer slide pode ligar.
 *
 * Os descritores moram aqui, e não copiados em cada `fields.ts`, porque é o mesmo campo
 * nos dez templates: declarado à mão em cada um, o rótulo divergiria no terceiro.
 *
 * ## Dois níveis, e só dois
 *
 * `showHeader` e `showFooter` são interruptores **de faixa**: desligados, a faixa inteira
 * some. As cinco peças do rodapé são sub-opções dele — `section: "footer"` —, e o inspector as
 * desenha dentro da seção e só com a faixa ligada. É a diferença entre "quero o rodapé
 * sem handle" e "não quero rodapé".
 *
 * A constelação continua sem opção própria — progresso é o que o rodapé é, e um rodapé sem
 * ele não seria um rodapé mais enxuto, seria outra coisa. Quem a tira é quem tira a faixa
 * toda, que é a única leitura em que ela não contradiz nada.
 *
 * A grade fica de fora das duas seções: é o fundo do slide, não peça de faixa nenhuma.
 */

import type { Field } from "@/templates/types";

export const showGridOption: Field = {
  key: "showGrid",
  type: "toggle",
  label: "Grade de fundo",
};

export const showHeaderOption: Field = {
  key: "showHeader",
  type: "toggle",
  label: "Cabeçalho",
};

export const showFooterOption: Field = {
  key: "showFooter",
  type: "toggle",
  label: "Rodapé",
};

export const showRuleOption: Field = {
  key: "showRule",
  type: "toggle",
  label: "Régua acima do rodapé",
  section: "footer",
};

export const showLogoOption: Field = {
  key: "showLogo",
  type: "toggle",
  label: "Logo no rodapé",
  section: "footer",
};

export const showLogoPlateOption: Field = {
  key: "showLogoPlate",
  type: "toggle",
  label: "Fundo da logo",
  section: "footer",
};

export const showHandleOption: Field = {
  key: "showHandle",
  type: "toggle",
  label: "@handle no rodapé",
  section: "footer",
};

export const showChevronOption: Field = {
  key: "showChevron",
  type: "toggle",
  label: "Afordância de deslize",
  section: "footer",
};

/**
 * A ordem em que as oito aparecem no inspector. Um template as espalha com
 * `...sharedOptions` e acrescenta as próprias depois.
 *
 * A ordem é a de leitura vertical do slide, e dentro do rodapé a da faixa de fora para
 * dentro: o fundo do slide, o cabeçalho, o rodapé inteiro, a régua que o separa do
 * conteúdo, a identidade — logo, o fundo dela, handle — e por fim a seta. A §11.0 dos
 * templates pede a grade primeiro, e o resto segue a geometria.
 */
export const sharedOptions: Field[] = [
  showGridOption,
  showHeaderOption,
  showFooterOption,
  showRuleOption,
  showLogoOption,
  showLogoPlateOption,
  showHandleOption,
  showChevronOption,
];
