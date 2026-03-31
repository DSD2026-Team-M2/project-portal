/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          25: "#f8fafc",
        },
        brand: {
          blue: "#2563eb",
          teal: "#0f766e",
          ice: "#eff6ff",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.06)",
        glass: "0 18px 45px rgba(148, 163, 184, 0.16)",
      },
      backgroundImage: {
        "section-line":
          "linear-gradient(90deg, rgba(59,130,246,0.95), rgba(56,189,248,0.78), rgba(45,212,191,0.72))",
      },
    },
  },
  plugins: [],
};
