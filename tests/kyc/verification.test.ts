import { describe, it, expect, vi } from 'vitest';
import { KYCManager } from '../../src/kyc/verification';

describe('KYCManager', () => {
    const kycManager = new KYCManager();

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

        const result = await kycManager.submitVerification(userId, mockDocuments);

        expect(result.userId).toBe(userId);
        expect(result.status).toBe('pending');
        expect(result.documents).toHaveLength(2);
        expect(result.documents[0].hash).toBeDefined();
    });

    it('should handle document verification status', async () => {
        const userId = 'test-user-id';
        const mockDocuments = [createMockFile('test content')];

        const result = await kycManager.submitVerification(userId, mockDocuments);
        expect(result.documents[0].verified).toBe(false);
    });
}); 