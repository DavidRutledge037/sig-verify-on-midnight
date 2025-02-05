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

describe('DocumentSigning', () => {
    let documentSigning: DocumentSigning;
    let mockDIDManagement: DIDManagement;
    let cryptoService: CryptoService;

    beforeEach(() => {
        const mockDIDDoc = {
            id: 'did:midnight:test1',
            verificationMethod: [
                {
                    id: 'did:midnight:test1#key-1',
                    type: 'MidnightSecp256k1VerificationKey2024',
                    controller: 'did:midnight:test1',
                    publicKeyHex: '04ab01', // Example public key
                    privateKeyHex: '123456', // Example private key
                }
            ],
            authentication: ['did:midnight:test1#key-1']
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
                            privateKeyHex: undefined
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

        // Mock CryptoService implementation
        cryptoService = {
            sign: async () => ({
                signature: 'mock_signature',
                params: {
                    type: 'MidnightSignature2024',
                    created: new Date().toISOString(),
                    verificationMethod: 'did:midnight:test1#key-1',
                    proofPurpose: 'assertionMethod'
                }
            }),
            verify: async () => true
        } as unknown as CryptoService;

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
            const invalidDoc: any = { content: 'test' };
            await expect(documentSigning.verifySignature(invalidDoc))
                .rejects.toThrow(InvalidDocumentFormatError);
        });
    });

    describe('Signing and Verification', () => {
        test('should create and verify signature', async () => {
            const content = 'Test content';
            const signerDID = 'did:midnight:test1';
            const keyId = 'key-1';

            const signedDoc = await documentSigning.createSignedDocument(content, signerDID, keyId);
            
            expect(signedDoc).toEqual({
                content,
                signature: 'mock_signature',
                signatureParams: {
                    type: 'MidnightSignature2024',
                    created: expect.any(String),
                    verificationMethod: 'did:midnight:test1#key-1',
                    proofPurpose: 'assertionMethod'
                },
                signerDID,
                keyId
            });

            const isValid = await documentSigning.verifySignature(signedDoc);
            expect(isValid).toBe(true);
        });

        test('should handle DID resolution failure', async () => {
            const signedDoc = {
                content: 'Test content',
                signature: 'mock_signature',
                signatureParams: {
                    type: 'MidnightSignature2024',
                    created: new Date().toISOString(),
                    verificationMethod: 'did:midnight:invalid#key-1',
                    proofPurpose: 'assertionMethod'
                },
                signerDID: 'did:midnight:invalid',
                keyId: 'key-1'
            };

            await expect(documentSigning.verifySignature(signedDoc))
                .rejects.toThrow('Resolution failed');
        });
    });
}); 