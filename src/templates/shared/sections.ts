/**
 * As seções do inspector, e a ordem em que ele as desenha.
 *
 * A ordem é a **vertical do slide**: cabeçalho, conteúdo, rodapé, e depois o que não é
 * nenhuma faixa. É a mesma leitura que a §11.0 dos templates já usava para ordenar as
 * opções compartilhadas, aplicada um nível acima — quem edita procura o controle onde a
 * coisa está no slide, não onde ela está no modelo de dados.
 *
 * **Conteúdo e Apresentação são seções como as outras**, só que sem interruptor. É o que
 * torna a ordem declarativa: sem isso o inspector teria de intercalar duas seções fixas
 * entre as declaradas, e a posição do Cabeçalho — acima do conteúdo, como no slide —
 * viraria uma regra escrita no componente em vez de no descritor.
 *
 * Campo sem `section` cai em `content`, opção sem `section` cai em `style`. É por isso que
 * nenhum descritor de template existente precisou ser editado quando as seções chegaram:
 * só o que muda de lugar declara onde fica.
 *
 * Um template pode acrescentar seção própria depois das quatro, como já acrescenta opção
 * própria depois das compartilhadas. Nenhum dos três precisou até agora.
 */

import type { FieldSection } from "@/templates/types";

export const sharedSections: FieldSection[] = [
  { key: "header", label: "Cabeçalho", toggle: "showHeader" },
  { key: "content", label: "Conteúdo" },
  { key: "footer", label: "Rodapé", toggle: "showFooter" },
  { key: "style", label: "Apresentação" },
];
