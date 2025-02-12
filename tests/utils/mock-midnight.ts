import { MidnightService } from '../../src/services/midnight';
import { TransactionDetails, Block } from '../../src/types/transaction';

export const createMockMidnightService = () => {
    const mockService = {
        submitProof: jest.fn(),
        verifyProof: jest.fn(),
        getTransactionDetails: jest.fn(),
        getTx: jest.fn(),
        getHeight: jest.fn(),
        getBlock: jest.fn()
    };

    // Default implementations
    mockService.submitProof.mockResolvedValue('mock-tx-hash');
    mockService.verifyProof.mockResolvedValue(true);
    mockService.getTransactionDetails.mockResolvedValue({
        hash: 'mock-tx-hash',
        height: 1,
        index: 0,
        proof: {
            type: 'test',
            created: new Date().toISOString(),
            creator: 'test',
            signatureValue: 'test',
            data: {}
        },
        tx: new Uint8Array(),
        transactionHash: 'mock-tx-hash',
        blockHeight: 1,
        timestamp: new Date(),
        gasUsed: 0,
        fee: '0'
    } as TransactionDetails);

    return mockService as jest.Mocked<MidnightService>;
}; 