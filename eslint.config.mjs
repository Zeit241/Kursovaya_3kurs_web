import { defineConfig } from "eslint/config"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
  {
    ignores: [
      "coverage/**",
      ".next/**",
      "components/ui/**",
      "hooks/use-mobile.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    extends: [...nextCoreWebVitals, ...nextTypescript],
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.integration.test.ts", "**/*.integration.test.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
])
