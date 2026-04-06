import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    test: {
        globals: true,
        include: ["src/**/*.spec.ts"],
        exclude: ["node_modules", "dist"],
        sequence: {
            concurrent: false,
        },
    },
    plugins: [
        tsConfigPaths(),
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
})