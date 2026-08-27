/**
 * O arnês com que cada template prova que declarou a região do guard — a marca **⌐** da
 * §11.x dos templates.
 *
 * A asserção que importa não é "existe uma `div` com altura fixa": é que **engordar o
 * conteúdo daquela faixa marca o slide**. Sem isso, um template que esquecesse de pendurar
 * os dois refs passaria em qualquer teste de classe.
 *
 * `happy-dom` não faz layout, então as alturas saem do `stubLayout` — cada nó diz quanto
 * mede em `data-h` — e o observador é o `fakeResizeObserver`, que dispara quando o teste
 * mandar. Instale os dois **antes** do `render`, com `beforeAll`/`afterAll`.
 */

import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { act, render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import type { DeckMeta } from "@/deck/types";
import { OverflowScope, useOverflowScope } from "@/render/overflow";
import type { AnyTemplateDef } from "@/templates/types";
import { fakeResizeObserver, stubLayout } from "@/test/layout";

function Scope({ children }: { children: ReactElement }) {
  const { overflow, report } = useOverflowScope();

  return (
    <OverflowScope value={report}>
      <div data-testid="overflow-scope" data-overflow={overflow ? "true" : "false"}>
        {children}
      </div>
    </OverflowScope>
  );
}

export type GuardedRender = RenderResult & {
  /** Se algum guard dentro do escopo está reprovando agora. */
  overflowing: () => boolean;
};

export function renderGuarded(ui: ReactElement): GuardedRender {
  const result = render(<Scope>{ui}</Scope>);

  return {
    ...result,
    overflowing() {
      return result.getByTestId("overflow-scope").dataset.overflow === "true";
    },
  };
}

/**
 * Faz o conteúdo da faixa estourar: a faixa passa a medir `band`, o primeiro filho dela
 * — o bloco de conteúdo que o template pendurou no `content` do guard — passa a medir
 * mais que isso, e o observador dispara.
 */
export function overflowRegion(
  region: HTMLElement,
  flush: () => void,
  band = 800,
  content = 1200,
): void {
  const block = region.firstElementChild;

  if (!(block instanceof HTMLElement)) {
    throw new Error("A região guardada não tem bloco de conteúdo dentro");
  }

  region.dataset.h = String(band);
  block.dataset.h = String(content);

  // O disparo do observador leva a um `setState` no escopo, e fora de um evento do React
  // isso precisa de `act` — senão o aviso vira ruído em todo teste de template.
  act(() => {
    flush();
  });
}

const DECK: DeckMeta = { handle: "@rafael", pillar: "log" };

/**
 * O bloco de testes que todo template repete: **uma linha por template**, chamada no
 * `index.test.tsx` dele.
 *
 * É a convenção da §11.0 dos templates virada asserção. Um template que esquecesse de
 * pendurar os dois refs do guard passaria em qualquer teste de classe ou de texto, e só
 * seria descoberto com um slide transbordando em silêncio no carrossel publicado.
 *
 * `regions` é quantas faixas o template marca com ⌐ — hoje todos marcam uma; o
 * `code-annotated` da 3E marcará duas.
 */
export function describeGuardedRegion(template: AnyTemplateDef, regions = 1): void {
  describe("a região que o guard mede — a marca ⌐ da §11.x", () => {
    let layout: () => void;
    let observer: ReturnType<typeof fakeResizeObserver>;

    beforeAll(() => {
      layout = stubLayout();
      observer = fakeResizeObserver();
    });

    afterAll(() => {
      observer.restore();
      layout();
    });

    function renderTemplate() {
      const { Component, defaults } = template;

      return renderGuarded(
        <Component
          fields={defaults.fields}
          options={defaults.options}
          deck={DECK}
          index={0}
          total={8}
        />,
      );
    }

    function bands(container: HTMLElement) {
      return [...container.querySelectorAll<HTMLElement>("[data-guarded]")];
    }

    test(`declara ${regions} região guardada`, () => {
      const { container } = renderTemplate();

      expect(bands(container)).toHaveLength(regions);
    });

    test("a faixa medida tem altura de faixa, e não do que ela contém — §13", () => {
      const { container } = renderTemplate();

      for (const band of bands(container)) {
        expect(band.className).toMatch(/(^|\s)h-\[\d+px\]/);
      }
    });

    test("com o conteúdo dos defaults o slide não transborda", () => {
      const view = renderTemplate();

      expect(view.overflowing()).toBe(false);
    });

    test("conteúdo maior que a faixa marca o slide", () => {
      const view = renderTemplate();

      for (const band of bands(view.container)) {
        overflowRegion(band, observer.flush);
        expect(view.overflowing()).toBe(true);

        // Devolve a faixa ao normal antes da próxima, para que cada uma responda por si.
        overflowRegion(band, observer.flush, 800, 400);
        expect(view.overflowing()).toBe(false);
      }
    });
  });
}
