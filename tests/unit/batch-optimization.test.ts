import { assert } from 'chai';
import { ProofBatchingService } from '../../src/services/proof-batching';
import { WalletService } from '../../src/services/wallet';

describe('ZK Batch Optimization', () => {
  let batchingService: ProofBatchingService;
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    batchingService = new ProofBatchingService(walletService);
  });

  describe('Parameter Optimization', () => {
    it('should optimize compression parameters', async () => {
      const proofs = [
        { data: new Uint8Array([1, 2, 3]), type: 'transfer' },
        { data: new Uint8Array([4, 5, 6]), type: 'mint' }
      ];
      const result = await batchingService.optimizeBatch(proofs);
      assert.property(result.aggregatedProof.metadata, 'parameters');
      assert.isTrue(result.aggregatedProof.metadata.parameters.has('compression_level'));
    });

    it('should handle empty parameter set', async () => {
      const proofs = [
        { data: new Uint8Array([1]), type: 'transfer' }
      ];
      const result = await batchingService.optimizeBatch(proofs);
      assert.property(result.aggregatedProof.metadata, 'parameters');
    });
  });

  describe('Performance Optimization', () => {
    it('should optimize large batches', async () => {
      const largeProofSet = Array(100).fill(null).map(() => ({
        data: new Uint8Array([1, 2, 3]),
        type: 'transfer'
      }));
      const result = await batchingService.optimizeBatch(largeProofSet);
      assert.property(result.aggregatedProof.metadata, 'parameters');
    });

    it('should optimize different proof types', async () => {
      const mixedProofs = [
        { data: new Uint8Array([1]), type: 'transfer' },
        { data: new Uint8Array([2]), type: 'mint' },
        { data: new Uint8Array([3]), type: 'burn' }
      ];
      const result = await batchingService.optimizeBatch(mixedProofs);
      assert.property(result.aggregatedProof.metadata, 'parameters');
    });
  });
}); 