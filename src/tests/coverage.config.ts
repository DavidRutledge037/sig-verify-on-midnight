import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import baseConfig from '../vitest.config';

export default mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html', 'lcov'],
                exclude: [
                    'node_modules/',
                    'dist/',
                    '**/*.d.ts',
                    '**/*.test.ts',
                    '**/*.spec.ts',
                    '**/mocks/**',
                    '**/*.config.ts'
                ],
                thresholds: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80
                }
            }
        }
    })
); 