/** @type {import('ts-jest').JestConfigWithTsJest} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/src/tests/setup.ts',
        '<rootDir>/jest.setup.js'
    ],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^crypto$': require.resolve('crypto-browserify'),
        '\\.crypto\\.js$': require.resolve('crypto-browserify'),
        '\\./crypto\\.js$': require.resolve('crypto-browserify'),
        '^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
        '^react-is$': require.resolve('react-is'),
        '^@types/sdk$': '<rootDir>/src/types/sdk.ts',
        '^../../contexts/(.*)$': '<rootDir>/src/contexts/$1',
        '^source-map-support$': '<rootDir>/src/tests/mocks/source-map-support.js',
        '^\\./(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.test.json',
                jsx: 'react-jsx',
                isolatedModules: true
            }
        ]
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', 'src'],
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
    },
    transformIgnorePatterns: [
        'node_modules/(?!(crypto-browserify|react-is|react|react-dom)/)'
    ],
    resolver: undefined,
    testPathIgnorePatterns: ['/node_modules/']
}; 