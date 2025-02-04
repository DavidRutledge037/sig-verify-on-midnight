export interface NavigationEvent {
    route: string;
    timestamp: Date;
    duration: number;
    success: boolean;
    error?: string;
    userRole?: string;
}

export class NavigationAnalytics {
    private events: NavigationEvent[] = [];
    private readonly maxEvents = 1000;
    private startTime: number | null = null;

    startNavigation(route: string) {
        this.startTime = performance.now();
    }

    endNavigation(route: string, success: boolean, error?: string, userRole?: string) {
        if (!this.startTime) return;
        
        const duration = performance.now() - this.startTime;
        this.addEvent({
            route,
            timestamp: new Date(),
            duration,
            success,
            error,
            userRole
        });

        this.startTime = null;
    }

    private addEvent(event: NavigationEvent) {
        this.events.unshift(event);
        if (this.events.length > this.maxEvents) {
            this.events.pop();
        }
        this.persistEvents();
    }

    getAnalytics() {
        return {
            totalNavigations: this.events.length,
            successRate: this.calculateSuccessRate(),
            averageDuration: this.calculateAverageDuration(),
            popularRoutes: this.getPopularRoutes(),
            recentErrors: this.getRecentErrors()
        };
    }

    private calculateSuccessRate(): number {
        if (this.events.length === 0) return 0;
        const successful = this.events.filter(e => e.success).length;
        return (successful / this.events.length) * 100;
    }

    private calculateAverageDuration(): number {
        if (this.events.length === 0) return 0;
        const total = this.events.reduce((sum, event) => sum + event.duration, 0);
        return total / this.events.length;
    }

    private getPopularRoutes(): Record<string, number> {
        return this.events.reduce((acc, event) => {
            acc[event.route] = (acc[event.route] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    private getRecentErrors(): NavigationEvent[] {
        return this.events
            .filter(e => !e.success)
            .slice(0, 5);
    }

    private persistEvents() {
        try {
            localStorage.setItem('nav_analytics', JSON.stringify(this.events));
        } catch (error) {
            console.error('Failed to persist navigation analytics:', error);
        }
    }
} 