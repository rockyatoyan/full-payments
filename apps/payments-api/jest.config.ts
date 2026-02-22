import type { Config } from 'jest'

const config: Config = {
  displayName: 'payments-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', "html"],
  transform: { '^.+\\.(ts|tsx|js)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }] },
  rootDir: 'src',
  coverageDirectory: '../../coverage/apps/payments-api',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

  },
};

export default config;
