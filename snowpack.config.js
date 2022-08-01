// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

require('dotenv').config()
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {},
  plugins: ['@snowpack/plugin-dotenv'],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  },
  packageOptions: {
    /* ... */
    namedExports: ['draft-js', 'react-draft-wysiwyg'],
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  routes: [
    { match: 'all', src: '/api/.*', dest: (req, res) => proxy.web(req, res) },
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  alias: {
    '@mth/assets': './src/assets',
    '@mth/components': './src/components',
    '@mth/constants': './src/core/constants',
    '@mth/enums': './src/core/enums',
    '@mth/graphql': './src/graphql',
    '@mth/hooks': './src/core/hooks',
    '@mth/models': './src/core/models',
    '@mth/providers': './src/providers',
    '@mth/screens': './src/screens',
    '@mth/utils': './src/core/utils',
  },
}
