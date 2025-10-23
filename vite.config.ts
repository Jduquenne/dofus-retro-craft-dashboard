import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/dofus-retro-craft-dashboard/", // ⚠️ DOIT correspondre EXACTEMENT au nom de votre repo GitHub
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
