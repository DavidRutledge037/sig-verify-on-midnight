import { describe, test, expect, beforeEach, vi } from 'vitest';
import { KYCVerification } from '../KYCVerification';
import { DIDManagement } from '../DIDManagement';
import { DocumentSigning } from '../DocumentSigning';
import type { DIDDocument } from '../types';

describe('KYCVerification', () => {
    let kycVerification: KYCVerification;
    let mockDIDManagement: DIDManagement;
    let mockDocumentSigning: DocumentSigning;

    beforeEach(() => {
        mockDIDManagement = {
            resolveDID: vi.fn().mockImplementation((did: string) => Promise.resolve({
                id: did,
                verificationMethod: [{
                    id: `${did}#key-1`,
                    type: 'Ed25519VerificationKey2020',
                    controller: did,
                    publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
                }],
                authentication: [`${did}#key-1`]
            }))
        } as DIDManagement;

        mockDocumentSigning = {
            verifySignature: vi.fn().mockImplementation(() => Promise.resolve(true))
        } as DocumentSigning;

        kycVerification = new KYCVerification(mockDIDManagement, mockDocumentSigning);
    });

    test('should verify KYC document', async () => {
        const kycDocument = {
            content: {
                userId: '123',
                level: 'advanced',
                timestamp: Date.now()
            },
            signature: 'valid_signature',
            signerDID: 'did:midnight:test1'
        };

        const result = await kycVerification.verifyKYC(kycDocument);
        expect(result).toBe(true);
    });

    test('should reject invalid KYC document', async () => {
        const invalidDocument = {
            content: {
                userId: '123',
                level: 'advanced',
                timestamp: Date.now()
            },
            signature: 'invalid_signature',
            signerDID: 'did:midnight:test2'
        };

        mockDocumentSigning.verifySignature = vi.fn().mockImplementation(() => Promise.resolve(false));
        const result = await kycVerification.verifyKYC(invalidDocument);
        expect(result).toBe(false);
    });

    test('should handle DID resolution failure', async () => {
        const kycDocument = {
            content: {
                userId: '123',
                level: 'advanced',
                timestamp: Date.now()
            },
            signature: 'valid_signature',
            signerDID: 'did:midnight:invalid'
        };

        mockDIDManagement.resolveDID = vi.fn().mockRejectedValue(new Error('Resolution failed'));
        await expect(kycVerification.verifyKYC(kycDocument)).rejects.toThrow('Resolution failed');
    });

    test('should validate document format', async () => {
        const invalidDocument = {
            content: {
                userId: '123'
                // Missing required fields
            }
        };

        await expect(kycVerification.verifyKYC(invalidDocument as any)).rejects.toThrow('Invalid KYC document format');
    });
}); 