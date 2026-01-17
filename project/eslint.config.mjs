import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig({
  files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  plugins: {
    js,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // pour TS
  ],
  languageOptions: {
    globals: globals.browser,
  },
});
