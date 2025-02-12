import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { MidnightService } from '../../src/services/midnight';
import { StargateClient, SigningStargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

// Mock the Cosmos SDK classes
vi.mock('@cosmjs/stargate', () => ({
    StargateClient: {
        connect: vi.fn()
    },
    SigningStargateClient: {
        connectWithSigner: vi.fn()
    }
}));

vi.mock('@cosmjs/proto-signing', () => ({
    DirectSecp256k1HdWallet: {
        fromMnemonic: vi.fn()
    }
}));

describe('MidnightService', () => {
    let midnightService: MidnightService;
    let mockStargateClient: any;
    let mockSigningClient: any;
    let mockWallet: any;

    beforeEach(async () => {
        // Reset mocks
        vi.clearAllMocks();

        // Create mock clients
        mockStargateClient = {
            queryUnverified: vi.fn(),
            disconnect: vi.fn()
        };

        mockSigningClient = {
            signAndBroadcast: vi.fn(),
            disconnect: vi.fn()
        };

        mockWallet = {
            getAccounts: vi.fn().mockResolvedValue([{ address: 'midnight1mock' }])
        };

        // Set up mock responses
        (StargateClient.connect as any).mockResolvedValue(mockStargateClient);
        (SigningStargateClient.connectWithSigner as any).mockResolvedValue(mockSigningClient);
        (DirectSecp256k1HdWallet.fromMnemonic as any).mockResolvedValue(mockWallet);

        // Create service
        midnightService = new MidnightService('http://localhost:1234', 'test-chain-1');
        
        // Connect to network
        await midnightService.connect();
    });

    it('should submit a DID document', async () => {
        const mockDID = {
            id: 'did:midnight:123',
            verificationMethod: [],
            authentication: []
        };

        mockSigningClient.signAndBroadcast.mockResolvedValueOnce({
            transactionHash: 'mock_hash',
            height: 100,
            gasUsed: 50000
        });

        const result = await midnightService.submitDID(mockDID);

        expect(result.transactionHash).toBe('mock_hash');
        expect(result.blockHeight).toBe(100);
        expect(mockSigningClient.signAndBroadcast).toHaveBeenCalledWith(
            'midnight1mock',
            expect.arrayContaining([
                expect.objectContaining({
                    typeUrl: '/midnight.did.v1.MsgCreateDid'
                })
            ]),
            'auto'
        );
    });

    it('should query a DID document', async () => {
        const mockDIDResponse = {
            did: {
                id: 'did:midnight:123',
                verificationMethod: [],
                authentication: []
            }
        };

        mockStargateClient.queryUnverified.mockResolvedValueOnce(mockDIDResponse);

        const result = await midnightService.queryDID('did:midnight:123');

        expect(result).toEqual(mockDIDResponse);
        expect(mockStargateClient.queryUnverified).toHaveBeenCalledWith(
            '/midnight/did/v1/did/did:midnight:123'
        );
    });

    it('should submit a document hash', async () => {
        mockSigningClient.signAndBroadcast.mockResolvedValueOnce({
            transactionHash: 'mock_hash',
            height: 100,
            gasUsed: 50000
        });

        const result = await midnightService.submitDocument(
            'document_hash',
            'did:midnight:123'
        );

        expect(result.transactionHash).toBe('mock_hash');
        expect(result.blockHeight).toBe(100);
        expect(mockSigningClient.signAndBroadcast).toHaveBeenCalledWith(
            'midnight1mock',
            expect.arrayContaining([
                expect.objectContaining({
                    typeUrl: '/midnight.document.v1.MsgStoreDocument'
                })
            ]),
            'auto'
        );
    });

    it('should get transaction details', async () => {
        const mockTxHash = 'test-hash';
        const result = await midnightService.getTransactionDetails(mockTxHash);
        expect(result).toBeDefined();
        expect(result.hash).toBeDefined();
    });

    it('should handle transaction verification', async () => {
        const mockTxHash = 'test-hash';
        const result = await midnightService.verifyTransaction(mockTxHash);
        expect(result).toBeDefined();
    });
}); 