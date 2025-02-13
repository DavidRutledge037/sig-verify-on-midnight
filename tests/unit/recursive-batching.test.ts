import { assert } from 'chai';
import { ProofBatchingService } from '../../src/services/proof-batching';
import { WalletService } from '../../src/services/wallet';

describe('ZK Recursive Batching', () => {
  let batchingService: ProofBatchingService;
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    batchingService = new ProofBatchingService(walletService);
  });

  describe('Recursive Batch Creation', () => {
    it('should create recursive batch from multiple batches', async () => {
      const batch1 = await batchingService.createBatch([
        { data: new Uint8Array([1]), type: 'transfer' }
      ]);
      const batch2 = await batchingService.createBatch([
        { data: new Uint8Array([2]), type: 'mint' }
      ]);

      const recursiveBatch = await batchingService.batchRecursively([batch1, batch2]);
      assert.isArray(recursiveBatch.proofs);
      assert.lengthOf(recursiveBatch.proofs, 2);
    });

    it('should handle nested recursive batches', async () => {
      const batch1 = await batchingService.createBatch([
        { data: new Uint8Array([1]), type: 'transfer' }
      ]);
      const batch2 = await batchingService.createBatch([
        { data: new Uint8Array([2]), type: 'mint' }
      ]);

      const firstRecursive = await batchingService.batchRecursively([batch1, batch2]);
      const batch3 = await batchingService.createBatch([
        { data: new Uint8Array([3]), type: 'burn' }
      ]);

      const nestedRecursive = await batchingService.batchRecursively([firstRecursive, batch3]);
      assert.isArray(nestedRecursive.proofs);
      assert.lengthOf(nestedRecursive.proofs, 2);
    });
  });

  describe('Recursive Batch Verification', () => {
    it('should verify recursive batch integrity', async () => {
      const batch1 = await batchingService.createBatch([
        { data: new Uint8Array([1]), type: 'transfer' }
      ]);
      const batch2 = await batchingService.createBatch([
        { data: new Uint8Array([2]), type: 'mint' }
      ]);

      const recursiveBatch = await batchingService.batchRecursively([batch1, batch2]);
      const isValid = await batchingService.verifyBatch();
      assert.isTrue(isValid, 'Recursive batch should be valid');
    });

    it('should verify nested recursive batch integrity', async () => {
      const batch1 = await batchingService.createBatch([
        { data: new Uint8Array([1]), type: 'transfer' }
      ]);
      const batch2 = await batchingService.createBatch([
        { data: new Uint8Array([2]), type: 'mint' }
      ]);

      const firstRecursive = await batchingService.batchRecursively([batch1, batch2]);
      const batch3 = await batchingService.createBatch([
        { data: new Uint8Array([3]), type: 'burn' }
      ]);

      const nestedRecursive = await batchingService.batchRecursively([firstRecursive, batch3]);
      const isValid = await batchingService.verifyBatch();
      assert.isTrue(isValid, 'Nested recursive batch should be valid');
    });
  });

  describe('Recursive Batch Performance', () => {
    it('should handle large recursive batches', async () => {
      const batches = await Promise.all(
        Array(10).fill(null).map(() => 
          batchingService.createBatch([
            { data: new Uint8Array([1]), type: 'transfer' }
          ])
        )
      );

      const recursiveBatch = await batchingService.batchRecursively(batches);
      assert.isArray(recursiveBatch.proofs);
      assert.lengthOf(recursiveBatch.proofs, 10);
    });
  });
}); 