import { WalletProvider } from '../../types/wallet';

export class LaceWallet implements WalletProvider {
  private get cardanoWindow() {
    return window?.cardano?.lace;
  }

  private isAvailable(): boolean {
    return !!this.cardanoWindow;
  }

  async connect(): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        console.error('Lace wallet not found');
        return false;
      }
      
      const connected = await this.cardanoWindow.enable();
      return !!connected;
    } catch (error) {
      console.error('Lace wallet connection failed:', error);
      return false;
    }
  }

  async getAddress(): Promise<string | null> {
    try {
      if (!this.isAvailable()) return null;
      const addresses = await this.cardanoWindow.getUsedAddresses();
      return addresses[0] || null;
    } catch (error) {
      console.error('Failed to get Lace address:', error);
      return null;
    }
  }

  async signMessage(message: string): Promise<string | null> {
    try {
      if (!this.isAvailable()) return null;
      const address = await this.getAddress();
      if (!address) return null;
      
      const signature = await this.cardanoWindow.signData(address, message);
      return signature;
    } catch (error) {
      console.error('Lace signing failed:', error);
      return null;
    }
  }
} 