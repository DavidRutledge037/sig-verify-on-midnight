import { assert } from 'chai';
import { ProofBatchingService } from '../../src/services/proof-batching';
import { WalletService } from '../../src/services/wallet';

describe('ZK Proof Verification', () => {
  let batchingService: ProofBatchingService;
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    batchingService = new ProofBatchingService(walletService);
  });

  describe('Individual Proof Verification', () => {
    it('should verify a single valid proof', async () => {
      const proof = {
        data: new Uint8Array([1, 2, 3]),
        type: 'transfer'
      };
      const isValid = await batchingService.verifyIndividualProof(proof);
      assert.isTrue(isValid, 'Valid proof should be verified');
    });

    it('should reject an invalid proof', async () => {
      const invalidProof = {
        data: new Uint8Array([255, 255, 255]), // Invalid data
        type: 'transfer'
      };
      const isValid = await batchingService.verifyIndividualProof(invalidProof);
      assert.isFalse(isValid, 'Invalid proof should be rejected');
    });
  });

  describe('Batch Verification', () => {
    it('should verify a valid batch', async () => {
      const proofs = [
        { data: new Uint8Array([1, 2, 3]), type: 'transfer' },
        { data: new Uint8Array([4, 5, 6]), type: 'mint' }
      ];
      const batch = await batchingService.createBatch(proofs);
      const isValid = await batchingService.verifyBatch();
      assert.isTrue(isValid);
    });

    it('should verify batch commitment', async () => {
      const proofs = [
        { data: new Uint8Array([1, 2, 3]), type: 'transfer' }
      ];
      const batch = await batchingService.createBatch(proofs);
      const isValid = await batchingService.verifyCommitment();
      assert.isTrue(isValid);
    });

    it('should verify aggregated proof', async () => {
      const proofs = [
        { data: new Uint8Array([1, 2, 3]), type: 'transfer' },
        { data: new Uint8Array([4, 5, 6]), type: 'mint' }
      ];
      const batch = await batchingService.createBatch(proofs);
      assert.property(batch, 'aggregatedProof');
      assert.property(batch.aggregatedProof, 'data');
      assert.property(batch.aggregatedProof, 'commitment');
    });
  });

  describe('Performance Verification', () => {
    it('should handle large batch verification', async () => {
      const largeProofSet = Array(100).fill(null).map(() => ({
        data: new Uint8Array([1, 2, 3]),
        type: 'transfer'
      }));
      const batch = await batchingService.createBatch(largeProofSet);
      const isValid = await batchingService.verifyBatch();
      assert.isTrue(isValid);
    });

    it('should verify proofs in parallel', async () => {
      const proofs = Array(10).fill(null).map(() => ({
        data: new Uint8Array([1, 2, 3]),
        type: 'transfer'
      }));
      const batch = await batchingService.createBatch(proofs);
      const verificationPromises = proofs.map(() => batchingService.verifyIndividualProof(proofs[0]));
      const results = await Promise.all(verificationPromises);
      results.forEach(isValid => assert.isTrue(isValid));
    });
  });
}); 