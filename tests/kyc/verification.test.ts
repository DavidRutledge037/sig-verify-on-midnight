import { jest, describe, it, expect } from '@jest/globals';
import { KYCVerification } from '../../src/kyc/verification';

describe('KYCVerification', () => {
    let kycVerification: KYCVerification;

    beforeEach(() => {
        kycVerification = new KYCVerification();
    });

    it('should verify KYC data', () => {
        const result = kycVerification.verify({
            name: 'Test User',
            dob: '1990-01-01',
            id: '123456789'
        });
        expect(result).toBeDefined();
        expect(result.verified).toBe(true);
    });

    // Mock File API
    const createMockFile = (content: string, name: string = 'test.pdf', type: string = 'application/pdf') => {
        const blob = new Blob([content], { type });
        return new File([blob], name, { type });
    };

    it('should submit verification documents', async () => {
        const userId = 'test-user-id';
        const mockDocuments = [
            createMockFile('test content 1'),
            createMockFile('test content 2')
        ];

        const result = await kycVerification.submitVerification(userId, mockDocuments);

        expect(result.userId).toBe(userId);
        expect(result.status).toBe('pending');
        expect(result.documents).toHaveLength(2);
        expect(result.documents[0].hash).toBeDefined();
    });

    it('should handle document verification status', async () => {
        const userId = 'test-user-id';
        const mockDocuments = [createMockFile('test content')];

        const result = await kycVerification.submitVerification(userId, mockDocuments);
        expect(result.documents[0].verified).toBe(false);
    });
}); 