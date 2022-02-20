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
        'comma-dangle': 'off',
        'no-sparse-arrays': 'off',
        'no-undef': 'off',
        'operator-linebreak': 'off',
        'arrow-parens': 'off',
        'implicit-arrow-linebreak': 'off',
        'function-paren-newline': 'off',
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
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'react/button-has-type': 'off',
        'react/forbid-prop-types': 'off',
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
