module.exports = {
    extends: 'airbnb-base',

    env: {
      node: true,
    },

    rules: {
      'object-curly-newline': 'off',
      'no-underscore-dangle': 'warn',
      'no-unused-vars': ['error', { 'argsIgnorePattern': 'next|res|req' }],
    },
};