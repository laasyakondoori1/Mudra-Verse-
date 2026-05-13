/**
 * Vite config for Vercel SPA deployment.
 * No Cloudflare plugin, no TanStack Start SSR — pure client-side SPA.
 * The routeTree.gen.ts is already generated, so we don't need the router plugin.
 * Build: vite build --config vite.config.spa.ts
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    react(),
  ],
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/react-router"],
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
