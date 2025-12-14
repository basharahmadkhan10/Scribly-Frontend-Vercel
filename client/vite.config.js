import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [
    react(),
  ],

  // IMPORTANT for Vercel
  base: "/",

  // Build config (keep it simple)
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },

  // Dev server (local only)
  server: {
    port: 5173,
  },

  preview: {
    port: 4173,
  },
});
