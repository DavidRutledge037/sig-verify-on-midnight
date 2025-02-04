interface CacheEntry {
    data: any;
    timestamp: number;
    expiry?: number;
}

export class RouteCache {
    private readonly CACHE_KEY = 'route_cache';
    private readonly DEFAULT_EXPIRY = 1000 * 60 * 5; // 5 minutes
    private cache: Record<string, CacheEntry>;

    constructor() {
        this.cache = this.loadCache();
    }

    async getRoute(route: string): Promise<any | null> {
        const entry = this.cache[route];
        if (!entry) return null;

        const now = Date.now();
        if (entry.expiry && now > entry.timestamp + entry.expiry) {
            delete this.cache[route];
            await this.saveCache();
            return null;
        }

        return entry.data;
    }

    async setRoute(route: string, data: any, expiry: number = this.DEFAULT_EXPIRY): Promise<void> {
        this.cache[route] = {
            data,
            timestamp: Date.now(),
            expiry
        };
        
        try {
            await this.saveCache();
        } catch (error) {
            delete this.cache[route]; // Rollback on error
            throw new Error('Failed to save cache: ' + error.message);
        }
    }

    clearCache(): void {
        this.cache = {};
        try {
            localStorage.removeItem(this.CACHE_KEY);
        } catch (error) {
            throw new Error('Failed to clear cache: ' + error.message);
        }
    }

    private loadCache(): Record<string, CacheEntry> {
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            return cached ? JSON.parse(cached) : {};
        } catch (error) {
            console.error('Failed to load cache:', error);
            return {};
        }
    }

    private async saveCache(): Promise<void> {
        const data = JSON.stringify(this.cache);
        localStorage.setItem(this.CACHE_KEY, data);
    }
} 