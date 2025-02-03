/** @type {import('ts-jest').JestConfigWithTsJest} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            useESM: true
        }]
    },
    moduleDirectories: ['node_modules', 'src'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/'],
    globals: {
        'ts-jest': {
            useESM: true,
            tsconfig: 'tsconfig.test.json'
        }
    }
}; 