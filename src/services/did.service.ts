import { DIDDocument, DIDResolutionResult, DIDService as DIDServiceInterface } from '../types/did.types';
import { WalletService } from './wallet.service';
import { DIDManager } from '../identity/did';

export class DIDService implements DIDServiceInterface {
    private didManager: DIDManager;

    constructor(private walletService: WalletService) {
        this.didManager = new DIDManager(walletService);
    }

    async createDID(): Promise<DIDDocument> {
        return this.didManager.createDID();
    }

    async verifyDID(did: DIDDocument): Promise<boolean> {
        return this.didManager.verifyDID(did);
    }

    async resolveDID(didId: string): Promise<DIDResolutionResult> {
        if (!this.didManager.isValidDIDFormat(didId)) {
            throw new Error('Invalid DID format');
        }

        // Implement actual DID resolution logic here
        return {
            didDocument: {} as DIDDocument,
            didResolutionMetadata: {
                contentType: 'application/did+json'
            },
            didDocumentMetadata: {
                created: new Date().toISOString()
            }
        };
    }

    async revokeDID(didId: string): Promise<boolean> {
        if (!this.didManager.isValidDIDFormat(didId)) {
            throw new Error('Invalid DID format');
        }
        return true;
    }

    isValidDIDFormat(did: string): boolean {
        return this.didManager.isValidDIDFormat(did);
    }

    async addService(didId: string, service: any): Promise<boolean> {
        if (!this.didManager.isValidDIDFormat(didId)) {
            throw new Error('Invalid DID format');
        }
        return true;
    }
}

export type { DIDServiceInterface as DIDService }; 