import { jest } from '@jest/globals';
import type { ZKProof } from '../../types/sdk.js';

const generateZKProof = jest.fn().mockResolvedValue({
    proof: 'test_proof',
    publicInputs: [],
    privateInputs: []
} as ZKProof);

const verifyZKProof = jest.fn().mockResolvedValue(true);

const generateHash = jest.fn().mockReturnValue('test_hash');

const generateNonce = jest.fn().mockReturnValue('test_nonce');

export default {
    generateZKProof,
    verifyZKProof,
    generateHash,
    generateNonce
}; 