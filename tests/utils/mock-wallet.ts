import { IWalletService } from '../../src/types/services';
import { randomBytes } from 'crypto';

export const createMockWalletService = () => {
    const mockKeyPair = {
        publicKey: new Uint8Array(randomBytes(32)),
        privateKey: new Uint8Array(randomBytes(32))
    };

    const mockAddress = randomBytes(20).toString('hex');

    const mockService: jest.Mocked<IWalletService> = {
        createWallet: jest.fn().mockResolvedValue({ address: mockAddress }),
        sign: jest.fn().mockResolvedValue(new Uint8Array(randomBytes(64))),
        verify: jest.fn().mockResolvedValue(true),
        getAddress: jest.fn().mockResolvedValue(mockAddress),
        getPublicKey: jest.fn().mockReturnValue(mockKeyPair.publicKey),
        isInitialized: jest.fn().mockReturnValue(true)
    };

    return {
        service: mockService,
        keyPair: mockKeyPair,
        address: mockAddress
    };
}; 