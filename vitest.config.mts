import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Follows the Next.js guide in
// node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md, with two changes:
// happy-dom instead of jsdom, and no @vitejs/plugin-react. The plugin only adds Fast
// Refresh and Babel hooks, neither of which a test run uses, and its Babel 8 toolchain
// conflicts with the Babel 7 that shadcn already pins. JSX is transformed straight from
// the tsconfig's "jsx": "react-jsx".
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
