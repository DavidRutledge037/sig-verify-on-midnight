import { DIDDocument, DIDStatus, VerificationMethod } from '../types/did.types';
import { WalletService } from '../services/wallet.service';
import { randomBytes } from 'crypto';

export class DIDManager {
    private walletService: WalletService;

    constructor(walletService: WalletService) {
        this.walletService = walletService;
    }

    async createDID(): Promise<DIDDocument> {
        const publicKey = this.walletService.getPublicKey();
        const id = `did:midnight:${randomBytes(16).toString('hex')}`;
        const controller = id;
        const verificationMethod: VerificationMethod = {
            id: `${id}#key-1`,
            type: 'Ed25519VerificationKey2020',
            controller: id,
            publicKeyMultibase: Buffer.from(publicKey).toString('base64')
        };

        const didDocument: DIDDocument = {
            id,
            controller,
            verificationMethod: [verificationMethod],
            authentication: [`${id}#key-1`],
            assertionMethod: [],
            keyAgreement: [],
            capabilityInvocation: [],
            capabilityDelegation: [],
            service: [],
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            status: 'active' as DIDStatus
        };

        return didDocument;
    }

    async verifyDID(did: DIDDocument): Promise<boolean> {
        if (!did.id.startsWith('did:midnight:')) {
            throw new Error('Invalid DID format');
        }

        // Verify the DID document signature if present
        if (did.verificationMethod && did.verificationMethod.length > 0) {
            const publicKey = Buffer.from(did.verificationMethod[0].publicKeyMultibase, 'base64');
            // Add signature verification logic here
            return true;
        }

        return false;
    }

    isValidDIDFormat(did: string): boolean {
        return did.startsWith('did:midnight:') && did.length >= 32;
    }
} 