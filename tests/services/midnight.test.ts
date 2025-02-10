import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    const config = {
        nodeUrl: 'http://localhost:26657',
        chainId: 'midnight-1',
        mnemonic: 'test test test test test test test test test test test junk'
    };

    let service: MidnightService;
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
        service = new MidnightService(config);
        
        // Connect to network
        await service.connect();
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

        const result = await service.submitDID(mockDID);

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

        const result = await service.queryDID('did:midnight:123');

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

        const result = await service.submitDocument(
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
}); 