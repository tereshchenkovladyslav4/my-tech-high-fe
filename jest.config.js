module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': [
      'ts-jest',
      {
        diagnostics: {
          exclude: ['**/mocks/*.ts'],
          /*
           * :warning: IMPORTANT: error code 1343 MUST be ignored for the transformer to work.
           * https://github.com/Microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json#L1035
           */
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: { env: { SNOWPACK_PUBLIC_S3_URL: 'http://localhost:3005/upload' } },
              },
            },
          ],
        },
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@mth/components/(.*)$': '<rootDir>/src/components/$1',
    '@mth/constants': '<rootDir>/src/core/constants',
    '@mth/enums': '<rootDir>/src/core/enums',
    '@mth/envs/(.*)$': '<rootDir>/src/core/envs/$1',
    '@mth/graphql/(.*)$': '<rootDir>/src/graphql/$1',
    '@mth/hooks/(.*)$': '<rootDir>/src/core/hooks/$1',
    '@mth/mocks/(.*)$': '<rootDir>/mocks/$1',
    '@mth/providers/(.*)$': '<rootDir>/src/providers/$1',
    '@mth/screens/(.*)$': '<rootDir>/src/screens/$1',
    '@mth/services/(.*)$': '<rootDir>/src/core/services/$1',
    '@mth/styles/(.*)$': '<rootDir>/src/styles/$1',
    '@mth/utils/(.*)$': '<rootDir>/src/core/utils/$1',
    '@unleash/proxy-client-react': '<rootDir>/mocks/proxyClientReactMock.ts',
    '\\.svg$': '<rootDir>/src/assets/mock.js',
  },
  setupFiles: ['<rootDir>/tests/test-setup.js'],
}
