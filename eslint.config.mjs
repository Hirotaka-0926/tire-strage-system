import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // TypeScriptを使用しているためprop-typesは不要
      "@typescript-eslint/no-explicit-any": "off", // anyの使用を許可
      "react/no-unknown-property": [
        "error",
        {
          ignore: [
            "css",
            "className",
            "htmlFor",
            "onClick",
            "onChange",
            "onSubmit",
            "cmdk-input-wrapper", // cmdk属性を許可
            "cmdk-group-heading", // cmdk属性を許可
            "cmdk-group", // cmdk属性を許可
            "cmdk-input", // cmdk属性を許可
            "cmdk-item", // cmdk属性を許可
          ],
        },
      ],
    },
  },
];
