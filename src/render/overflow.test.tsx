import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  OverflowScope,
  overflowsRegion,
  useOverflowGuard,
  useOverflowScope,
} from "@/render/overflow";
import { stubLayout } from "@/test/layout";

let restore: () => void;

beforeAll(() => {
  restore = stubLayout();
});

afterAll(() => {
  restore();
});

/** Uma região com um bloco de conteúdo dentro, cada um com a altura que o caso pedir. */
function Guarded({ band, content }: { band: number; content: number }) {
  // Desestruturado, e não `guard.region` no JSX: a regra `react-hooks/refs` recusa acesso
  // a membro de um valor de ref durante o render.
  const { region, content: block } = useOverflowGuard();

  return (
    <div ref={region} data-h={band}>
      <p ref={block} data-h={content}>
        conteúdo
      </p>
    </div>
  );
}

function Scope({
  children,
  onOverflow,
}: {
  children?: React.ReactNode;
  onOverflow?: (over: boolean) => void;
}) {
  const { overflow, report } = useOverflowScope(onOverflow);

  return (
    <OverflowScope value={report}>
      <div data-testid="scope" data-overflow={overflow ? "true" : "false"}>
        {children}
      </div>
    </OverflowScope>
  );
}

function marked() {
  return screen.getByTestId("scope").dataset.overflow;
}

describe("overflowsRegion", () => {
  test("conteúdo mais alto que a faixa transborda", () => {
    expect(overflowsRegion(900, 866)).toBe(true);
  });

  test("conteúdo do tamanho exato da faixa não transborda", () => {
    expect(overflowsRegion(866, 866)).toBe(false);
  });

  test("conteúdo mais baixo que a faixa não transborda", () => {
    expect(overflowsRegion(624, 866)).toBe(false);
  });

  test("faixa ainda não medida não reprova nada — 0 é 'não sei', não 'transbordou'", () => {
    expect(overflowsRegion(900, 0)).toBe(false);
    expect(overflowsRegion(0, 0)).toBe(false);
  });
});

describe("useOverflowGuard", () => {
  test("conteúdo que cabe deixa o escopo limpo", () => {
    render(
      <Scope>
        <Guarded band={866} content={624} />
      </Scope>,
    );

    expect(marked()).toBe("false");
  });

  test("conteúdo que estoura a faixa marca o escopo", () => {
    render(
      <Scope>
        <Guarded band={866} content={1040} />
      </Scope>,
    );

    expect(marked()).toBe("true");
  });

  test("duas regiões guardadas: uma que estoura basta", () => {
    render(
      <Scope>
        <Guarded band={532} content={400} />
        <Guarded band={270} content={330} />
      </Scope>,
    );

    expect(marked()).toBe("true");
  });

  test("a região que sai de cena devolve o escopo ao normal", () => {
    const { rerender } = render(
      <Scope>
        <Guarded band={866} content={1040} />
      </Scope>,
    );

    expect(marked()).toBe("true");

    // Trocar o layout do slide desmonta a região guardada do template anterior. Sem o
    // reporte de `false` na limpeza, a marca ficaria pendurada no escopo.
    rerender(<Scope />);

    expect(marked()).toBe("false");
  });

  test("avisa quem montou o escopo, que é como a lista lateral fica sabendo", () => {
    const onOverflow = vi.fn();

    render(
      <Scope onOverflow={onOverflow}>
        <Guarded band={866} content={1040} />
      </Scope>,
    );

    expect(onOverflow).toHaveBeenCalledWith(true);
  });

  test("um guard sem escopo em volta não quebra — o palco de exportação não mede nada", () => {
    expect(() => render(<Guarded band={866} content={1040} />)).not.toThrow();
  });
});
