import { describe, test, expect, beforeEach } from 'vitest';
import { DocumentSigning } from '../../services/DocumentSigning';
import { DIDManagement } from '../../services/DIDManagement';
import { CryptoService } from '../../services/CryptoService';
import {
    EmptyContentError,
    NoVerificationMethodsError,
    KeyNotFoundError,
    PrivateKeyNotAvailableError,
    InvalidDocumentFormatError
} from '../../errors/DocumentSigningErrors';
import { MidnightDIDDocument } from '../../types/DID';

describe('DocumentSigning', () => {
    let documentSigning: DocumentSigning;
    let mockDIDManagement: DIDManagement;
    let cryptoService: CryptoService;

    beforeEach(() => {
        const mockDIDDoc: MidnightDIDDocument = {
            id: 'did:midnight:test1',
            verificationMethod: [
                {
                    id: 'did:midnight:test1#key-1',
                    type: 'MidnightSecp256k1VerificationKey2024',
                    controller: 'did:midnight:test1',
                    publicKeyHex: '04ab...', // Example public key
                    privateKeyHex: '123...', // Example private key
                },
                {
                    id: 'did:midnight:test1#key-2',
                    type: 'MidnightSecp256k1VerificationKey2024',
                    controller: 'did:midnight:test1',
                    publicKeyHex: '04cd...', // Example public key
                    privateKeyHex: '456...', // Example private key
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

        cryptoService = new CryptoService();
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

    describe('Signature Parameters', () => {
        test('should include correct signature parameters', async () => {
            const content = 'Test content';
            const signerDID = 'did:midnight:test1';
            const keyId = 'key-1';

            const signedDoc = await documentSigning.createSignedDocument(content, signerDID, keyId);

            expect(signedDoc.signatureParams).toEqual({
                type: 'MidnightSignature2024',
                created: expect.any(String),
                verificationMethod: `${signerDID}#${keyId}`,
                proofPurpose: 'assertionMethod'
            });

            // Verify created timestamp is valid and not in future
            const createdDate = new Date(signedDoc.signatureParams.created);
            expect(createdDate).toBeLessThanOrEqual(new Date());
            expect(createdDate).toBeInstanceOf(Date);
        });

        test('should respect custom proof purpose', async () => {
            const signedDoc = await documentSigning.createSignedDocument(
                'Test content',
                'did:midnight:test1',
                'key-1',
                { proofPurpose: 'authentication' }
            );

            expect(signedDoc.signatureParams.proofPurpose).toBe('authentication');
        });
    });

    // Note: Actual signing/verification tests are commented out since we haven't implemented
    // the actual Midnight cryptographic functions yet
    /*
    describe('Signing and Verification', () => {
        test('should sign and verify document', async () => {
            const content = 'Test document content';
            const signerDID = 'did:midnight:test1';
            const keyId = 'key-1';

            const signedDoc = await documentSigning.createSignedDocument(content, signerDID, keyId);
            const isValid = await documentSigning.verifySignature(signedDoc);
            
            expect(isValid).toBe(true);
        });
    });
    */
}); 