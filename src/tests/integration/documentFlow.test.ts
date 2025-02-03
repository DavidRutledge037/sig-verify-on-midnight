import '@jest/globals';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { DIDManager } from '../../contracts/DIDManager.js';
import { DocumentManager } from '../../contracts/DocumentManager.js';
import { DocumentVerifier } from '../../contracts/DocumentVerifier.js';
import { KYCManager } from '../../contracts/KYCManager.js';
import { mockSDK } from '../mocks/walletMock.js';
import { VerificationLevel } from '../../types/kyc.js';
import type { ZKProof } from '../../types/sdk.js';

// Mock the crypto module
const mockZKProof: ZKProof = {
    proof: 'test_proof',
    publicInputs: [],
    privateInputs: []
};

type GenerateZKProofFn = (message: string, privateKey: string) => Promise<ZKProof>;
type VerifyZKProofFn = (proof: ZKProof) => Promise<boolean>;
type GenerateHashFn = (data: string) => string;
type GenerateNonceFn = () => string;

jest.mock('../../utils/crypto.js', () => ({
    generateZKProof: jest.fn<GenerateZKProofFn>().mockImplementation(async () => mockZKProof),
    verifyZKProof: jest.fn<VerifyZKProofFn>().mockImplementation(async () => true),
    generateHash: jest.fn<GenerateHashFn>().mockImplementation(() => 'test_hash'),
    generateNonce: jest.fn<GenerateNonceFn>().mockImplementation(() => 'test_nonce')
}));

// Import after mock
import { generateZKProof } from '../../utils/crypto.js';

describe('DID Manager', () => {
    let didManager: DIDManager;

    beforeEach(() => {
        didManager = new DIDManager(mockSDK as any);
    });

    it('should create a DID', async () => {
        const address = '0x1234567890123456789012345678901234567890';
        const did = await didManager.createDID(address, 'test_public_key');
        expect(did).toBeDefined();
    });
});

describe('Document Flow', () => {
    let didManager: DIDManager;
    let documentManager: DocumentManager;
    let documentVerifier: DocumentVerifier;
    let kycManager: KYCManager;

    beforeEach(() => {
        didManager = new DIDManager(mockSDK);
        kycManager = new KYCManager();
        documentManager = new DocumentManager();
        documentVerifier = new DocumentVerifier(kycManager, didManager);
    });

    it('should create and verify a document', async () => {
        // Create DID
        const did = await didManager.createDID('address', 'publicKey');

        // Verify KYC
        await kycManager.addVerifier('verifier_address');
        await kycManager.verifyIdentity(did, VerificationLevel.ADVANCED, new Map());

        // Create document
        const documentId = await documentManager.createDocument(
            'owner',
            'content',
            {
                title: 'Test Doc',
                mimeType: 'text/plain',
                size: 100
            }
        );

        // Generate and verify proof
        const zkProof = await generateZKProof('message', 'privateKey');
        const isValid = await documentVerifier.verifyDocument(
            documentId,
            did,
            'signature',
            zkProof
        );

        expect(isValid).toBe(true);
    });

    it('should create a DID', async () => {
        const address = '0x1234567890123456789012345678901234567890';
        const did = await didManager.createDID(address, 'test_public_key');
        expect(did).toBeDefined();
    });
});