import next from 'eslint-config-next'
import prettier from 'eslint-config-prettier'
import cypress from 'eslint-plugin-cypress'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'coverage/**',
      'public/**',
      'storybook-static/**',
      'styles/base.css',
    ],
  },
  ...next,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // New in eslint-plugin-react-hooks v7 (React Compiler era). The typing
      // game intentionally derives state inside effects, so keep this advisory
      // rather than a hard error.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    files: ['cypress/**/*.{js,jsx,ts,tsx}'],
    ...cypress.configs.recommended,
  },
  prettier,
]

export default config
