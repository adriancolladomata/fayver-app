import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      // Estética
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'no-trailing-spaces': 'error',
      'space-infix-ops': 'error',
      'keyword-spacing': 'error',
      'comma-spacing': 'error',
      'space-before-function-paren': ['error', 'always'],
      'eol-last': ['error', 'always']
    }
  }
];
