import { describe, it, expect, beforeEach } from 'vitest';
import { DIDService } from '../../services/did/didService';
import { KYCService } from '../../services/kyc/kycService';
import { ZKService } from '../../services/zk/zkService';
import { TestHelpers } from '../utils/testHelpers';

describe('Service Integration Tests', () => {
  let didService: DIDService;
  let kycService: KYCService;
  let zkService: ZKService;
  const mockEndpoint = 'https://api.midnight.test';

  beforeEach(() => {
    didService = new DIDService(mockEndpoint);
    kycService = new KYCService(mockEndpoint);
    zkService = new ZKService(mockEndpoint);
    TestHelpers.resetMocks();
  });

  describe('KYC to DID Flow', () => {
    it('should complete full KYC verification and DID creation', async () => {
      await TestHelpers.mockServiceFlow({
        kycSession: true,
        zkProof: true,
        kycVerification: true,
        didCreation: true
      });

      const sessionId = await kycService.initiateKYC('0x123...789');
      expect(sessionId).toBe('session123');

      const kycProof = await zkService.generateProof({
        privateInputs: { sessionId },
        publicInputs: { status: 'verified' }
      });
      expect(kycProof.proof).toBe('mockProof123');

      const isKycValid = await kycService.verifyKYC(kycProof);
      expect(isKycValid).toBe(true);

      const did = await didService.createDID(kycProof);
      expect(did.id).toBe('did:midnight:123');
    });
  });

  describe('Document Signing Flow', () => {
    it('should generate and verify signature proof with DID', async () => {
      const mockMessage = 'Test document content';
      const mockDid = 'did:midnight:123';

      // Mock DID verification
      global.fetch = TestHelpers.mockFetch({ isValid: true });

      const isDidValid = await didService.verifyDID(mockDid);
      expect(isDidValid).toBe(true);

      // Mock signature proof generation
      const mockSignatureProof = TestHelpers.createMockZKProof({
        protocol: 'plonk',
        proof: 'signatureProof123'
      });

      global.fetch = TestHelpers.mockFetch(mockSignatureProof);

      const signatureProof = await zkService.generateSignatureProof(
        mockMessage,
        mockDid,
        { privateKey: 'secret' }
      );

      // Mock proof verification
      global.fetch = TestHelpers.mockFetch({ isValid: true });

      const verificationResult = await zkService.verifyProof(signatureProof);
      expect(verificationResult.isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle failed KYC verification gracefully', async () => {
      const invalidProof = TestHelpers.createMockZKProof({
        proof: 'invalid',
        publicInputs: [],
        verificationKey: 'invalid',
        protocol: 'groth16'
      });

      global.fetch = TestHelpers.mockFetch(invalidProof, false);

      const isValid = await kycService.verifyKYC(invalidProof);
      expect(isValid).toBe(false);
    });

    it('should handle network errors', async () => {
      TestHelpers.mockNetworkError();
      
      await expect(didService.resolveDID('invalid-did'))
        .rejects
        .toThrow('Network error');
    });
  });
}); 