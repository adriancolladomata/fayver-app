import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // --- REGLAS DE ESTILO (Sincronizadas con tu Backend) ---

      'no-unused-vars': 'warn',
      'no-undef': 'error',

      // 1. Sangría de 2 espacios
      'indent': ['error', 2],

      // 2. Comillas simples obligatorias
      'quotes': ['error', 'single'],

      // 3. Prohibir punto y coma al final (Standard Style)
      'semi': ['error', 'never'],

      // 4. Espacio antes de los paréntesis de la función
      // Ejemplo: function nombre () { ... }
      'space-before-function-paren': ['error', 'always'],

      // 5. Última línea del archivo vacía
      'eol-last': ['error', 'always'],

      // 6. Espacios en operadores (ej: a + b)
      'space-infix-ops': 'error',

      // 7. Espacio después de palabras clave (if, else, for)
      'keyword-spacing': 'error',

      // 8. Espacio después de las comas
      'comma-spacing': 'error',

      // 9. No dejar espacios al final de las líneas
      'no-trailing-spaces': 'error',

      // Reglas específicas de React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
