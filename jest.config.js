/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleDirectories: ['node_modules', 'dist'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  roots: ['<rootDir>/tests', '<rootDir>/dist/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/contracts/did/jest.setup.ts'],
};
