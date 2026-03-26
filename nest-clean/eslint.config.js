import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-useless-constructor': 'off',
      'no-new': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'always',
          js: 'always',
        },
      ],
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
]