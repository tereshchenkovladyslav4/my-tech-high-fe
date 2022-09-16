module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: [
    // Uses the recommended rules from the @typescript-eslint/eslint-pluginno-param-reassign
    'plugin:@typescript-eslint/recommended',
    // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/display-name': 'off',
    'comma-dangle': [2, 'always-multiline'],
    'arrow-parens': 1,
    '@typescript-eslint/no-unused-vars': 2,
    semi: 0,
    'max-len': 0,
    'no-unused-expressions': 1,
    'no-trailing-spaces': 0,
    'import/no-dynamic-require': 1,
    'consistent-return': 1,
    'import/imports-first': 0,
    'function-paren-newline': 'off',
    'space-before-function-paren': 'off',
    'func-names': 0,
    'global-require': 0,
    'class-methods-use-this': 0,
    'arrow-body-style': [0, 'as-needed'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-debugger': 0,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'new-cap': 0,
    strict: 0,
    'object-curly-newline': 'off',
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'eol-last': 0,
    indent: 'off',
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
      },
    ],
    'implicit-arrow-linebreak': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@mth/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', '@mth/**', 'next/*'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
