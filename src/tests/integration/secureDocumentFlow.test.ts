import '@jest/globals';
import { PrivateDocumentManager } from '../../contracts/PrivateDocumentManager';
import { MidnightSDK } from '../../sdk/midnight';
import { EncryptionService } from '../../utils/encryption';
import { ZKProofGenerator } from '../../utils/zkProofs';
import { midnightConfig } from '../../config/midnight';

describe('Secure Document Flow', () => {
    let documentManager: PrivateDocumentManager;
    let sdk: MidnightSDK;
    let encryptionService: EncryptionService;
    let zkProofGenerator: ZKProofGenerator;

    beforeEach(() => {
        sdk = new MidnightSDK(midnightConfig);
        documentManager = new PrivateDocumentManager(sdk);
        encryptionService = new EncryptionService();
        zkProofGenerator = new ZKProofGenerator();
    });

    it('should create and verify a private document', async () => {
        const content = Buffer.from('test document');
        const ownerAddress = 'test_address';
        const privateKey = 'test_private_key';

        // Generate encryption key
        const encryptionKey = encryptionService.generateKey();

        // Encrypt document
        const encryptedData = await encryptionService.encryptDocument(
            content,
            encryptionKey
        );

        // Generate ZK proof
        const zkProof = await zkProofGenerator.generateDocumentProof(
            content,
            ownerAddress,
            privateKey
        );

        // Create document
        const documentId = await documentManager.createPrivateDocument(
            ownerAddress,
            encryptedData,
            {
                title: 'Test Doc',
                mimeType: 'text/plain',
                size: content.length,
                tags: ['encrypted']
            },
            [ownerAddress],
            zkProof
        );

        expect(documentId).toBeDefined();
    });
}); 