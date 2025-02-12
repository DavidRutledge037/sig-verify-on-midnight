import { jest } from '@jest/globals';
import { ProofService } from '../../src/services/proof.service';
import { MidnightService } from '../../src/services/midnight.service';
import { DIDDocument } from '../../src/types/did.types';
import { TransactionDetails, Proof } from '../../src/types/transaction.types';

describe('Proof Service Tests', () => {
    let proofService: ProofService;
    let mockMidnightService: jest.Mocked<MidnightService>;

    const mockDID: DIDDocument = {
        id: 'did:midnight:test123',
        controller: 'did:midnight:controller123',
        verificationMethod: [],
        authentication: [],
        assertionMethod: [],
        keyAgreement: [],
        capabilityInvocation: [],
        capabilityDelegation: [],
        service: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        status: 'active'
    };

    const mockTxDetails: TransactionDetails = {
        hash: 'txhash123',
        height: 100,
        index: 0,
        proof: {
            type: 'Ed25519Signature2020',
            created: new Date().toISOString(),
            creator: 'did:midnight:creator123',
            signatureValue: 'signature123',
            data: { test: 'data' }
        },
        tx: {
            type: 'test',
            data: { test: 'data' }
        }
    };

    beforeEach(() => {
        mockMidnightService = {
            getTransactionDetails: jest.fn(),
            verifyTransaction: jest.fn(),
            // ... other required methods
        } as jest.Mocked<MidnightService>;

        proofService = new ProofService(mockMidnightService);
    });

    it('should get proof for a DID', async () => {
        mockMidnightService.getTransactionDetails.mockResolvedValue(mockTxDetails);
        const proof = await proofService.getProof(mockDID.id);
        expect(proof).toBeDefined();
        expect(proof?.type).toBe('Ed25519Signature2020');
    });

    it('should get proof for a hash', async () => {
        mockMidnightService.getTransactionDetails.mockResolvedValue(mockTxDetails);
        const proof = await proofService.getProof('hash123');
        expect(proof).toBeDefined();
        expect(proof?.type).toBe('Ed25519Signature2020');
    });

    it('should verify a valid proof', async () => {
        mockMidnightService.getTransactionDetails.mockResolvedValue(mockTxDetails);
        mockMidnightService.verifyTransaction.mockResolvedValue(true);
        
        const proof = await proofService.getProof('hash123');
        const isValid = await proofService.verifyProof('hash123');
        
        expect(isValid).toBe(true);
        expect(mockMidnightService.verifyTransaction).toHaveBeenCalled();
    });

    it('should handle missing proof', async () => {
        mockMidnightService.getTransactionDetails.mockResolvedValue(null);
        const proof = await proofService.getProof('nonexistent');
        expect(proof).toBeNull();
    });

    it('should handle verification of missing proof', async () => {
        mockMidnightService.getTransactionDetails.mockResolvedValue(null);
        const isValid = await proofService.verifyProof('nonexistent');
        expect(isValid).toBe(false);
    });
}); 