import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

const sharedRules = {
  'no-unused-vars': ['warn', {
    varsIgnorePattern: '^(?:[A-Z_]|motion$)',
    argsIgnorePattern: '^_',
    caughtErrors: 'none',
    caughtErrorsIgnorePattern: '^_',
  }],
  'no-empty': 'warn',
  'no-useless-escape': 'warn',
  'no-case-declarations': 'warn',
  'no-dupe-keys': 'warn',
}

export default defineConfig([
  globalIgnores([
    'dist',
    'node_modules',
    '.vercel',
    '.cache',
    'scratch',
    'src/data/chemistry_dataset_10000_js/*.js',
  ]),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...sharedRules,
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['api/**/*.js', 'scripts/**/*.js', 'vite.config.js', 'postcss.config.js', 'tailwind.config.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: sharedRules,
  },
])
