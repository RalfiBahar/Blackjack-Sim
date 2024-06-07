import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "bg-grey": "#37404A",
      "light-grey": "#99A5B1",
    },
    extend: {},
  },
  corePlugins: {
    aspectRatio: true,
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
export default config;
