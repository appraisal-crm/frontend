import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// Shared flat config for all apps/packages.
export default tseslint.config(
  { ignores: ['dist/**', '.turbo/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
