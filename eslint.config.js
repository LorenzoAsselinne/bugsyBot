const babelEslintParser = require('@babel/eslint-parser');
const esLintimportPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        requireConfigFile: false,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        Promise: 'readonly',
        sails: 'readonly',
        _: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      import: esLintimportPlugin,
    },
    rules: {
      // Enforce best practices
      'block-scoped-var': 'error', // Enforce the use of block-scoped variables
      'curly': 'warn', // Require curly braces for all control statements
      'eqeqeq': ['error', 'always'], // Require the use of === and !==
      'no-extra-semi': 'warn', // Disallow unnecessary semicolons
      'no-labels': 'error', // Disallow the use of labeled statements
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'], // Disallow mixed spaces and tabs
      'no-redeclare': 'warn', // Disallow variable redeclaration
      'no-sequences': 'error', // Disallow comma operator
      'no-trailing-spaces': 'warn', // Disallow trailing whitespace
      'no-unused-vars': [
        'warn',
        {
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^unused($|[A-Z].*$)',
          argsIgnorePattern: '^unused($|[A-Z].*$)',
          varsIgnorePattern: '^unused($|[A-Z].*$)',
        },
      ],
      'no-use-before-define': ['error', { functions: false }], // Disallow the use of variables before they are defined

      // Code style
      'comma-style': ['warn', 'last'], // Enforce consistent comma style
      'eol-last': 'warn', // Require newline at the end of files
      'indent': [
        'warn',
        2, // Indent with 2 spaces
        {
          SwitchCase: 1,
          MemberExpression: 'off',
          FunctionDeclaration: { body: 1, parameters: 'off' },
          FunctionExpression: { body: 1, parameters: 'off' },
          CallExpression: { arguments: 'off' },
          ArrayExpression: 1,
          ObjectExpression: 1,
          ignoredNodes: ['ConditionalExpression'],
        },
      ],
      'linebreak-style': ['error', 'unix'], // Enforce Unix linebreaks
      'quotes': ['warn', 'single', { avoidEscape: false, allowTemplateLiterals: true }], // Enforce single quotes
      'semi': ['warn', 'always'], // Require semicolons
      'semi-spacing': ['warn', { before: false, after: true }], // Enforce spacing after semicolons
      'semi-style': ['warn', 'last'], // Enforce semicolon to be at the end of the line

      // Padding rules
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' }, // Ensure one blank line before return statements
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }, // No blank line between variable declarations
        { blankLine: 'always', prev: '*', next: 'function' }, // Ensure one blank line before function declarations
        { blankLine: 'always', prev: 'function', next: '*' }, // Ensure one blank line after function declarations
        { blankLine: 'always', prev: '*', next: 'block-like' }, // Blank line before block-like statements (if, switch, for, etc.)
        { blankLine: 'always', prev: 'block-like', next: '*' }, // Blank line after block-like statements
        { blankLine: 'always', prev: 'directive', next: '*' }, // Ensure one blank line after 'use strict' or similar directives
        { blankLine: 'any', prev: 'import', next: 'import' }, // No blank line between consecutive import statements
        { blankLine: 'always', prev: 'import', next: '*' }, // Ensure one blank line after import statements if followed by anything other than import
        { blankLine: 'always', prev: '*', next: 'export' }, // Ensure one blank line before export statements
        { blankLine: 'always', prev: 'export', next: '*' }, // Ensure one blank line after export statements
        { blankLine: 'never', prev: ['const', 'let', 'var'], next: ['if', 'switch', 'for', 'while', 'do'] } // Allow no blank line between variable declarations and control statements
      ],

      // No multiple empty lines
      'no-multiple-empty-lines': [
        'warn',
        { max: 1, maxEOF: 0, maxBOF: 0 } // Allow maximum one blank line, none at EOF or BOF
      ],

      // Import rules
      'sort-imports': [
        'warn',
        {
          ignoreCase: false,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always', // Require new lines between import groups
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Treat warnings as errors
      'no-warning-comments': ['error', { terms: ['warn', 'fixme'], location: 'start' }], // Report 'warn' and 'fixme'
    },
    settings: {
      // Enable reporting of unused ESLint disable directives
      reportUnusedDisableDirectives: true,
    },
  },
];
