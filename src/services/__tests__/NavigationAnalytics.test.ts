import { describe, test, expect, beforeEach, vi } from 'vitest';
import { NavigationAnalytics } from '../NavigationAnalytics';

describe('NavigationAnalytics', () => {
    let analytics: NavigationAnalytics;

    beforeEach(() => {
        analytics = new NavigationAnalytics();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('should track successful navigation', () => {
        analytics.startNavigation('dashboard');
        analytics.endNavigation('dashboard', true);

        const results = analytics.getAnalytics();
        expect(results.successRate).toBe(100);
        expect(results.totalNavigations).toBe(1);
    });

    test('should track failed navigation', () => {
        analytics.startNavigation('settings');
        analytics.endNavigation('settings', false, 'Access denied', 'user');

        const results = analytics.getAnalytics();
        expect(results.successRate).toBe(0);
        expect(results.recentErrors).toHaveLength(1);
    });

    test('should calculate average duration', () => {
        analytics.startNavigation('dashboard');
        vi.advanceTimersByTime(100);
        analytics.endNavigation('dashboard', true);

        const results = analytics.getAnalytics();
        expect(results.averageDuration).toBe(100);
    });

    test('should track popular routes', () => {
        analytics.startNavigation('dashboard');
        analytics.endNavigation('dashboard', true);
        analytics.startNavigation('dashboard');
        analytics.endNavigation('dashboard', true);
        analytics.startNavigation('settings');
        analytics.endNavigation('settings', true);

        const results = analytics.getAnalytics();
        expect(results.popularRoutes.dashboard).toBe(2);
        expect(results.popularRoutes.settings).toBe(1);
    });
}); 