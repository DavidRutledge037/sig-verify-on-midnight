import { assert } from 'chai';
import { ProofBatchingService } from '../../src/services/proof-batching';
import { WalletService } from '../../src/services/wallet';

describe('ZK Batch Creation', () => {
  let batchingService: ProofBatchingService;
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    batchingService = new ProofBatchingService(walletService);
  });

  describe('Input Validation', () => {
    it('should validate proof data format', async () => {
      const validProof = {
        data: new Uint8Array([1, 2, 3]),
        type: 'transfer'
      };
      const batch = await batchingService.createBatch([validProof]);
      assert.isNotNull(batch);
      assert.isArray(batch.proofs);
    });

    it('should validate proof type', async () => {
      const invalidProof = {
        data: new Uint8Array([1, 2, 3]),
        type: 'invalid_type'
      };
      try {
        await batchingService.createBatch([invalidProof]);
        assert.fail('Should throw error for invalid proof type');
      } catch (error: any) {
        assert.include(error.message, 'Invalid proof type');
      }
    });

    it('should handle empty proofs', async () => {
      try {
        await batchingService.createBatch([]);
        assert.fail('Should throw error for empty proofs array');
      } catch (error: any) {
        assert.include(error.message, 'Empty proofs array');
      }
    });

    it('should validate batch size limits', async () => {
      const maxBatchSize = 1000;
      const tooManyProofs = Array(maxBatchSize + 1).fill({
        data: new Uint8Array([1]),
        type: 'transfer'
      });

      try {
        await batchingService.createBatch(tooManyProofs);
        assert.fail('Should throw error for exceeding batch size limit');
      } catch (error: any) {
        assert.include(error.message, 'Batch size limit exceeded');
      }
    });
  });

  describe('Batch Structure', () => {
    it('should create correct batch ID format', async () => {
      const batch = await batchingService.createBatch([{
        data: new Uint8Array([1]),
        type: 'transfer'
      }]);
      assert.match(batch.id, /^0x[a-fA-F0-9]{64}$/);
    });

    it('should structure proofs correctly', async () => {
      const inputProof = {
        data: new Uint8Array([1, 2, 3]),
        type: 'transfer'
      };
      const batch = await batchingService.createBatch([inputProof]);
      
      assert.isArray(batch.proofs);
      const proof = batch.proofs[0];
      assert.property(proof, 'id');
      assert.property(proof, 'data');
      assert.property(proof, 'type');
      assert.property(proof, 'metadata');
    });

    it('should set correct metadata', async () => {
      const batch = await batchingService.createBatch([{
        data: new Uint8Array([1]),
        type: 'transfer'
      }]);

      const proof = batch.proofs[0];
      assert.property(proof.metadata, 'timestamp');
      assert.property(proof.metadata, 'schema');
      assert.equal(proof.metadata.schema, 'midnight.proof.v1');
    });

    it('should handle aggregated proof creation', async () => {
      const batch = await batchingService.createBatch([{
        data: new Uint8Array([1]),
        type: 'transfer'
      }]);

      assert.property(batch, 'aggregatedProof');
      assert.property(batch.aggregatedProof, 'data');
      assert.property(batch.aggregatedProof, 'commitment');
      assert.property(batch.aggregatedProof.metadata, 'scheme');
      assert.equal(batch.aggregatedProof.metadata.scheme, 'groth16');
    });
  });
}); 