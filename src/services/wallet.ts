import { KeyManager } from '../identity/keys';
import { IWalletService } from '../types/services';

export class WalletService implements IWalletService {
    private keyManager: KeyManager;
    private currentKeyPair: { publicKey: Uint8Array; privateKey: Uint8Array } | null = null;

    constructor() {
        this.keyManager = new KeyManager();
    }

    async createWallet(): Promise<{ address: string }> {
        try {
            this.currentKeyPair = this.keyManager.generateKeyPair();
            const address = await this.getAddress();
            return { address };
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw new Error('Failed to create wallet');
        }
    }

    async sign(message: string): Promise<Uint8Array> {
        try {
            if (!this.currentKeyPair) {
                throw new Error('Wallet not initialized');
            }
            return this.keyManager.sign(message, this.currentKeyPair.privateKey);
        } catch (error) {
            console.error('Error signing message:', error);
            throw new Error('Failed to sign message');
        }
    }

    async verify(message: string, signature: Uint8Array): Promise<boolean> {
        try {
            if (!this.currentKeyPair) {
                throw new Error('Wallet not initialized');
            }
            return this.keyManager.verify(message, signature, this.currentKeyPair.publicKey);
        } catch (error) {
            console.error('Error verifying signature:', error);
            throw new Error('Failed to verify signature');
        }
    }

    async getAddress(): Promise<string> {
        try {
            if (!this.currentKeyPair) {
                throw new Error('Wallet not initialized');
            }
            // Convert public key to address (implementation depends on your addressing scheme)
            const publicKeyBytes = this.currentKeyPair.publicKey;
            return Buffer.from(publicKeyBytes).toString('hex');
        } catch (error) {
            console.error('Error getting address:', error);
            throw new Error('Failed to get address');
        }
    }

    getPublicKey(): Uint8Array {
        if (!this.currentKeyPair) {
            throw new Error('Wallet not initialized');
        }
        return this.currentKeyPair.publicKey;
    }

    isInitialized(): boolean {
        return this.currentKeyPair !== null;
    }
} 