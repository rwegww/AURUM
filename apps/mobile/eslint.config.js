module.exports = [
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**"]
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        console: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        clearInterval: "readonly",
        setInterval: "readonly",
        URLSearchParams: "readonly",
        process: "readonly",
        module: "readonly"
      }
    }
  }
];
