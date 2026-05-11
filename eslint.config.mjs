import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.ts"] },
  
  pluginJs.configs.recommended,
  
  ...tseslint.configs.recommended,

  {
    rules: {
      "no-console": "warn", 
      "@typescript-eslint/no-unused-vars": "error", 
      "@typescript-eslint/no-explicit-any": "warn", 
    },
  },
];