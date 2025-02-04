import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { RouteCache } from '../RouteCache';

describe('RouteCache', () => {
    let cache: RouteCache;

    beforeEach(() => {
        vi.useFakeTimers();
        window.localStorage.clear();
        cache = new RouteCache();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    test('should cache and retrieve route data', async () => {
        const routeData = { test: 'data' };
        await cache.setRoute('/test', routeData);
        
        const cached = await cache.getRoute('/test');
        expect(cached).toEqual(routeData);
    });

    test('should handle expired cache', async () => {
        const routeData = { test: 'data' };
        await cache.setRoute('/test', routeData, 1000); // 1 second expiry
        
        vi.setSystemTime(Date.now() + 2000); // Advance time by 2 seconds
        
        const cached = await cache.getRoute('/test');
        expect(cached).toBeNull();
    });

    test('should clear cache', async () => {
        await cache.setRoute('/test1', { data: 1 });
        await cache.setRoute('/test2', { data: 2 });
        
        cache.clearCache();
        
        const cached1 = await cache.getRoute('/test1');
        const cached2 = await cache.getRoute('/test2');
        
        expect(cached1).toBeNull();
        expect(cached2).toBeNull();
    });

    test('should persist cache to localStorage', async () => {
        const testData = { data: 'test' };
        await cache.setRoute('/test', testData);
        
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'route_cache',
            expect.any(String)
        );
        
        // Create new cache instance
        const newCache = new RouteCache();
        const cached = await newCache.getRoute('/test');
        
        expect(cached).toEqual(testData);
    });

    test('should handle localStorage errors', async () => {
        vi.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => {
            throw new Error('Storage full');
        });

        await expect(
            cache.setRoute('/test', { data: 'test' })
        ).rejects.toThrow('Failed to save cache: Storage full');
    });
}); 