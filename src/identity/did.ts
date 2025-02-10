import { randomBytes } from 'crypto';
import { base58btc } from 'multiformats/bases/base58';
import { HashingService } from '../services/hashing';

interface DIDDocument {
    '@context': string[];
    id: string;
    controller: string[];
    verificationMethod: {
        id: string;
        type: string;
        controller: string;
        publicKeyMultibase: string;
    }[];
    authentication: string[];
    assertionMethod?: string[];
    keyAgreement?: string[];
    capabilityInvocation?: string[];
    capabilityDelegation?: string[];
}

class DIDManager {
    private readonly METHOD = 'midnight';
    private readonly KEY_TYPE = 'Ed25519VerificationKey2020';
    private readonly CONTEXT = [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1'
    ];

    /**
     * Creates a new DID Document using a public key
     */
    async createDID(publicKey: string): Promise<DIDDocument> {
        // Generate a unique identifier using the public key
        const identifier = HashingService.hashData(publicKey).slice(1); // Remove 'z' prefix
        const did = `did:${this.METHOD}:${identifier}`;

        // Create the verification method
        const verificationMethod = {
            id: `${did}#key-1`,
            type: this.KEY_TYPE,
            controller: did,
            publicKeyMultibase: publicKey
        };

        // Create the DID document
        const didDocument: DIDDocument = {
            '@context': this.CONTEXT,
            id: did,
            controller: [did],
            verificationMethod: [verificationMethod],
            authentication: [`${did}#key-1`],
            assertionMethod: [`${did}#key-1`],
            keyAgreement: [`${did}#key-1`],
            capabilityInvocation: [`${did}#key-1`],
            capabilityDelegation: [`${did}#key-1`]
        };

        return didDocument;
    }

    /**
     * Validates a DID string format
     */
    isValidDID(did: string): boolean {
        const didRegex = new RegExp(`^did:${this.METHOD}:[1-9A-HJ-NP-Za-km-z]+$`);
        return didRegex.test(did);
    }

    /**
     * Extracts the public key from a DID Document
     */
    getPublicKey(didDocument: DIDDocument): string | null {
        const verificationMethod = didDocument.verificationMethod[0];
        return verificationMethod?.publicKeyMultibase || null;
    }
}

export { DIDManager, type DIDDocument }; 