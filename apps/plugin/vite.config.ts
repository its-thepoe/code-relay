import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import framer from "vite-plugin-framer";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), command === "serve" ? mkcert() : null, framer()].filter(
    Boolean,
  ),
  server: {
    https: true,
  },
}));
