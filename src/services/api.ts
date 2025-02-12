import { DIDService } from './did.service';
import { DIDStorageService } from './did-storage.service';
import { DIDDocument } from '../types/did.types';
import { ProofService, Proof } from './proof';

export class APIService {
    private proofService: ProofService;

    constructor(
        private didService: DIDService,
        private storageService: DIDStorageService,
        rpcUrl?: string,
        chainId?: string
    ) {
        if (rpcUrl && chainId) {
            this.proofService = new ProofService(rpcUrl, chainId);
        }
    }

    async createDID(): Promise<DIDDocument> {
        try {
            // Create new DID
            const did = await this.didService.createDID();
            
            // Store DID
            await this.storageService.storeDID(did);
            
            // If proof service is available, submit proof
            if (this.proofService) {
                const proof: Proof = {
                    type: 'DIDCreation',
                    created: new Date().toISOString(),
                    creator: did.controller,
                    signatureValue: new Uint8Array(), // This should be properly signed
                    data: {
                        didDocument: did
                    }
                };
                
                await this.proofService.submitProof(proof);
            }
            
            return did;
        } catch (error) {
            console.error('Error creating DID:', error);
            throw error;
        }
    }

    async resolveDID(didId: string): Promise<DIDDocument> {
        try {
            // Validate DID format
            if (!this.didService.isValidDIDFormat(didId)) {
                throw new Error('Invalid DID format');
            }

            // Retrieve DID
            const did = await this.storageService.getDID(didId);
            if (!did) {
                throw new Error('DID not found');
            }

            return did;
        } catch (error) {
            console.error('Error resolving DID:', error);
            throw error;
        }
    }

    async updateDID(didId: string, updates: Partial<DIDDocument>): Promise<DIDDocument> {
        try {
            // Get existing DID
            const existingDID = await this.storageService.getDID(didId);
            if (!existingDID) {
                throw new Error('DID not found');
            }

            // Create updated DID
            const updatedDID: DIDDocument = {
                ...existingDID,
                ...updates,
                updated: new Date().toISOString()
            };

            // Store updated DID
            const success = await this.storageService.updateDID(updatedDID);
            if (!success) {
                throw new Error('Failed to update DID');
            }

            // Submit proof if available
            if (this.proofService) {
                const proof: Proof = {
                    type: 'DIDUpdate',
                    created: new Date().toISOString(),
                    creator: updatedDID.controller,
                    signatureValue: new Uint8Array(), // This should be properly signed
                    data: {
                        didDocument: updatedDID
                    }
                };
                
                await this.proofService.submitProof(proof);
            }

            return updatedDID;
        } catch (error) {
            console.error('Error updating DID:', error);
            throw error;
        }
    }

    async deleteDID(didId: string): Promise<boolean> {
        try {
            const success = await this.storageService.deleteDID(didId);
            if (!success) {
                throw new Error('Failed to delete DID');
            }

            // Submit proof if available
            if (this.proofService) {
                const proof: Proof = {
                    type: 'DIDDeletion',
                    created: new Date().toISOString(),
                    creator: 'system', // This should be the authenticated user
                    signatureValue: new Uint8Array(), // This should be properly signed
                    data: {
                        didId
                    }
                };
                
                await this.proofService.submitProof(proof);
            }

            return true;
        } catch (error) {
            console.error('Error deleting DID:', error);
            throw error;
        }
    }
} 