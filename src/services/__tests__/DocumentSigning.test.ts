import { describe, test, expect, beforeEach } from 'vitest';
import { DocumentSigning } from '../DocumentSigning';
import { DIDManagement } from '../DIDManagement';
import { CryptoService } from '../CryptoService';
import {
    EmptyContentError,
    NoVerificationMethodsError,
    KeyNotFoundError,
    PrivateKeyNotAvailableError,
    InvalidDocumentFormatError
} from '../../errors/DocumentSigningErrors';
import { VerificationError } from '../../errors/CryptoServiceErrors';

describe('DocumentSigning', () => {
    let documentSigning: DocumentSigning;
    let mockDIDManagement: DIDManagement;
    let cryptoService: CryptoService;
    let keyPairs: { [key: string]: CryptoKeyPair };

    beforeEach(async () => {
        cryptoService = new CryptoService();
        
        // Generate different types of key pairs
        keyPairs = {
            'ecdsa-key': await cryptoService.generateKeyPair({
                name: 'ECDSA',
                hash: { name: 'SHA-256' }
            }),
            'rsassa-key': await cryptoService.generateKeyPair({
                name: 'RSASSA-PKCS1-v1_5',
                hash: { name: 'SHA-256' }
            })
        };

        const mockDIDDoc = {
            id: 'did:midnight:test1',
            verificationMethod: [
                {
                    id: 'did:midnight:test1#ecdsa-key',
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    controller: 'did:midnight:test1',
                    publicKey: keyPairs['ecdsa-key'].publicKey,
                    privateKey: keyPairs['ecdsa-key'].privateKey,
                    algorithm: {
                        name: 'ECDSA',
                        hash: { name: 'SHA-256' }
                    }
                },
                {
                    id: 'did:midnight:test1#rsassa-key',
                    type: 'RsaVerificationKey2018',
                    controller: 'did:midnight:test1',
                    publicKey: keyPairs['rsassa-key'].publicKey,
                    privateKey: keyPairs['rsassa-key'].privateKey,
                    algorithm: {
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: { name: 'SHA-256' }
                    }
                }
            ],
            authentication: ['did:midnight:test1#ecdsa-key', 'did:midnight:test1#rsassa-key']
        };

        mockDIDManagement = {
            resolveDID: (did: string) => {
                if (did === 'did:midnight:invalid') {
                    return Promise.reject(new Error('Resolution failed'));
                }
                if (did === 'did:midnight:no-key') {
                    return Promise.resolve({
                        ...mockDIDDoc,
                        verificationMethod: [{
                            ...mockDIDDoc.verificationMethod[0],
                            privateKey: undefined  // Return a verification method without private key
                        }]
                    });
                }
                if (did === 'did:midnight:empty') {
                    return Promise.resolve({
                        ...mockDIDDoc,
                        verificationMethod: []
                    });
                }
                return Promise.resolve(mockDIDDoc);
            }
        } as DIDManagement;

        documentSigning = new DocumentSigning(mockDIDManagement, cryptoService);
    });

    describe('Error Handling', () => {
        test('should throw EmptyContentError for empty content', async () => {
            await expect(documentSigning.createSignedDocument('', 'did:midnight:test1'))
                .rejects.toThrow(EmptyContentError);
        });

        test('should throw NoVerificationMethodsError for DID without methods', async () => {
            await expect(documentSigning.createSignedDocument('content', 'did:midnight:empty'))
                .rejects.toThrow(NoVerificationMethodsError);
        });

        test('should throw KeyNotFoundError for invalid key ID', async () => {
            await expect(documentSigning.createSignedDocument('content', 'did:midnight:test1', 'invalid-key'))
                .rejects.toThrow(KeyNotFoundError);
        });

        test('should throw PrivateKeyNotAvailableError when private key is missing', async () => {
            await expect(documentSigning.createSignedDocument('content', 'did:midnight:no-key'))
                .rejects.toThrow(PrivateKeyNotAvailableError);
        });

        test('should throw InvalidDocumentFormatError for invalid document', async () => {
            const invalidDoc: any = { content: 'test' }; // Missing required fields
            await expect(documentSigning.verifySignature(invalidDoc))
                .rejects.toThrow(InvalidDocumentFormatError);
        });
    });

    describe('Signing and Verification', () => {
        test('should sign and verify with ECDSA', async () => {
            const content = 'Test document content';
            const signerDID = 'did:midnight:test1';
            const keyId = 'ecdsa-key';

            const signedDoc = await documentSigning.createSignedDocument(content, signerDID, keyId);
            expect(signedDoc.keyId).toBe(keyId);
            
            const isValid = await documentSigning.verifySignature(signedDoc);
            expect(isValid).toBe(true);
        });

        test('should sign and verify with RSA', async () => {
            const content = 'Test document content';
            const signerDID = 'did:midnight:test1';
            const keyId = 'rsassa-key';

            const signedDoc = await documentSigning.createSignedDocument(content, signerDID, keyId);
            expect(signedDoc.keyId).toBe(keyId);
            
            const isValid = await documentSigning.verifySignature(signedDoc);
            expect(isValid).toBe(true);
        });

        test('should create and verify signature with specific key', async () => {
            const content = 'Test document content';
            const signerDID = 'did:midnight:test1';
            const keyId = 'rsassa-key';

            const signedDoc = await documentSigning.createSignedDocument(content, signerDID, keyId);
            
            expect(signedDoc.content).toBe(content);
            expect(signedDoc.signerDID).toBe(signerDID);
            expect(signedDoc.keyId).toBe(keyId);
            expect(typeof signedDoc.signature).toBe('string');

            const isValid = await documentSigning.verifySignature(signedDoc);
            expect(isValid).toBe(true);
        });

        test('should handle unsupported algorithm', async () => {
            const mockDocWithUnsupportedAlg = {
                content: 'Test content',
                signature: 'test-signature',
                signerDID: 'did:midnight:test1',
                keyId: 'unsupported-key'
            };

            const result = await documentSigning.verifySignature(mockDocWithUnsupportedAlg);
            expect(result).toBe(false);
        });

        test('should create and verify signature', async () => {
            const content = 'Test document content';
            const signerDID = 'did:midnight:test1';

            const signedDoc = await documentSigning.createSignedDocument(content, signerDID);
            
            expect(signedDoc.content).toBe(content);
            expect(signedDoc.signerDID).toBe(signerDID);
            expect(typeof signedDoc.signature).toBe('string');

            const isValid = await documentSigning.verifySignature(signedDoc);
            expect(isValid).toBe(true);
        });

        test('should handle invalid DID when signing', async () => {
            const content = 'Test document content';
            const signerDID = 'did:midnight:invalid';

            await expect(documentSigning.createSignedDocument(content, signerDID))
                .rejects.toThrow('Resolution failed');
        });

        test('should validate content when signing', async () => {
            const signerDID = 'did:midnight:test1';

            await expect(documentSigning.createSignedDocument('', signerDID))
                .rejects.toThrow('Content cannot be empty');
        });

        test('should verify valid signature', async () => {
            const content = 'Test document content';
            const contentBuffer = new TextEncoder().encode(content);
            const signature = await window.crypto.subtle.sign(
                {
                    name: 'ECDSA',
                    hash: { name: 'SHA-256' },
                },
                keyPairs['ecdsa-key'].privateKey,
                contentBuffer
            );

            const document = {
                content,
                signature: Buffer.from(signature).toString('base64'),
                signerDID: 'did:midnight:test1',
                keyId: 'ecdsa-key'
            };

            const result = await documentSigning.verifySignature(document);
            expect(result).toBe(true);
        });

        test('should reject invalid signature', async () => {
            const document = {
                content: 'Test document content',
                signature: 'invalid_base64_signature',
                signerDID: 'did:midnight:test1',
                keyId: 'ecdsa-key'
            };

            const result = await documentSigning.verifySignature(document);
            expect(result).toBe(false);
        });

        test('should handle DID resolution failure', async () => {
            const document = {
                content: 'Test document content',
                signature: 'valid_signature',
                signerDID: 'did:midnight:invalid',
                keyId: 'ecdsa-key'
            };

            await expect(documentSigning.verifySignature(document)).rejects.toThrow('Resolution failed');
        });

        test('should validate document format', async () => {
            const invalidDocument = {
                content: 'Test document content',
                // Missing signature and signerDID
            };

            await expect(documentSigning.verifySignature(invalidDocument)).rejects.toThrow('Invalid document format');
        });
    });
}); 