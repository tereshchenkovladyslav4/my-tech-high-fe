// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

// eslint-disable-next-line @typescript-eslint/no-var-requires
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
    namedExports: ['draft-js', 'react-draft-wysiwyg', '@unleash/proxy-client-react', 'unleash-proxy-client'],
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
    '@mth/envs': './src/core/envs',
    '@mth/graphql': './src/graphql',
    '@mth/hooks': './src/core/hooks',
    '@mth/mocks': './mocks',
    '@mth/models': './src/core/models',
    '@mth/providers': './src/providers',
    '@mth/screens': './src/screens',
    '@mth/services': './src/core/services',
    '@mth/styles': './src/styles',
    '@mth/utils': './src/core/utils',
  },
}
