// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
module.exports = defineConfig([
  // TYPESCRIPT FILES
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic, angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'public-instance-field',
            'private-instance-field',
            'constructor',
            'method',
          ],
        },
      ],

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      // OFF
      '@angular-eslint/prefer-inject': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      // WARNING
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
    },
  },
  // HTML FILES
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // OFF
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      // WARNING
      '@angular-eslint/template/prefer-control-flow': 'warn',
      '@angular-eslint/template/elements-content': 'warn',
      '@angular-eslint/template/alt-text': 'warn',
    },
  },
  eslintConfigPrettier,
]);
