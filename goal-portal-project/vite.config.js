import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "orange-jeans-look.loca.lt",
      "durham-wellington-sixth-probability.trycloudflare.com",
    ],
    proxy: {
      "/api": "http://127.0.0.1:5000",
    },
  },
});
