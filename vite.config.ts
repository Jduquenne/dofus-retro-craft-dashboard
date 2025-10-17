import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/dofus-retro-craft-dashboard/", // Remplacer par le nom de votre repo
});
