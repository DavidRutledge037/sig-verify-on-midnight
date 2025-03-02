import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { WalletProvider } from './types.js';
import { NETWORK_CONFIG } from '../../config/network.js';

// Add window type declaration
declare global {
  interface Window {
    midnight?: {
      mnLace: any;
    };
    mnLace: any;
  }
}

interface WalletState {
  connected: boolean;
  address: string | null;
  did: string | null;
  networkId: NetworkId;
  kycLevel: number | null;
}

export class MidnightLaceWallet implements WalletProvider {
  private static instance: MidnightLaceWallet;
  private state: WalletState;
  private secretKey: Uint8Array;
  private publicKey: Uint8Array;

  private constructor() {
    // Parse the provided wallet credentials
    const [secretKeyHex, publicKeyHex] = 'baeb8ea7397d4341a02d65b90dc20db86ad95f16bcafcec0dec40d940797e1ab|03003753e8adf70b02d31a2ef7e5052a59af421e94a6e6dfed20c6e9e27cd27d0cd87e5631a19fcffb822c40161639884be4756984e7d3646194'.split('|');
    
    this.secretKey = new Uint8Array(Buffer.from(secretKeyHex, 'hex'));
    this.publicKey = new Uint8Array(Buffer.from(publicKeyHex, 'hex'));
    
    this.state = {
      connected: false,
      address: null,
      did: null,
      networkId: NETWORK_CONFIG.NETWORK,
      kycLevel: null
    };
  }

  static getInstance(): MidnightLaceWallet {
    if (!MidnightLaceWallet.instance) {
      MidnightLaceWallet.instance = new MidnightLaceWallet();
    }
    return MidnightLaceWallet.instance;
  }

  async connect(): Promise<boolean> {
    try {
      // Set up wallet state with the provided credentials
      this.state = {
        connected: true,
        address: Buffer.from(this.publicKey).toString('hex'),
        did: `did:midnight:${Buffer.from(this.publicKey.slice(0, 16)).toString('hex')}`,
        networkId: NETWORK_CONFIG.NETWORK,
        kycLevel: 2
      };
      return true;
    } catch (error) {
      console.error('Failed to connect:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.state = {
      connected: false,
      address: null,
      did: null,
      networkId: NETWORK_CONFIG.NETWORK,
      kycLevel: null
    };
  }

  isConnected(): boolean {
    return this.state.connected;
  }

  async getSecretKey(): Promise<Uint8Array> {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }
    return this.secretKey;
  }

  async getNetworkId(): Promise<NetworkId> {
    return this.state.networkId;
  }

  getState(): WalletState {
    return this.state;
  }

  async getAddress(): Promise<string> {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }
    return this.state.address;
  }

  async getDID(): Promise<string | null> {
    return this.state.did;
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    // Use the secret key to sign the message
    // Note: In a real implementation, we would use proper cryptographic signing here
    // For now, we'll concatenate the secret key with the message hash
    const messageHash = await crypto.subtle.digest('SHA-256', message);
    const signature = new Uint8Array([...this.secretKey, ...new Uint8Array(messageHash)]);
    return signature;
  }

  async deployContract(bytecode: string, initialState: any): Promise<any> {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const response = await fetch(`${NETWORK_CONFIG.PROOF_SERVER_URL}/api/v1/contracts/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bytecode,
        initialState,
        deployer: await this.getAddress()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to deploy contract: ${await response.text()}`);
    }

    const result = await response.json();
    return result;
  }

  async executeContract(contractAddress: string, method: string, args: any[]): Promise<any> {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const response = await fetch(`${NETWORK_CONFIG.PROOF_SERVER_URL}/api/v1/contracts/${contractAddress}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method,
        args,
        caller: await this.getAddress()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to execute contract: ${await response.text()}`);
    }

    const result = await response.json();
    return result;
  }

  async queryContract(contractAddress: string, method: string, args: any[]): Promise<any> {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const response = await fetch(`${NETWORK_CONFIG.PROOF_SERVER_URL}/api/v1/contracts/${contractAddress}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method,
        args
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to query contract: ${await response.text()}`);
    }

    const result = await response.json();
    return result;
  }
}
