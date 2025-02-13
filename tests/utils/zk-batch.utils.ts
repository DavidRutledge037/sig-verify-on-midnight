import { expect } from 'chai';

export interface ProofBatch {
  id: string;
  proofs: {
    id: string;
    data: Uint8Array;
    type: string;
    metadata: {
      timestamp: number;
      schema: string;
    };
  }[];
  aggregatedProof: {
    data: Uint8Array;
    commitment: string;
    metadata: {
      scheme: string;
      parameters: Map<string, number>;
    };
  };
  verification: {
    status: 'valid' | 'invalid';
    proof: Uint8Array;
    timestamp: number;
  };
}

export const createTestProofBatch = (): ProofBatch => ({
  id: '0x' + Array(32).fill('0').join(''),
  proofs: Array(3).fill(0).map((_, i) => ({
    id: '0x' + Array(32).fill(i.toString()).join(''),
    data: new Uint8Array([1, 2, 3, 4]),
    type: 'transfer',
    metadata: {
      timestamp: Date.now(),
      schema: 'midnight.proof.v1'
    }
  })),
  aggregatedProof: {
    data: new Uint8Array([5, 6, 7, 8]),
    commitment: '0x' + Array(64).fill('1').join(''),
    metadata: {
      scheme: 'groth16',
      parameters: new Map([
        ['compression_level', 3],
        ['batch_size', 3]
      ])
    }
  },
  verification: {
    status: 'valid',
    proof: new Uint8Array([9, 10, 11, 12]),
    timestamp: Date.now()
  }
});

export const expectToBeValidProofBatch = (batch: ProofBatch) => {
  expect(batch.id).to.match(/^0x[a-fA-F0-9]{32}$/);
  expect(batch.proofs).to.be.an('array');
  batch.proofs.forEach(proof => {
    expect(proof.id).to.match(/^0x[a-fA-F0-9]{32}$/);
    expect(proof.data).to.be.instanceOf(Uint8Array);
    expect(proof.metadata).to.include.keys('timestamp', 'schema');
  });
  expect(batch.aggregatedProof.data).to.be.instanceOf(Uint8Array);
  expect(batch.aggregatedProof.commitment).to.match(/^0x[a-fA-F0-9]{64}$/);
  expect(batch.aggregatedProof.metadata.parameters).to.be.instanceOf(Map);
  expect(batch.verification.status).to.be.oneOf(['valid', 'invalid']);
  expect(batch.verification.proof).to.be.instanceOf(Uint8Array);
}; 