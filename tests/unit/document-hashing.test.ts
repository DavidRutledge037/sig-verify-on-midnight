import { assert } from 'chai';
import { DocumentService } from '../../src/services/document';
import { WalletService } from '../../src/services/wallet';
import { DIDService } from '../../src/services/did';

describe('Document Hashing & Storage', () => {
  let documentService: DocumentService;
  let walletService: WalletService;
  let didService: DIDService;

  beforeEach(() => {
    walletService = new WalletService();
    didService = new DIDService(walletService);
    documentService = new DocumentService(walletService, didService);
  });

  describe('Document Hashing', () => {
    it('should generate consistent hash for same document', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const hash1 = await documentService.hashDocument(document);
      const hash2 = await documentService.hashDocument(document);
      assert.deepEqual(hash1, hash2);
    });

    it('should generate different hashes for different documents', async () => {
      const doc1 = new Uint8Array([1, 2, 3]);
      const doc2 = new Uint8Array([4, 5, 6]);
      const hash1 = await documentService.hashDocument(doc1);
      const hash2 = await documentService.hashDocument(doc2);
      assert.notDeepEqual(hash1, hash2);
    });
  });

  describe('Document Storage', () => {
    it('should store document hash with DID reference', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const did = await didService.generateDID();
      const stored = await documentService.storeDocument(document, did);
      assert.property(stored, 'hash');
      assert.property(stored, 'did');
      assert.equal(stored.did, did);
    });

    it('should verify document ownership', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const did = await didService.generateDID();
      const stored = await documentService.storeDocument(document, did);
      const isOwner = await documentService.verifyDocumentOwnership(stored.hash, did);
      assert.isTrue(isOwner);
    });
  });
}); 