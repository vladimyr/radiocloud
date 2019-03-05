module.exports = {
  extends: 'semistandard',
  globals: {
    cast: true,
    chrome: true,
  },
  rules: {
    'prefer-const': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }]
  }
};
