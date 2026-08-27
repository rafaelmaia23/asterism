/**
 * O teste que faz "gerado dos tokens" ser verificável.
 *
 * A §10.4 do design system diz que o tema do shiki é **gerado a partir dos tokens do
 * Observatório, não importado pronto** — senão o bloco de código é a única coisa do
 * carrossel que não parece do sistema. Escrever os hex à mão num módulo satisfaz a letra
 * e não a regra: no dia em que um degrau da rampa mudar no `globals.css`, o tema fica para
 * trás em silêncio, e o defeito aparece num PDF meses depois.
 *
 * Então a asserção é contra a **fonte**: cada cor da paleta é lida do `globals.css` e
 * comparada com a que o módulo publica. É o mesmo espírito do teste de paridade
 * descritor↔defaults de cada template — duas descrições da mesma coisa, e o teste é quem
 * garante que não divirjam.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PALETTE, observatorio, type CodeRole } from "@/code/theme";

// O caminho sai da raiz do projeto, e não de `import.meta.url`: sob `happy-dom` a URL do
// módulo é `http:`, e `fileURLToPath` recusa. O vitest roda com a raiz como cwd.
const CSS = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

/** O valor declarado para uma variável no bloco `@theme static` do Observatório. */
function declared(variable: string): string | undefined {
  return new RegExp(`^\\s*${variable}:\\s*(#[0-9a-f]{3,8});`, "m").exec(CSS)?.[1];
}

const roles = Object.keys(PALETTE) as CodeRole[];

describe("a paleta sai dos tokens do Observatório", () => {
  test.each(roles)("%s tem a cor que o globals.css declara", (role) => {
    const { token, hex } = PALETTE[role];

    expect(declared(token)).toBe(hex);
  });

  test("os dez papéis da §10.4 estão declarados", () => {
    expect(roles).toHaveLength(10);
  });
});

describe("o tema do shiki", () => {
  test("é escuro e usa o fundo da janela da §10.3", () => {
    expect(observatorio.type).toBe("dark");
    expect(observatorio.bg).toBe(declared("--color-slide-raised"));
    expect(observatorio.fg).toBe(PALETTE.base.hex);
  });

  test("não pinta nenhum escopo com cor de fora da paleta", () => {
    const allowed = new Set(roles.map((role) => PALETTE[role].hex));

    for (const setting of observatorio.settings ?? []) {
      const foreground = setting.settings.foreground;

      if (foreground !== undefined) {
        expect(allowed).toContain(foreground);
      }
    }
  });

  test("o comentário é o único itálico — §10.4", () => {
    const italic = (observatorio.settings ?? []).filter(
      (setting) => setting.settings.fontStyle === "italic",
    );

    expect(italic).toHaveLength(1);
    expect(italic[0].settings.foreground).toBe(PALETTE.comment.hex);
  });

  test("nenhum escopo é declarado duas vezes", () => {
    const scopes = (observatorio.settings ?? []).flatMap((setting) =>
      typeof setting.scope === "string" ? [setting.scope] : (setting.scope ?? []),
    );

    expect(new Set(scopes).size).toBe(scopes.length);
  });
});
