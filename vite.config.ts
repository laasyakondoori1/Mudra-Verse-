/**
 * Vite configuration for MudraVerse.
 *
 * - Local dev / Cloudflare Pages build: TanStack Start SSR + Cloudflare Worker
 * - Vercel build (VERCEL=1 auto-set): pure SPA — generates dist/client/index.html
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

const isVercel = process.env.VERCEL === "1";

export default defineConfig(async ({ command, mode }) => {
  // ── Vercel SPA mode ────────────────────────────────────────────────────────
  if (isVercel) {
    return {
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
    };
  }

  // ── Cloudflare Pages / local dev ───────────────────────────────────────────
  const { tanstackStart } = await import("@tanstack/react-start/plugin/vite");

  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    // Cloudflare Worker bundler — build only (not needed in dev server)
    ...(command === "build"
      ? [await import("@cloudflare/vite-plugin").then(m => m.cloudflare({ viteEnvironment: { name: "ssr" } }))]
      : []),
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    react(),
  ];

  // Inject VITE_* env vars so they are statically replaceable in client code
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const define = Object.fromEntries(
    Object.entries(loadedEnv).map(([k, v]) => [`import.meta.env.${k}`, JSON.stringify(v)])
  );

  return {
    define,
    plugins,
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: {
      host: "::",
      port: 8080,
    },
  };
});
