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
      "@": "./",
      "@features": "./features",
    },
  },
});
