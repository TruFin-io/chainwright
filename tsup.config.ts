import { defineConfig } from "tsup";

export default defineConfig({
    name: "chainwright",
    entry: ["src/cli/index.ts", "src/core/index.ts", "src/wallets/index.ts"],
    external: ["@playwright/test", "zod"],
    outDir: "dist",
    format: "esm",
    target: "es2024",
    sourcemap: false,
    clean: true,
    dts: true,
    splitting: false,
    bundle: true,
    minify: true,
});
