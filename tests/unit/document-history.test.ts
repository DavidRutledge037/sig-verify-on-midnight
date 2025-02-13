import { assert } from 'chai';
import { DocumentService } from '../../src/services/document';
import { WalletService } from '../../src/services/wallet';
import { DIDService } from '../../src/services/did';

describe('Document History', () => {
  let documentService: DocumentService;
  let walletService: WalletService;
  let didService: DIDService;

  beforeEach(() => {
    walletService = new WalletService();
    didService = new DIDService(walletService);
    documentService = new DocumentService(walletService, didService);
  });

  describe('Document Tracking', () => {
    it('should track document history', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const did = await didService.generateDID();
      await documentService.storeDocument(document, did);
      const hash = await documentService.hashDocument(document);
      const history = await documentService.getDocumentHistory(hash);
      assert.isArray(history);
      assert.include(history, did);
    });

    it('should handle non-existent documents', async () => {
      const nonExistentHash = new Uint8Array([9, 9, 9]);
      const history = await documentService.getDocumentHistory(nonExistentHash);
      assert.isArray(history);
      assert.isEmpty(history);
    });
  });
}); 