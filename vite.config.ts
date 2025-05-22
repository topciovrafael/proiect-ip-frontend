// vite.config.ts  (or vite.config.js)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        // ✅ proper regex: slash is escaped *inside* the literal
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
