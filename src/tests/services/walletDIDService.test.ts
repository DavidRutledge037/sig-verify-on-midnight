import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WalletDIDService } from '../../services/did/walletDIDService';
import { DIDService } from '../../services/did/didService';
import { LaceWallet } from '../../services/wallet/laceWallet';
import { ZKService } from '../../services/zk/zkService';
import { TestHelpers } from '../utils/testHelpers';

describe('WalletDIDService', () => {
  let walletDIDService: WalletDIDService;
  let mockDIDService: DIDService;
  let mockWallet: LaceWallet;
  let mockZKService: ZKService;

  beforeEach(() => {
    // Create mock services
    mockDIDService = {
      createDID: vi.fn(),
      resolveDID: vi.fn(),
      verifyDID: vi.fn()
    } as any;

    mockWallet = {
      connect: vi.fn().mockResolvedValue(true),
      getAddress: vi.fn().mockResolvedValue('addr1...'),
      signMessage: vi.fn().mockResolvedValue('signature123')
    } as any;

    mockZKService = {
      generateProof: vi.fn().mockResolvedValue(TestHelpers.createMockZKProof()),
      verifyProof: vi.fn().mockResolvedValue({ isValid: true })
    } as any;

    walletDIDService = new WalletDIDService(
      mockDIDService,
      mockWallet,
      mockZKService
    );
  });

  describe('createWalletDID', () => {
    const mockKYCProof = TestHelpers.createMockZKProof({
      proof: 'kycProof123'
    });

    it('should create a DID with valid wallet and KYC proofs', async () => {
      const mockDID = TestHelpers.createMockDIDDocument();
      mockDIDService.createDID.mockResolvedValue(mockDID);

      const result = await walletDIDService.createWalletDID(mockKYCProof);

      expect(result).toBeTruthy();
      expect(mockWallet.connect).toHaveBeenCalled();
      expect(mockWallet.getAddress).toHaveBeenCalled();
      expect(mockWallet.signMessage).toHaveBeenCalled();
      expect(mockZKService.generateProof).toHaveBeenCalled();
      expect(mockDIDService.createDID).toHaveBeenCalled();
    });

    it('should handle wallet connection failure', async () => {
      mockWallet.connect.mockResolvedValue(false);
      
      const result = await walletDIDService.createWalletDID(mockKYCProof);
      
      expect(result).toBeNull();
      expect(mockDIDService.createDID).not.toHaveBeenCalled();
    });

    it('should handle missing wallet address', async () => {
      mockWallet.getAddress.mockResolvedValue(null);
      
      const result = await walletDIDService.createWalletDID(mockKYCProof);
      
      expect(result).toBeNull();
      expect(mockDIDService.createDID).not.toHaveBeenCalled();
    });
  });

  describe('verifyWalletDID', () => {
    const mockDID = 'did:midnight:123';

    it('should verify a valid wallet-linked DID', async () => {
      const mockDIDDoc = TestHelpers.createMockDIDDocument(mockDID, {
        verificationMethod: [{
          id: `${mockDID}#key-1`,
          type: 'WalletVerificationKey2023',
          controller: mockDID,
          proofValue: 'mockProofValue123'
        }]
      });

      mockDIDService.resolveDID.mockResolvedValue(mockDIDDoc);
      mockWallet.getAddress.mockResolvedValue('addr1...');
      mockZKService.verifyProof.mockResolvedValue(true);

      const result = await walletDIDService.verifyWalletDID(mockDID);
      
      expect(result).toBe(true);
      expect(mockDIDService.resolveDID).toHaveBeenCalledWith(mockDID);
      expect(mockZKService.verifyProof).toHaveBeenCalledWith({
        proof: 'mockProofValue123',
        publicInputs: {
          address: 'addr1...'
        }
      });
    });

    it('should handle DID resolution failure', async () => {
      mockDIDService.resolveDID.mockResolvedValue(null);
      
      const result = await walletDIDService.verifyWalletDID(mockDID);
      
      expect(result).toBe(false);
      expect(mockZKService.verifyProof).not.toHaveBeenCalled();
    });

    it('should handle wallet address mismatch', async () => {
      mockWallet.getAddress.mockResolvedValue(null);
      
      const result = await walletDIDService.verifyWalletDID(mockDID);
      
      expect(result).toBe(false);
      expect(mockZKService.verifyProof).not.toHaveBeenCalled();
    });
  });
}); 