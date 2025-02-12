import { jest } from '@jest/globals';
import { DIDDocument } from '../../src/types/did.types';
import { TransactionDetails } from '../../src/types/transaction';

export interface MockServices {
    DIDService: {
        createDID: jest.Mock<Promise<DIDDocument>>;
        isValidDIDFormat: jest.Mock<boolean>;
    };
    MidnightService: {
        submitProof: jest.Mock<Promise<string>>;
        verifyProof: jest.Mock<Promise<boolean>>;
        getTransactionDetails: jest.Mock<Promise<TransactionDetails>>;
        getTx: jest.Mock<Promise<Uint8Array>>;
        getHeight: jest.Mock<Promise<number>>;
        getBlock: jest.Mock<Promise<any>>;
    };
    StorageService: {
        getDID: jest.Mock<Promise<DIDDocument | null>>;
        storeDID: jest.Mock<Promise<void>>;
        updateDID: jest.Mock<Promise<boolean>>;
        deleteDID: jest.Mock<Promise<boolean>>;
    };
}

export const createMockServices = (): MockServices => ({
    DIDService: {
        createDID: jest.fn(),
        isValidDIDFormat: jest.fn()
    },
    MidnightService: {
        submitProof: jest.fn(),
        verifyProof: jest.fn(),
        getTransactionDetails: jest.fn(),
        getTx: jest.fn(),
        getHeight: jest.fn(),
        getBlock: jest.fn()
    },
    StorageService: {
        getDID: jest.fn(),
        storeDID: jest.fn(),
        updateDID: jest.fn(),
        deleteDID: jest.fn()
    }
}); 