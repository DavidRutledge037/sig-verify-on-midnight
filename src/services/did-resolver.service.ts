import { DIDDocument, DIDResolutionResult, DIDMethod } from '../types/did.types';
import { DIDStorageService } from './did-storage.service';

export interface ResolutionResult {
    didDocument: DIDDocument | null;
    status: 'active' | 'revoked' | 'not-found';
    error?: string;
}

export class DIDResolverService {
    private methodMap: Map<string, DIDMethod>;
    private storageService: DIDStorageService;

    constructor(
        methods: DIDMethod[] = [],
        private storageService: DIDStorageService
    ) {
        this.methodMap = new Map(methods.map(m => [m.name, m]));
        this.storageService = storageService;
    }

    async resolve(didId: string): Promise<DIDResolutionResult> {
        try {
            // Validate DID format
            if (!this.isValidDIDFormat(didId)) {
                return {
                    didDocument: null,
                    status: 'not-found',
                    error: 'Invalid DID format'
                };
            }

            // Get DID document
            const didDocument = await this.storageService.getDID(didId);

            if (!didDocument) {
                return {
                    didDocument: null,
                    status: 'not-found',
                    error: 'DID not found'
                };
            }

            return {
                didDocument,
                status: didDocument.status
            };
        } catch (error) {
            return {
                didDocument: null,
                status: 'not-found',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    getSupportedMethods(): string[] {
        return Array.from(this.methodMap.keys());
    }

    addMethod(method: DIDMethod): void {
        this.methodMap.set(method.name, method);
    }

    private isValidDIDFormat(did: string): boolean {
        return did.startsWith('did:midnight:');
    }

    private async checkRevocationStatus(did: string): Promise<{ revoked: boolean; reason?: string }> {
        try {
            // TODO: Check blockchain for revocation status
            // For POC, we'll check local storage
            const doc = await this.storageService.getDID(did);
            return { 
                revoked: doc?.revoked || false, 
                reason: doc?.revocationReason 
            };
        } catch (error) {
            console.error('Failed to check revocation status:', error);
            return { revoked: false };
        }
    }
} 