// @ts-check
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslint = require('@eslint/js');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    processor: angular.processInlineTemplates,
    plugins: { prettier: eslintPluginPrettier },
    rules: { ...eslintConfigPrettier.rules, 'prettier/prettier': ['error', {}, { usePrettierrc: true }] }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    plugins: { prettier: eslintPluginPrettier },
    rules: { ...eslintConfigPrettier.rules }
  }
);
