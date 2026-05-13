// On Cloudflare Pages: uses TanStack Start SSR + Cloudflare Worker build
// On Vercel: VERCEL=1 is set automatically → pure SPA build with index.html
//
// @lovable.dev/vite-tanstack-config already includes:
//   tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only)
// Do NOT add those manually — they would duplicate.

import { defineConfig as lovableDefineConfig } from "@lovable.dev/vite-tanstack-config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

const isVercel = process.env.VERCEL === "1";

export default isVercel
  ? // ─── Vercel SPA build ────────────────────────────────────────────────────
    defineConfig({
      plugins: [
        tailwindcss(),
        tsConfigPaths({ projects: ["./tsconfig.json"] }),
        react(),
      ],
      resolve: {
        alias: { "@": `${process.cwd()}/src` },
        dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
      },
      build: {
        outDir: "dist/client",
        emptyOutDir: true,
      },
    })
  : // ─── Cloudflare Pages SSR build ─────────────────────────────────────────
    lovableDefineConfig({
      tanstackStart: {
        server: { entry: "server" },
      },
    });
