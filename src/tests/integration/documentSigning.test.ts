import { describe, test, expect, beforeEach } from 'vitest';
import { DocumentSigning } from '../../services/DocumentSigning';
import { CryptoService } from '../../services/CryptoService';
import { DIDManagement } from '../../services/DIDManagement';
import { DIDResolver } from '../../services/DIDResolver';
import { hashMessage, recoverMessageAddress, signMessage } from 'viem'
import type { Hash, Hex } from 'viem'

class TestDIDResolver implements DIDResolver {
    private keyPairs: { [key: string]: CryptoKeyPair } = {};
    private cryptoService: CryptoService;

    constructor() {
        this.cryptoService = new CryptoService();
    }

    async initialize() {
        this.keyPairs = {
            'ecdsa-key': await this.cryptoService.generateKeyPair({
                name: 'ECDSA',
                hash: { name: 'SHA-256' }
            }),
            'rsassa-key': await this.cryptoService.generateKeyPair({
                name: 'RSASSA-PKCS1-v1_5',
                hash: { name: 'SHA-256' }
            })
        };
    }

    async resolve(did: string) {
        if (did === 'did:midnight:invalid') {
            throw new Error('DID not found');
        }

        return {
            id: did,
            verificationMethod: [
                {
                    id: `${did}#ecdsa-key`,
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    controller: did,
                    publicKey: this.keyPairs['ecdsa-key'].publicKey,
                    privateKey: this.keyPairs['ecdsa-key'].privateKey,
                    algorithm: {
                        name: 'ECDSA',
                        hash: { name: 'SHA-256' }
                    }
                },
                {
                    id: `${did}#rsassa-key`,
                    type: 'RsaVerificationKey2018',
                    controller: did,
                    publicKey: this.keyPairs['rsassa-key'].publicKey,
                    privateKey: this.keyPairs['rsassa-key'].privateKey,
                    algorithm: {
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: { name: 'SHA-256' }
                    }
                }
            ],
            authentication: [`${did}#ecdsa-key`, `${did}#rsassa-key`]
        };
    }
}

describe('Document Signing Integration', () => {
    let documentSigning: DocumentSigning;
    let didResolver: TestDIDResolver;
    let didManagement: DIDManagement;
    let cryptoService: CryptoService;

    beforeEach(async () => {
        didResolver = new TestDIDResolver();
        await didResolver.initialize();
        
        cryptoService = new CryptoService();
        didManagement = new DIDManagement(didResolver);
        documentSigning = new DocumentSigning(didManagement, cryptoService);
    });

    test('complete signing and verification flow with ECDSA', async () => {
        const content = 'Test document for integration';
        const signerDID = 'did:midnight:test1';
        const keyId = 'ecdsa-key';

        // Create signed document
        const signedDoc = await documentSigning.createSignedDocument(content, signerDID, keyId);
        
        expect(signedDoc).toEqual(expect.objectContaining({
            content,
            signerDID,
            keyId,
            signature: expect.any(String)
        }));

        // Verify with same instance
        const isValidSame = await documentSigning.verifySignature(signedDoc);
        expect(isValidSame).toBe(true);

        // Verify with new instance
        const newDocumentSigning = new DocumentSigning(didManagement, new CryptoService());
        const isValidNew = await newDocumentSigning.verifySignature(signedDoc);
        expect(isValidNew).toBe(true);
    });

    test('cross-key verification', async () => {
        const content = 'Test document for cross-key verification';
        const signerDID = 'did:midnight:test1';

        // Sign with ECDSA
        const ecdsaDoc = await documentSigning.createSignedDocument(content, signerDID, 'ecdsa-key');
        
        // Sign same content with RSA
        const rsaDoc = await documentSigning.createSignedDocument(content, signerDID, 'rsassa-key');

        // Verify both signatures
        expect(await documentSigning.verifySignature(ecdsaDoc)).toBe(true);
        expect(await documentSigning.verifySignature(rsaDoc)).toBe(true);

        // Verify signatures are different
        expect(ecdsaDoc.signature).not.toBe(rsaDoc.signature);
    });

    test('multi-party document flow', async () => {
        const content = 'Multi-party test document';
        const signer1DID = 'did:midnight:signer1';
        const signer2DID = 'did:midnight:signer2';

        // Both parties sign the same document
        const signature1 = await documentSigning.createSignedDocument(content, signer1DID, 'ecdsa-key');
        const signature2 = await documentSigning.createSignedDocument(content, signer2DID, 'rsassa-key');

        // Verify both signatures
        expect(await documentSigning.verifySignature(signature1)).toBe(true);
        expect(await documentSigning.verifySignature(signature2)).toBe(true);

        // Ensure signatures are different
        expect(signature1.signature).not.toBe(signature2.signature);
    });
});

export class CryptoService {
    async sign(
        content: string,
        privateKey: Hex,
    ): Promise<Hex> {
        try {
            return await signMessage({
                message: content,
                privateKey
            })
        } catch (error) {
            throw new SigningError(error as Error)
        }
    }

    async verify(
        content: string,
        signature: Hex,
        address: Hex
    ): Promise<boolean> {
        try {
            const recoveredAddress = await recoverMessageAddress({
                message: content,
                signature
            })
            return recoveredAddress.toLowerCase() === address.toLowerCase()
        } catch (error) {
            throw new VerificationError(error as Error)
        }
    }

    hashMessage(content: string): Hash {
        return hashMessage(content)
    }
} 