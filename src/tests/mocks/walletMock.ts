import { jest } from '@jest/globals';
import type { MidnightSDK, ZKProof } from '../../types/sdk.js';

type TransactionStatus = 'confirmed' | 'pending' | 'failed';

// Create mock SDK functions with proper types
const mockSDKFns = {
    getTransactionStatus: jest.fn<(hash: string) => Promise<TransactionStatus>>()
        .mockImplementation(async (hash) => hash === 'tx_123' ? 'confirmed' : 'pending'),
        
    generateZKProof: jest.fn<(data: any) => Promise<ZKProof>>()
        .mockImplementation(async () => ({
            proof: 'zk_proof_123',
            publicInputs: [],
            privateInputs: []
        })),
        
    submitShieldedTransaction: jest.fn<
        (method: string, args: any[], proof?: ZKProof) => Promise<string>
    >().mockImplementation(async () => 'tx_hash_123'),

    getNetwork: jest.fn<() => Promise<string>>()
        .mockResolvedValue('midnight-1'),

    getAddress: jest.fn<() => Promise<string>>()
        .mockResolvedValue('midnight1234...5678'),

    verifyZKProof: jest.fn<(proof: ZKProof) => Promise<boolean>>()
        .mockResolvedValue(true)
} as const;

export const mockSDK = {
    ...mockSDKFns,
    nodeUrl: 'http://localhost:8080',
    chainId: 'midnight-1',
    privacyLevel: 'shielded'
} as unknown as jest.Mocked<MidnightSDK>;

// Create mock wallet functions with proper types
type WalletFunctions = {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getAddress(): Promise<string>;
    getPublicKey(): Promise<string>;
    getNetwork(): Promise<string>;
    signTransaction(tx: any): Promise<string>;
    signMessage(msg: string): Promise<string>;
    isConnected(): Promise<boolean>;
    switchNetwork(network: string): Promise<void>;
};

export const mockMidnightWallet = {
    connect: jest.fn<WalletFunctions['connect']>().mockResolvedValue(undefined),
    disconnect: jest.fn<WalletFunctions['disconnect']>().mockResolvedValue(undefined),
    getAddress: jest.fn<WalletFunctions['getAddress']>().mockResolvedValue('midnight1234...5678'),
    getPublicKey: jest.fn<WalletFunctions['getPublicKey']>().mockResolvedValue('pubkey123'),
    getNetwork: jest.fn<WalletFunctions['getNetwork']>().mockResolvedValue('midnight-1'),
    signTransaction: jest.fn<WalletFunctions['signTransaction']>().mockResolvedValue('tx_hash_123'),
    signMessage: jest.fn<WalletFunctions['signMessage']>().mockResolvedValue('signed_message'),
    isConnected: jest.fn<WalletFunctions['isConnected']>().mockResolvedValue(true),
    switchNetwork: jest.fn<WalletFunctions['switchNetwork']>().mockResolvedValue(undefined)
} as const; 