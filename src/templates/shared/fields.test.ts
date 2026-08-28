import { describe, expect, test } from "vitest";
import { LANG_IDS } from "@/code/langs";
import { codeFields, codeField, fileField, kickerField, langField, sharedFields } from "@/templates/shared/fields";
import { fields as coverFields } from "@/templates/cover-statement/fields";
import { fields as bulletsFields } from "@/templates/text-bullets/fields";
import { fields as finalFields } from "@/templates/final-cta/fields";
import { fields as codeWindowFields } from "@/templates/code-window/fields";

/**
 * O simétrico de `shared/options.ts`, e pelo mesmo argumento: é o mesmo campo nos dez
 * templates, e declarado à mão em cada um o rótulo divergiria no terceiro. O teste guarda
 * isso por **identidade de objeto** — um template que reescrever o próprio descritor com as
 * mesmas propriedades reprova, que é o ponto.
 */
describe("campos compartilhados do slide", () => {
  test("o kicker é texto literal, com o limite e o exemplo da §11.1", () => {
    expect(kickerField).toMatchObject({
      key: "kicker",
      type: "text",
      label: "Kicker",
      max: 12,
      placeholder: "api/ · 04",
      section: "header",
    });
  });

  /** Decisão 14: o kicker é digitado, não derivado de `meta.pillar` com a posição. */
  test("o kicker não aceita marcação", () => {
    expect(kickerField).not.toHaveProperty("md", true);
  });

  test("todo template expõe o kicker, e o mesmo objeto", () => {
    for (const fields of [coverFields, bulletsFields, finalFields]) {
      expect(fields).toContain(kickerField);
    }
  });

  /** O cabeçalho é a primeira faixa do slide, e abre a lista de campos. */
  test("o kicker vem primeiro em todo template", () => {
    for (const fields of [coverFields, bulletsFields, finalFields]) {
      expect(fields[0]).toBe(kickerField);
    }
  });

  test("`sharedFields` é a lista dos compartilhados", () => {
    expect(sharedFields).toEqual([kickerField]);
  });
});

/**
 * Os três descritores do bloco de código, o segundo caso do argumento do `kickerField`.
 *
 * A §6 do documento de contexto não pede só que `code`, `file` e `lang` tenham o mesmo
 * **papel** nos dois templates de código: pede que tenham a mesma **forma**, porque a
 * migração compara as duas coisas e uma chave cuja forma não bate fica com o default do
 * destino. E a própria §6 diz como se cumpre a promessa — "um descritor compartilhado é o
 * que faz a promessa ser verdadeira em vez de disciplina".
 *
 * Por isso o teste é de **identidade de objeto**: dois descritores com as mesmas
 * propriedades escritos em dois arquivos passam num `toMatchObject` e divergem no dia em
 * que um dos dois mudar. É o mesmo formato do teste do kicker, pelo mesmo motivo.
 */
describe("os campos do bloco de código", () => {
  test("file é texto literal de 40, com o exemplo da §11.6", () => {
    expect(fileField).toMatchObject({
      key: "file",
      type: "text",
      label: "Arquivo",
      max: 40,
      placeholder: "cache.ts",
    });
    expect(fileField).not.toHaveProperty("md", true);
  });

  /**
   * As opções saem do **bundle**, não de uma lista escrita à mão: é o que impede o
   * formulário de oferecer uma linguagem que o realçador não tem, e o sintoma disso seria
   * um slide sem cor.
   */
  test("lang oferece exatamente as linguagens que o bundle carregou", () => {
    expect(langField).toMatchObject({ key: "lang", type: "select", label: "Linguagem" });
    expect(langField.type === "select" && langField.options.map((option) => option.value)).toEqual([
      ...LANG_IDS,
    ]);
  });

  /** O teto de 14 linhas é o da §10.3 do design system, e é conselho: quem reprova é o guard. */
  test("code é o tipo `code`, com o teto de 14 linhas", () => {
    expect(codeField).toMatchObject({
      key: "code",
      type: "code",
      label: "Código",
      maxLines: 14,
    });
  });

  test("`codeFields` é a lista dos três, na ordem da §11.6", () => {
    expect(codeFields).toEqual([fileField, langField, codeField]);
  });

  test("o `code-window` expõe os três objetos compartilhados, não cópias", () => {
    for (const field of codeFields) {
      expect(codeWindowFields).toContain(field);
    }
  });
});
