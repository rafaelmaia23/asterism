import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Testing Library only auto-cleans when Vitest runs with globals enabled, and this
// project keeps the explicit imports the Next guide uses. Unmounting by hand here keeps
// one test's DOM out of the next one.
afterEach(cleanup);
