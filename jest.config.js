module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': [
      'ts-jest',
      {
        diagnostics: {
          exclude: ['**/mocks/*.ts'],
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
    '@mth/graphql/(.*)$': '<rootDir>/src/graphql/$1',
    '@mth/hooks/(.*)$': '<rootDir>/src/core/hooks/$1',
    '@mth/mocks/(.*)$': '<rootDir>/mocks/$1',
    '@mth/providers/(.*)$': '<rootDir>/src/providers/$1',
    '@mth/screens/(.*)$': '<rootDir>/src/screens/$1',
    '@mth/services/(.*)$': '<rootDir>/src/core/services/$1',
    '@mth/utils/(.*)$': '<rootDir>/src/core/utils/$1',
  },
}
