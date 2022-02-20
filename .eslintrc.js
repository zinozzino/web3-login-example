/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@next/next/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2021,
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb',
        'airbnb/hooks',
        'plugin:react/jsx-runtime',
      ],
      plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],
      rules: {
        'no-sparse-arrays': 'off',
        'no-undef': 'off',
        'arrow-parens': 'off',
        'import/extensions': [
          'error',
          'ignorePackages',
          { js: 'never', ts: 'never', tsx: 'never' },
        ],
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
        'jsx-a11y/anchor-is-valid': ['off'],
        'react/jsx-filename-extension': [
          'error',
          { extensions: ['jsx', 'tsx'] },
        ],
        'react/function-component-definition': [
          'warn',
          {
            namedComponents: ['function-declaration', 'arrow-function'],
            unnamedComponents: 'arrow-function',
          },
        ],
        'react/jsx-props-no-spreading': [
          'warn',
          {
            html: 'ignore',
            custom: 'enforce',
            exceptions: ['Component'],
          },
        ],
      },
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
    },
  ],
};

module.exports = config;
