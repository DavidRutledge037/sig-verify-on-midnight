import { EncryptionService } from '../utils/encryption';
import { StorageProvider } from '../types/storage';

export class SecureStorageService {
    private encryptionService: EncryptionService;
    private storageProvider: StorageProvider;

    constructor(storageProvider: StorageProvider) {
        this.encryptionService = new EncryptionService();
        this.storageProvider = storageProvider;
    }

    async storeEncrypted(
        content: Buffer,
        userId: string,
        documentId: string
    ): Promise<string> {
        // Generate unique key for this document
        const encryptionKey = this.encryptionService.generateKey();
        
        // Encrypt content
        const encryptedContent = await this.encryptionService.encryptDocument(
            content,
            encryptionKey
        );

        // Store in provider (e.g., IPFS)
        const cid = `${this.storageProvider.type}_${documentId}`;
        
        return cid;
    }
} 