export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            useESM: true
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    verbose: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 10000,
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
}; 