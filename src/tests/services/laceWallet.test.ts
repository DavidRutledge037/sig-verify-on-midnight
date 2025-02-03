import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LaceWallet } from '../../services/wallet/laceWallet';

describe('LaceWallet', () => {
  let laceWallet: LaceWallet;
  const mockAddress = 'addr1qxy8p07cr9nxgg5nqzh3qkgzz9erucddjg3n5x5jgqxe34l4w9gfzpz66vqkw2etxkw74xtfwh6j0cz8fs8gdmrxc9qs0nshs5';

  beforeEach(() => {
    // Reset window object
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  describe('with available wallet', () => {
    beforeEach(() => {
      // Setup mock Lace wallet
      vi.stubGlobal('window', {
        cardano: {
          lace: {
            enable: vi.fn().mockResolvedValue(true),
            getUsedAddresses: vi.fn().mockResolvedValue([mockAddress]),
            signData: vi.fn().mockResolvedValue('signedMessage123')
          }
        }
      });
      
      laceWallet = new LaceWallet();
    });

    it('should connect successfully to Lace wallet', async () => {
      const result = await laceWallet.connect();
      expect(result).toBe(true);
    });

    it('should return the first used address', async () => {
      const address = await laceWallet.getAddress();
      expect(address).toBe(mockAddress);
    });

    it('should sign message successfully', async () => {
      const signature = await laceWallet.signMessage('Test message');
      expect(signature).toBe('signedMessage123');
    });
  });

  describe('without wallet', () => {
    beforeEach(() => {
      vi.stubGlobal('window', {});
      laceWallet = new LaceWallet();
    });

    it('should handle missing Lace wallet', async () => {
      const result = await laceWallet.connect();
      expect(result).toBe(false);
    });

    it('should return null when getting address', async () => {
      const address = await laceWallet.getAddress();
      expect(address).toBeNull();
    });

    it('should return null when signing message', async () => {
      const signature = await laceWallet.signMessage('Test message');
      expect(signature).toBeNull();
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      vi.stubGlobal('window', {
        cardano: {
          lace: {
            enable: vi.fn().mockRejectedValue(new Error('Connection failed')),
            getUsedAddresses: vi.fn().mockRejectedValue(new Error('Failed to get addresses')),
            signData: vi.fn().mockRejectedValue(new Error('Signing failed'))
          }
        }
      });
      
      laceWallet = new LaceWallet();
    });

    it('should handle connection errors', async () => {
      const result = await laceWallet.connect();
      expect(result).toBe(false);
    });

    it('should handle address errors', async () => {
      const address = await laceWallet.getAddress();
      expect(address).toBeNull();
    });

    it('should handle signing errors', async () => {
      const signature = await laceWallet.signMessage('Test message');
      expect(signature).toBeNull();
    });
  });
}); 