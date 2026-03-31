import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          i18n: ["i18next", "react-i18next"],
          calendar: ["@fullcalendar/core", "@fullcalendar/daygrid", "@fullcalendar/interaction", "@fullcalendar/react"],
          markdown: ["react-markdown", "remark-gfm", "rehype-slug", "rehype-autolink-headings"],
        },
      },
    },
  },
});
