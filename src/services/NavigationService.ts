import { NavigationAnalytics } from './NavigationAnalytics';
import { RouteCache } from './RouteCache';

export type NavigationRoute = {
    id: string;
    path: string;
    title: string;
    icon: string;
    requiresAuth?: boolean;
    roles?: string[];
};

export interface NavigationError {
    code: string;
    message: string;
    retryable: boolean;
    context?: any;
}

export class NavigationService {
    private analytics: NavigationAnalytics;
    private cache: RouteCache;
    private maxRetries = 3;
    private retryDelay = 1000;

    constructor() {
        this.analytics = new NavigationAnalytics();
        this.cache = new RouteCache();
    }

    async navigateWithRetry(
        route: string,
        context: any = {},
        onError?: (error: NavigationError) => void
    ): Promise<boolean> {
        this.analytics.startNavigation(route);
        let attempts = 0;

        while (attempts < this.maxRetries) {
            try {
                const cachedRoute = await this.cache.getRoute(route);
                if (cachedRoute) {
                    this.analytics.endNavigation(route, true);
                    return true;
                }

                const success = await this.attemptNavigation(route, context);
                if (success) {
                    await this.cache.setRoute(route, { timestamp: Date.now() });
                    this.analytics.endNavigation(route, true);
                    return true;
                }

                // Handle unauthorized access
                if (onError) {
                    onError({
                        code: 'UNAUTHORIZED',
                        message: 'Access denied',
                        retryable: false,
                        context
                    });
                }
                this.analytics.endNavigation(route, false, 'Access denied');
                return false;
            } catch (error) {
                attempts++;
                
                // Call onError for each retry attempt
                if (onError) {
                    onError({
                        code: 'NAVIGATION_FAILED',
                        message: error.message,
                        retryable: true,
                        context
                    });
                }

                if (attempts === this.maxRetries) {
                    this.analytics.endNavigation(route, false, error.message);
                    return false;
                }

                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }

        return false;
    }

    private async attemptNavigation(route: string, context: any): Promise<boolean> {
        if (!context.isAuthenticated) {
            return false;
        }
        return true;
    }

    getCache(): RouteCache {
        return this.cache;
    }
} 