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
