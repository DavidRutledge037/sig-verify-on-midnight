import type { Config } from '@jest/types';
import baseConfig from './jest.config';

const config: Config.InitialOptions = {
    ...baseConfig,
    testMatch: ['**/tests/e2e/**/*.test.ts'],
    setupFiles: ['<rootDir>/tests/e2e/setup.ts'],
    testTimeout: 30000,
    maxConcurrency: 1
};

export default config; 