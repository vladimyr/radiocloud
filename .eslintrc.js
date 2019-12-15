'use strict';

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: '@vladimyr',
  overrides: [{
    files: ['index.js', './caster.js'],
    parserOptions: {
      sourceType: 'module'
    }
  }],
  globals: {
    cast: true,
    chrome: true,
  },
  env: {
    browser: true
  }
};
