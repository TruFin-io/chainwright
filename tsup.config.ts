import { defineConfig } from "tsup";

export default defineConfig({
    name: "chainwright",
    entry: ["src/cli/index.ts", "src/core/index.ts", "src/wallets/index.ts"],
    external: [
        "@inquirer/checkbox",
        "@playwright/test",
        "adm-zip",
        "cli-progress",
        "commander",
        "glob",
        "tsx",
        "zod",
    ],
    outDir: "dist",
    format: "esm",
    platform: "node",
    target: "es2024",
    sourcemap: false,
    clean: true,
    dts: true,
    splitting: false,
    bundle: true,
    shims: true,
    minify: true,
});
