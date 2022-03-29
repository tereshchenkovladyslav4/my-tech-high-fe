// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

require('dotenv').config()
process.env.SNOWPACK_PUBLIC_TEST = 'yolo'
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {},
  plugins: ['@snowpack/plugin-dotenv'],
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
}
