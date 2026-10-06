import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { forest: "#2F4D39", sage: "#91A084", cream: "#F3F0E7", terracotta: "#BA7A52", ink: "#1F2A24", muted: "#6B6F68" },
    fontFamily: { serif: ["var(--font-serif)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"], script: ["var(--font-script)", "cursive"] },
  } },
  plugins: [],
};
export default config;
