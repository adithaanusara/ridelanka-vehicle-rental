import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { navy: "#081a31", teal: "#0a9caa", mist: "#f4f7fa" },
      boxShadow: { lift: "0 18px 45px rgba(8,26,49,.12)" },
    },
  },
  plugins: [],
} satisfies Config;
