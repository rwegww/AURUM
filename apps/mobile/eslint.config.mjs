import expoConfig from 'eslint-config-expo/flat.js';

export default [
  ...expoConfig,
  {
    ignores: ['.expo/**', 'dist/**', 'node_modules/**'],
  },
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'import/no-unresolved': 'off',
    },
  },
];
