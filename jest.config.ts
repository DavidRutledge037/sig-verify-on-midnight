import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@midnight-ntwrk)/)'
  ],
  projects: [
    {
      displayName: 'default',
      testMatch: ['<rootDir>/tests/**/*.test.ts', '!<rootDir>/tests/lib/wallet/*.test.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          useESM: true,
          tsconfig: 'tsconfig.json'
        }]
      }
    },
    {
      displayName: 'wallet',
      testMatch: ['<rootDir>/tests/lib/wallet/*.test.ts'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          useESM: true,
          tsconfig: 'tsconfig.json'
        }]
      }
    }
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  resolver: 'ts-jest-resolver',
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }
  }
};

export default config;
