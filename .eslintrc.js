export default {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    require: true,
    process: true,
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'no-unused-vars': ['error', { vars: 'local', args: 'after-used', ignoreRestSiblings: false }],
  },
  ignorePatterns: ['.eslintrc.js', 'node_modules/*', 'coverage/*'],
  globals: {
    module: 'writable',
    require: 'readonly',
    process: 'readonly',
    exports: 'readonly',
  },
};
