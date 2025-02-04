import { describe, test, expect, beforeEach, vi } from 'vitest';
import { EnterpriseAdmin } from '../EnterpriseAdmin';
import { DIDManagement } from '../DIDManagement';
import { KYCVerification } from '../KYCVerification';

describe('EnterpriseAdmin', () => {
    let enterpriseAdmin: EnterpriseAdmin;
    let mockDIDManagement: DIDManagement;
    let mockKYCVerification: KYCVerification;

    beforeEach(() => {
        mockDIDManagement = {
            resolveDID: vi.fn().mockImplementation(async (did: string) => ({
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

        mockKYCVerification = {
            verifyKYC: vi.fn().mockResolvedValue(true)
        } as KYCVerification;

        enterpriseAdmin = new EnterpriseAdmin(mockDIDManagement, mockKYCVerification);
    });

    test('should verify enterprise admin', async () => {
        const adminDID = 'did:midnight:admin1';
        const result = await enterpriseAdmin.verifyAdmin(adminDID);
        expect(result).toBe(true);
    });

    test('should reject non-admin DID', async () => {
        const nonAdminDID = 'did:midnight:user1';
        mockKYCVerification.verifyKYC = vi.fn().mockResolvedValue(false);
        
        const result = await enterpriseAdmin.verifyAdmin(nonAdminDID);
        expect(result).toBe(false);
    });

    test('should handle DID resolution failure', async () => {
        const invalidDID = 'did:midnight:invalid';
        mockDIDManagement.resolveDID = vi.fn().mockRejectedValue(new Error('Resolution failed'));
        
        await expect(enterpriseAdmin.verifyAdmin(invalidDID)).rejects.toThrow('Resolution failed');
    });

    test('should validate DID format', async () => {
        const invalidDID = 'invalid:did:format';
        await expect(enterpriseAdmin.verifyAdmin(invalidDID)).rejects.toThrow('Invalid DID format');
    });
}); 