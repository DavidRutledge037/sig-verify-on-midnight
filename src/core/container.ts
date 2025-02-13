import type { IUnitOfWork } from './repository.js';
import type { 
    IDIDService, 
    IStorageService, 
    IWalletService,
    IKeyManager 
} from '../types/service.types.js';

export interface ServiceContainer {
    unitOfWork: IUnitOfWork;
    keyManager: IKeyManager;
    walletService: IWalletService;
    storageService: IStorageService;
    didService: IDIDService;
}

export class Container {
    private static instance: Container;
    private services: Partial<ServiceContainer> = {};
    
    private constructor() {}
    
    static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }
    
    register<K extends keyof ServiceContainer>(
        key: K, 
        service: ServiceContainer[K]
    ): void {
        this.services[key] = service;
    }
    
    resolve<K extends keyof ServiceContainer>(key: K): ServiceContainer[K] {
        const service = this.services[key];
        if (!service) {
            throw new Error(`Service ${key} not registered`);
        }
        return service;
    }
    
    async initialize(config: {
        chainId: string;
        rpcUrl: string;
        dbUrl: string;
    }): Promise<void> {
        // Initialize services in dependency order
        const walletService = this.resolve('walletService');
        await walletService.initialize();
        
        const storageService = this.resolve('storageService');
        await storageService.initialize();
    }
    
    cleanup(): void {
        this.services = {};
    }
}