import { DIDDocument } from '../types/did.types';
import { DIDStorageService } from './did-storage.service';
import { WalletService } from './wallet';

export class DIDRevocationService {
    constructor(
        private storageService: DIDStorageService,
        private walletService: WalletService
    ) {}

    async revokeDID(didId: string): Promise<boolean> {
        try {
            // Get the DID document
            const didDocument = await this.storageService.getDID(didId);
            if (!didDocument) {
                throw new Error('DID not found');
            }

            // Check authorization
            const currentAddress = await this.walletService.getAddress();
            if (didDocument.controller !== currentAddress) {
                throw new Error('Unauthorized to revoke DID');
            }

            // Update DID status
            const updatedDID: DIDDocument = {
                ...didDocument,
                status: 'revoked',
                updated: new Date().toISOString()
            };

            // Store the updated DID
            const success = await this.storageService.updateDID(updatedDID);
            if (!success) {
                throw new Error('Failed to update DID status');
            }

            return true;
        } catch (error) {
            console.error('Error revoking DID:', error);
            throw error;
        }
    }

    async isRevoked(didId: string): Promise<boolean> {
        try {
            const didDocument = await this.storageService.getDID(didId);
            return didDocument?.status === 'revoked';
        } catch (error) {
            console.error('Error checking DID revocation status:', error);
            throw error;
        }
    }

    async restoreDID(didId: string): Promise<boolean> {
        try {
            // Get the DID document
            const didDocument = await this.storageService.getDID(didId);
            if (!didDocument) {
                throw new Error('DID not found');
            }

            // Check authorization
            const currentAddress = await this.walletService.getAddress();
            if (didDocument.controller !== currentAddress) {
                throw new Error('Unauthorized to restore DID');
            }

            // Update DID status
            const updatedDID: DIDDocument = {
                ...didDocument,
                status: 'active',
                updated: new Date().toISOString()
            };

            // Store the updated DID
            return await this.storageService.updateDID(updatedDID);
        } catch (error) {
            console.error('Error restoring DID:', error);
            throw error;
        }
    }
} 