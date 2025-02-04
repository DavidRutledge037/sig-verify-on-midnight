import { describe, test, expect, beforeEach, vi } from 'vitest';
import { NavigationService } from '../NavigationService';
import { NavigationAnalytics } from '../NavigationAnalytics';
import { RouteCache } from '../RouteCache';

// Mock dependencies
vi.mock('../NavigationAnalytics');
vi.mock('../RouteCache');

describe('NavigationService', () => {
    let navigationService: NavigationService;

    beforeEach(() => {
        navigationService = new NavigationService();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    test('should successfully navigate to valid route', async () => {
        const result = await navigationService.navigateWithRetry('/test', { isAuthenticated: true });
        expect(result).toBe(true);
    });

    test('should handle unauthorized access', async () => {
        const mockOnError = vi.fn();
        const result = await navigationService.navigateWithRetry('/test', { isAuthenticated: false }, mockOnError);
        
        expect(result).toBe(false);
        expect(mockOnError).toHaveBeenCalledWith({
            code: 'UNAUTHORIZED',
            message: 'Access denied',
            retryable: false,
            context: { isAuthenticated: false }
        });
    });

    test('should retry on transient failures', async () => {
        const mockOnError = vi.fn();
        let attempts = 0;
        
        // Mock attemptNavigation to fail twice then succeed
        vi.spyOn(navigationService as any, 'attemptNavigation').mockImplementation(async () => {
            attempts++;
            if (attempts <= 2) {
                throw new Error('Transient error');
            }
            return true;
        });

        const promise = navigationService.navigateWithRetry('/test', { isAuthenticated: true }, mockOnError);
        
        // Advance timers for each retry
        await vi.advanceTimersByTimeAsync(1000); // First retry
        await vi.advanceTimersByTimeAsync(1000); // Second retry
        
        const result = await promise;

        expect(result).toBe(true);
        expect(attempts).toBe(3);
        expect(mockOnError).toHaveBeenCalledTimes(2);
        expect(mockOnError).toHaveBeenCalledWith({
            code: 'NAVIGATION_FAILED',
            message: 'Transient error',
            retryable: true,
            context: { isAuthenticated: true }
        });
    });

    test('should use cache when available', async () => {
        const mockCache = vi.spyOn(navigationService['cache'], 'getRoute')
            .mockResolvedValueOnce({ timestamp: Date.now() });

        const result = await navigationService.navigateWithRetry('/test');
        
        expect(result).toBe(true);
        expect(mockCache).toHaveBeenCalledWith('/test');
    });
}); 