import react from "@vitejs/plugin-react";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" },
    }),
    react(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@core": new URL("./core", import.meta.url).pathname,
      "@app": new URL("./app", import.meta.url).pathname,
      "@features": new URL("./features", import.meta.url).pathname,
    },
  },
});
