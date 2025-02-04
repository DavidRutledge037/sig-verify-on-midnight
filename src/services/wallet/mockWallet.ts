import { WalletProvider } from '../../types/wallet';

export class MockWallet implements WalletProvider {
  private isConnected = false;
  private mockAddress = 'addr1qxy8p07cr9nxgg5nqzh3qkgzz9erucddjg3n5x5jgqxe34l4w9gfzpz66vqkw2etxkw74xtfwh6j0cz8fs8gdmrxc9qs0nshs5';

  async connect(): Promise<boolean> {
    console.log('MockWallet: Attempting to connect...');
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.isConnected = true;
    console.log('MockWallet: Connected successfully');
    return true;
  }

  async getAddress(): Promise<string | null> {
    console.log('MockWallet: Getting address...');
    if (!this.isConnected) {
      console.log('MockWallet: Not connected, returning null address');
      return null;
    }
    console.log('MockWallet: Returning mock address');
    return this.mockAddress;
  }

  async signMessage(message: string): Promise<string | null> {
    console.log('MockWallet: Signing message:', message);
    if (!this.isConnected) {
      console.log('MockWallet: Not connected, cannot sign');
      return null;
    }
    // Simulate signing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const signature = `signed_${message}_${Date.now()}`;
    console.log('MockWallet: Signed successfully:', signature);
    return signature;
  }

  async disconnect(): Promise<void> {
    console.log('MockWallet: Disconnecting...');
    this.isConnected = false;
    console.log('MockWallet: Disconnected successfully');
  }
} 