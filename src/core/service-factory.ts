import { DIDService } from '../services/did.service.js';
import { DIDStorageService } from '../services/did-storage.service.js';
import { WalletService } from '../services/wallet.service.js';
import { DatabaseService } from '../services/database.service.js';
import { IUnitOfWork } from './repository.js';
import type { IStorageService, IWalletService, IDIDService } from '../types/service.types.js';

export class ServiceFactory {
    private static instance: ServiceFactory;
    private services: Map<string, any> = new Map();

    private constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly config: {
            chainId: string;
            rpcUrl: string;
            dbUrl: string;
        }
    ) {}

    static getInstance(unitOfWork: IUnitOfWork, config: {
        chainId: string;
        rpcUrl: string;
        dbUrl: string;
    }): ServiceFactory {
        if (!ServiceFactory.instance) {
            ServiceFactory.instance = new ServiceFactory(unitOfWork, config);
        }
        return ServiceFactory.instance;
    }

    getWalletService(): IWalletService {
        if (!this.services.has('wallet')) {
            this.services.set(
                'wallet',
                new WalletService(this.config.chainId, this.config.rpcUrl)
            );
        }
        return this.services.get('wallet');
    }

    getStorageService(): IStorageService {
        if (!this.services.has('storage')) {
            const dbService = new DatabaseService(this.config.dbUrl);
            this.services.set(
                'storage',
                new DIDStorageService(dbService)
            );
        }
        return this.services.get('storage');
    }

    getDIDService(): IDIDService {
        if (!this.services.has('did')) {
            const walletService = this.getWalletService();
            this.services.set(
                'did',
                new DIDService(walletService)
            );
        }
        return this.services.get('did');
    }

    async initialize(): Promise<void> {
        const walletService = this.getWalletService();
        await walletService.initialize();

        const storageService = this.getStorageService();
        await storageService.initialize();
    }

    async cleanup(): Promise<void> {
        for (const service of this.services.values()) {
            if (service.cleanup) {
                await service.cleanup();
            }
        }
        this.services.clear();
    }
} 