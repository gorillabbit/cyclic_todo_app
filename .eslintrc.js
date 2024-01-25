module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'linebreak-style': ['error', 'windows'],
  },
  plugins: [
    'eslint-comments',
    'react',
    'react-hooks',
    'react-native',
    '@react-native',
    'jest',
  ],
};
