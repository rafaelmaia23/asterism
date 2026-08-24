import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MaiahubGlyph } from "@/components/maiahub";

// Sentinel: guards the test setup itself. Rendering this component exercises the JSX
// transform, the happy-dom environment, the Testing Library queries and the "@/" alias
// at once — the glyph imports "@/lib/utils". If it breaks, suspect vitest.config.mts
// before suspecting the component.
test("renders the glyph as a labelled image", () => {
  render(<MaiahubGlyph />);

  expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
});

// A correção ótica do experimento 5, presa em teste porque é fácil de desfazer sem
// perceber: traço 2.25 em opacidade cheia, no viewBox de 32, dá 2,25px a 32px de exibição
// — a mesma espessura declarada do chevron ao lado. O desenho anterior tinha 1.6 a 55% e
// desaparecia no rodapé. Ver docs/maiahub-logo.md.
test("keeps the optical correction: full-opacity 2.25 stroke", () => {
  const { container } = render(<MaiahubGlyph />);
  const path = container.querySelector("path");

  expect(path?.getAttribute("stroke-width")).toBe("2.25");
  expect(path?.getAttribute("class")).toBe("stroke-current");
});
