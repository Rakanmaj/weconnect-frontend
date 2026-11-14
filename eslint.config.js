// Parse JavaScript/JSX without the removed Next.js or TypeScript presets.
export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/.local/**"] },
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "constructor-super": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "valid-typeof": "error",
    },
  },
];
