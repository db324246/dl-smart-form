module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 0,
    'no-new-funtion': 0,
    'space-before-function-paren': 0,
    'camelcase': 0,
    'no-new-func': 0,
    'no-useless-return': 1,
    'object-curly-newline': 1,
    'promise/param-names': 0,
    'import/no-named-default': 0,
    'import/first': 0
  }
}
