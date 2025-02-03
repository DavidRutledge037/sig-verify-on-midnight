import { 
    Contract, 
    Address, 
    DIDDocument,
    type PrivacyLevel, 
    type PrivacyConfig,
    msg 
} from '../types/index.js';
import type { MidnightSDK } from '../types/index.js';

export class DIDManager extends Contract {
    private static readonly METHOD_NAME = 'midnight';
    private static readonly CONTEXT = [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1'
    ];

    private didDocuments: Map<string, DIDDocument>;
    private controllers: Map<string, Set<string>>;
    private sdk: MidnightSDK;
    private privacyConfig: PrivacyConfig;

    constructor(sdk: MidnightSDK) {
        super();
        this.didDocuments = new Map();
        this.controllers = new Map();
        this.sdk = sdk;
        this.privacyConfig = {
            level: 'shielded',
            encryptionKey: 'default'
        };
    }

    public async createDID(address: Address, publicKey: string): Promise<string> {
        const did = `did:${DIDManager.METHOD_NAME}:${address}`;
        
        if (this.didDocuments.has(did)) {
            throw new Error('DID already exists');
        }

        const document: DIDDocument = {
            '@context': DIDManager.CONTEXT,
            id: did,
            controller: [did],
            verificationMethod: [{
                id: `${did}#key-1`,
                type: 'Ed25519VerificationKey2020',
                controller: did,
                publicKeyMultibase: publicKey
            }],
            authentication: [`${did}#key-1`],
            assertionMethod: [`${did}#key-1`],
            service: []
        };

        // Generate ZK proof for DID creation
        const zkProof = await this.sdk.generateZKProof({
            document,
            address,
            publicKey
        });

        // Submit as shielded transaction
        await this.sdk.submitShieldedTransaction(
            'createDID',
            [document],
            zkProof
        );

        this.didDocuments.set(did, document);
        const controllerSet = new Set<string>([did]);
        this.controllers.set(did, controllerSet);
        
        return did;
    }
}
