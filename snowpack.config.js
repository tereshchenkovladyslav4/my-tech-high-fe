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
    '@components': './src/components',
    '@constants': './src/core/constants',
    '@enums': './src/core/enums',
    '@models': './src/core/models',
    '@providers': './src/providers',
    '@screens': './src/screens',
    '@utils': './src/core/utils',
  },
}
