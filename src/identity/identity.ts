import { DIDManager, DIDDocument } from './did';
import { KeyManager, KeyPair } from './keys';

interface Identity {
    did: DIDDocument;
    keyPair: KeyPair;
}

class IdentityManager {
    private didManager: DIDManager;
    private keyManager: KeyManager;
    private identityStore: Map<string, Identity>;

    constructor() {
        this.didManager = new DIDManager();
        this.keyManager = new KeyManager();
        this.identityStore = new Map();
    }

    /**
     * Create a new identity with DID and key pair
     */
    async createIdentity(): Promise<Identity> {
        // Generate key pair
        const keyPair = await this.keyManager.generateKeyPair();
        
        // Create DID using public key
        const did = await this.didManager.createDID(keyPair.publicKey);

        // Store the identity
        const identity = { did, keyPair };
        this.identityStore.set(did.id, identity);

        return identity;
    }

    /**
     * Sign a message using an identity
     */
    async sign(message: string, identity: Identity): Promise<string> {
        const messageBytes = new TextEncoder().encode(message);
        return await this.keyManager.sign(messageBytes, identity.keyPair.privateKey);
    }

    /**
     * Verify a signature using a DID
     */
    async verify(message: string, signature: string, did: string): Promise<boolean> {
        // Get the identity from store
        const identity = this.identityStore.get(did);
        if (!identity) {
            return false;
        }

        const messageBytes = new TextEncoder().encode(message);
        return await this.keyManager.verify(
            messageBytes,
            signature,
            identity.keyPair.publicKey
        );
    }
}

export { IdentityManager, type Identity }; 