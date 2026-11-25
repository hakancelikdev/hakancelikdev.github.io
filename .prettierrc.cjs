/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,

  plugins: [require.resolve('prettier-plugin-astro')],

  overrides: [
    { files: '*.astro', options: { parser: 'astro' } },
    // Posts: leave the code samples exactly as written.
    { files: ['*.md', '*.mdx'], options: { embeddedLanguageFormatting: 'off' } },
  ],
};
